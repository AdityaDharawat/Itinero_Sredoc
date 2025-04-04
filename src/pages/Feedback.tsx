import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiSend, FiMessageSquare, FiStar, FiAward, FiGift, FiMap } from 'react-icons/fi';
import axios from 'axios';

const Feedback = () => {
    const [feedbackType, setFeedbackType] = useState<'general' | 'bug' | 'suggestion' | 'compliment'>('general');
    const [message, setMessage] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [rating, setRating] = useState<number | null>(null);
    const [hoverRating, setHoverRating] = useState<number | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://127.0.0.1:5000/api/feedback', {
                feedbackType,
                message,
                rating
            });

            console.log(response.data);
            setSubmitted(true);
        } catch (error) {
            console.error("Error submitting feedback:", error);
        }
    };

    const feedbackTypes = [
        { id: 'general', label: 'General', icon: <FiMessageSquare />, color: 'bg-blue-100', activeColor: 'bg-blue-600' },
        { id: 'bug', label: 'Bug Report', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>, color: 'bg-red-100', activeColor: 'bg-red-600' },
        { id: 'suggestion', label: 'Suggestion', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>, color: 'bg-green-100', activeColor: 'bg-green-600' },
        { id: 'compliment', label: 'Compliment', icon: <FiStar />, color: 'bg-yellow-100', activeColor: 'bg-yellow-600' }
    ];

    return (
        <div className="container mx-auto px-4 pt-20 pb-16">
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-12"
            >
                <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent py-[0.2em]">
                    Share Your Travel Experience
                </h1>
            </motion.div>

            {submitted ? (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                    className="text-center py-12 bg-white rounded-2xl shadow-xl border border-gray-100 max-w-2xl mx-auto"
                >
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                    </div>
                    <h3 className="text-2xl font-bold mb-3">Thank You!</h3>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                        Your feedback helps us improve the travel planning experience for everyone.
                    </p>
                    <div className="bg-blue-50 rounded-lg p-4 max-w-md mx-auto mb-6">
                        <div className="flex items-center justify-center space-x-2">
                            <FiGift className="text-blue-500" />
                            <span className="text-blue-600 font-medium">
                                As a thank you, enjoy 10% off your next trip with code: <span className="font-bold">TRAVEL10</span>
                            </span>
                        </div>
                    </div>
                    <button 
                        onClick={() => {
                            setSubmitted(false);
                            setMessage('');
                            setRating(null);
                        }}
                        className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors shadow-lg hover:shadow-xl"
                    >
                        Submit Another Feedback
                    </button>
                </motion.div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto"
                >
                    <div className="lg:w-1/2 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-lg border border-gray-100 p-8">
                        <div className="flex items-center mb-6">
                            <FiAward className="text-blue-500 mr-3 text-2xl" />
                            <h2 className="text-2xl font-bold">Why Your Feedback Matters</h2>
                        </div>
                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="bg-blue-100 p-2 rounded-lg">
                                    <FiMap className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg">Better Recommendations</h3>
                                    <p className="text-gray-600">Your suggestions help us improve destination suggestions.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="bg-indigo-100 p-2 rounded-lg">
                                    <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg">Improve Features</h3>
                                    <p className="text-gray-600">Bug reports help us identify and fix issues faster.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="bg-green-100 p-2 rounded-lg">
                                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg">Enhance Experience</h3>
                                    <p className="text-gray-600">Your input helps create a better experience for all travelers.</p>
                                </div>
                            </div>
                        </div>
                        <div className="mt-8 bg-white rounded-xl p-6 shadow-sm">
                            <h3 className="font-semibold text-lg mb-3">What happens next?</h3>
                            <ul className="space-y-2 text-gray-600">
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-500">•</span> Our team reviews all feedback weekly
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-500">•</span> We may reach out for more details
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-500">•</span> Updates are shared in our newsletter
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="lg:w-1/2 bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                        <div className="flex items-center mb-6">
                            <FiMessageSquare className="text-blue-500 mr-3 text-2xl" />
                            <h2 className="text-2xl font-bold">Feedback Form</h2>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium mb-3">What type of feedback are you sharing?</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {feedbackTypes.map((type) => (
                                        <button
                                            key={type.id}
                                            type="button"
                                            onClick={() => setFeedbackType(type.id as 'general' | 'bug' | 'suggestion' | 'compliment')}
                                            className={`px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                                                feedbackType === type.id 
                                                    ? `${type.activeColor} text-white shadow-md` 
                                                    : `${type.color} text-gray-800 hover:shadow-sm`
                                            }`}
                                        >
                                            {type.icon}
                                            {type.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-3">Your feedback</label>
                                <textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    className="w-full bg-gray-50 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 min-h-[150px] border border-gray-200"
                                    placeholder={
                                        feedbackType === 'bug' ? 'Describe the issue you encountered...' :
                                        feedbackType === 'suggestion' ? 'Tell us about your suggestion for improvement...' :
                                        feedbackType === 'compliment' ? 'Share what you love about our travel planner...' :
                                        'Share your thoughts with us...'
                                    }
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-3">How would you rate your experience?</label>
                                <div className="flex items-center justify-center space-x-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setRating(star)}
                                            onMouseEnter={() => setHoverRating(star)}
                                            onMouseLeave={() => setHoverRating(null)}
                                            className="text-2xl focus:outline-none"
                                        >
                                            <FiStar
                                                className={`transition-colors ${
                                                    ((hoverRating !== null || rating !== null) && star <= (hoverRating ?? rating ?? 0))
                                                        ? star <= 2 
                                                            ? 'text-red-500' 
                                                            : star <= 4 
                                                                ? 'text-yellow-500' 
                                                                : 'text-green-500'
                                                        : 'text-gray-300'
                                                } ${
                                                    star <= 2 
                                                        ? 'hover:text-red-400' 
                                                        : star <= 4 
                                                            ? 'hover:text-yellow-400' 
                                                            : 'hover:text-green-400'
                                                }`}
                                                fill={
                                                    ((hoverRating !== null || rating !== null) && star <= (hoverRating ?? rating ?? 0))
                                                        ? 'currentColor' 
                                                        : 'none'
                                                }
                                            />
                                        </button>
                                    ))}
                                </div>
                                <div className="flex justify-between text-xs text-gray-500 mt-1">
                                    <span>Not satisfied</span>
                                    <span>Very satisfied</span>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={!message.trim()}
                                className={`w-full flex items-center justify-center px-6 py-4 text-white rounded-xl font-medium transition-all shadow-lg ${
                                    !message.trim() 
                                        ? 'bg-gray-400 cursor-not-allowed' 
                                        : 'bg-blue-600 hover:bg-blue-700 hover:shadow-xl'
                                }`}
                            >
                                <FiSend className="mr-3" /> 
                                <span className="text-lg">
                                    {feedbackType === 'bug' ? 'Report Issue' : 
                                     feedbackType === 'suggestion' ? 'Submit Suggestion' :
                                     feedbackType === 'compliment' ? 'Share Compliment' : 'Send Feedback'}
                                </span>
                            </button>
                        </form>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default Feedback;