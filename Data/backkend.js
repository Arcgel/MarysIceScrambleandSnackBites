import express from 'express';
import mysql from 'mysql2';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'maryicescramblesystem'
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL database');
});

// Fetch products with sizes and settings
app.get('/products', (req, res) => {
  const query = `
    SELECT
      p.id, p.title, p.description, p.image,
      GROUP_CONCAT(DISTINCT CONCAT('{"size":"', s.size, '","price":', s.price, '}')) AS sizes,
      GROUP_CONCAT(DISTINCT CONCAT('{"setting":"', st.setting, '","price":', st.price, '}')) AS setting
    FROM products p
    LEFT JOIN sizes s ON p.id = s.product_id
    LEFT JOIN setting st ON p.id = st.product_id
    GROUP BY p.id
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching products:', err);
      return res.status(500).send('Error fetching products');
    }

    try {
      const products = results.map(product => ({
        id: product.id,
        title: product.title,
        description: product.description,
        image: product.image,
        sizes: product.sizes ? JSON.parse(`[${product.sizes}]`) : [],
        setting: product.setting ? JSON.parse(`[${product.setting}]`) : []
      }));

      res.status(200).json(products);
    } catch (parseError) {
      console.error('Error parsing product data:', parseError);
      return res.status(500).send('Error parsing product data');
    }
  });
});

// Add to cart
// Add to cart
app.post('/add-to-cart', (req, res) => {
  const { userId, productId, config, size, quantity } = req.body;

  // Check if the item already exists in the cart
  const checkQuery = 'SELECT * FROM carts WHERE user_id = ? AND product_id = ? AND config = ? AND size = ?';
  db.query(checkQuery, [userId, productId, config, size], (err, results) => {
    if (err) {
      console.error('Error checking cart:', err);
      return res.status(500).send('Error checking cart');
    }

    if (results.length > 0) {
      // Item exists, update the quantity
      const existingItem = results[0];
      const newQuantity = existingItem.quantity + quantity;
      const updateQuery = 'UPDATE carts SET quantity = ? WHERE id = ?';
      db.query(updateQuery, [newQuantity, existingItem.id], (err) => {
        if (err) {
          console.error('Error updating cart:', err);
          return res.status(500).send('Error updating cart');
        }
        res.status(200).send('Cart updated successfully');
      });
    } else {
      // Item does not exist, insert a new entry
      const insertQuery = 'INSERT INTO carts (user_id, product_id, config, size, quantity) VALUES (?, ?, ?, ?, ?)';
      db.query(insertQuery, [userId, productId, config, size, quantity], (err) => {
        if (err) {
          console.error('Error adding to cart:', err);
          return res.status(500).send('Error adding to cart');
        }
        res.status(200).send('Added to cart successfully');
      });
    }
  });
});


// Fetch user cart
app.get('/cart/:userId', (req, res) => {
  const { userId } = req.params;
  const query = 'SELECT * FROM carts WHERE user_id = ?';
  db.query(query, [userId], (err, results) => {
    if (err) {
      return res.status(500).send('Error fetching cart');
    }
    res.status(200).json(results);
  });
});

// Fetch previous orders
app.get('/previous-orders/:userId', (req, res) => {
  const { userId } = req.params;
  db.query(`
    SELECT o.id AS order_id, o.order_date, o.total, oi.product_id, oi.config, oi.size, oi.quantity, oi.price, p.title, p.image
    FROM orders o
    JOIN order_items oi ON o.id = oi.order_id
    JOIN products p ON oi.product_id = p.id
    WHERE o.user_id = ?
    ORDER BY o.order_date DESC
  `, [userId], (err, results) => {
    if (err) {
      return res.status(500).send('Error fetching previous orders');
    }
    res.status(200).json(results);
  });
});

// Fetch favorites
app.get('/favorites/:userId', (req, res) => {
  const { userId } = req.params;
  const query = `
    SELECT p.id, p.title, p.description, p.image, f.user_id
    FROM favorites f
    JOIN products p ON f.product_id = p.id
    WHERE f.user_id = ?;
  `;
  db.query(query, [userId], (err, results) => {
    if (err) {
      return res.status(500).send('Error fetching favorites');
    }
    res.status(200).json(results);
  });
});

// Add feedback
app.post('/feedback', (req, res) => {
  const { userId, message } = req.body;
  const query = 'INSERT INTO feedback (user_id, message) VALUES (?, ?)';
  db.query(query, [userId, message], (err) => {
    if (err) {
      return res.status(500).send('Error adding feedback');
    }
    res.status(200).send('Feedback added successfully');
  });
});

// Checkout
app.post('/checkout', (req, res) => {
  const { userId, orderItems, total } = req.body;

  db.beginTransaction((err) => {
    if (err) return res.status(500).send('Transaction error');

    const orderQuery = 'INSERT INTO orders (user_id, total) VALUES (?, ?)';
    db.query(orderQuery, [userId, total], (err, results) => {
      if (err) {
        return db.rollback(() => res.status(500).send('Error creating order'));
      }

      const orderId = results.insertId;
      const orderItemsQuery = 'INSERT INTO order_items (order_id, product_id, config, size, quantity, price) VALUES ?';
      const orderItemsData = orderItems.map(item => [orderId, item.product_id, item.config, item.size, item.quantity, item.price]);

      db.query(orderItemsQuery, [orderItemsData], (err) => {
        if (err) {
          return db.rollback(() => res.status(500).send('Error creating order items'));
        }

        db.query('DELETE FROM carts WHERE user_id = ?', [userId], (err) => {
          if (err) {
            return db.rollback(() => res.status(500).send('Error clearing cart'));
          }

          db.commit((err) => {
            if (err) {
              return db.rollback(() => res.status(500).send('Transaction commit error'));
            }
            res.status(200).send('Order placed successfully');
          });
        });
      });
    });
  });
});

// User login
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const query = 'SELECT * FROM users WHERE email = ?';
  db.query(query, [email], async (err, results) => {
    if (err) {
      return res.status(500).send('Error fetching user');
    }
    if (results.length === 0) {
      return res.status(401).send('User not found');
    }

    const user = results[0];
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).send('Invalid password');
    }

    const token = jwt.sign({ id: user.id, email: user.email }, 'your_jwt_secret_key', { expiresIn: '1h' });
    res.status(200).json({ token });
  });
});

// User registration
app.post('/register', async (req, res) => {
  const { email, password, firstname, lastname } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);
  const query = 'INSERT INTO users (email, password, firstname, lastname) VALUES (?, ?, ?, ?)';
  db.query(query, [email, hashedPassword, firstname, lastname], (err) => {
    if (err) {
      return res.status(500).send('Error registering user');
    }
    res.status(200).send('User registered successfully');
  });
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
