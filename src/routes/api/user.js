const express = require('express')
const router = express.Router()
const {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser
} = require('../../controllers/user')
const paginateResults = require('../../middleware/page-results')
const User = require('../../models/User')
const { routeProtect, authorize } = require('../../middleware/auth')

router.use(routeProtect)
router.use(authorize('admin'))

router.route('/getAllUsers').get(paginateResults(User), getAllUsers)
router.route('/createUser').post(createUser)
router.route('/updateUser').post(updateUser)
router.route('/deleteUser').post(deleteUser)

module.exports = router
