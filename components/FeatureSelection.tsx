import React from 'react';
import { Feature } from '../types';
import { BookIcon, ClipboardListIcon, BeakerIcon, LightbulbIcon, ScanIcon } from './icons/Icons';
import { motion } from 'framer-motion';

interface FeatureSelectionProps {
  onSelect: (feature: Feature) => void;
}

const features: Feature[] = [
  {
    name: 'General Q&A',
    description: 'Ask any nutrition-related question.',
    icon: <LightbulbIcon />,
    welcomeMessage: 'Hello! I am NutriGuide. What nutrition question can I answer for you today?',
    promptPrefix: 'Provide a clear, evidence-based answer to the user\'s question.'
  },
  {
    name: 'Meal Plan',
    description: 'Generate a daily, 3-day, or 7-day meal plan.',
    icon: <ClipboardListIcon />,
    welcomeMessage: 'I can create a personalized meal plan for you. What are your goals? For how many days would you like a plan?',
    promptPrefix: 'Generate a detailed meal plan based on the user\'s request. Follow the meal planning rules precisely.'
  },
  {
    name: 'Recipe Analysis',
    description: 'Analyze and optimize your favorite recipes.',
    icon: <BeakerIcon />,
    welcomeMessage: 'Please provide a recipe (ingredients and instructions) and I can analyze it for you and suggest healthy improvements.',
    promptPrefix: 'Analyze the provided recipe. Provide a nutritional breakdown and offer specific, actionable optimizations.'
  },
  {
    name: 'Image Analysis',
    description: 'Scan a food label for a quick summary.',
    icon: <ScanIcon />,
    welcomeMessage: 'Please upload an image of a nutrition label, and I will analyze it for you.',
    promptPrefix: 'Analyze the food label in the image. Summarize key nutritional information and flag any potential allergens or concerns.'
  },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2,
        },
    },
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
};

const FeatureCard: React.FC<{ feature: Feature; onClick: () => void }> = ({ feature, onClick }) => (
  <motion.button
    onClick={onClick}
    className="bg-slate-800 p-4 rounded-lg border border-slate-700 hover:border-indigo-500 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-left w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900"
    variants={itemVariants}
    whileTap={{ scale: 0.98 }}
  >
    <div className="flex items-start space-x-4">
      <div className="p-2 bg-slate-700 text-slate-300 rounded-lg">
        {feature.icon}
      </div>
      <div>
        <h3 className="font-semibold text-slate-100">{feature.name}</h3>
        <p className="text-sm text-slate-400 mt-1">{feature.description}</p>
      </div>
    </div>
  </motion.button>
);


const FeatureSelection: React.FC<FeatureSelectionProps> = ({ onSelect }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-4">
        <div className="max-w-2xl w-full text-center">
            <motion.h1 
                className="text-4xl font-bold text-slate-100 mb-4"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                Hello! How can I help today?
            </motion.h1>
            <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {features.map(feature => (
                <FeatureCard key={feature.name} feature={feature} onClick={() => onSelect(feature)} />
                ))}
            </motion.div>
        </div>
    </div>
  );
};

export default FeatureSelection;