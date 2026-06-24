const mongoose = require('mongoose');
const Job = process.env.MONGO_URI ? require('../models/Job') : require('../models/JobMock');

const getStats = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.userId);

    // 1. Group by status
    const statsArray = await Job.aggregate([
      { $match: { createdBy: userId } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    // Format stats array into key-value pairs
    const stats = statsArray.reduce((acc, curr) => {
      const { _id: title, count } = curr;
      acc[title] = count;
      return acc;
    }, {});

    // Ensure all statuses have a default value of 0
    const defaultStats = {
      Applied: stats.Applied || 0,
      Interview: stats.Interview || 0,
      Assessment: stats.Assessment || 0,
      Offer: stats.Offer || 0,
      Rejected: stats.Rejected || 0,
    };

    const totalApplications = await Job.countDocuments({ createdBy: userId });

    // Success Rate: Offers / Total Applications * 100
    const successRate = totalApplications > 0 
      ? Math.round((defaultStats.Offer / totalApplications) * 100) 
      : 0;

    // 2. Monthly applications trend
    let monthlyApplications = await Job.aggregate([
      { $match: { createdBy: userId } },
      {
        $group: {
          _id: {
            year: { $year: '$applicationDate' },
            month: { $month: '$applicationDate' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 12 }, // Fetch up to 12 months for a comprehensive trend
    ]);

    // Format months to user-friendly format (e.g. "Jun 2024") and sort chronologically
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    monthlyApplications = monthlyApplications
      .map((item) => {
        const { year, month } = item._id;
        const date = `${months[month - 1]} ${year}`;
        const count = item.count;
        return { date, count, year, month };
      })
      .reverse(); // Reverse to chronological order (oldest to newest)

    res.status(200).json({
      defaultStats,
      totalApplications,
      successRate,
      monthlyApplications,
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ msg: 'An error occurred while generating dashboard statistics' });
  }
};

module.exports = { getStats };
