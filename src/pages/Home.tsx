import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiGlobe, FiMap, FiCalendar, FiUsers, FiTrendingUp, FiAward, FiCompass, FiBriefcase, FiPocket } from 'react-icons/fi';

const Home = () => {
  return (
    <div className="container mx-auto px-4 pt-28 py-12">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 p-8 md:p-12 text-white mb-16 shadow-xl"
      >
        <div className="relative z-10 max-w-3xl">
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl font-bold mb-4 leading-tight"
          >
            Welcome to Itinero
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl mb-8"
          >
            Plan smarter, travel better with Itinero's AI-powered itinerary planner.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <Link 
              to="/planner" 
              className="inline-flex items-center px-8 py-3 bg-white text-blue-600 font-semibold rounded-full hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Start Planning Now
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="bg-white rounded-xl p-8 mb-16 grid grid-cols-2 md:grid-cols-4 gap-8 shadow-lg border border-gray-100"
      >
        <StatItem icon={<FiTrendingUp className="w-8 h-8 text-blue-500" />} value="10K+" label="Trips Planned" />
        <StatItem icon={<FiGlobe className="w-8 h-8 text-blue-500" />} value="150+" label="Destinations" />
        <StatItem icon={<FiUsers className="w-8 h-8 text-blue-500" />} value="5K+" label="Happy Travelers" />
        <StatItem icon={<FiAward className="w-8 h-8 text-blue-500" />} value="98%" label="Satisfaction" />
      </motion.div>

      {/* Features Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Why Choose Our Travel Planner</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white rounded-2xl p-8 md:p-12 shadow-lg mb-16 border border-gray-100">
        <h2 className="text-3xl font-bold mb-8 text-gray-800">How It Works</h2>
        <div className="space-y-8">
          {steps.map((step, index) => (
            <StepItem key={index} index={index} {...step} />
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-center py-16"
      >
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Ready to Plan Your Next Adventure?</h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto text-gray-600">
          Join thousands of travelers creating perfect itineraries with our smart planner.
        </p>
        <Link 
          to="/planner" 
          className="inline-flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-lg shadow-lg hover:shadow-xl transition-all"
        >
          Start Planning for Free
        </Link>
      </motion.section>
    </div>
  );
};

// Component Definitions
const StatItem = ({ icon, value, label }: { icon: React.ReactNode, value: string, label: string }) => (
  <div className="text-center">
    <div className="text-blue-500 mb-2 flex justify-center">{icon}</div>
    <div className="text-2xl font-bold mb-1 text-gray-800">{value}</div>
    <div className="text-gray-500 text-sm">{label}</div>
  </div>
);

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -5 }}
    className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
  >
    <div className="text-blue-500 mb-4">{icon}</div>
    <h3 className="text-xl font-semibold mb-2 text-gray-800">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </motion.div>
);

const StepItem = ({ index, title, description }: { index: number, title: string, description: string }) => (
  <motion.div 
    initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: index * 0.2 }}
    className="flex flex-col md:flex-row gap-6 items-start"
  >
    <div className="flex-shrink-0 w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xl font-bold">
      {index + 1}
    </div>
    <div>
      <h3 className="text-xl font-semibold mb-2 text-gray-800">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  </motion.div>
);

// Data Arrays
const features = [
  {
    icon: <FiCompass className="w-8 h-8" />,
    title: "Personalized Itineraries",
    description: "Get custom travel plans tailored to your budget, interests, and travel style."
  },
  {
    icon: <FiBriefcase className="w-8 h-8" />,
    title: "Smart Budgeting",
    description: "Automatically balance costs across transport, lodging, and activities."
  },
  {
    icon: <FiUsers className="w-8 h-8" />,
    title: "Group Planning",
    description: "Collaborate with travel companions on shared itineraries."
  },
  {
    icon: <FiPocket className="w-8 h-8" />,
    title: "Real-time Pricing",
    description: "Get up-to-date costs for flights, hotels, and attractions."
  }
];

const steps = [
  {
    title: "Enter Your Details",
    description: "Tell us your destination, travel dates, budget, and preferences."
  },
  {
    title: "AI Itinerary Generation",
    description: "Our system creates optimized plans considering weather, events, and pricing."
  },
  {
    title: "Customize & Share",
    description: "Edit your perfect itinerary and share with travel companions."
  }
];

export default Home;