const express = require('express');
const routes = require('./routes/routes');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);

app.listen(8000, () => {
  console.log('Server is running on port 8000');
});
