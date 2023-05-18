const userRouter = require('express').Router();
const {
  getUsers, createUser, getUserById, editProfile, updateAvatar,
} = require('../controllers/users');

userRouter.get('/users', getUsers);

userRouter.post('/users', createUser);

userRouter.get('/users/:id', getUserById);

userRouter.patch('/users/me', editProfile);

userRouter.patch('/users/me/avatar', updateAvatar);

module.exports = userRouter;
