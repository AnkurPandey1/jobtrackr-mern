import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import api from '../services/api';
import { useToast } from '../hooks/useToast';
import { FiArrowLeft, FiLoader, FiBriefcase, FiMapPin, FiLink, FiDollarSign, FiCalendar, FiFileText } from 'react-icons/fi';

const AddJob = () => {
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Get current date formatted for date inputs (YYYY-MM-DD)
  const today = new Date().toISOString().split('T')[0];

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      status: 'Applied',
      location: 'Remote',
      applicationDate: today,
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await api.post('/jobs', data);
      showToast('Job application recorded successfully!', 'success');
      navigate('/applications');
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.msg || 'Failed to submit application';
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto animate-fade-in">
      {/* Back link */}
      <Link to="/applications" className="inline-flex items-center gap-2 text-navy-400 hover:text-white transition-colors text-sm font-medium">
        <FiArrowLeft /> Back to Applications
      </Link>

      {/* Header */}
      <div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">Add Job Application</h2>
        <p className="text-sm text-navy-400 mt-1">Record a new role submission and track its progress</p>
      </div>

      {/* Form Card */}
      <form onSubmit={handleSubmit(onSubmit)} className="glass-panel p-6 sm:p-8 rounded-3xl space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Company Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-navy-400">Company Name *</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-400">
                <FiBriefcase />
              </span>
              <input
                type="text"
                placeholder="Google"
                className={`w-full pl-10 pr-4 glass-input text-sm ${errors.company ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500' : ''}`}
                {...register('company', { required: 'Company name is required' })}
              />
            </div>
            {errors.company && <p className="text-rose-400 text-xs mt-1">{errors.company.message}</p>}
          </div>

          {/* Job Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-navy-400">Job Title / Position *</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-400">
                <FiBriefcase />
              </span>
              <input
                type="text"
                placeholder="Frontend Engineer"
                className={`w-full pl-10 pr-4 glass-input text-sm ${errors.position ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500' : ''}`}
                {...register('position', { required: 'Job title is required' })}
              />
            </div>
            {errors.position && <p className="text-rose-400 text-xs mt-1">{errors.position.message}</p>}
          </div>

          {/* Status */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-navy-400">Status *</label>
            <select
              className="w-full px-4 glass-input text-sm cursor-pointer"
              {...register('status', { required: 'Status is required' })}
            >
              <option value="Applied">Applied</option>
              <option value="Interview">Interview</option>
              <option value="Assessment">Assessment</option>
              <option value="Offer">Offer</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          {/* Location */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-navy-400">Location *</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-400">
                <FiMapPin />
              </span>
              <input
                type="text"
                placeholder="Remote / San Francisco, CA"
                className={`w-full pl-10 pr-4 glass-input text-sm ${errors.location ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500' : ''}`}
                {...register('location', { required: 'Location is required' })}
              />
            </div>
            {errors.location && <p className="text-rose-400 text-xs mt-1">{errors.location.message}</p>}
          </div>

          {/* Salary */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-navy-400">Estimated Salary (USD / Year)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-400">
                <FiDollarSign />
              </span>
              <input
                type="number"
                placeholder="120000"
                className="w-full pl-10 pr-4 glass-input text-sm"
                {...register('salary', {
                  min: { value: 0, message: 'Salary must be a positive number' },
                })}
              />
            </div>
            {errors.salary && <p className="text-rose-400 text-xs mt-1">{errors.salary.message}</p>}
          </div>

          {/* Job Link */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-navy-400">Job Posting Link</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-400">
                <FiLink />
              </span>
              <input
                type="url"
                placeholder="https://careers.google.com/jobs/..."
                className="w-full pl-10 pr-4 glass-input text-sm"
                {...register('jobLink')}
              />
            </div>
          </div>

          {/* Applied Date */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-navy-400">Applied Date *</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-400">
                <FiCalendar />
              </span>
              <input
                type="date"
                className={`w-full pl-10 pr-4 glass-input text-sm cursor-pointer ${errors.applicationDate ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500' : ''}`}
                {...register('applicationDate', { required: 'Applied date is required' })}
              />
            </div>
            {errors.applicationDate && <p className="text-rose-400 text-xs mt-1">{errors.applicationDate.message}</p>}
          </div>

          {/* Deadline */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-navy-400">Application/Assessment Deadline</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-400">
                <FiCalendar />
              </span>
              <input
                type="date"
                className="w-full pl-10 pr-4 glass-input text-sm cursor-pointer"
                {...register('deadline')}
              />
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-navy-400">Internal Notes & Reminders</label>
          <div className="relative">
            <span className="absolute left-3 top-4 text-navy-400">
              <FiFileText />
            </span>
            <textarea
              rows={4}
              placeholder="List recruiter details, interview stages, key skills required or preparation strategies..."
              className="w-full pl-10 pr-4 glass-input text-sm"
              {...register('notes')}
            />
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-navy-800/80">
          <button
            type="button"
            onClick={() => navigate('/applications')}
            className="glass-btn-secondary text-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="glass-btn-primary text-sm flex items-center gap-2"
          >
            {loading ? (
              <>
                <FiLoader className="animate-spin text-sm" />
                <span>Recording...</span>
              </>
            ) : (
              <span>Save Application</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddJob;
