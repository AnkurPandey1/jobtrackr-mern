const Job = process.env.MONGO_URI ? require('../models/Job') : require('../models/JobMock');

const createJob = async (req, res) => {
  const { company, position, status, location, salary, applicationDate, deadline, notes, jobLink } = req.body;

  if (!company || !position || !location || !applicationDate) {
    return res.status(400).json({ msg: 'Please provide all required fields (company, position, location, applicationDate)' });
  }

  try {
    const job = await Job.create({
      company,
      position,
      status,
      location,
      salary: salary === '' ? undefined : salary,
      applicationDate,
      deadline: deadline === '' ? undefined : deadline,
      notes,
      jobLink,
      createdBy: req.user.userId,
    });

    res.status(201).json({ job });
  } catch (error) {
    console.error('Create job error:', error);
    res.status(500).json({ msg: 'An error occurred while creating the job application' });
  }
};

const getAllJobs = async (req, res) => {
  const { search, status, sort, page, limit } = req.query;

  // Base query: only retrieve jobs created by this user
  const queryObject = { createdBy: req.user.userId };

  // 1. Search filter (company or position/job title)
  if (search) {
    queryObject.$or = [
      { company: { $regex: search, $options: 'i' } },
      { position: { $regex: search, $options: 'i' } },
    ];
  }

  // 2. Status filter
  if (status && status !== 'all') {
    queryObject.status = status;
  }

  // Set up Mongoose Query
  let result = Job.find(queryObject);

  // 3. Sorting
  if (sort === 'latest') {
    result = result.sort('-createdAt');
  } else if (sort === 'oldest') {
    result = result.sort('createdAt');
  } else if (sort === 'company') {
    result = result.sort('company');
  } else if (sort === 'status') {
    result = result.sort('status');
  } else {
    // Default to latest
    result = result.sort('-createdAt');
  }

  // 4. Pagination
  const pageNumber = Number(page) || 1;
  const limitNumber = Number(limit) || 10;
  const skip = (pageNumber - 1) * limitNumber;

  result = result.skip(skip).limit(limitNumber);

  try {
    const jobs = await result;
    const totalJobs = await Job.countDocuments(queryObject);
    const numOfPages = Math.ceil(totalJobs / limitNumber);

    res.status(200).json({ jobs, totalJobs, numOfPages });
  } catch (error) {
    console.error('Get all jobs error:', error);
    res.status(500).json({ msg: 'An error occurred while retrieving job applications' });
  }
};

const getJob = async (req, res) => {
  const { id: jobId } = req.params;

  try {
    const job = await Job.findOne({ _id: jobId, createdBy: req.user.userId });
    if (!job) {
      return res.status(404).json({ msg: `No job application found with id ${jobId}` });
    }
    res.status(200).json({ job });
  } catch (error) {
    console.error('Get job error:', error);
    res.status(500).json({ msg: 'An error occurred while fetching the job application' });
  }
};

const updateJob = async (req, res) => {
  const { id: jobId } = req.params;
  const { company, position, status, location, salary, applicationDate, deadline, notes, jobLink } = req.body;

  if (!company || !position || !location || !applicationDate) {
    return res.status(400).json({ msg: 'Please provide all required fields (company, position, location, applicationDate)' });
  }

  try {
    const job = await Job.findOne({ _id: jobId, createdBy: req.user.userId });
    if (!job) {
      return res.status(404).json({ msg: `No job application found with id ${jobId}` });
    }

    job.company = company;
    job.position = position;
    job.status = status;
    job.location = location;
    job.salary = salary === '' || salary === null ? undefined : salary;
    job.applicationDate = applicationDate;
    job.deadline = deadline === '' || deadline === null ? undefined : deadline;
    job.notes = notes;
    job.jobLink = jobLink;

    await job.save();

    res.status(200).json({ job });
  } catch (error) {
    console.error('Update job error:', error);
    res.status(500).json({ msg: 'An error occurred while updating the job application' });
  }
};

const deleteJob = async (req, res) => {
  const { id: jobId } = req.params;

  try {
    const job = await Job.findOneAndDelete({ _id: jobId, createdBy: req.user.userId });
    if (!job) {
      return res.status(404).json({ msg: `No job application found with id ${jobId}` });
    }
    res.status(200).json({ msg: 'Job application removed successfully' });
  } catch (error) {
    console.error('Delete job error:', error);
    res.status(500).json({ msg: 'An error occurred while deleting the job application' });
  }
};

module.exports = {
  createJob,
  getAllJobs,
  getJob,
  updateJob,
  deleteJob,
};
