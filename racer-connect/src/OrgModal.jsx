import React from 'react';

export default function OrgModal({ isOpen, onClose, organization }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black opacity-60" onClick={onClose}></div>

      {/* Modal Content */}
      <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl h-auto max-h-[90vh] overflow-y-auto relative text-black z-10">
        {/* Blue Banner */}
        <div className="bg-blue-600 text-white px-6 py-3 rounded-t-lg flex justify-between items-center">
          <h2 className="text-xl font-bold">{organization.name}</h2>
          <button className="text-white text-2xl hover:text-gray-300" onClick={onClose}>
            &times;
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-8">
          {organization.image && <img src={organization.image} alt={organization.name} className="mb-4 w-full h-auto rounded-lg" />}
          <p className="mb-4">{organization.description}</p>
          <div>
            <h3 className="text-xl font-semibold">Misc Info</h3>
            <p>{organization.miscInfo}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
