const express = require('express');
const router = express.Router();
const { createJob, getAllJobs, getJob, updateJob, deleteJob } = require('../controllers/jobController');
const { authenticateUser } = require('../middleware/authMiddleware');

// Protect all routes under jobs
router.use(authenticateUser);

router.route('/')
  .post(createJob)
  .get(getAllJobs);

router.route('/:id')
  .get(getJob)
  .patch(updateJob)
  .delete(deleteJob);

module.exports = router;
