const connection = require('../database/connection');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

require('dotenv').config();

const signUp = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const hasharedPassword = await bcrypt.hash(password, 10);
    const query = 'insert into users (name, email, password) values ($1, $2, $3)';
    const { rowCount } = await connection.query(query, [name, email, hasharedPassword]);

    if (rowCount === 0) {
      return res.status(400).json('User cannot be registered, try again.');
    }
    return res.status(201).json('User created successfully.');
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

const signIn = async (req, res) => {
  const { email } = req.body;
  try {
    const query = 'select * from users where email = $1';
    const { rows } = await connection.query(query, [email]);
    const user = rows[0];
    const userData = { id: user.id, name: user.name };
    const token = jwt.sign({ user: userData }, process.env.JWT_SECRET, { expiresIn: '1d' });

    return res.status(200).json({ Information: userData, token });
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

const transaction = async (req, res) => {
  const { transaction, category, description, id } = req.body;
  const value = res.locals.value;
  const date = res.locals.date;

  try {
    const query =
      'insert into transactions (transaction, value, date, category, description, user_id) values ($1, $2, $3, $4, $5, $6)';
    const { rowCount } = await connection.query(query, [
      transaction,
      value,
      date,
      category,
      description,
      id,
    ]);
    if (rowCount === 0) {
      return res.status(400).json('Transaction has a error, try again.');
    }
    const queryTransaction = 'select * from transactions where user_id = $1';
    const { rows } = await connection.query(queryTransaction, [id]);
    const userTransaction = rows[rows.length - 1];
    console.log(userTransaction);
    return res.status(201).json({ message: 'Transaction created successfully.', transaction: userTransaction });
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

module.exports = { signUp, signIn, transaction };
