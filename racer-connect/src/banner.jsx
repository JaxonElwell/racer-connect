import React from 'react';

export default function Banner() {
    return (
        <header className="fixed top-0 w-full h-[12.5vh] bg-[#002144] bg-opacity-60 flex items-center justify-between px-5">
            <img src="racerLogo.png" alt="Racer logo" className="h-full" />
            <h1 className="m-0 text-white text-xl">Murray State University</h1>
        </header>
    );
}