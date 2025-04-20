// src/UserContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Fetch user data on mount
  useEffect(() => {
    axios.get('http://localhost:5000/auth/profile', { withCredentials: true })
      .then(res => {
        const googleUser = res.data.user;
        const parsedUser = {
          name: googleUser.displayName || `${googleUser.name?.givenName || ''} ${googleUser.name?.familyName || ''}`,
          email: googleUser.emails?.[0]?.value,
          picture: googleUser.photos?.[0]?.value
        };
        setUser(parsedUser);
      })
      .catch(err => {
        console.error('Error fetching user profile in context:', err);
      });
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
