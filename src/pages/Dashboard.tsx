import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Line, Doughnut } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { FiDownload, FiFilter, FiCalendar, FiMapPin, FiClock, FiDollarSign, FiUsers, FiCloud, FiMessageSquare } from 'react-icons/fi';

Chart.register(...registerables);

const Dashboard = () => {
  const [timeRange, setTimeRange] = useState('monthly');
  const [activeTrip, setActiveTrip] = useState<number | null>(null);
  const [weatherUpdates, setWeatherUpdates] = useState<string | null>(null);
  const [tripTypesData, setTripTypesData] = useState({
    labels: ['Beach', 'City', 'Mountain', 'Road Trip'],
    datasets: [
      {
        label: 'Current Year',
        data: [12, 19, 8, 15],
        backgroundColor: '#5E5ADB',
        borderRadius: 6,
      },
      {
        label: 'Last Year',
        data: [8, 15, 5, 10],
        backgroundColor: '#10B981',
        borderRadius: 6,
      },
    ],
  });

  const handleTripSelect = (id: number) => {
    setActiveTrip(activeTrip === id ? null : id);
  };

  const handleMapPinClick = (destination: string) => {
    alert(`Displaying map for: ${destination}`);
  };

  const updateTripTypesData = (newData: number[][]) => {
    setTripTypesData((prevData) => ({
      ...prevData,
      datasets: prevData.datasets.map((dataset, index) => ({
        ...dataset,
        data: newData[index] || dataset.data,
      })),
    }));
  };

  const handleSendMessage = () => {
    alert('Message sent to collaborators!');
  };

  const handleViewCalendar = () => {
    alert('Opening calendar for trip scheduling...');
  };

  const handleViewBudget = () => {
    alert('Displaying detailed budget breakdown...');
  };

  const handleManageUsers = () => {
    alert('Managing collaborators for the trip...');
  };

  useEffect(() => {
    // Fetch real-time weather updates
    fetch('https://api.weatherapi.com/v1/current.json?key=YOUR_API_KEY&q=New York')
      .then((response) => response.json())
      .then((data) => setWeatherUpdates(`Current Weather: ${data.current.temp_c}°C, ${data.current.condition.text}`))
      .catch((error) => console.error('Error fetching weather updates:', error));

    // Simulate fetching updated trip types data
    const fetchUpdatedData = async () => {
      const updatedData = [[14, 22, 10, 18], [10, 17, 7, 12]]; // Example new data
      updateTripTypesData(updatedData);
    };

    fetchUpdatedData();
  }, []);

  // Sample data
  const travelTrendsData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'Trips Planned',
        data: [3, 5, 4, 7, 6, 8, 10],
        borderColor: '#5E5ADB',
        backgroundColor: 'rgba(94, 90, 219, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const budgetData = {
    labels: ['Transport', 'Accommodation', 'Activities', 'Food'],
    datasets: [
      {
        data: [35, 40, 15, 10],
        backgroundColor: ['#5E5ADB', '#10B981', '#F59E0B', '#EF4444'],
        borderWidth: 0,
      },
    ],
  };

  const upcomingTrips = [
    { id: 1, destination: 'Bali, Indonesia', date: '2025-06-15', duration: '7 days', budget: '$2,500', status: 'planned' },
    { id: 2, destination: 'Paris, France', date: '2025-07-22', duration: '5 days', budget: '$3,200', status: 'confirmed' },
    { id: 3, destination: 'Tokyo, Japan', date: '2025-09-10', duration: '10 days', budget: '$4,800', status: 'planned' },
    { id: 4, destination: 'New York, USA', date: '2025-11-05', duration: '4 days', budget: '$2,100', status: 'completed' },
    { id: 5, destination: 'Rome, Italy', date: '2025-12-15', duration: '6 days', budget: '$2,700', status: 'completed' },
  ];

  return (
    <div className="container mx-auto px-4 pt-28 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-4xl font-bold text-gray-800"
        >
          Intelligent Travel Planner
        </motion.h1>
        
        <div className="flex items-center space-x-4 mt-4 md:mt-0">
          <div className="relative">
            <select 
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="appearance-none bg-white border border-gray-200 rounded-lg pl-4 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
            >
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
            </select>
            <FiFilter className="absolute right-3 top-2.5 text-gray-400" />
          </div>
          <button className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">
            <FiDownload className="mr-2" /> Export
          </button>
        </div>
      </div>

      {/* Weather Updates */}
      {weatherUpdates && (
        <div className="bg-blue-100 text-blue-800 p-4 rounded-lg mb-8">
          <FiCloud className="inline-block mr-2" /> {weatherUpdates}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-white rounded-xl p-6 shadow border border-gray-100"
        >
          <p className="text-sm text-gray-600 mb-1">Upcoming Trips</p>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">3</h3>
          <p className="text-sm text-green-500">+1 from last month</p>
        </motion.div>
        
        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-white rounded-xl p-6 shadow border border-gray-100"
        >
          <p className="text-sm text-gray-600 mb-1">Total Countries</p>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">14</h3>
          <p className="text-sm text-green-500">+2 from last year</p>
        </motion.div>
        
        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-white rounded-xl p-6 shadow border border-gray-100"
        >
          <p className="text-sm text-gray-600 mb-1">Avg. Trip Budget</p>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">$2,850</h3>
          <p className="text-sm text-green-500">+12% from last year</p>
        </motion.div>
        
        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-white rounded-xl p-6 shadow border border-gray-100"
        >
          <p className="text-sm text-gray-600 mb-1">Days Traveling</p>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">42</h3>
          <p className="text-sm text-green-500">+8 from last year</p>
        </motion.div>
      </div>

      {/* New Functionalities */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-white rounded-xl p-6 shadow border border-gray-100 flex items-center space-x-4"
          onClick={handleSendMessage}
        >
          <FiMessageSquare className="text-blue-500 w-8 h-8" />
          <div>
            <p className="text-sm text-gray-600 mb-1">Messages</p>
            <h3 className="text-lg font-bold text-gray-900">Collaborate</h3>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-white rounded-xl p-6 shadow border border-gray-100 flex items-center space-x-4"
          onClick={handleViewCalendar}
        >
          <FiCalendar className="text-green-500 w-8 h-8" />
          <div>
            <p className="text-sm text-gray-600 mb-1">Calendar</p>
            <h3 className="text-lg font-bold text-gray-900">Schedule</h3>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-white rounded-xl p-6 shadow border border-gray-100 flex items-center space-x-4"
          onClick={handleViewBudget}
        >
          <FiDollarSign className="text-yellow-500 w-8 h-8" />
          <div>
            <p className="text-sm text-gray-600 mb-1">Budget</p>
            <h3 className="text-lg font-bold text-gray-900">Details</h3>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-white rounded-xl p-6 shadow border border-gray-100 flex items-center space-x-4"
          onClick={handleManageUsers}
        >
          <FiUsers className="text-purple-500 w-8 h-8" />
          <div>
            <p className="text-sm text-gray-600 mb-1">Collaborators</p>
            <h3 className="text-lg font-bold text-gray-900">Manage</h3>
          </div>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
        >
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Travel Trends</h3>
          <div className="h-64">
            <Line 
              data={travelTrendsData} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                  y: { beginAtZero: true, grid: { color: 'rgba(0, 0, 0, 0.05)' } },
                  x: { grid: { display: false } }
                }
              }} 
            />
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
        >
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Budget Allocation</h3>
          <div className="h-64">
            <Doughnut 
              data={budgetData} 
              options={{
                cutout: '70%',
                plugins: { legend: { position: 'right' } },
                maintainAspectRatio: false
              }} 
            />
          </div>
        </motion.div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 mb-8">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Collaborative Trip Planning</h3>
        <p className="text-sm text-gray-600 mb-4">
          Invite your travel companions to collaborate on this itinerary.
        </p>
        <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors">
          <FiUsers className="mr-2" /> Invite Collaborators
        </button>
      </div>

      {/* Upcoming Trips */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800">Upcoming Trips</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-gray-100">
                <th className="p-4 text-sm font-medium text-gray-600">Destination</th>
                <th className="p-4 text-sm font-medium text-gray-600">Date</th>
                <th className="p-4 text-sm font-medium text-gray-600">Duration</th>
                <th className="p-4 text-sm font-medium text-gray-600">Budget</th>
                <th className="p-4 text-sm font-medium text-gray-600">Status</th>
                <th className="p-4 text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {upcomingTrips.map((trip) => (
                <tr key={trip.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="p-4 text-sm text-gray-800 font-medium">{trip.destination}</td>
                  <td className="p-4 text-sm text-gray-600 flex items-center gap-2">
                    <FiCalendar className="text-blue-500" /> {trip.date}
                  </td>
                  <td className="p-4 text-sm text-gray-600 flex items-center gap-2">
                    <FiClock className="text-blue-500" /> {trip.duration}
                  </td>
                  <td className="p-4 text-sm text-gray-600 flex items-center gap-2">
                    <FiDollarSign className="text-blue-500" /> {trip.budget}
                  </td>
                  <td className="p-4">
                    {trip.status === 'completed' ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Completed
                      </span>
                    ) : trip.status === 'confirmed' ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Confirmed
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Planned
                      </span>
                    )}
                  </td>
                  <td className="p-4 flex items-center gap-2">
                    <button
                      onClick={() => handleTripSelect(trip.id)}
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      {activeTrip === trip.id ? 'Hide Details' : 'View Details'}
                    </button>
                    <FiMapPin
                      className="text-blue-500 cursor-pointer"
                      onClick={() => handleMapPinClick(trip.destination)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;