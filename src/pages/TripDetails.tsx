import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams } from 'react-router-dom';
import { Star, MapPin, Calendar, Users, DollarSign, Clock, Heart, Share2, ChevronDown, ChevronUp } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Mock data for trips
const TRIPS = [
  {
    id: 'paris-luxury',
    title: 'Parisian Elegance Experience',
    location: 'Paris, France',
    rating: 4.9,
    reviews: 428,
    price: 3499,
    duration: '7 days',
    groupSize: '2-4 people',
    dates: ['Jun 15-22, 2024', 'Jul 6-13, 2024', 'Aug 10-17, 2024'],
    images: [
      'https://images.unsplash.com/photo-1431274172761-fca41d930114?q=80&w=3000',
      'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=2920',
      'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=3000',
      'https://images.unsplash.com/photo-1491884662610-dfcd28f30cfb?q=80&w=2874'
    ],
    description: 'Immerse yourself in the unparalleled elegance of Paris with our exclusive luxury package. Stay at 5-star hotels, dine at Michelin-starred restaurants, and enjoy private tours of the city\'s most iconic landmarks.',
    highlights: [
      'Private Eiffel Tower champagne reception at sunset',
      'Exclusive after-hours Louvre Museum tour',
      'Gourmet dining at Alain Ducasse au Plaza Athénée',
      'Luxury shopping experience with personal stylist',
      'Chauffeured transfers in Mercedes S-Class'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival & Welcome',
        description: 'Private airport transfer to your suite at Hôtel de Crillon. Evening welcome dinner at Le Jules Verne in the Eiffel Tower.'
      },
      {
        day: 2,
        title: 'Art & Culture',
        description: 'Private guided tour of Musée d\'Orsay followed by lunch at Café de Flore. Afternoon at leisure with optional haute couture shopping experience.'
      },
      {
        day: 3,
        title: 'Royal Versailles',
        description: 'Exclusive early access tour of Palace of Versailles including the King\'s Private Apartments. Gourmet picnic in the gardens.'
      },
      {
        day: 4,
        title: 'Culinary Delights',
        description: 'Market tour and private cooking class with a Michelin-starred chef. Evening at your leisure to explore Paris by night.'
      },
      {
        day: 5,
        title: 'Hidden Paris',
        description: 'Off-the-beaten-path tour of secret Paris locations including private mansions and hidden gardens. Evening opera performance at Palais Garnier.'
      },
      {
        day: 6,
        title: 'Leisure Day',
        description: 'Day at your discretion with optional activities: hot air balloon ride, wine tasting, or spa day at Dior Institut.'
      },
      {
        day: 7,
        title: 'Departure',
        description: 'Private transfer to airport with farewell gifts from Paris.'
      }
    ],
    inclusions: [
      '6 nights in 5-star luxury accommodation',
      'Daily breakfast and 4 gourmet dinners',
      'Private transfers and tours',
      'All museum entries and special experiences',
      '24/7 concierge service'
    ],
    exclusions: [
      'International airfare',
      'Travel insurance',
      'Personal shopping expenses',
      'Optional activities not specified'
    ]
  },
  {
    id: 'maldives-retreat',
    title: 'Maldives Private Island Paradise',
    location: 'North Malé Atoll, Maldives',
    rating: 5.0,
    reviews: 312,
    price: 8999,
    duration: '10 days',
    groupSize: '2 people',
    dates: ['May 1-10, 2024', 'Jun 5-14, 2024', 'Nov 10-19, 2024'],
    images: [
      'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?q=80&w=2874',
      'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?q=80&w=3024',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2940',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=2960'
    ],
    description: 'Experience ultimate privacy and luxury on your own stretch of paradise. Our exclusive private island resort offers unparalleled service, gourmet dining, and the most spectacular marine life in the world.',
    highlights: [
      'Private overwater villa with infinity pool',
      'Personal butler and chef service',
      'Private yacht excursions',
      'Coral reef restoration experience',
      'Sunset dolphin cruises'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival by Seaplane',
        description: 'Private seaplane transfer to your villa. Welcome champagne and spa treatment to begin your relaxation.'
      },
      {
        day: 2,
        title: 'Island Exploration',
        description: 'Guided tour of the island\'s ecosystems. Evening stargazing from your private deck.'
      },
      {
        day: 3,
        title: 'Marine Adventure',
        description: 'Private snorkeling tour with marine biologist. Afternoon at the underwater spa.'
      },
      {
        day: 4,
        title: 'Yacht Day',
        description: 'Full day private yacht charter with gourmet picnic on a sandbank.'
      },
      {
        day: 5,
        title: 'Wellness Day',
        description: 'Personalized wellness program with yoga, meditation, and holistic treatments.'
      },
      {
        day: 6,
        title: 'Cultural Experience',
        description: 'Visit to local fishing village and traditional Maldivian cooking class.'
      },
      {
        day: 7,
        title: 'Romantic Experience',
        description: 'Private beach dinner under the stars with personal musicians.'
      },
      {
        day: 8,
        title: 'Adventure Day',
        description: 'Choose from diving with mantas, big game fishing, or parasailing.'
      },
      {
        day: 9,
        title: 'Relaxation',
        description: 'Day at leisure to enjoy your villa and the island amenities.'
      },
      {
        day: 10,
        title: 'Departure',
        description: 'Seaplane transfer back to Malé with farewell gifts.'
      }
    ],
    inclusions: [
      '9 nights in private overwater palace villa',
      'All meals and premium beverages',
      'Private transfers by seaplane',
      'Daily spa credits',
      'All non-motorized water sports'
    ],
    exclusions: [
      'International flights',
      'Scuba diving certification courses',
      'Motorized water sports',
      'Off-island excursions'
    ]
  }
];

const TripDetails = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">Trip Details</h1>
      <p className="text-lg text-gray-600 dark:text-gray-400">
        Here you can view and manage all the details of your trip, including destinations, activities, and more.
      </p>
      {/* Add any additional content or components for TripDetails here */}
    </div>
  );
};

export default TripDetails;