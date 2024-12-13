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

// Middleware for JWT authentication
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.status(401).send('Token required');

  jwt.verify(token, 'your_jwt_secret_key', (err, user) => {
    if (err) return res.status(403).send('Invalid token');
    req.user = user;
    next();
  });
};

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

//Add to Cart
app.post('/add-to-cart', authenticateToken, (req, res) => {
  const { userId, productId, config, size, quantity } = req.body;

  const checkQuery = 'SELECT * FROM carts WHERE user_id = ? AND product_id = ? AND config = ? AND size = ?';
  db.query(checkQuery, [userId, productId, config, size], (err, results) => {
    if (err) {
      console.error('Error checking cart:', err);
      return res.status(500).send('Error checking cart');
    }

    if (results.length > 0) {
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
app.get('/cart/:userId', authenticateToken, (req, res) => {
  const { userId } = req.params;
  const query = 'SELECT * FROM carts WHERE user_id = ?';
  db.query(query, [userId], (err, results) => {
    if (err) {
      return res.status(500).send('Error fetching cart');
    }
    res.status(200).json(results);
  });
});

//Remove with Cart
app.post('/remove-from-cart', authenticateToken, (req, res) => {
  const { userId, productId, config, size } = req.body;

  const deleteQuery = 'DELETE FROM carts WHERE user_id = ? AND product_id = ? AND config = ? AND size = ?';
  db.query(deleteQuery, [userId, productId, config, size], (err) => {
    if (err) {
      console.error('Error removing from cart:', err);
      return res.status(500).send('Error removing from cart');
    }
    res.status(200).send('Item removed from cart successfully');
  });
});

// Fetch previous orders
app.get('/previous-orders', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const query = `
    SELECT o.id, o.order_date, oi.product_id, oi.config, oi.size, oi.quantity, oi.price, p.title
    FROM orders o
    JOIN order_items oi ON o.id = oi.order_id
    JOIN products p ON oi.product_id = p.id
    WHERE o.user_id = ?
    ORDER BY o.order_date DESC
  `;

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Error fetching previous orders:', err);
      return res.status(500).send('Error fetching previous orders');
    }
    res.status(200).json(results);
  });
});

app.post('/checkout', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const { cartItems, total } = req.body;

  console.log('Checkout request received:', { cartItems, total }); // Log the received data

  db.beginTransaction((err) => {
    if (err) {
      console.error('Error starting transaction:', err);
      return res.status(500).send('Error starting transaction');
    }

    const insertOrderQuery = 'INSERT INTO orders (user_id, total) VALUES (?, ?)';
    db.query(insertOrderQuery, [userId, total], (err, orderResult) => {
      if (err) {
        console.error('Error inserting order:', err);
        return db.rollback(() => res.status(500).send('Error inserting order'));
      }

      const orderId = orderResult.insertId;

      const insertOrderItemsQuery = 'INSERT INTO order_items (order_id, product_id, config, size, quantity, price) VALUES ?';
      const orderItems = cartItems.map(item => [
        orderId, item.product_id, item.config, item.size, item.quantity, item.price
      ]);

      console.log('Inserting order items:', orderItems); // Log the order items being inserted

      db.query(insertOrderItemsQuery, [orderItems], (err) => {
        if (err) {
          console.error('Error inserting order items:', err);
          return db.rollback(() => res.status(500).send('Error inserting order items'));
        }

        const clearCartQuery = 'DELETE FROM carts WHERE user_id = ?';
        db.query(clearCartQuery, [userId], (err) => {
          if (err) {
            console.error('Error clearing cart:', err);
            return db.rollback(() => res.status(500).send('Error clearing cart'));
          }

          db.commit((err) => {
            if (err) {
              console.error('Error committing transaction:', err);
              return db.rollback(() => res.status(500).send('Error committing transaction'));
            }

            res.status(200).send({ message: 'Checkout successful', orderId });
          });
        });
      });
    });
  });
});


// Verify token and get user details
app.get('/user-details', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const query = 'SELECT firstname, lastname, email, password, is_verified FROM users WHERE id = ?';

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Error fetching user details:', err);
      return res.status(500).send('Error fetching user details');
    }

    if (results.length === 0) {
      return res.status(404).send('User not found');
    }

    const user = results[0];
    res.status(200).json(user);
  });
});

// Update user details
app.post('/update-user', authenticateToken, (req, res) => {
  const { field, value } = req.body;
  const userId = req.user.id;
  const allowedFields = ['firstname', 'lastname', 'email', 'password'];

  if (!allowedFields.includes(field)) {
    return res.status(400).send('Invalid field');
  }

  let query = '';
  const values = [value, userId];

  if (field === 'password') {
    bcrypt.hash(value, 10, (err, hashedPassword) => {
      if (err) {
        console.error('Error hashing password:', err);
        return res.status(500).send('Error updating password');
      }

      query = 'UPDATE users SET password = ? WHERE id = ?';
      values[0] = hashedPassword;
      db.query(query, values, (err) => {
        if (err) {
          console.error(`Error updating ${field}:`, err);
          return res.status(500).send(`Error updating ${field}`);
        }
        res.status(200).send(`${field} updated successfully`);
      });
    });
  } else {
    query = `UPDATE users SET ${field} = ? WHERE id = ?`;
    db.query(query, values, (err) => {
      if (err) {
        console.error(`Error updating ${field}:`, err);
        return res.status(500).send(`Error updating ${field}`);
      }
      res.status(200).send(`${field} updated successfully`);
    });
  }
});

// Verify token
app.get('/verify-token', authenticateToken, (req, res) => {
  res.status(200).json({ userId: req.user.id });
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
