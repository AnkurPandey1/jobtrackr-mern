import React, { useContext } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FiTrendingUp, FiTarget, FiGrid, FiShield, FiBriefcase } from 'react-icons/fi';

const Landing = () => {
  const { user } = useContext(AuthContext);

  // If already logged in, skip landing page
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const features = [
    {
      title: 'Visual Dashboard',
      description: 'Get deep analytics, monthly tracking rates, status distribution, and offer ratios automatically generated from your entries.',
      icon: FiTrendingUp,
      color: 'text-brand-400 bg-brand-500/10 border-brand-500/20',
    },
    {
      title: 'Status & Deadlines',
      description: 'Track application steps from initial Applied status through Assessments, Interviews, Offers, and Rejections.',
      icon: FiTarget,
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    },
    {
      title: 'Search & Filters',
      description: 'Find applications instantly by searching for company names or titles, and filter by status and date criteria.',
      icon: FiGrid,
      color: 'text-violet-400 bg-violet-500/10 border-violet-500/20',
    },
    {
      title: 'Private & Secure',
      description: 'Secure account logins and passwords protected by Bcrypt encryption and authenticated via JWT cookies.',
      icon: FiShield,
      color: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
    },
  ];

  return (
    <div className="flex-1 flex flex-col bg-navy-950 min-h-screen relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-gradient-radial-glow -z-10" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-gradient-radial-glow -z-10" />

      {/* Landing Navbar */}
      <nav className="w-full max-w-7xl mx-auto px-6 py-6 flex justify-between items-center z-10">
        <div className="flex items-center gap-2">
          <span className="text-3xl">🎯</span>
          <h1 className="text-xl font-bold tracking-wider text-white">
            Job<span className="text-brand-500">Trackr</span>
          </h1>
        </div>
        <div className="flex gap-4">
          <Link to="/login" className="glass-btn-secondary text-sm px-5 py-2">
            Sign In
          </Link>
          <Link to="/register" className="glass-btn-primary text-sm px-5 py-2">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero section */}
      <main className="flex-1 flex items-center justify-center py-16 px-6 z-10">
        <div className="max-w-4xl text-center space-y-8 animate-slide-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-300 text-xs font-semibold uppercase tracking-wider mx-auto">
            <FiBriefcase /> Track. Analyze. Succeed.
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.15]">
            Simplify Your <span className="text-gradient-primary">Job Search</span> Journey
          </h1>
          
          <p className="text-lg md:text-xl text-navy-300 max-w-2xl mx-auto leading-relaxed">
            Stop managing your career spreadsheet-by-spreadsheet. JobTrackr gives you a clean visual dashboard to monitor applications, schedule deadlines, and secure your next role.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
            <Link to="/register" className="glass-btn-primary text-base px-8 py-3.5 w-full sm:w-auto">
              Start Tracking Now
            </Link>
            <Link to="/login" className="glass-btn-secondary text-base px-8 py-3.5 w-full sm:w-auto">
              Access Dashboard
            </Link>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-20 text-left">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div key={idx} className="glass-panel p-6 rounded-2xl space-y-4 hover:border-navy-700 transition-all duration-300">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center border text-2xl ${feature.color}`}>
                    <Icon />
                  </div>
                  <h3 className="text-lg font-bold text-white">{feature.title}</h3>
                  <p className="text-sm text-navy-400 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-navy-900 py-6 text-center text-xs text-navy-500 z-10">
        &copy; {new Date().getFullYear()} JobTrackr. Created for interview preparation and productivity.
      </footer>
    </div>
  );
};

export default Landing;
