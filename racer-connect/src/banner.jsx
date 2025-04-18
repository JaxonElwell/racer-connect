import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function Banner() {
    const location = useLocation();
    const navigate = useNavigate();

    const goToHome = () => {
        navigate('/');
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
            </div>
        </header>
    );
}