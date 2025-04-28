import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUser } from './context/UserContext';

export default function Banner() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useUser();
  const [file, setFile] = useState(null);

  const goToHome = () => {
    navigate('/');
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (!file) {
      alert('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:5000/api/UploadStudentOrganizations', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        alert('File uploaded successfully!');
      } else {
        const error = await response.text();
        console.error('Error uploading file:', error);
        alert('Failed to upload file. Please try again.');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full h-[12.5vh] bg-[#002144] bg-opacity-60 flex flex-row items-center justify-between px-5 z-50">
      <div className="flex items-center">
        <img src="racerLogo.png" alt="Racer logo" className="h-[12.5vh]" />
        <h1 className="m-0 text-white text-xl ml-4">Murray State University</h1>
      </div>
      <div className="flex items-center space-x-4">
        {/* Home Button (only appears when not on App.jsx) */}
        {location.pathname !== '/' && (
          <button
            onClick={goToHome}
            className="bg-yellow-500 text-black font-bold py-2 px-4 rounded hover:bg-yellow-600 transition duration-300"
          >
            Home
          </button>
        )}
        {/* Info Button */}
        <a
          href="https://www.murraystate.edu/campus/orgsRecreation/StudentOrganizations/stuOrgsContact.aspx"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-yellow-500 text-black font-bold py-2 px-4 rounded hover:bg-yellow-600 transition duration-300"
        >
          Info
        </a>
        {/* Upload CSV Button (only for specific users) */}
        {user && ['jelwell@murraystate.edu', 'bowens11@murraystate.edu', 'cwilson80@murraystate.edu', 'kgambill@murraystate.edu'].includes(user.email) && (
          <div className="relative">
            <label className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 transition duration-300 cursor-pointer">
              Upload CSV
              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
            {file && (
              <button
                onClick={handleFileUpload}
                className="ml-2 bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-600 transition duration-300"
              >
                Submit
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
}