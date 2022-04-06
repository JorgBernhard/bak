const verifyDateAndValue = (req, res, next) => {
  const { transaction } = req.body;
  let { value, date } = req.body;
  if (transaction === 'output') {
    value = value * -1;
  }
  if (!date) {
    date = new Date();
  }
  res.locals.value = value * 100;
  res.locals.date = date;
  next();
};
module.exports = { verifyDateAndValue };