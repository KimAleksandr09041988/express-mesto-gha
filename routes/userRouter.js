const userRouter = require('express').Router();
const {
  getUsers, getUserById, editProfile, updateAvatar, me,
} = require('../controllers/users');

userRouter.get('/', getUsers);
userRouter.get('/:id', getUserById);
userRouter.patch('/me', editProfile);
userRouter.patch('/me/avatar', updateAvatar);

module.exports = userRouter;
