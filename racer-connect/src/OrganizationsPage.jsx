import React, { useState, useEffect, useRef } from 'react';
import Layout from './Layout';
import OrgModal from './OrgModal';
import SkeletonOrgCard from './Components/SkeletonOrgCard';
// Import user context or state
import { useUser } from './context/UserContext'; // Replace with your actual user context

function OrganizationsPage() {
<<<<<<< HEAD
  const [organizations, setOrganizations] = useState([]); // Loaded organizations
  const [currentPage, setCurrentPage] = useState(0); // Tracks the current page
  const [currentSearch, setCurrentSearch] = useState(''); // Tracks the current search
  const [isLoading, setIsLoading] = useState(false); // Loading state for fetching data
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility
  const [selectedOrganization, setSelectedOrganization] = useState(null); // Selected organization for the modal
=======
  const [organizations, setOrganizations] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [currentSearch, setCurrentSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrganization, setSelectedOrganization] = useState(null);
>>>>>>> f6c23465807840dc68b2a529021142aa8a63f0e4

  const hasFetched = useRef(false);

<<<<<<< HEAD
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
=======
  // Get the current user
  const { user } = useUser(); // Replace with your actual user retrieval logic

  const fetchOrganizations = async (page, search) => {
    setIsLoading(true);
    try {
      if (!search) search = '%';
      else search = `%${search}%`;

      const response = await fetch(`/api/StudentOrganizationsPaginated?page=${page}&limit=10&search=${search}`);
>>>>>>> f6c23465807840dc68b2a529021142aa8a63f0e4
      const data = await response.json();
      if (Array.isArray(data.data)) {
        setOrganizations((prev) => [...prev, ...data.data]);
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

  const handleSearch = () => {
    setOrganizations([]);
    setCurrentPage(0);
<<<<<<< HEAD
    fetchOrganizations(currentPage, currentSearch);
  }
=======
    fetchOrganizations(0, currentSearch);
  };
>>>>>>> f6c23465807840dc68b2a529021142aa8a63f0e4

  useEffect(() => {
    if (!hasFetched.current) {
      fetchOrganizations(0);
      hasFetched.current = true;
    }
  }, []);

  return (
    <Layout>
      <div className="px-4 sm:px-8">
        <h1 className="text-3xl font-bold text-center mb-8">Student Organizations</h1>

        {/* Search Bar */}
        <div className="mb-6 flex justify-center">
          <input
            type="text"
            value={currentSearch}
<<<<<<< HEAD
            onChange={(e) => {setCurrentSearch(e.target.value)}}
=======
            onChange={(e) => setCurrentSearch(e.target.value)}
>>>>>>> f6c23465807840dc68b2a529021142aa8a63f0e4
            placeholder="Search organizations..."
            className="border bg-white border-gray-300 rounded-lg p-2 w-full max-w-md text-black"
          />
          <button
            onClick={handleSearch}
            className="bg-blue-500 text-white font-bold py-2 px-6 rounded hover:bg-blue-600 transition duration-300"
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'Search'}
          </button>
        </div>

        {/* Organizations Grid */}
        <div className="grid grid-cols-5 gap-4">
          {isLoading && organizations.length === 0
            ? [1, 2, 3, 4, 5].map((key) => <SkeletonOrgCard key={key} />)
            : organizations.map((org) => (
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

        {/* Load More Button */}
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
            user={user} // Pass the user object to the modal
          />
        )}
      </div>
    </Layout>
  );
}

export default OrganizationsPage;