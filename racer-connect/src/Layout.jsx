import React from 'react';

export default function Layout({ children }) {
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

      {/* Page Content */}
      <div
        className="relative z-10 flex flex-col items-center justify-start min-h-screen text-white mt-[12.5vh]"
      >
        {children}
      </div>
    </div>
  );
}
