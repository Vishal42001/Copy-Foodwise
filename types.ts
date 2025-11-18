// Fix: Import React to resolve error with React.ReactNode type.
import React from 'react';

export interface UserProfile {
  age?: number;
  sex?: 'male' | 'female' | 'other';
  height?: number;
  weight?: number;
  activityLevel?: 'sedentary' | 'light' | 'moderate' | 'active' | 'very-active';
  dietaryPreference?: string;
  allergies?: string;
  cuisinePreference?: string;
  goal?: 'weight-loss' | 'muscle-gain' | 'maintenance' | 'general-health';
  targetWeight?: number;
}

export interface ChatMessage {
  id: number;
  role: 'user' | 'model';
  text: string;
  image?: string;
}

export interface Feature {
    name: string;
    description: string;
    icon: React.ReactNode;
    welcomeMessage: string;
    promptPrefix: string;
}

export interface ChatSession {
  id: string;
  title: string;
  feature: Feature | null;
  messages: ChatMessage[];
  createdAt: number;
}
