const connection = require('../database/connection');
const bcrypt = require('bcrypt');

const verifyFields = async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name) return res.status(400).json('Name is required.');
  if (!email) return res.status(400).json('Email is required.');
  if (!password) return res.status(400).json('Password is required.');

  try {
    const query = 'select * from users where email = $1';
    const { rowCount } = await connection.query(query, [email]);
    if (rowCount > 0) {
      return res.status(400).json('This email already registered.');
    }
  } catch (error) {
    return res.status(400).json(error.message);
  }

  next();
};

const verifyLogin = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email) return res.status(400).json('Email is required.');
  if (!password) return res.status(400).json('Password is required.');

  try {
    const query = 'select * from users where email = $1';
    const { rowCount, rows } = await connection.query(query, [email]);
    if (rowCount === 0) {
      return res.status(400).json('Incorrect email or password.');
    }

    const user = rows[0];
    const passwordVerified = await bcrypt.compare(password, user.password);
    if (!passwordVerified) {
      return res.status(400).json('Incorrect password');
    }
  } catch (error) {
    return res.status(400).json(error.message);
  }

  next();
};

const verifyTransaction = async (req, res, next) => {
  const { category, value, description } = req.body;
  if (!category) return res.status(400).json('Category is required.');
  if(category.length >= 25) return res.status(400).json('Category must be less than 25 characters.');
  if(description.length >= 25) return res.status(400).json('Description must be less than 25 characters.');
  if (value <= 0) return res.status(400).json('Value cannot be less than 0.');
  next();
};
module.exports = { verifyFields, verifyLogin, verifyTransaction };
