const connection = require('../database/connection');

const getTransactions = async (req, res) => {
  const { id } = req.params;
  try {
    const query = 'select * from transactions where user_id = $1';
    const queryComeIn =
      'select sum(value) from transactions where user_id = $1 and transaction = $2';
    const queryComeOut =
      'select sum(value) from transactions where user_id = $1 and transaction = $2';
    const { rows: sumComeIn } = await connection.query(queryComeIn, [id, 'entry']);
    const { rows: sumComeOut } = await connection.query(queryComeOut, [id, 'output']);
    const { rows } = await connection.query(query, [id]);
    const allUserInfo = {
      userInfo: rows,
      balance: {
        comeIn: Number(sumComeIn[0].sum),
        comeOut: Number(sumComeOut[0].sum),
        balance: Number(sumComeIn[0].sum) + Number(sumComeOut[0].sum),
      },
    };
    return res.status(200).json(allUserInfo);
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

const deleteTransaction = async (req, res) => {
  const { id } = req.params;
  try {
    const query = 'delete from transactions where id = $1';
    const { rowCount } = await connection.query(query, [id]);

    if (rowCount === 0) {
      return res.status(400).json('Transaction not found.');
    }
    return res.status(200).json('Transaction deleted.');
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

const updateTransaction = async (req, res) => {
  const { id } = req.params;
  const { transaction, category, description } = req.body;
  const value = res.locals.value;
  const date = res.locals.date;
  try {
    const query =
      'update transactions set transaction = $1, category = $2, description = $3, value = $4, date = $5 where id = $6';
    const { rowCount } = await connection.query(query, [
      transaction,
      category,
      description,
      value,
      date,
      id,
    ]);

    if (rowCount === 0) {
      return res.status(400).json('Transaction not found.');
    }
    return res.status(200).json({message:'Transaction updated.'});
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

module.exports = { getTransactions, deleteTransaction, updateTransaction };
