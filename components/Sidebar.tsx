import React from 'react';
import { UserIcon, PlusIcon, LogoIcon, Trash2Icon } from './icons/Icons';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatSession } from '../types';
import { cn } from '../lib/utils';

interface SidebarProps {
  chatSessions: ChatSession[];
  activeChatId: string | null;
  onNewChatClick: () => void;
  onSelectChat: (chatId: string) => void;
  onDeleteChat: (chatId: string) => void;
  onProfileClick: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  chatSessions,
  activeChatId,
  onNewChatClick,
  onSelectChat,
  onDeleteChat,
  onProfileClick
}) => {
  return (
    <aside className="w-64 bg-slate-950 text-white flex flex-col p-4">
      <div className="flex items-center space-x-3 mb-8">
        <div className="p-1.5 bg-indigo-600 rounded-lg">
            <LogoIcon className="w-7 h-7 text-white"/>
        </div>
        <div>
          <h1 className="text-xl font-bold">Foodwise AI</h1>
        </div>
      </div>
      
      <motion.button
        onClick={onNewChatClick}
        className="w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <PlusIcon className="w-5 h-5"/>
        <span>New Chat</span>
      </motion.button>
      
      <div className="flex-1 mt-8 overflow-y-auto">
        <p className="text-xs text-slate-400 uppercase tracking-wider mb-2">History</p>
        <AnimatePresence>
          {chatSessions.length > 0 ? (
            <ul className="space-y-1">
              {chatSessions.map((session) => (
                <motion.li
                  key={session.id}
                  layout
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
                  className="group"
                >
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      onSelectChat(session.id);
                    }}
                    className={cn(
                      'flex items-center justify-between w-full p-2 rounded-md text-sm truncate',
                      activeChatId === session.id
                        ? 'bg-slate-700 font-semibold'
                        : 'text-slate-300 hover:bg-slate-800'
                    )}
                  >
                    <span className="truncate">{session.title}</span>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDeleteChat(session.id);
                        }}
                        className="p-1 rounded-full text-slate-400 opacity-0 group-hover:opacity-100 hover:text-red-400 hover:bg-slate-700 transition-opacity"
                        aria-label={`Delete chat: ${session.title}`}
                    >
                        <Trash2Icon className="w-4 h-4" />
                    </button>
                  </a>
                </motion.li>
              ))}
            </ul>
          ) : (
            <div className="mt-4 text-sm text-center text-slate-500">
              No chats yet.
            </div>
          )}
        </AnimatePresence>
      </div>

      <div className="border-t border-slate-700 pt-4">
        <motion.button
          onClick={onProfileClick}
          className="w-full flex items-center space-x-3 p-2 rounded-lg hover:bg-slate-700 transition-colors text-left"
          whileTap={{ scale: 0.98 }}
        >
          <UserIcon className="w-6 h-6 text-slate-300"/>
          <span className="font-medium">Profile</span>
        </motion.button>
      </div>
    </aside>
  );
};

export default Sidebar;
