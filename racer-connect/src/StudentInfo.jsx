import React from 'react';
import Layout from './Layout'; // adjust if needed
import { useUser } from './context/UserContext'; // path depends on your final structure

const StudentInfo = () => {
  const { user } = useUser();

  // Placeholder/mock data (remove later if pulling from API)
  const events = [
    { id: 1, name: "Tech Talk - AI in 2025", date: "2025-04-20" },
    { id: 2, name: "Hackathon", date: "2025-05-01" }
  ];
  const organization = "Computer Science Club";

  if (!user) return <div className="text-center mt-10">Loading user info...</div>;

  return (
    <Layout>
      <div className="w-full bg-gradient-to-br from-blue-100 to-purple-200 p-4 flex justify-center items-start">
        <div className="w-full max-w-4xl mt-10 p-6 bg-white shadow-lg rounded-xl">
          <div className="flex items-center gap-4 mb-6">
            <img
              src={user.picture}
              alt="Profile"
              className="w-20 h-20 rounded-full border"
            />
            <div>
              <h2 style={{ color: 'red', fontSize: '24px' }}>{user.name}</h2>
              <p className="text-gray-600 mb-2 break-all">{user.email}</p>
            </div>
          </div>

          <div className="mb-6">
            <h3 style={{ color: 'red', fontSize: '24px' }}>Organization</h3>
            <p>{organization}</p>
          </div>

          <div>
            <h3 style={{ color: 'red', fontSize: '24px' }}>Signed Up Events</h3>
            {events.length > 0 ? (
              <ul style={{ color: 'red', fontSize: '24px' }}>
                {events.map((event) => (
                  <li key={event.id}>
                    {event.name} – <span className="text-gray-500">{event.date}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No events signed up yet.</p>
            )}
          </div>

          <h3 style={{ color: 'red', fontSize: '24px' }} className="mt-10">Your Google Calendar</h3>
          <div className="aspect-video w-full mt-4">
            <iframe
                src={`https://calendar.google.com/calendar/embed?src=${encodeURIComponent(user.email)}&ctz=America/Chicago`}
                style={{ border: 0 }}
                className="w-full h-full rounded-lg shadow-lg"
                frameBorder="0"
                scrolling="no"
                title="Google Calendar"
            ></iframe>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default StudentInfo;
