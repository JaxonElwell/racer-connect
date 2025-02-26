import React from 'react';
import Layout from './Layout';

function App() {
  return (
    <Layout>
      <h1 className="text-3xl font-bold">Welcome to Racer Connect</h1>
      <div className="pt-[12.5vh] flex justify-center items-center min-h-screen">
        <div className="bg-white rounded-lg p-8 shadow-lg w-full max-w-4xl">
          <div className="flex flex-col space-y-4">
            <button className="bg-yellow-500 text-black font-bold py-2 px-6 rounded hover:bg-yellow-600 transition duration-300">
              Organize an event
            </button>
            <button className="bg-yellow-500 text-black font-bold py-2 px-6 rounded hover:bg-yellow-600 transition duration-300">
              Find an event
            </button>
            <button className="bg-yellow-500 text-black font-bold py-2 px-6 rounded hover:bg-yellow-600 transition duration-300">
              Find organizations
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default App;
