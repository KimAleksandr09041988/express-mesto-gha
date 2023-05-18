const express = require('express');
const mongoose = require('mongoose');

const { PORT = 3000 } = process.env;
const app = express();
const userRouter = require('./routes/userRouter');
const cardRouter = require('./routes/cardRouter');

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
app.use('/users', userRouter);
app.use('/cards', cardRouter);

app.use((req, res) => {
  res.status(404).send({
    message: 'Запрошен несуществующий роут',
  });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
