import React from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';



const StudentInfo = ({ user }) => {
  if (!user) {
    return <div className="text-center mt-10 text-lg">Loading your account info...</div>;
  }

  const navigate = useNavigate();
  // Extract calendar ID from email for now (personal calendar)
  const calendarSrc = `https://calendar.google.com/calendar/embed?src=${encodeURIComponent(user.email)}&ctz=America/Chicago`;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 rounded-xl shadow-lg bg-white">
      <h1 className="text-2xl font-bold mb-4 text-center">Welcome, {user.name}!</h1>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-8">
        <div className="text-center sm:text-left">
          <p className="text-lg font-medium">Email: <span className="text-gray-700">{user.email}</span></p>
        </div>
        {user.picture && (
          <img
            src={user.picture}
            alt="Profile"
            className="w-20 h-20 rounded-full border-2 border-gray-300"
          />
        )}
      </div>

      <h2 className="text-xl font-semibold mb-4 text-center">Your Google Calendar</h2>
      <div className="aspect-video">
        <iframe
          title="Google Calendar"
          src={calendarSrc}
          style={{ border: 0, width: '100%', height: '100%' }}
          frameBorder="0"
          scrolling="no"
        />
      </div>
    </div>
  );
};

export default StudentInfo;
