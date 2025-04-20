import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { UserProvider } from "./context/UserContext";
import './index.css';
import App from './App.jsx';
import Banner from './banner.jsx';
import StudentInfo from './StudentInfo.jsx';
import OrganizationsPage from './OrganizationsPage.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <UserProvider>
        <div>
          <Banner />
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/StudentInfo" element={<StudentInfo />} />
            <Route path="/OrganizationsPage" element={<OrganizationsPage />} />
            <Route path="*" element={<div>Page Not Found</div>} />
          </Routes>
        </div>
      </UserProvider>
    </BrowserRouter>
  </StrictMode>,
);
