const userRouter = require('express').Router();
const {
  getUsers, getUserById, editProfile, updateAvatar, dataUser,
} = require('../controllers/users');

userRouter.get('/me', dataUser);
userRouter.get('/', getUsers);
userRouter.get('/:id', getUserById);
userRouter.patch('/me', editProfile);
userRouter.patch('/me/avatar', updateAvatar);

module.exports = userRouter;
