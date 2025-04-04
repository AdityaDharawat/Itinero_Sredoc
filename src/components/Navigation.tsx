import React, { useState } from 'react';
import { Shield, Home, BarChart2, MessageSquare, Menu, X, LogIn, Mic } from 'lucide-react';
import { FiCalendar, FiMic } from 'react-icons/fi';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import DeathlyHallowsLogo from './ShipWheelLogo.tsx';

const Navigation = ({ appName }: { appName: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/dashboard', label: 'Dashboard', icon: BarChart2 },
    { path: '/feedback', label: 'Feedback', icon: MessageSquare },
  ];

  const baseNavStyle = `flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 font-medium`;

  const getNavLinkClasses = (path: string) =>
    location.pathname === path
      ? 'bg-white text-blue-600 shadow-md'
      : 'text-white hover:bg-white hover:text-blue-600';

  const getButtonClasses = (path: string) =>
    location.pathname === path
      ? 'bg-white text-blue-600 shadow-md'
      : 'text-white hover:bg-white hover:text-blue-600';

  return (
    <nav className="fixed top-0 left-0 w-full bg-gradient-to-r from-blue-700 to-blue-500 text-white p-4 shadow-md z-50">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo and App Name */}
        <div className="flex items-center space-x-3">
          <DeathlyHallowsLogo size={32} color="white" className="w-8 h-8" />
          <span className="text-xl font-bold">{appName}</span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`${baseNavStyle} ${getNavLinkClasses(item.path)}`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}

          {/* Planner Button */}
          <button
            onClick={() => navigate('/planner')}
            className={`${baseNavStyle} ${getButtonClasses('/planner')}`}
          >
            <FiCalendar className="w-5 h-5" />
            <span>Planner</span>
          </button>

          {/* TripDetails Button */}
          <button
            onClick={() => navigate('/trip-details')}
            className={`${baseNavStyle} ${getButtonClasses('/trip-details')}`}
          >
            <FiMic className="w-5 h-5" />
            <span>Trip Details</span>
          </button>

          {/* Login */}
          <Link
            to="/auth"
            className="flex items-center space-x-2 px-4 py-2 bg-white text-blue-600 hover:bg-blue-100 font-semibold rounded-lg transition-all"
          >
            <LogIn className="w-5 h-5" />
            <span>Login</span>
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-white hover:bg-white hover:text-blue-600 rounded-md transition-all"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden ${isOpen ? 'block' : 'hidden'}`}>
        <div className="pt-4 pb-3 space-y-2 px-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`${baseNavStyle} w-full ${getNavLinkClasses(item.path)}`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}

          {/* Planner Button */}
          <button
            onClick={() => {
              navigate('/planner'); // Navigate to Planner page
              setIsOpen(false);
            }}
            className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium w-full ${
              location.pathname === '/planner'
                ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/20'
                : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800/50'
            }`}
          >
            <FiCalendar className="w-5 h-5" />
            <span>Planner</span>
          </button>

          {/* TripDetails Button */}
          <button
            onClick={() => {
              navigate('/trip-details'); // Navigate to TripDetails page
              setIsOpen(false);
            }}
            className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium w-full ${
              location.pathname === '/trip-details'
                ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/20'
                : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800/50'
            }`}
          >
            <FiMic className="w-5 h-5" />
            <span>Trip Details</span>
          </button>

          <Link
            to="/auth"
            onClick={() => setIsOpen(false)}
            className="flex items-center space-x-2 px-4 py-2 bg-white text-blue-600 hover:bg-blue-100 font-semibold rounded-lg transition-all w-full"
          >
            <LogIn className="w-5 h-5" />
            <span>Login</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
