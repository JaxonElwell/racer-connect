// Currently the search bar is a placeholder and does not filter the organizations.

import React, { useState, useEffect, useRef } from 'react';
import Layout from './Layout';
import OrgModal from './OrgModal';

function OrganizationsPage() {
  const [organizations, setOrganizations] = useState([]); // Loaded organizations
  const [currentPage, setCurrentPage] = useState(0); // Tracks the current page
  const [currentSearch, setCurrentSearch] = useState(''); // Tracks the current page
  const [isLoading, setIsLoading] = useState(false); // Loading state for fetching data
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility
  const [selectedOrganization, setSelectedOrganization] = useState(null); // Selected organization for the modal

  const hasFetched = useRef(false); // Prevent double-fetch in Strict Mode

  const fetchOrganizations = async (page, search) => {
    setIsLoading(true);
    try {
      console.log(`Fetching page: ${page}`); // Debugging
      if(!search) { // Set Search
        search = '%';
      } else {
        search = '%' + search + '%';
      }
      const response = await fetch(`/api/StudentOrganizationsPaginated?page=${page}&limit=10&search=${search}`); // Fetch 10 organizations (2 rows)
      const data = await response.json();
      console.log('Fetched data:', data.data); // Debugging
      if (Array.isArray(data.data)) {
        setOrganizations((prev) => [...prev, ...data.data]); // Append new organizations to the list
      } else {
        console.error('Unexpected response format:', data);
      }
    } catch (error) {
      console.error('Error fetching organizations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadMore = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    fetchOrganizations(nextPage, currentSearch);
  };

  const handleOpenModal = (organization) => {
    setSelectedOrganization(organization);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedOrganization(null);
    setIsModalOpen(false);
  };

  const handleSearch = (e) => {
    setCurrentSearch(e.target.value);
  }

  useEffect(() => {
    if (!hasFetched.current) {
      console.log('Fetching initial organizations');
      fetchOrganizations(0);
      hasFetched.current = true;
    }
  }, []);

  return (
    <Layout>
      <div className="px-4 sm:px-8">
        <h1 className="text-3xl font-bold text-center mb-8">Student Organizations</h1>

        {/* Search Bar Placeholder */}
        <div className="mb-6 flex justify-center">
          <input
            type="text"
            value={currentSearch}
            onChange={handleSearch}
            placeholder="Search organizations..."
            className="border bg-white border-gray-300 rounded-lg p-2 w-full max-w-md text-black"
          />
        </div>

        <div className="grid grid-cols-5 gap-4">
          {organizations.map((org) => (
            <div
              key={org.id}
              className="bg-gray-100 rounded-lg p-4 flex flex-col items-center cursor-pointer hover:bg-gray-200 transition hover:scale-105"
              onClick={() => handleOpenModal(org)}
            >
              <img
                src={org.image || 'defaultOrg.jpg'}
                alt={org.name}
                className="rounded-lg w-20 h-20 mb-4"
              />
              <h3 className="font-bold text-lg text-gray-900 text-center">{org.name}</h3>
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-8">
          <button
            onClick={handleLoadMore}
            className="bg-blue-500 text-white font-bold py-2 px-6 rounded hover:bg-blue-600 transition duration-300"
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'Load More Orgs'}
          </button>
        </div>

        {/* OrgModal */}
        {isModalOpen && (
          <OrgModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            organization={selectedOrganization}
          />
        )}
      </div>
    </Layout>
  );
}

export default OrganizationsPage;