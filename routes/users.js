const router = require('express').Router();
const {
  getUsers, getUser, getUserById, updateUser, updateAvatar,
} = require('../controllers/users');
const { updateUserValidation, updateAvatarValidation } = require('../middlewares/validation');

router.get('/', getUsers);
router.get('/me', getUser);
router.get('/:userId', getUserById);
router.patch('/me', updateUserValidation, updateUser);
router.patch('/me/avatar', updateAvatarValidation, updateAvatar);

module.exports = router;
