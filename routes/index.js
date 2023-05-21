const router = require('express').Router();
const usersRouter = require('./userRouter');
const cardsRouter = require('./cardRouter');

router.use('/users', usersRouter);
router.use('/cards', cardsRouter);

module.exports = router;
