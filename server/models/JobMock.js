const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../data/jobs.json');

// Ensure directory and file exists
if (!fs.existsSync(path.dirname(dbPath))) {
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });
}
if (!fs.existsSync(dbPath)) {
  fs.writeFileSync(dbPath, JSON.stringify([]));
}

const getJobs = () => {
  try {
    return JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  } catch (e) {
    return [];
  }
};
const saveJobs = (jobs) => fs.writeFileSync(dbPath, JSON.stringify(jobs, null, 2));

const JobMock = {
  create: async (data) => {
    const jobs = getJobs();
    const newJob = {
      _id: Math.random().toString(36).substring(2, 9),
      ...data,
      salary: data.salary ? Number(data.salary) : undefined,
      applicationDate: data.applicationDate || new Date().toISOString(),
      createdAt: new Date().toISOString()
    };
    jobs.push(newJob);
    saveJobs(jobs);
    return newJob;
  },
  
  find: (queryObject) => {
    let jobs = getJobs();
    
    // Filter by user ownership
    if (queryObject.createdBy) {
      const uId = queryObject.createdBy.toString();
      jobs = jobs.filter(j => j.createdBy === uId);
    }
    
    // Regex Search filter (company or position)
    if (queryObject.$or) {
      const searchTerms = queryObject.$or;
      const termCompany = searchTerms[0].company.$regex;
      const termPosition = searchTerms[1].position.$regex;
      jobs = jobs.filter(j => 
        (j.company && j.company.toLowerCase().includes(termCompany.toLowerCase())) ||
        (j.position && j.position.toLowerCase().includes(termPosition.toLowerCase()))
      );
    }
    
    // Status Filter
    if (queryObject.status) {
      jobs = jobs.filter(j => j.status === queryObject.status);
    }
    
    // Return mock query builder chain
    const chain = {
      jobsList: jobs,
      sort: function(sortStr) {
        if (sortStr.includes('-createdAt')) {
          this.jobsList.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        } else if (sortStr.includes('createdAt')) {
          this.jobsList.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        } else if (sortStr.includes('company')) {
          this.jobsList.sort((a, b) => a.company.localeCompare(b.company));
        } else if (sortStr.includes('status')) {
          this.jobsList.sort((a, b) => a.status.localeCompare(b.status));
        }
        return this;
      },
      skip: function(skipVal) {
        this.jobsList = this.jobsList.slice(skipVal);
        return this;
      },
      limit: function(limitVal) {
        this.jobsList = this.jobsList.slice(0, limitVal);
        return this;
      },
      then: function(onFulfilled) {
        return Promise.resolve(this.jobsList).then(onFulfilled);
      }
    };
    
    return chain;
  },

  countDocuments: async (queryObject) => {
    let jobs = getJobs();
    if (queryObject.createdBy) {
      const uId = queryObject.createdBy.toString();
      jobs = jobs.filter(j => j.createdBy === uId);
    }
    if (queryObject.$or) {
      const searchTerms = queryObject.$or;
      const termCompany = searchTerms[0].company.$regex;
      const termPosition = searchTerms[1].position.$regex;
      jobs = jobs.filter(j => 
        (j.company && j.company.toLowerCase().includes(termCompany.toLowerCase())) ||
        (j.position && j.position.toLowerCase().includes(termPosition.toLowerCase()))
      );
    }
    if (queryObject.status) {
      jobs = jobs.filter(j => j.status === queryObject.status);
    }
    return jobs.length;
  },

  findOne: async (query) => {
    const jobs = getJobs();
    const uId = query.createdBy ? query.createdBy.toString() : '';
    const job = jobs.find(j => j._id === query._id && j.createdBy === uId);
    if (!job) return null;
    
    return {
      ...job,
      save: async function() {
        const currentJobs = getJobs();
        const idx = currentJobs.findIndex(j => j._id === this._id);
        if (idx !== -1) {
          currentJobs[idx] = {
            ...currentJobs[idx],
            company: this.company,
            position: this.position,
            status: this.status,
            location: this.location,
            salary: this.salary,
            applicationDate: this.applicationDate,
            deadline: this.deadline,
            notes: this.notes,
            jobLink: this.jobLink,
            updatedAt: new Date().toISOString()
          };
          saveJobs(currentJobs);
        }
        return this;
      }
    };
  },

  findOneAndDelete: async (query) => {
    const jobs = getJobs();
    const uId = query.createdBy ? query.createdBy.toString() : '';
    const idx = jobs.findIndex(j => j._id === query._id && j.createdBy === uId);
    if (idx === -1) return null;
    const deletedJob = jobs.splice(idx, 1)[0];
    saveJobs(jobs);
    return deletedJob;
  },

  aggregate: async (pipeline) => {
    const jobs = getJobs();
    const matchStep = pipeline.find(s => s.$match);
    const userId = matchStep?.$match?.createdBy?.toString();
    
    const userJobs = jobs.filter(j => j.createdBy === userId);

    const groupStep = pipeline.find(s => s.$group);
    
    if (groupStep && groupStep.$group._id === '$status') {
      const statusCounts = {};
      userJobs.forEach(j => {
        statusCounts[j.status] = (statusCounts[j.status] || 0) + 1;
      });
      return Object.keys(statusCounts).map(status => ({
        _id: status,
        count: statusCounts[status]
      }));
    }

    if (groupStep && groupStep.$group._id.year) {
      const monthlyCounts = {};
      userJobs.forEach(j => {
        const appDate = new Date(j.applicationDate);
        const year = appDate.getFullYear();
        const month = appDate.getMonth() + 1;
        const key = `${year}-${month}`;
        if (!monthlyCounts[key]) {
          monthlyCounts[key] = { year, month, count: 0 };
        }
        monthlyCounts[key].count++;
      });
      
      return Object.values(monthlyCounts).map(item => ({
        _id: { year: item.year, month: item.month },
        count: item.count
      }));
    }

    return [];
  }
};

module.exports = JobMock;
