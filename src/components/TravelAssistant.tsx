// components/TravelAssistant.tsx
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSend, FiX, FiMessageSquare, FiMap, FiCalendar, FiDollarSign, FiUsers, FiCompass } from 'react-icons/fi';

const TravelAssistant = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [messages, setMessages] = useState<Array<{ text: string; sender: 'user' | 'bot' }>>([
    { text: "Hello! I'm your Travel Planner assistant. Where would you like to go today?", sender: 'bot' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const commonQuestions = [
    "What's the best time to visit Bali?",
    "How can I save money on flights?",
    "What are some must-see places in Paris?",
    "How do I share my itinerary with friends?"
  ];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (inputValue.trim() === '') return;

    // Add user message
    const userMessage = { text: inputValue, sender: 'user' as const };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    // Simulate bot response after a delay
    setTimeout(() => {
      const botResponse = generateBotResponse(inputValue);
      setMessages(prev => [...prev, { text: botResponse, sender: 'bot' }]);
    }, 800);
  };

  const generateBotResponse = (question: string) => {
    const lowerQuestion = question.toLowerCase();
    
    if (lowerQuestion.includes('best time') || lowerQuestion.includes('when to visit')) {
      return "The best time to visit depends on your destination. For tropical locations like Bali, April-October offers dry weather. European cities are great in spring (April-June) or fall (September-October) to avoid crowds.";
    } else if (lowerQuestion.includes('save money') || lowerQuestion.includes('cheap')) {
      return "Here are money-saving tips:\n1. Book flights 6-8 weeks in advance\n2. Travel mid-week for lower prices\n3. Use our price alert feature\n4. Consider alternative airports\n5. Bundle flights and hotels for discounts";
    } else if (lowerQuestion.includes('must-see') || lowerQuestion.includes('recommend')) {
      return "For Paris: Eiffel Tower, Louvre, Montmartre, Seine River cruise. For Tokyo: Shibuya Crossing, Sensoji Temple, Tsukiji Market. For New York: Central Park, Statue of Liberty, Times Square. Want recommendations for a specific city?";
    } else if (lowerQuestion.includes('share') || lowerQuestion.includes('friends')) {
      return "You can share itineraries by:\n1. Clicking 'Share' on your trip page\n2. Adding collaborators via email\n3. Generating a shareable link\n4. Exporting as PDF\nAll collaborators can view and edit the itinerary in real-time!";
    } else if (lowerQuestion.includes('budget') || lowerQuestion.includes('cost')) {
      return "Our system automatically tracks your budget across categories:\n- Flights: $500-$1500\n- Hotels: $80-$300/night\n- Food: $30-$100/day\n- Activities: $20-$100/day\nWould you like me to suggest a budget-friendly itinerary?";
    } else if (lowerQuestion.includes('pack') || lowerQuestion.includes('bring')) {
      return "Packing essentials depend on your destination and season. Generally:\n- Comfortable walking shoes\n- Weather-appropriate clothing\n- Universal adapter\n- Medications\n- Copies of important documents\nNeed a detailed packing list for your trip?";
    } else {
      return "I can help with travel planning questions about destinations, itineraries, budgets, packing, and more. Try asking about best times to visit, saving money, or must-see attractions!";
    }
  };

  const handleQuickQuestion = (question: string) => {
    setInputValue(question);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ type: 'spring', damping: 25 }}
          className="fixed bottom-24 right-8 w-96 max-w-full bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4 text-white flex justify-between items-center">
            <div className="flex items-center">
              <FiCompass className="w-6 h-6 mr-2" />
              <h3 className="font-semibold">Travel Assistant</h3>
            </div>
            <button 
              onClick={onClose}
              className="p-1 rounded-full hover:bg-white/10 transition-colors"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="h-80 overflow-y-auto p-4 space-y-4 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200">
            {/* Example usage of icons */}
            <div className="flex items-center gap-4">
              <FiMessageSquare className="text-blue-500 w-6 h-6" />
              <FiMap className="text-green-500 w-6 h-6" />
              <FiCalendar className="text-yellow-500 w-6 h-6" />
              <FiDollarSign className="text-red-500 w-6 h-6" />
              <FiUsers className="text-purple-500 w-6 h-6" />
            </div>
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs md:max-w-md rounded-lg px-4 py-2 ${message.sender === 'user' 
                    ? 'bg-blue-500 text-white rounded-br-none' 
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none'}`}
                >
                  {message.text.split('\n').map((line, i) => (
                    <p key={i} className={i > 0 ? 'mt-2' : ''}>{line}</p>
                  ))}
                </div>
              </motion.div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions */}
          <div className="px-4 pb-2">
            <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">COMMON QUESTIONS</h4>
            <div className="flex flex-wrap gap-2">
              {commonQuestions.map((question, index) => (
                <motion.button
                  key={index}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleQuickQuestion(question)}
                  className="text-xs bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 px-3 py-1 rounded-full transition-colors"
                >
                  {question}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex bg-gray-100 dark:bg-gray-700">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask about destinations, budgets, or itineraries..."
              className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 dark:text-gray-200"
            />
            <button
              onClick={handleSendMessage}
              disabled={inputValue.trim() === ''}
              className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-r-lg transition-colors"
            >
              <FiSend className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TravelAssistant;