import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import SkeletonLoader from '../components/SkeletonLoader';
import { FiUser, FiMail, FiCalendar, FiBriefcase, FiCheckCircle } from 'react-icons/fi';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [profileStats, setProfileStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileStats = async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/stats');
        setProfileStats(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfileStats();
  }, []);

  return (
    <div className="space-y-6 max-w-3xl mx-auto animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">My Profile</h2>
        <p className="text-sm text-navy-400 mt-1">Manage credentials and monitor account activity summaries</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="md:col-span-1 glass-panel p-6 rounded-3xl flex flex-col items-center text-center space-y-4">
          <div className="w-20 h-20 rounded-full bg-brand-600/20 border-2 border-brand-500/40 flex items-center justify-center font-bold text-brand-400 text-3xl">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="text-lg font-bold text-white leading-tight">{user?.name}</h3>
            <p className="text-xs text-navy-400 mt-1 font-semibold">Job Seeker Account</p>
          </div>
        </div>

        {/* Credentials Details */}
        <div className="md:col-span-2 glass-panel p-6 sm:p-8 rounded-3xl space-y-6">
          <h4 className="text-base font-bold text-white border-b border-navy-800/80 pb-3">User Details</h4>
          
          <div className="space-y-4 text-sm">
            <div className="flex items-center gap-3">
              <span className="text-lg text-navy-400 shrink-0">
                <FiUser />
              </span>
              <div>
                <span className="text-xs text-navy-500 font-bold uppercase tracking-wider block">Full Name</span>
                <span className="text-navy-200 font-medium">{user?.name}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-lg text-navy-400 shrink-0">
                <FiMail />
              </span>
              <div>
                <span className="text-xs text-navy-500 font-bold uppercase tracking-wider block">Email Address</span>
                <span className="text-navy-200 font-medium">{user?.email}</span>
              </div>
            </div>
          </div>

          <h4 className="text-base font-bold text-white border-b border-navy-800/80 pb-3 pt-2">Search Activity Summary</h4>
          
          {loading ? (
            <div className="space-y-3 pt-2">
              <div className="h-4 bg-navy-800 rounded animate-pulse w-3/4"></div>
              <div className="h-4 bg-navy-800 rounded animate-pulse w-1/2"></div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="bg-navy-950/40 border border-navy-800/80 p-4 rounded-xl flex items-center gap-3">
                <span className="text-xl text-brand-400 p-2 rounded-lg bg-brand-500/10">
                  <FiBriefcase />
                </span>
                <div>
                  <span className="text-xs text-navy-500 font-semibold block">Total tracked</span>
                  <span className="text-base font-bold text-white">{profileStats?.totalApplications || 0}</span>
                </div>
              </div>

              <div className="bg-navy-950/40 border border-navy-800/80 p-4 rounded-xl flex items-center gap-3">
                <span className="text-xl text-emerald-400 p-2 rounded-lg bg-emerald-500/10">
                  <FiCheckCircle />
                </span>
                <div>
                  <span className="text-xs text-navy-500 font-semibold block">Success Rate</span>
                  <span className="text-base font-bold text-white">{profileStats?.successRate || 0}%</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
