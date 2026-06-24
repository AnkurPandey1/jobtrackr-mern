import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useToast } from '../hooks/useToast';
import SkeletonLoader from '../components/SkeletonLoader';
import {
  FiSearch,
  FiFilter,
  FiChevronLeft,
  FiChevronRight,
  FiEdit2,
  FiTrash2,
  FiEye,
  FiPlus,
  FiX,
  FiExternalLink,
  FiMapPin,
  FiDollarSign,
  FiCalendar,
} from 'react-icons/fi';

const Applications = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalJobs, setTotalJobs] = useState(0);
  const [numOfPages, setNumOfPages] = useState(1);
  
  // Search & Filter State
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [sort, setSort] = useState('latest');
  const [page, setPage] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Modals state
  const [selectedJob, setSelectedJob] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);

  const { showToast } = useToast();
  const navigate = useNavigate();

  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset to page 1 on new search
    }, 400);

    return () => clearTimeout(handler);
  }, [search]);

  const fetchJobs = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/jobs', {
        params: {
          search: debouncedSearch,
          status,
          sort,
          page,
          limit: 10,
        },
      });
      setJobs(data.jobs);
      setTotalJobs(data.totalJobs);
      setNumOfPages(data.numOfPages);
    } catch (err) {
      console.error(err);
      showToast('Failed to load applications', 'error');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, status, sort, page, showToast]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleDeleteJob = async () => {
    if (!jobToDelete) return;
    try {
      await api.delete(`/jobs/${jobToDelete}`);
      showToast('Application deleted successfully', 'success');
      setIsDeleteModalOpen(false);
      setJobToDelete(null);
      // Fetch updated list (re-evaluate pagination if page becomes empty)
      if (jobs.length === 1 && page > 1) {
        setPage(page - 1);
      } else {
        fetchJobs();
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to delete application', 'error');
    }
  };

  const getStatusBadge = (statusName) => {
    const badges = {
      Applied: 'bg-indigo-950/60 text-indigo-300 border-indigo-800/80',
      Interview: 'bg-amber-950/60 text-amber-300 border-amber-800/80',
      Assessment: 'bg-violet-950/60 text-violet-300 border-violet-800/80',
      Offer: 'bg-emerald-950/60 text-emerald-300 border-emerald-800/80',
      Rejected: 'bg-rose-950/60 text-rose-300 border-rose-800/80',
    };
    return badges[statusName] || 'bg-navy-900 text-navy-200 border-navy-700';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatSalary = (val) => {
    if (!val) return 'Not Specified';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Applications</h2>
          <p className="text-sm text-navy-400 mt-1">Manage and update your ongoing application workflows</p>
        </div>
        <Link to="/add-job" className="glass-btn-primary flex items-center gap-2 self-start sm:self-auto text-sm">
          <FiPlus /> Add Application
        </Link>
      </div>

      {/* Filters Glass Box */}
      <div className="glass-panel p-5 rounded-2xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search Input */}
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-400">
            <FiSearch />
          </span>
          <input
            type="text"
            placeholder="Search company or title..."
            className="w-full pl-10 pr-4 glass-input py-2 text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Status filter */}
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-400">
            <FiFilter />
          </span>
          <select
            className="w-full pl-10 pr-4 glass-input py-2 text-sm appearance-none cursor-pointer"
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
          >
            <option value="all">All Statuses</option>
            <option value="Applied">Applied</option>
            <option value="Interview">Interview</option>
            <option value="Assessment">Assessment</option>
            <option value="Offer">Offer</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        {/* Sort Select */}
        <div>
          <select
            className="w-full px-4 glass-input py-2 text-sm cursor-pointer"
            value={sort}
            onChange={(e) => {
              setSort(e.target.value);
              setPage(1);
            }}
          >
            <option value="latest">Sort: Latest Added</option>
            <option value="oldest">Sort: Oldest Added</option>
            <option value="company">Sort: Company Name A-Z</option>
            <option value="status">Sort: Status Group</option>
          </select>
        </div>

        {/* Stat Counter */}
        <div className="flex items-center justify-end pr-2 text-xs font-semibold text-navy-400 uppercase tracking-wider">
          Found {totalJobs} Application{totalJobs !== 1 && 's'}
        </div>
      </div>

      {/* Main Table / Cards view */}
      {loading ? (
        <SkeletonLoader type="table" />
      ) : jobs.length > 0 ? (
        <div className="space-y-4">
          {/* Desktop Table View */}
          <div className="hidden md:block glass-panel rounded-2xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-navy-800 bg-navy-900/40 text-navy-300 text-xs font-semibold uppercase tracking-wider">
                    <th className="py-4 px-6">Company</th>
                    <th className="py-4 px-6">Job Title</th>
                    <th className="py-4 px-6">Location</th>
                    <th className="py-4 px-6">Applied Date</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy-800/80 text-sm">
                  {jobs.map((job) => (
                    <tr key={job._id} className="hover:bg-navy-900/30 transition-colors">
                      <td className="py-4 px-6 font-semibold text-white">{job.company}</td>
                      <td className="py-4 px-6 text-navy-200">{job.position}</td>
                      <td className="py-4 px-6 text-navy-400">
                        <span className="flex items-center gap-1.5">
                          <FiMapPin className="text-xs" /> {job.location}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-navy-400">{formatDate(job.applicationDate)}</td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusBadge(job.status)}`}>
                          {job.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setSelectedJob(job)}
                            className="p-2 rounded-lg bg-navy-800/60 hover:bg-navy-800 text-brand-400 hover:text-brand-300 border border-navy-700/60 transition-all active:scale-95"
                            title="View details"
                          >
                            <FiEye />
                          </button>
                          <button
                            onClick={() => navigate(`/edit-job/${job._id}`)}
                            className="p-2 rounded-lg bg-navy-800/60 hover:bg-navy-800 text-amber-400 hover:text-amber-300 border border-navy-700/60 transition-all active:scale-95"
                            title="Edit"
                          >
                            <FiEdit2 />
                          </button>
                          <button
                            onClick={() => {
                              setJobToDelete(job._id);
                              setIsDeleteModalOpen(true);
                            }}
                            className="p-2 rounded-lg bg-rose-950/20 hover:bg-rose-950/40 text-rose-400 hover:text-rose-300 border border-rose-900/30 transition-all active:scale-95"
                            title="Delete"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Cards View */}
          <div className="md:hidden grid grid-cols-1 gap-4">
            {jobs.map((job) => (
              <div key={job._id} className="glass-panel p-5 rounded-2xl flex flex-col gap-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-white text-lg">{job.company}</h3>
                    <p className="text-sm text-navy-300">{job.position}</p>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusBadge(job.status)}`}>
                    {job.status}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-y-2 gap-x-4 border-t border-navy-800/80 pt-3 text-xs text-navy-400">
                  <div className="flex items-center gap-1.5">
                    <FiMapPin /> {job.location}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <FiCalendar /> {formatDate(job.applicationDate)}
                  </div>
                </div>

                <div className="flex gap-2 pt-2 mt-1 border-t border-navy-800/80">
                  <button
                    onClick={() => setSelectedJob(job)}
                    className="flex-1 py-2 glass-btn-secondary text-xs flex items-center justify-center gap-1.5"
                  >
                    <FiEye /> Details
                  </button>
                  <button
                    onClick={() => navigate(`/edit-job/${job._id}`)}
                    className="flex-1 py-2 bg-amber-950/20 border border-amber-900/40 text-amber-300 hover:bg-amber-950/30 text-xs flex items-center justify-center gap-1.5 rounded-lg"
                  >
                    <FiEdit2 /> Edit
                  </button>
                  <button
                    onClick={() => {
                      setJobToDelete(job._id);
                      setIsDeleteModalOpen(true);
                    }}
                    className="p-2 bg-rose-950/20 hover:bg-rose-950/40 text-rose-400 border border-rose-900/30 rounded-lg active:scale-95 flex items-center justify-center"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {numOfPages > 1 && (
            <div className="flex items-center justify-between pt-4">
              <span className="text-xs text-navy-400">
                Page <span className="font-semibold text-white">{page}</span> of{' '}
                <span className="font-semibold text-white">{numOfPages}</span>
              </span>
              <div className="flex gap-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  className="p-2 glass-btn-secondary text-sm disabled:opacity-30 disabled:pointer-events-none"
                >
                  <FiChevronLeft />
                </button>
                <button
                  disabled={page === numOfPages}
                  onClick={() => setPage(page + 1)}
                  className="p-2 glass-btn-secondary text-sm disabled:opacity-30 disabled:pointer-events-none"
                >
                  <FiChevronRight />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Empty State */
        <div className="glass-panel p-12 text-center rounded-2xl max-w-xl mx-auto space-y-4 py-16 animate-slide-up">
          <span className="text-6xl block">📋</span>
          <h3 className="text-xl font-bold text-white">No Applications Found</h3>
          <p className="text-navy-400 text-sm max-w-md mx-auto leading-relaxed">
            {search || status !== 'all'
              ? "We couldn't find any job applications matching your current filters. Try resetting search strings or selecting all statuses."
              : "You haven't recorded any job applications yet. Click 'Add Application' to register your first job submission details."}
          </p>
          {(search || status !== 'all') ? (
            <button
              onClick={() => {
                setSearch('');
                setStatus('all');
                setSort('latest');
              }}
              className="glass-btn-secondary text-xs"
            >
              Clear Filters
            </button>
          ) : (
            <Link to="/add-job" className="glass-btn-primary text-xs inline-flex items-center gap-2">
              <FiPlus /> Create Application
            </Link>
          )}
        </div>
      )}

      {/* Details Dialog Modal */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-2xl glass-panel p-6 rounded-2xl relative max-h-[90vh] overflow-y-auto space-y-6">
            {/* Close Button */}
            <button
              onClick={() => setSelectedJob(null)}
              className="absolute right-4 top-4 p-2 text-navy-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
            >
              <FiX className="text-xl" />
            </button>

            {/* Header info */}
            <div>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border mb-2.5 ${getStatusBadge(selectedJob.status)}`}>
                {selectedJob.status}
              </span>
              <h3 className="text-2xl font-bold text-white leading-tight">{selectedJob.company}</h3>
              <p className="text-lg text-brand-400 font-semibold mt-0.5">{selectedJob.position}</p>
            </div>

            {/* Grid metrics details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-b border-navy-800/80 py-5 text-sm">
              <div className="space-y-1">
                <span className="text-xs uppercase tracking-wider font-bold text-navy-500">Location</span>
                <span className="text-navy-200 flex items-center gap-2">
                  <FiMapPin className="text-brand-400" /> {selectedJob.location}
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-xs uppercase tracking-wider font-bold text-navy-500">Estimated Salary</span>
                <span className="text-navy-200 flex items-center gap-2">
                  <FiDollarSign className="text-emerald-400" /> {formatSalary(selectedJob.salary)}
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-xs uppercase tracking-wider font-bold text-navy-500">Applied Date</span>
                <span className="text-navy-200 flex items-center gap-2">
                  <FiCalendar className="text-indigo-400" /> {formatDate(selectedJob.applicationDate)}
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-xs uppercase tracking-wider font-bold text-navy-500">Submission Deadline</span>
                <span className="text-navy-200 flex items-center gap-2">
                  <FiCalendar className="text-rose-400" /> {formatDate(selectedJob.deadline)}
                </span>
              </div>
            </div>

            {/* Link & Notes */}
            <div className="space-y-4">
              {selectedJob.jobLink && (
                <div>
                  <span className="text-xs uppercase tracking-wider font-bold text-navy-500 block mb-1">Job Details Link</span>
                  <a
                    href={selectedJob.jobLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-brand-400 hover:text-brand-300 font-semibold transition-colors break-all"
                  >
                    View Job Posting <FiExternalLink className="text-xs" />
                  </a>
                </div>
              )}

              <div>
                <span className="text-xs uppercase tracking-wider font-bold text-navy-500 block mb-1">Internal Notes & Reminders</span>
                <div className="bg-navy-950/60 border border-navy-800 p-4 rounded-xl text-navy-300 text-sm leading-relaxed max-h-[200px] overflow-y-auto whitespace-pre-wrap">
                  {selectedJob.notes || 'No notes written for this application.'}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setSelectedJob(null)} className="glass-btn-secondary text-sm">
                Close Detail
              </button>
              <button
                onClick={() => {
                  const id = selectedJob._id;
                  setSelectedJob(null);
                  navigate(`/edit-job/${id}`);
                }}
                className="glass-btn-primary text-sm flex items-center gap-2"
              >
                <FiEdit2 /> Edit Application
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md glass-panel p-6 rounded-2xl space-y-5">
            <h3 className="text-xl font-bold text-white">Delete Job Application?</h3>
            <p className="text-sm text-navy-400 leading-relaxed">
              Are you sure you want to remove this application? This action will permanently delete all logs, details, and metrics.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setJobToDelete(null);
                }}
                className="glass-btn-secondary text-xs"
              >
                Cancel
              </button>
              <button onClick={handleDeleteJob} className="glass-btn-danger text-xs">
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Applications;
