const express = require('express');
const { getTransactions, updateTransaction, deleteTransaction } = require('../controllers/transactions');
const { signIn, signUp, transaction } = require('../controllers/users');
const { verifyDateAndValue } = require('../middlewares/middleware');
const { verifyFields, verifyLogin, verifyTransaction } = require('../middlewares/users');
const routes = express.Router();

routes.post('/signup', verifyFields, signUp);
routes.post('/signin', verifyLogin, signIn);
routes.post('/transaction', verifyDateAndValue,verifyTransaction, transaction);

routes.get('/transaction/:id', getTransactions);
routes.put('/transaction/:id', verifyDateAndValue, verifyTransaction, updateTransaction);
routes.delete('/transaction/:id', deleteTransaction)

module.exports = routes;