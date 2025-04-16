import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import Banner from './banner.jsx';
import StudentInfo from './StudentInfo.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <div>
      <App />
      <Banner />
        <Routes>
          <Route path="/StudentInfo" element={<StudentInfo />} />
        </Routes>
    </div>
    </BrowserRouter>
  </StrictMode>,
);