const express = require('express')
const router = express.Router()
const {
  registerUser,
  loginUser,
  getUserInfo,
  forgotPassword,
  resetPassword,
  updateUserInfo,
  updatePassword,
  logoutUser
} = require('../../controllers/auth')
const { routeProtect } = require('../../middleware/auth')

router.route('/register').post(registerUser)
router.route('/login').post(loginUser)
router.route('/getUserInfo').get(routeProtect, getUserInfo)
router.route('/forgotPassword').post(forgotPassword)
router.route('/resetPassword/:resetToken').post(resetPassword)
router.route('/updateUserInfo').post(routeProtect, updateUserInfo)
router.route('/updatePassword').post(routeProtect, updatePassword)
router.route('/logout').post(routeProtect, logoutUser)

module.exports = router
