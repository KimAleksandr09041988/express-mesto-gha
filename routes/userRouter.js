const userRouter = require('express').Router();
const {
  getUsers, getUserById, editProfile, updateAvatar, dataUser,
} = require('../controllers/users');
const { validateProfile, validateAvatar, validateIds } = require('../middlewares/errors');

userRouter.get('/me', dataUser);
userRouter.get('/', getUsers);
userRouter.get('/:id', validateIds, getUserById);
userRouter.patch('/me', validateProfile, editProfile);
userRouter.patch('/me/avatar', validateAvatar, updateAvatar);

module.exports = userRouter;
