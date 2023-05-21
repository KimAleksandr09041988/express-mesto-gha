const express = require('express');
const mongoose = require('mongoose');

const { PORT = 3000 } = process.env;
const app = express();
const router = require('./routes/index');
const { NOT_FOUND } = require('./utils/constanst');

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  family: 4,
});

app.use((req, res, next) => {
  req.user = { _id: '64663a621794175263a9f88e' };
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(router);

app.use((req, res) => {
  res.status(NOT_FOUND).send({ message: 'Ошибка в url. Проверьте правильность введённых данных' });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
