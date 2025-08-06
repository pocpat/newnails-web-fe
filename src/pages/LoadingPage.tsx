import { useState, useEffect } from 'react';
import { fetchRandomFunFact } from '../lib/api';
import { motion, AnimatePresence } from 'framer-motion';

const LoadingPage = () => {
  const [funFact, setFunFact] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const getFact = async () => {
      try {
        const data = await fetchRandomFunFact();
        if (isMounted) {
          setFunFact(data.text);
          setError('');
        }
      } catch (err) {
        if (isMounted) {
          setError('Could not fetch a fun fact. Waiting for the magic to happen...');
          console.error(err);
        }
      }
    };

    getFact(); // Initial fetch
    const intervalId = setInterval(getFact, 10000); // Fetch every 10 seconds

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-center">
      <div className="w-16 h-16 border-4 border-pink-400 border-dashed rounded-full animate-spin mb-8"></div>
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Generating your designs...</h1>
      <p className="text-lg text-gray-600 mb-8">Please wait, this can take a moment.</p>
      <div className="h-20 w-full max-w-md px-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={funFact}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="text-xl italic text-pink-500 font-title "
          >
            {error || funFact}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default LoadingPage;
