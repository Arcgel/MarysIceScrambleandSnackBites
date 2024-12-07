import express from 'express';
import mysql from 'mysql';
import cors from 'cors';

const app = express();
const port = 4000;

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'maryicescrambleinfo'
});

db.connect(err => {
  if (err) {
    console.error('Error Connecting:', err);
    return;
  }
  console.log('Connected to MySQL');
});

app.get('/products', (req, res) => {
  db.query('SELECT * FROM products', (err, results) => {
    if (err) {
      console.error('Error Fetching Products:', err);
      res.status(500).send('Server Error');
      return;
    }
    // Parse the JSON strings into JavaScript objects
    results.forEach(product => {
      try {
        product.sizez = JSON.parse(product.sizez.replace(/\\/g, '').replace(/""/g, '"'));
        product.setting = JSON.parse(product.setting.replace(/\\/g, '').replace(/""/g, '"'));
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError);
        res.status(500).send('JSON Parse Error');
        return;
      }
    });
    res.json(results);
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
