const express = require('express')
const router = express.Router()
const {
  getBootcamps,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  uploadBootcamp
} = require('../../controllers/bootcamps')

router.route('/query').get(getBootcamps)
router.route('/create').post(createBootcamp)
router.route('/edit').post(updateBootcamp)
router.route('/delete').post(deleteBootcamp)
router.route('/upload').post(uploadBootcamp)

module.exports = router
