import React, { useState } from 'react';
import { UserProfile } from '../types';
import { CloseIcon } from './icons/Icons';
import { motion } from 'framer-motion';

interface UserProfileFormProps {
  onClose: () => void;
  onSave: (profile: UserProfile) => void;
  initialProfile: UserProfile | null;
}

const UserProfileForm: React.FC<UserProfileFormProps> = ({ onClose, onSave, initialProfile }) => {
  const [profile, setProfile] = useState<UserProfile>(initialProfile || {});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(profile);
  };
  
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { type: 'spring', damping: 15, stiffness: 200 } },
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } }
  };


  return (
    <motion.div 
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
      variants={backdropVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      onClick={onClose}
    >
      <motion.div 
        className="bg-slate-800 rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col"
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        <div className="flex justify-between items-center p-4 border-b border-slate-700">
          <h2 className="text-xl font-bold text-slate-100">Your Profile</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-700">
            <CloseIcon />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          <p className="text-sm text-slate-400 mb-4">Provide these details for personalized advice. All fields are optional.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="age" className="block text-sm font-medium text-slate-300">Age</label>
              <input type="number" name="age" id="age" value={profile.age || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-slate-600 bg-slate-700 text-slate-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
            <div>
              <label htmlFor="sex" className="block text-sm font-medium text-slate-300">Sex</label>
              <select name="sex" id="sex" value={profile.sex || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-slate-600 bg-slate-700 text-slate-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                <option value="">Select...</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label htmlFor="height" className="block text-sm font-medium text-slate-300">Height (cm)</label>
              <input type="number" name="height" id="height" value={profile.height || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-slate-600 bg-slate-700 text-slate-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
            <div>
              <label htmlFor="weight" className="block text-sm font-medium text-slate-300">Weight (kg)</label>
              <input type="number" name="weight" id="weight" value={profile.weight || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-slate-600 bg-slate-700 text-slate-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
          </div>
          <div>
            <label htmlFor="activityLevel" className="block text-sm font-medium text-slate-300">Activity Level</label>
            <select name="activityLevel" id="activityLevel" value={profile.activityLevel || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-slate-600 bg-slate-700 text-slate-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
              <option value="">Select...</option>
              <option value="sedentary">Sedentary (little or no exercise)</option>
              <option value="light">Lightly active (light exercise/sports 1-3 days/week)</option>
              <option value="moderate">Moderately active (moderate exercise/sports 3-5 days/week)</option>
              <option value="active">Very active (hard exercise/sports 6-7 days a week)</option>
              <option value="very-active">Extra active (very hard exercise/sports & physical job)</option>
            </select>
          </div>
           <div>
            <label htmlFor="goal" className="block text-sm font-medium text-slate-300">Primary Goal</label>
            <select name="goal" id="goal" value={profile.goal || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-slate-600 bg-slate-700 text-slate-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                <option value="">Select a goal...</option>
                <option value="weight-loss">Weight Loss</option>
                <option value="muscle-gain">Muscle Gain</option>
                <option value="maintenance">Weight Maintenance</option>
                <option value="general-health">General Health</option>
            </select>
          </div>
          {(profile.goal === 'weight-loss' || profile.goal === 'muscle-gain') && (
            <div>
                <label htmlFor="targetWeight" className="block text-sm font-medium text-slate-300">Target Weight (kg)</label>
                <input 
                    type="number" 
                    name="targetWeight" 
                    id="targetWeight" 
                    value={profile.targetWeight || ''} 
                    onChange={handleChange} 
                    className="mt-1 block w-full rounded-md border-slate-600 bg-slate-700 text-slate-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="e.g., 75"
                />
            </div>
          )}
          <div>
            <label htmlFor="dietaryPreference" className="block text-sm font-medium text-slate-300">Dietary Preferences (e.g., vegetarian, vegan, Jain)</label>
            <input type="text" name="dietaryPreference" id="dietaryPreference" value={profile.dietaryPreference || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-slate-600 bg-slate-700 text-slate-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
          </div>
          <div>
            <label htmlFor="allergies" className="block text-sm font-medium text-slate-300">Allergies (e.g., peanuts, gluten, dairy)</label>
            <input type="text" name="allergies" id="allergies" value={profile.allergies || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-slate-600 bg-slate-700 text-slate-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
          </div>
          <div>
            <label htmlFor="cuisinePreference" className="block text-sm font-medium text-slate-300">Favorite Cuisines (e.g., Indian, Mediterranean)</label>
            <input type="text" name="cuisinePreference" id="cuisinePreference" value={profile.cuisinePreference || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-slate-600 bg-slate-700 text-slate-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
          </div>
        </form>
        <div className="flex justify-end p-4 border-t border-slate-700 bg-slate-900/50 rounded-b-lg">
          <motion.button 
            type="button" 
            onClick={onClose} 
            className="px-4 py-2 text-sm font-medium text-slate-200 bg-slate-700 border border-slate-600 rounded-md shadow-sm hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Cancel
          </motion.button>
          <motion.button 
            type="submit" 
            onClick={handleSubmit} 
            className="ml-3 px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Save Profile
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default UserProfileForm;