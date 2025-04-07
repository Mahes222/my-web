const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');

const app = express();
const port = 3000;

// PostgreSQL connection
const pool = new Pool({
  connectionString: 'postgresql://postgres.beslrbsxeedativjhwna:Mahes%40%40222@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres'
});


app.use(bodyParser.urlencoded({ extended: true }));

// Serve your HTML
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.use(express.static(__dirname));

const salt = 10;
// Handle form submission
app.post('/signUp', async (req, res) => {
  const firstname = req.body.fName;
  const email_id = req.body.email;
  const pass = req.body.password;
  const pass_hash = await bcrypt.hash(pass, salt);
  let num = await pool.query('SELECT  * FROM users WHERE email = $1', [email_id]);

  if (num.rows.length > 0) {
    res.send('email id already exist');
  }
  await pool.query('INSERT INTO users(username,email,password) VALUES($1,$2,$3)', [firstname, email_id, pass_hash]);
  res.end();

});


app.post('/signIn', async (req, res) => {
  const emailid = req.body.email;
  const passin = req.body.password;

  let result = await pool.query(
    'SELECT * FROM users WHERE email = $1',
    [emailid]
  );

  if (result.rows.length > 0) {
    const use = result.rows[0];
    const match = await bcrypt.compare(passin, use.password);
    if (match) {
      res.redirect('/home.html');
    }
    else {
      res.send('wrong password');
    }
  } else {
    res.send('user not found');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});