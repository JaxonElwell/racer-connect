import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from './context/UserContext'; // adjust if needed

export default function Layout({ children }) {
  const { user } = useUser();
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen w-full">
      {/* Background Image */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-fixed"
        style={{ backgroundImage: "url('/currisCenterBG.jpg')" }}
      ></div>

      {/* Dark Blue Overlay */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{ backgroundColor: '#002144', opacity: 0.6 }}
      ></div>

      {/* Top-Right Profile Button */}
      {user && (
        <div className="absolute top-4 right-4 z-20">
          <img
            src={user.picture}
            alt="Profile"
            className="w-10 h-10 rounded-full border border-white cursor-pointer hover:scale-105 transition"
            title={`Go to profile: ${user.name}`}
            onClick={() => navigate('/StudentInfo')}
          />
        </div>
      )}

      {/* Page Content */}
      <div className="relative z-10 flex flex-col items-center justify-start min-h-screen text-white mt-[12.5vh]">
        {children}
      </div>
    </div>
  );
}
