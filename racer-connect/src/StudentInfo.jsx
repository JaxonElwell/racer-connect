import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from './Layout';
import { useUser } from './context/UserContext';

const StudentInfo = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  const events = [
    { id: 1, name: 'Tech Talk - AI in 2025', date: '2025-04-20' },
    { id: 2, name: 'Hackathon', date: '2025-05-01' },
  ];
  const organization = 'Computer Science Club';

  if (!user) return <div className="text-center mt-10">Loading user info...</div>;

  return (
    <Layout>
      {/* 🔙 Back Button (top-left corner) */}
      <div className="absolute top-4 left-4 z-20">
        <button
          onClick={() => navigate('/')}
          className="bg-white text-blue-700 font-semibold px-4 py-2 rounded-full shadow hover:bg-gray-100 transition"
        >
          ← Back
        </button>
      </div>

      {/* Main content */}
      <div className="w-full flex justify-center px-4">
        <div className="w-full max-w-4xl mt-10 p-6 bg-white shadow-lg rounded-xl text-black space-y-8">
          {/* Profile Header */}
          <div className="flex items-center gap-4">
            <img
              src={user.picture}
              alt="Profile"
              className="w-20 h-20 rounded-full border border-gray-300"
            />
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">{user.name}</h2>
              <p className="text-sm text-gray-600 break-all">{user.email}</p>
            </div>
          </div>

          {/* Organization */}
          <section>
            <h3 className="text-xl font-semibold text-blue-800 mb-2">Organization</h3>
            <p className="text-gray-800">{organization}</p>
            <button
                onClick={() => navigate('/OrganizationsPage')}
                className="text-sm text-blue-600 hover:underline mt-1"
            >
                View all student organizations
            </button>
            </section>


          {/* Events */}
          <section>
            <h3 className="text-xl font-semibold text-blue-800 mb-2">Signed Up Events</h3>
            {events.length > 0 ? (
                <ul className="list-disc list-inside text-gray-800 space-y-1">
                {events.map((event) => (
                    <li key={event.id}>
                    <span className="font-medium">{event.name}</span> — 
                    <span className="text-sm text-gray-500 ml-1">{event.date}</span>
                    </li>
                ))}
                </ul>
            ) : (
                <p className="text-gray-600 italic">No events signed up yet.</p>
            )}

            {/* Stub link for future page */}
            <button
                onClick={() => {}}
                disabled
                className="text-sm text-blue-400 hover:underline mt-2 cursor-not-allowed"
                title="Coming soon"
            >
                View all upcoming events
            </button>
            </section>
          {/* Google Calendar */}
          <section>
            <h3 className="text-xl font-semibold text-blue-800 mb-2">Your Google Calendar</h3>
            <div className="aspect-video w-full">
              <iframe
                src={`https://calendar.google.com/calendar/embed?src=${encodeURIComponent(
                  user.email
                )}&ctz=America/Chicago`}
                style={{ border: 0 }}
                className="w-full h-full rounded-lg shadow"
                frameBorder="0"
                scrolling="no"
                title="Google Calendar"
              ></iframe>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default StudentInfo;
