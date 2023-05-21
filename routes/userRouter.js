const userRouter = require('express').Router();
const {
  getUsers, createUser, getUserById, editProfile, updateAvatar,
} = require('../controllers/users');

userRouter.get(getUsers);

userRouter.post(createUser);

userRouter.get('/:id', getUserById);

userRouter.patch('/me', editProfile);

userRouter.patch('/me/avatar', updateAvatar);

module.exports = userRouter;
