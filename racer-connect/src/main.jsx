import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import Banner from './banner.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <div>
      <App />
      <Banner />
    </div>
  </StrictMode>,
);