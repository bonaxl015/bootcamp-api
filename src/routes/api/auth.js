const express = require('express')
const router = express.Router()
const {
  registerUser,
  loginUser,
  getUserInfo,
  forgotPassword
} = require('../../controllers/auth')
const { routeProtect } = require('../../middleware/auth')

router.route('/register').post(registerUser)
router.route('/login').post(loginUser)
router.route('/getUserInfo').get(routeProtect, getUserInfo)
router.route('/forgotPassword').post(forgotPassword)

module.exports = router
