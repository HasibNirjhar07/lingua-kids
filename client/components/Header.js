import React from 'react';
import { Bell, Gem, User } from 'lucide-react';

const Header = ({ user, toggleNotifications }) => {
  // Using the placeholder API for the avatar
  const avatarUrl = "https://api.dicebear.com/9.x/adventurer/svg";

  return (
    <div className="flex flex-col lg:flex-row justify-between items-center mb-10">
      <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4 lg:mb-0">
        Welcome back, {user?.username}!
      </h1>
      
      <div className="flex items-center text-lg space-x-6 bg-white/20 rounded-full px-6 py-3">
        <div 
          onClick={toggleNotifications}
          className="text-yellow-300 cursor-pointer relative hover:scale-110 transition-transform"
        >
          <Bell size={24} />
          <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
            {user?.notifications}
          </span>
        </div>

        <div className="text-yellow-300 cursor-pointer flex items-center hover:scale-110 transition-transform">
          <Gem size={24} className="mr-2" />
          <span>{user?.points}</span>
        </div>

        <div className="flex items-center text-white">
          <User size={24} className="mr-2" />
          <span>{user?.username}</span>
        </div>

        <div className="flex items-center ml-4">
          <img 
            src={avatarUrl}
            alt={`${user?.username}'s avatar`}
            className="w-8 h-8 rounded-full border-2 border-white"
          />
        </div>
      </div>
    </div>
  );
};

export default Header;