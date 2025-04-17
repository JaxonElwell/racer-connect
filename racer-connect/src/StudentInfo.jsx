import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import Layout from './Layout';

const StudentInfo = () => {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [organization, setOrganization] = useState("");

  useEffect(() => {
    // Fetch real authenticated user data from backend
    axios.get('http://localhost:5000/auth/profile', { withCredentials: true })
      .then(res => {
        console.log('User from backend:', res.data.user); 
        const googleUser = res.data.user;
        setUser({
            name: googleUser.displayName || `${googleUser.name?.givenName || ''} ${googleUser.name?.familyName || ''}`,
            email: googleUser.emails?.[0]?.value,
            picture: googleUser.photos?.[0]?.value
          });
          console.log("User state just set:", {
            name: googleUser.displayName || `${googleUser.name?.givenName || ''} ${googleUser.name?.familyName || ''}`,
            email: googleUser.emails?.[0]?.value,
            picture: googleUser.photos?.[0]?.value
          });
      })
      .catch(err => {
        console.error('Error fetching user profile:', err);
      });

    // Mocked event/org data until backend integration
    setEvents([
      { id: 1, name: "Tech Talk - AI in 2025", date: "2025-04-20" },
      { id: 2, name: "Hackathon", date: "2025-05-01" }
    ]);
    setOrganization("Computer Science Club");
  }, []);

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
        </div>
      </div>
    </Layout>
  );
};

export default StudentInfo;
