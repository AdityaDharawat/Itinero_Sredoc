import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCalendar, FiMapPin, FiUsers, FiDollarSign, FiPlus, FiTrash2, FiEdit2, FiShare2, FiDownload, FiClock, FiSun, FiMoon, FiCoffee, FiCamera } from 'react-icons/fi';
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { format } from 'date-fns';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface Destination {
  id: string;
  name: string;
  arrival: Date;
  departure: Date;
  notes: string;
}

interface Activity {
  id: string;
  name: string;
  date: Date;
  time: string;
  type: 'morning' | 'afternoon' | 'evening' | 'custom';
  location: string;
  cost: number;
  notes: string;
}

interface Trip {
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  budget: number;
  travelers: string[];
  destinations: Destination[];
  activities: Activity[];
}

const Planner = () => {
  const [trip, setTrip] = useState<Trip>({
    title: 'My Awesome Trip',
    description: '',
    startDate: new Date(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    budget: 2000,
    travelers: [],
    destinations: [],
    activities: []
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [newTraveler, setNewTraveler] = useState('');
  const [activeTab, setActiveTab] = useState('itinerary');
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [isAddingDestination, setIsAddingDestination] = useState(false);
  const [isAddingActivity, setIsAddingActivity] = useState(false);
  const [newDestination, setNewDestination] = useState<Omit<Destination, 'id'>>({
    name: '',
    arrival: new Date(),
    departure: new Date(),
    notes: ''
  });
  const [newActivity, setNewActivity] = useState<Omit<Activity, 'id'>>({
    name: '',
    date: new Date(),
    time: '09:00',
    type: 'morning',
    location: '',
    cost: 0,
    notes: ''
  });

  const dateRangeRef = useRef<HTMLDivElement>(null);
  const travelerInputRef = useRef<HTMLInputElement>(null);

  // Close date picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dateRangeRef.current && !dateRangeRef.current.contains(event.target as Node)) {
        setShowDatePicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDateChange = (ranges: any) => {
    const { startDate, endDate } = ranges.selection;
    setTrip({
      ...trip,
      startDate,
      endDate
    });
  };

  const addTraveler = () => {
    if (newTraveler.trim() && !trip.travelers.includes(newTraveler.trim())) {
      setTrip({
        ...trip,
        travelers: [...trip.travelers, newTraveler.trim()]
      });
      setNewTraveler('');
      travelerInputRef.current?.focus();
    }
  };

  const removeTraveler = (name: string) => {
    setTrip({
      ...trip,
      travelers: trip.travelers.filter(t => t !== name)
    });
  };

  const addDestination = () => {
    if (newDestination.name.trim()) {
      setTrip({
        ...trip,
        destinations: [
          ...trip.destinations,
          {
            ...newDestination,
            id: Math.random().toString(36).substr(2, 9)
          }
        ]
      });
      setNewDestination({
        name: '',
        arrival: new Date(),
        departure: new Date(),
        notes: ''
      });
      setIsAddingDestination(false);
    }
  };

  const addActivity = () => {
    if (newActivity.name.trim()) {
      setTrip({
        ...trip,
        activities: [
          ...trip.activities,
          {
            ...newActivity,
            id: Math.random().toString(36).substr(2, 9)
          }
        ]
      });
      setNewActivity({
        name: '',
        date: new Date(),
        time: '09:00',
        type: 'morning',
        location: '',
        cost: 0,
        notes: ''
      });
      setIsAddingActivity(false);
    }
  };

  const removeDestination = (id: string) => {
    setTrip({
      ...trip,
      destinations: trip.destinations.filter(d => d.id !== id),
      activities: trip.activities.filter(a => 
        !trip.destinations.some(d => d.id === id && 
          new Date(a.date) >= new Date(d.arrival) && 
          new Date(a.date) <= new Date(d.departure))
      )
    });
  };

  const removeActivity = (id: string) => {
    setTrip({
      ...trip,
      activities: trip.activities.filter(a => a.id !== id)
    });
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(20);
    doc.text(trip.title, 105, 20, { align: 'center' });
    
    // Trip dates
    doc.setFontSize(12);
    doc.text(
      `${format(trip.startDate, 'MMM dd, yyyy')} - ${format(trip.endDate, 'MMM dd, yyyy')}`, 
      105, 
      28, 
      { align: 'center' }
    );
    
    // Travelers
    doc.setFontSize(14);
    doc.text('Travel Companions:', 14, 40);
    doc.setFontSize(12);
    doc.text(trip.travelers.join(', '), 14, 48);
    
    // Budget
    doc.setFontSize(14);
    doc.text(`Budget: $${trip.budget.toLocaleString()}`, 14, 60);
    
    // Destinations
    doc.setFontSize(16);
    doc.text('Destinations', 14, 72);
    
    const destinationData = trip.destinations.map(dest => [
      dest.name,
      format(dest.arrival, 'MMM dd, yyyy'),
      format(dest.departure, 'MMM dd, yyyy'),
      dest.notes || '-'
    ]);
    
    autoTable(doc, {
      startY: 78,
      head: [['Name', 'Arrival', 'Departure', 'Notes']],
      body: destinationData,
      theme: 'grid',
      headStyles: { fillColor: [41, 128, 185] }
    });
    
    // Activities
    doc.setFontSize(16);
    doc.text('Activities', 14, (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 15);
    
    const activityData = trip.activities.map(act => [
      act.name,
      format(act.date, 'MMM dd, yyyy'),
      act.time,
      act.type.charAt(0).toUpperCase() + act.type.slice(1),
      `$${act.cost}`,
      act.location || '-',
      act.notes || '-'
    ]);
    
    autoTable(doc, {
      startY: (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 20,
      head: [['Activity', 'Date', 'Time', 'Type', 'Cost', 'Location', 'Notes']],
      body: activityData,
      theme: 'grid',
      headStyles: { fillColor: [41, 128, 185] }
    });
    
    // Save the PDF
    doc.save(`${trip.title.replace(/\s+/g, '_')}_itinerary.pdf`);
  };

  const shareTrip = () => {
    const tripData = {
      title: trip.title,
      dates: `${format(trip.startDate, 'MM/dd/yyyy')} - ${format(trip.endDate, 'MM/dd/yyyy')}`,
      travelers: trip.travelers.join(', '),
      budget: `$${trip.budget}`,
      destinations: trip.destinations.map(d => d.name).join(', ')
    };
    
    const text = `Check out my trip plan!\n\n` +
      `Title: ${tripData.title}\n` +
      `Dates: ${tripData.dates}\n` +
      `Travelers: ${tripData.travelers}\n` +
      `Budget: ${tripData.budget}\n` +
      `Destinations: ${tripData.destinations}\n\n` +
      `Let me know what you think!`;
    
    if (navigator.share) {
      navigator.share({
        title: tripData.title,
        text: text
      }).catch(err => {
        console.log('Error sharing:', err);
        fallbackShare(text);
      });
    } else {
      fallbackShare(text);
    }
  };

  const fallbackShare = (text: string) => {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    alert('Trip details copied to clipboard!');
  };

  const getActivitiesForDate = (date: Date) => {
    return trip.activities.filter(activity => 
      format(new Date(activity.date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    ).sort((a, b) => a.time.localeCompare(b.time));
  };

  const getIconForActivityType = (type: string) => {
    switch (type) {
      case 'morning': return <FiSun className="text-yellow-500" />;
      case 'afternoon': return <FiSun className="text-orange-500" />;
      case 'evening': return <FiMoon className="text-indigo-500" />;
      default: return <FiCoffee className="text-gray-500" />;
    }
  };

  const getDatesInRange = (startDate: Date, endDate: Date) => {
    const dates = [];
    const currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return dates;
  };

  const tripDates = getDatesInRange(trip.startDate, trip.endDate);

  return (
    <div className="container mx-auto px-4 py-8">
    
      <div className="container mx-auto px-4 pt-28 py-12">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex-1">
              <input
                type="text"
                value={trip.title}
                onChange={(e) => setTrip({ ...trip, title: e.target.value })}
                className="text-3xl font-bold w-full border-none focus:ring-2 focus:ring-blue-500 rounded-lg p-2 -ml-2"
              />
              <textarea
                value={trip.description}
                onChange={(e) => setTrip({ ...trip, description: e.target.value })}
                placeholder="Add a trip description..."
                className="text-gray-600 w-full border-none focus:ring-2 focus:ring-blue-500 rounded-lg p-2 -ml-2 mt-2 resize-none"
                rows={2}
              />
            </div>
            
            <div className="relative flex items-center gap-4">
              <div className="text-center">
                <button 
                  onClick={() => setShowDatePicker(!showDatePicker)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 rounded-lg text-blue-700 font-medium transition-colors"
                >
                  <FiCalendar />
                  {format(trip.startDate, 'MMM d')} - {format(trip.endDate, 'MMM d, yyyy')}
                </button>
                
                {showDatePicker && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    ref={dateRangeRef}
                    className="absolute z-10 top-12 right-0 shadow-2xl"
                  >
                    <DateRange
                      editableDateInputs={true}
                      onChange={handleDateChange}
                      moveRangeOnFirstSelection={false}
                      ranges={[{
                        startDate: trip.startDate,
                        endDate: trip.endDate,
                        key: 'selection'
                      }]}
                      minDate={new Date()}
                    />
                  </motion.div>
                )}
              </div>
              
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={shareTrip}
                  className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700"
                  title="Share trip"
                >
                  <FiShare2 />
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={generatePDF}
                  className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700"
                  title="Download PDF"
                >
                  <FiDownload />
                </motion.button>
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2 bg-blue-50 rounded-full px-4 py-2">
              <FiDollarSign className="text-blue-600" />
              <span className="font-medium">Budget:</span>
              <input
                type="number"
                value={trip.budget}
                onChange={(e) => setTrip({ ...trip, budget: Number(e.target.value) })}
                className="w-24 border-none bg-transparent focus:ring-2 focus:ring-blue-500 rounded-lg p-1"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <FiUsers className="text-gray-600" />
              <div className="flex flex-wrap gap-2">
                {trip.travelers.map(traveler => (
                  <motion.div
                    key={traveler}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-1 bg-gray-100 rounded-full px-3 py-1 text-sm"
                  >
                    {traveler}
                    <button 
                      onClick={() => removeTraveler(traveler)}
                      className="text-gray-500 hover:text-red-500"
                    >
                      <FiTrash2 size={14} />
                    </button>
                  </motion.div>
                ))}
                
                <div className="relative">
                  <input
                    type="text"
                    ref={travelerInputRef}
                    value={newTraveler}
                    onChange={(e) => setNewTraveler(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addTraveler()}
                    placeholder="Add traveler..."
                    className="border-none bg-gray-100 rounded-full px-3 py-1 text-sm w-28 focus:ring-2 focus:ring-blue-500"
                  />
                  {newTraveler && (
                    <motion.button
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      onClick={addTraveler}
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 text-blue-500"
                    >
                      <FiPlus size={16} />
                    </motion.button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('itinerary')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === 'itinerary' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                Itinerary
              </button>
              <button
                onClick={() => setActiveTab('destinations')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === 'destinations' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                Destinations
              </button>
              <button
                onClick={() => setActiveTab('activities')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === 'activities' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                Activities
              </button>
              <button
                onClick={() => setActiveTab('map')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === 'map' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                Map View
              </button>
            </nav>
          </div>
          
          <div className="p-6">
            {activeTab === 'itinerary' && (
              <div className="space-y-8">
                {tripDates.map((date, index) => {
                  const activities = getActivitiesForDate(date);
                  const destination = trip.destinations.find(dest => 
                    new Date(date) >= new Date(dest.arrival) && 
                    new Date(date) <= new Date(dest.departure)
                  );
                  
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border border-gray-200 rounded-xl overflow-hidden"
                    >
                      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                        <h3 className="font-semibold text-lg">
                          {format(date, 'EEEE, MMMM d')}
                        </h3>
                        {destination && (
                          <div className="flex items-center gap-2 bg-blue-50 rounded-full px-4 py-1 text-sm">
                            <FiMapPin className="text-blue-600" />
                            {destination.name}
                          </div>
                        )}
                      </div>
                      
                      {activities.length > 0 ? (
                        <ul className="divide-y divide-gray-200">
                          {activities.map((activity, idx) => (
                            <motion.li
                              key={activity.id}
                              initial={{ opacity: 0, x: 10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.1 + idx * 0.05 }}
                              className="p-4 hover:bg-gray-50 flex justify-between items-start"
                            >
                              <div className="flex gap-4">
                                <div className="flex flex-col items-center pt-1">
                                  {getIconForActivityType(activity.type)}
                                  <span className="text-xs text-gray-500 mt-1">{activity.time}</span>
                                </div>
                                <div>
                                  <h4 className="font-medium">{activity.name}</h4>
                                  {activity.location && (
                                    <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                                      <FiMapPin size={14} /> {activity.location}
                                    </p>
                                  )}
                                  {activity.notes && (
                                    <p className="text-sm text-gray-600 mt-1">{activity.notes}</p>
                                  )}
                                </div>
                              </div>
                              <div className="flex gap-2">
                                {activity.cost > 0 && (
                                  <span className="text-sm bg-green-50 text-green-700 px-2 py-1 rounded">
                                    ${activity.cost}
                                  </span>
                                )}
                                <button
                                  onClick={() => {
                                    setSelectedActivity(activity);
                                    setIsAddingActivity(true);
                                  }}
                                  className="text-gray-400 hover:text-blue-500"
                                >
                                  <FiEdit2 size={16} />
                                </button>
                                <button
                                  onClick={() => removeActivity(activity.id)}
                                  className="text-gray-400 hover:text-red-500"
                                >
                                  <FiTrash2 size={16} />
                                </button>
                              </div>
                            </motion.li>
                          ))}
                        </ul>
                      ) : (
                        <div className="p-8 text-center text-gray-500">
                          No activities planned for this day
                        </div>
                      )}
                      
                      <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
                        <button
                          onClick={() => {
                            setNewActivity({
                              ...newActivity,
                              date: date,
                              type: activities.length > 0 ? 
                                (activities[activities.length - 1].type === 'morning' ? 'afternoon' : 
                                 activities[activities.length - 1].type === 'afternoon' ? 'evening' : 'morning') 
                                : 'morning',
                              time: activities.length > 0 ? 
                                (activities[activities.length - 1].type === 'morning' ? '13:00' : 
                                 activities[activities.length - 1].type === 'afternoon' ? '18:00' : '09:00') 
                                : '09:00'
                            });
                            setIsAddingActivity(true);
                          }}
                          className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                        >
                          <FiPlus size={16} /> Add Activity
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
            
            {activeTab === 'destinations' && (
              <div>
                <div className="mb-6 flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Destinations</h3>
                  <button
                    onClick={() => setIsAddingDestination(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                  >
                    <FiPlus /> Add Destination
                  </button>
                </div>
                
                {trip.destinations.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    No destinations added yet
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {trip.destinations.map((destination, index) => (
                      <motion.div
                        key={destination.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow"
                      >
                        <div className="bg-gray-100 h-32 flex items-center justify-center">
                          <FiMapPin className="w-12 h-12 text-gray-400" />
                        </div>
                        <div className="p-4">
                          <div className="flex justify-between items-start">
                            <h4 className="font-semibold text-lg">{destination.name}</h4>
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  setSelectedDestination(destination);
                                  setIsAddingDestination(true);
                                }}
                                className="text-gray-400 hover:text-blue-500"
                              >
                                <FiEdit2 size={16} />
                              </button>
                              <button
                                onClick={() => removeDestination(destination.id)}
                                className="text-gray-400 hover:text-red-500"
                              >
                                <FiTrash2 size={16} />
                              </button>
                            </div>
                          </div>
                          <div className="mt-2 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <FiCalendar size={14} />
                              {format(destination.arrival, 'MMM d')} - {format(destination.departure, 'MMM d, yyyy')}
                            </div>
                          </div>
                          {destination.notes && (
                            <p className="mt-2 text-sm text-gray-600">{destination.notes}</p>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'activities' && (
              <div>
                <div className="mb-6 flex justify-between items-center">
                  <h3 className="text-lg font-semibold">All Activities</h3>
                  <button
                    onClick={() => setIsAddingActivity(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                  >
                    <FiPlus /> Add Activity
                  </button>
                </div>
                
                {trip.activities.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    No activities added yet
                  </div>
                ) : (
                  <div className="space-y-4">
                    {trip.activities
                      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime() || a.time.localeCompare(b.time))
                      .map((activity, index) => (
                        <motion.div
                          key={activity.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 flex justify-between items-start"
                        >
                          <div className="flex gap-4">
                            <div className="flex flex-col items-center">
                              {getIconForActivityType(activity.type)}
                              <span className="text-xs text-gray-500 mt-1">{activity.time}</span>
                            </div>
                            <div>
                              <h4 className="font-medium">{activity.name}</h4>
                              <div className="flex items-center gap-3 mt-1">
                                <span className="text-sm text-gray-600">
                                  {format(activity.date, 'MMM d, yyyy')}
                                </span>
                                {activity.location && (
                                  <span className="text-sm text-gray-600 flex items-center gap-1">
                                    <FiMapPin size={14} /> {activity.location}
                                  </span>
                                )}
                                {activity.cost > 0 && (
                                  <span className="text-sm bg-green-50 text-green-700 px-2 py-0.5 rounded">
                                    ${activity.cost}
                                  </span>
                                )}
                              </div>
                              {activity.notes && (
                                <p className="text-sm text-gray-600 mt-2">{activity.notes}</p>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setSelectedActivity(activity);
                                setIsAddingActivity(true);
                              }}
                              className="text-gray-400 hover:text-blue-500"
                            >
                              <FiEdit2 size={16} />
                            </button>
                            <button
                              onClick={() => removeActivity(activity.id)}
                              className="text-gray-400 hover:text-red-500"
                            >
                              <FiTrash2 size={16} />
                            </button>
                          </div>
                        </motion.div>
                      ))}
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'map' && (
              <div className="text-center py-12 text-gray-500">
                <div className="bg-gray-100 rounded-xl h-64 flex items-center justify-center mb-4">
                  <FiMapPin className="w-12 h-12 text-gray-400" />
                </div>
                <p>Map view coming soon!</p>
                <p className="text-sm mt-2">Interactive map showing all your destinations and activities</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Add/Edit Destination Modal */}
        <AnimatePresence>
          {isAddingDestination && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-md"
              >
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold">
                      {selectedDestination ? 'Edit Destination' : 'Add New Destination'}
                    </h3>
                    <button
                      onClick={() => {
                        setIsAddingDestination(false);
                        setSelectedDestination(null);
                      }}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      ✕
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Destination Name</label>
                      <input
                        type="text"
                        value={selectedDestination?.name || newDestination.name}
                        onChange={(e) => 
                          selectedDestination 
                            ? setSelectedDestination({ ...selectedDestination, name: e.target.value })
                            : setNewDestination({ ...newDestination, name: e.target.value })
                        }
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g. Paris, France"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Arrival Date</label>
                        <input
                          type="date"
                          value={
                            selectedDestination 
                              ? format(selectedDestination.arrival, 'yyyy-MM-dd')
                              : format(newDestination.arrival, 'yyyy-MM-dd')
                          }
                          onChange={(e) => {
                            const date = e.target.value ? new Date(e.target.value) : new Date();
                            selectedDestination 
                              ? setSelectedDestination({ ...selectedDestination, arrival: date })
                              : setNewDestination({ ...newDestination, arrival: date });
                          }}
                          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Departure Date</label>
                        <input
                          type="date"
                          value={
                            selectedDestination 
                              ? format(selectedDestination.departure, 'yyyy-MM-dd')
                              : format(newDestination.departure, 'yyyy-MM-dd')
                          }
                          onChange={(e) => {
                            const date = e.target.value ? new Date(e.target.value) : new Date();
                            selectedDestination 
                              ? setSelectedDestination({ ...selectedDestination, departure: date })
                              : setNewDestination({ ...newDestination, departure: date });
                          }}
                          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                      <textarea
                        value={selectedDestination?.notes || newDestination.notes}
                        onChange={(e) => 
                          selectedDestination 
                            ? setSelectedDestination({ ...selectedDestination, notes: e.target.value })
                            : setNewDestination({ ...newDestination, notes: e.target.value })
                        }
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Any special notes about this destination..."
                        rows={3}
                      />
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-end gap-3">
                    <button
                      onClick={() => {
                        setIsAddingDestination(false);
                        setSelectedDestination(null);
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        if (selectedDestination) {
                          setTrip({
                            ...trip,
                            destinations: trip.destinations.map(dest => 
                              dest.id === selectedDestination.id ? selectedDestination : dest
                            )
                          });
                          setSelectedDestination(null);
                        } else {
                          addDestination();
                        }
                        setIsAddingDestination(false);
                      }}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                    >
                      {selectedDestination ? 'Update Destination' : 'Add Destination'}
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Add/Edit Activity Modal */}
        <AnimatePresence>
          {isAddingActivity && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-md"
              >
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold">
                      {selectedActivity ? 'Edit Activity' : 'Add New Activity'}
                    </h3>
                    <button
                      onClick={() => {
                        setIsAddingActivity(false);
                        setSelectedActivity(null);
                      }}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      ✕
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Activity Name</label>
                      <input
                        type="text"
                        value={selectedActivity?.name || newActivity.name}
                        onChange={(e) => 
                          selectedActivity 
                            ? setSelectedActivity({ ...selectedActivity, name: e.target.value })
                            : setNewActivity({ ...newActivity, name: e.target.value })
                        }
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g. Visit Eiffel Tower"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                        <input
                          type="date"
                          value={
                            selectedActivity 
                              ? format(selectedActivity.date, 'yyyy-MM-dd')
                              : format(newActivity.date, 'yyyy-MM-dd')
                          }
                          onChange={(e) => {
                            const date = e.target.value ? new Date(e.target.value) : new Date();
                            selectedActivity 
                              ? setSelectedActivity({ ...selectedActivity, date: date })
                              : setNewActivity({ ...newActivity, date: date });
                          }}
                          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                        <input
                          type="time"
                          value={selectedActivity?.time || newActivity.time}
                          onChange={(e) => 
                            selectedActivity 
                              ? setSelectedActivity({ ...selectedActivity, time: e.target.value })
                              : setNewActivity({ ...newActivity, time: e.target.value })
                          }
                          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                      <select
                        value={selectedActivity?.type || newActivity.type}
                        onChange={(e) => 
                          selectedActivity 
                            ? setSelectedActivity({ 
                                ...selectedActivity, 
                                type: e.target.value as 'morning' | 'afternoon' | 'evening' | 'custom'
                              })
                            : setNewActivity({ 
                                ...newActivity, 
                                type: e.target.value as 'morning' | 'afternoon' | 'evening' | 'custom'
                              })
                        }
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="morning">Morning</option>
                        <option value="afternoon">Afternoon</option>
                        <option value="evening">Evening</option>
                        <option value="custom">Custom</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                      <input
                        type="text"
                        value={selectedActivity?.location || newActivity.location}
                        onChange={(e) => 
                          selectedActivity 
                            ? setSelectedActivity({ ...selectedActivity, location: e.target.value })
                            : setNewActivity({ ...newActivity, location: e.target.value })
                        }
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Address or specific location"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Cost ($)</label>
                      <input
                        type="number"
                        value={selectedActivity?.cost || newActivity.cost}
                        onChange={(e) => 
                          selectedActivity 
                            ? setSelectedActivity({ ...selectedActivity, cost: Number(e.target.value) })
                            : setNewActivity({ ...newActivity, cost: Number(e.target.value) })
                        }
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="0"
                        min="0"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                      <textarea
                        value={selectedActivity?.notes || newActivity.notes}
                        onChange={(e) => 
                          selectedActivity 
                            ? setSelectedActivity({ ...selectedActivity, notes: e.target.value })
                            : setNewActivity({ ...newActivity, notes: e.target.value })
                        }
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Any special notes about this activity..."
                        rows={3}
                      />
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-end gap-3">
                    <button
                      onClick={() => {
                        setIsAddingActivity(false);
                        setSelectedActivity(null);
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        if (selectedActivity) {
                          setTrip({
                            ...trip,
                            activities: trip.activities.map(act => 
                              act.id === selectedActivity.id ? selectedActivity : act
                            )
                          });
                          setSelectedActivity(null);
                        } else {
                          addActivity();
                        }
                        setIsAddingActivity(false);
                      }}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                    >
                      {selectedActivity ? 'Update Activity' : 'Add Activity'}
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Planner;