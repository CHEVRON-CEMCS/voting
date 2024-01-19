import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '@/services/AuthContext';
import Navbar from '@/components/Navbar';
import * as XLSX from 'xlsx';

const Testtable = () => {
    const [nominations, setNominations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filterOption, setFilterOption] = useState('position');
    const [sortOrder, setSortOrder] = useState('ascending');

    const { user } = useAuth();
    const userToken = user?.token;
    const userEmail = user?.email;

    useEffect(() => {
        const fetchData = async () => {
            if (!userToken || !userEmail) {
                setLoading(false); // User is not logged in, set loading to false
                return;
              }
        
              setLoading(true); // Set loading to true while fetching data      
            setError(null);

            try {
                const response = await axios.get('https://virtual.chevroncemcs.com/voting/nominations/raw', {
                    headers: {
                        Authorization: `Bearer ${userToken}`, // Replace with your actual token
                    },
                    params: {
                        email: userEmail,
                    },
                });
                setNominations(response.data.data);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [userToken, userEmail]);

    const handleFilterChange = (event) => {
        setFilterOption(event.target.value);
    };

    const handleSortOrderChange = () => {
        setSortOrder((prevSortOrder) => (prevSortOrder === 'ascending' ? 'descending' : 'ascending'));
    };

    const sortData = (data) => {
        return data.sort((a, b) => {
            const valueA = a[filterOption];
            const valueB = b[filterOption];

            if (sortOrder === 'ascending') {
                return valueA.localeCompare(valueB);
            } else {
                return valueB.localeCompare(valueA);
            }
        });
    };

    const exportToExcel = () => {
        const sortedNominations = sortData(nominations);
        const worksheet = XLSX.utils.json_to_sheet(sortedNominations);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet 1');
        XLSX.writeFile(workbook, 'rawnomination.xlsx');
    };

    if (loading) {
        return <div class="flex items-center justify-center h-screen">Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    const sortedNominations = sortData(nominations);

    return (
        <div>
            <Navbar />
            <div className="container mx-auto mt-20">
                <h1 className="text-3xl font-bold text-center mb-4">Raw Nominations Data</h1>
                <div className="mt-4 flex items-center">
                    <label className="mr-2">Filter by:</label>
                    <select
                        value={filterOption}
                        onChange={handleFilterChange}
                        className="p-2 border rounded-md focus:outline-none"
                    >
                        <option value="position">Position</option>
                        <option value="nominee">Nominee</option>
                        <option value="nominatedBy">Nominated By</option>
                        <option value="timestamp">Timestamp</option>
                    </select>
                    <button
                        className="ml-2 p-2 bg-blue-500 text-white rounded-md cursor-pointer"
                        onClick={handleSortOrderChange}
                    >
                        {sortOrder === 'ascending' ? 'Sort Ascending' : 'Sort Descending'}
                    </button>
                    <button
                        className="ml-2 p-2 bg-green-500 text-white rounded-md cursor-pointer"
                        onClick={exportToExcel}
                    >
                        Export to Excel
                    </button>
                </div>
                <div className="mb-2 mt-2 text-lg font-semibold">Total Nominations: {nominations.length}</div>
                <table className="min-w-full mt-4 border border-gray-300">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="p-3 text-left">Position</th>
                            <th className="p-3 text-left">Nominee</th>
                            <th className="p-3 text-left">Nominated By</th>
                            <th className="p-3 text-left">Timestamp</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedNominations.map((nomination) => (
                            <tr key={nomination.id} className="border-b">
                                <td className="p-3">{nomination.position}</td>
                                <td className="p-3">{nomination.nominee}</td>
                                <td className="p-3">{nomination.nominatedBy}</td>
                                <td className="p-3">{nomination.timestamp}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Testtable;
