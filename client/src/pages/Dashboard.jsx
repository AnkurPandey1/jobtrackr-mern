import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import SkeletonLoader from '../components/SkeletonLoader';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { FiBriefcase, FiCalendar, FiCheckCircle, FiXCircle, FiTrendingUp, FiActivity, FiPlus } from 'react-icons/fi';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/stats');
      setStats(data);
    } catch (err) {
      console.error(err);
      setError('Could not retrieve dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="space-y-8 animate-fade-in">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Dashboard Overview</h2>
          <p className="text-sm text-navy-400 mt-1">Aggregating job status progress and metrics...</p>
        </div>
        <SkeletonLoader type="card" count={4} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <SkeletonLoader type="chart" />
          </div>
          <div>
            <SkeletonLoader type="chart" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-panel p-8 rounded-2xl text-center space-y-4 max-w-lg mx-auto mt-12 animate-slide-up">
        <FiXCircle className="text-rose-500 text-5xl mx-auto" />
        <h3 className="text-xl font-bold text-white">Metrics Unavailable</h3>
        <p className="text-navy-400 text-sm leading-relaxed">{error}</p>
        <button onClick={fetchStats} className="glass-btn-primary text-sm">
          Retry Sync
        </button>
      </div>
    );
  }

  const { defaultStats, totalApplications, successRate, monthlyApplications } = stats;

  const topCards = [
    {
      title: 'Total Applications',
      value: totalApplications,
      icon: FiBriefcase,
      color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20 shadow-indigo-500/5',
      desc: 'All tracked roles',
    },
    {
      title: 'Interviews Scheduled',
      value: defaultStats.Interview,
      icon: FiCalendar,
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/20 shadow-amber-500/5',
      desc: 'Active meetings scheduled',
    },
    {
      title: 'Offers Received',
      value: defaultStats.Offer,
      icon: FiCheckCircle,
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20 shadow-emerald-500/5',
      desc: 'Success roles unlocked',
    },
    {
      title: 'Rejections / Closed',
      value: defaultStats.Rejected,
      icon: FiXCircle,
      color: 'text-rose-400 bg-rose-500/10 border-rose-500/20 shadow-rose-500/5',
      desc: 'Applications closed',
    },
  ];

  // Pie chart formatting for status distribution
  const pieData = Object.keys(defaultStats)
    .map((key) => ({
      name: key,
      value: defaultStats[key],
    }))
    .filter((item) => item.value > 0); // Don't show statuses with count 0

  const COLORS = {
    Applied: '#6366f1',    // brand-500 / Indigo
    Interview: '#f59e0b',  // amber-500
    Assessment: '#8b5cf6', // violet-500
    Offer: '#10b981',      // emerald-500
    Rejected: '#ef4444',   // rose-500
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight font-sans">Dashboard</h2>
          <p className="text-sm text-navy-400 mt-1">Real-time statistics and hiring funnel analytics</p>
        </div>
        <Link to="/add-job" className="glass-btn-primary flex items-center gap-2 self-start sm:self-auto text-sm">
          <FiPlus /> Add Job Application
        </Link>
      </div>

      {/* Top Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {topCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className={`glass-panel p-6 rounded-2xl flex items-center gap-5 hover:border-navy-700/80 transition-all duration-300 shadow-lg ${card.color.split(' ')[4]}`}>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center border text-2xl shrink-0 ${card.color.split(' ')[0]} ${card.color.split(' ')[1]} ${card.color.split(' ')[2]}`}>
                <Icon />
              </div>
              <div>
                <span className="text-xs font-semibold text-navy-400 uppercase tracking-wider block">{card.title}</span>
                <span className="text-3xl font-bold text-white mt-1 block font-sans">{card.value}</span>
                <span className="text-[11px] text-navy-500 mt-0.5 block">{card.desc}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Trend Area Chart */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl flex flex-col justify-between min-h-[400px]">
          <div className="flex items-center gap-2 mb-6">
            <FiActivity className="text-brand-400 text-xl" />
            <h3 className="text-lg font-bold text-white">Monthly Application Trend</h3>
          </div>
          <div className="flex-1 w-full h-[300px]">
            {monthlyApplications.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyApplications} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorApplications" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} tickLine={false} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#1e293b',
                      borderRadius: '12px',
                      color: '#f8fafc',
                      fontSize: '13px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="count"
                    name="Applications"
                    stroke="#6366f1"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorApplications)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-2">
                <p className="text-navy-400 text-sm">No historical application data recorded yet.</p>
                <Link to="/add-job" className="text-brand-400 text-xs font-semibold hover:underline">
                  Submit your first job &rarr;
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Status Distribution Pie Chart & Success Rate */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col min-h-[400px]">
          <div className="flex items-center gap-2 mb-6">
            <FiTrendingUp className="text-emerald-400 text-xl" />
            <h3 className="text-lg font-bold text-white">Distribution & Rate</h3>
          </div>
          <div className="flex-1 flex flex-col justify-between">
            {pieData.length > 0 ? (
              <>
                {/* Recharts Pie Chart */}
                <div className="h-[200px] w-full relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[entry.name] || '#cbd5e1'} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#0f172a',
                          borderColor: '#1e293b',
                          borderRadius: '12px',
                          color: '#f8fafc',
                          fontSize: '12px',
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  {/* Center Text displaying Success Rate */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-extrabold text-white">{successRate}%</span>
                    <span className="text-[10px] text-navy-400 uppercase font-semibold tracking-wider">Success Rate</span>
                  </div>
                </div>

                {/* Custom Custom Legend Grid */}
                <div className="grid grid-cols-2 gap-3 mt-4">
                  {pieData.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs">
                      <div
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: COLORS[item.name] || '#cbd5e1' }}
                      />
                      <span className="text-navy-400 truncate">{item.name}</span>
                      <span className="text-white font-bold ml-auto">{item.value}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-6">
                <p className="text-navy-400 text-sm">No applications found to construct distributions.</p>
                <Link to="/add-job" className="text-brand-400 text-xs font-semibold hover:underline mt-2">
                  Create application &rarr;
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
