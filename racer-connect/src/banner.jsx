import React from 'react';

export default function Banner() {
    return (
        <header className="fixed top-0 left-0 w-full h-[12.5vh] bg-[#002144] bg-opacity-60 flex flex-row items-center justify-between px-5 z-50">
            <div className="flex items-center">
                <img src="racerLogo.png" alt="Racer logo" className="h-[12.5vh]" />
                <h1 className="m-0 text-white text-xl ml-4">Murray State University</h1>
            </div>
        </header>
    );
}
