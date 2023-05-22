const express = require('express');
const mongoose = require('mongoose');

const { PORT = 3000 } = process.env;
const app = express();
const router = require('./routes');
const { NOT_FOUND } = require('./utils/constanst');

const { createUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  family: 4,
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/signin', auth, login);
app.post('/signup', createUser);
app.use(router);

app.use((req, res) => {
  res.status(NOT_FOUND).send({ message: 'Ошибка в url. Проверьте правильность введённых данных' });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
