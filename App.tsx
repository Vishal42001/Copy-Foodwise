import React, { useState, useCallback, useEffect } from 'react';
import { UserProfile, ChatMessage, Feature, ChatSession } from './types';
import { generateResponse, generateChatTitle } from './services/geminiService';
import useLocalStorage from './hooks/useLocalStorage';
import Sidebar from './components/Sidebar';
import UserProfileForm from './components/UserProfileForm';
import ChatInterface from './components/ChatInterface';
import FeatureSelection from './components/FeatureSelection';
import { motion, AnimatePresence } from 'framer-motion';

const App: React.FC = () => {
  const [userProfile, setUserProfile] = useLocalStorage<UserProfile | null>('foodwise-userProfile', null);
  const [chatSessions, setChatSessions] = useLocalStorage<ChatSession[]>('foodwise-chatSessions', []);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [isProfileModalOpen, setProfileModalOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Effect to set an active chat on initial load if one exists
  useEffect(() => {
    if (!activeChatId && chatSessions.length > 0) {
      setActiveChatId(chatSessions[0].id);
    }
  }, [chatSessions, activeChatId]);

  const activeChat = chatSessions.find(session => session.id === activeChatId);

  const handleNewChat = () => {
    const newChat: ChatSession = {
      id: `chat_${Date.now()}`,
      title: 'New Chat',
      feature: null,
      messages: [],
      createdAt: Date.now(),
    };
    setChatSessions(prev => [newChat, ...prev]);
    setActiveChatId(newChat.id);
  };
  
  const handleSelectChat = (chatId: string) => {
    setActiveChatId(chatId);
  };
  
  const handleDeleteChat = (chatId: string) => {
    setChatSessions(prev => prev.filter(session => session.id !== chatId));
    if (activeChatId === chatId) {
        // If the active chat is deleted, switch to the next one or clear the view
        const remainingChats = chatSessions.filter(session => session.id !== chatId);
        setActiveChatId(remainingChats.length > 0 ? remainingChats[0].id : null);
    }
  };

  const updateChatSession = (chatId: string, updates: Partial<ChatSession>) => {
    setChatSessions(prev =>
      prev.map(session =>
        session.id === chatId ? { ...session, ...updates } : session
      )
    );
  };

  const handleFeatureSelect = (feature: Feature) => {
    if (!activeChatId) {
        // This case should ideally not happen if a new chat is created first, but as a fallback:
        handleNewChat();
        // We need to wait for the state update, so we'll handle this in an effect or a more robust state machine.
        // For simplicity, we'll update the session that was just created.
        const newChatId = chatSessions[0]?.id || `chat_${Date.now()}`;
        updateChatSession(newChatId, { 
            feature,
            messages: [{ id: Date.now(), role: 'model', text: feature.welcomeMessage }]
        });
    } else {
        updateChatSession(activeChatId, {
            feature,
            messages: [{ id: Date.now(), role: 'model', text: feature.welcomeMessage }]
        });
    }
    setError(null);
  };
  
  const handleSendMessage = useCallback(async (userInput: string, image: File | null) => {
    if (!activeChatId || (!userInput.trim() && !image)) return;

    const userMessage: ChatMessage = {
      id: Date.now(),
      role: 'user',
      text: userInput,
      image: image ? URL.createObjectURL(image) : undefined,
    };
    
    const currentMessages = activeChat?.messages || [];
    const updatedMessages = [...currentMessages, userMessage];
    updateChatSession(activeChatId, { messages: updatedMessages });

    setIsLoading(true);
    setError(null);
    
    // Check if this is the first user message to generate a title
    const isFirstUserMessage = currentMessages.filter(m => m.role === 'user').length === 0;

    if (isFirstUserMessage && userInput.trim()) {
      generateChatTitle(userInput).then(title => {
        updateChatSession(activeChatId, { title });
      });
    }

    try {
      const responseText = await generateResponse(
        userInput,
        image,
        userProfile,
        currentMessages.slice(-8), // Send last 8 messages for context
        activeChat?.feature
      );
      
      const modelMessage: ChatMessage = {
        id: Date.now() + 1,
        role: 'model',
        text: responseText,
      };
      updateChatSession(activeChatId, { messages: [...updatedMessages, modelMessage] });

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(errorMessage);
      const errorResponseMessage: ChatMessage = {
          id: Date.now() + 1,
          role: 'model',
          text: `Sorry, I encountered an error: ${errorMessage}`
      };
      updateChatSession(activeChatId, { messages: [...updatedMessages, errorResponseMessage] });
    } finally {
      setIsLoading(false);
    }
  }, [activeChatId, chatSessions, userProfile]);

  const handleProfileSave = (profile: UserProfile) => {
    setUserProfile(profile);
    setProfileModalOpen(false);
  };
  
  const pageVariants = {
    initial: { opacity: 0, scale: 0.98 },
    in: { opacity: 1, scale: 1 },
    out: { opacity: 0, scale: 0.98 },
  };

  const pageTransition = {
    type: "tween",
    ease: "circOut",
    duration: 0.4
  };

  const showFeatureSelection = !activeChat || !activeChat.feature;

  return (
    <div className="flex h-screen bg-slate-900 text-slate-200">
      <Sidebar 
        chatSessions={chatSessions}
        activeChatId={activeChatId}
        onNewChatClick={handleNewChat} 
        onSelectChat={handleSelectChat}
        onDeleteChat={handleDeleteChat}
        onProfileClick={() => setProfileModalOpen(true)} 
      />
      <main className="flex-1 flex flex-col h-full overflow-y-hidden">
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            {showFeatureSelection ? (
              <motion.div
                key="features"
                className="w-full h-full"
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
              >
                <FeatureSelection onSelect={handleFeatureSelect} />
              </motion.div>
            ) : (
              activeChat && (
                <motion.div
                  key={activeChat.id} // Key change triggers animation
                  className="w-full h-full"
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <ChatInterface
                    feature={activeChat.feature!}
                    messages={activeChat.messages}
                    isLoading={isLoading}
                    error={error}
                    onSendMessage={handleSendMessage}
                  />
                </motion.div>
              )
            )}
          </AnimatePresence>
        </div>
      </main>
      <AnimatePresence>
        {isProfileModalOpen && (
          <UserProfileForm
            onClose={() => setProfileModalOpen(false)}
            onSave={handleProfileSave}
            initialProfile={userProfile}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
