import Axios from 'axios'; // Import Axios
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/services/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/router';

function UploadNominations() {
  const [nominations, setNominations] = useState(['']);
  const [isLoading, setIsLoading] = useState(false);
  const [sirLoading, setSirLoading] = useState(false);
  const [fetchedData, setFetchedData] = useState(null); // State to store fetched data
  const { user } = useAuth();
  const { toast } = useToast();
  console.log(user?.token);
  console.log(user?.email) 

  const router = useRouter();

  // Use the useEffect hook to check if the user is logged in
  useEffect(() => {
    if (!user) {
      router.push('/signin');
    }
  }, [user, router]);

  const userEmail = user?.email;

  const addNomination = () => {
    setNominations([...nominations, '']);
  };

  const handleNominationChange = (index, value) => {
    const updatedNominations = [...nominations];
    updatedNominations[index] = value;
    setNominations(updatedNominations);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user?.token) {
          return;
        }

        setIsLoading(true);

        const apiUrl = 'https://virtual.chevroncemcs.com/voting/position';
        const authorizationToken = user?.token;

        const response = await Axios.get(apiUrl, {
          headers: {
            Authorization: `Bearer ${authorizationToken}`,
          },
        });

        if (response.status === 200) {
          console.log('Successfully fetched data:', response.data);
          setFetchedData(response.data); // Store the data in the state
        } else {
          console.error('Error fetching data:', response.data);
          // Handle error cases here
        }
      } catch (error) {
        console.error('An error occurred:', error);
        // Handle any network or other errors here
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user?.token]); // Add user?.token as a dependency

  const handleDeleteNomination = async (nominationName) => {
    try {
      setSirLoading(true); // Set loading state to true

      const apiUrl = 'https://virtual.chevroncemcs.com/voting/position';
      const authorizationToken = user?.token;

      const requestBody = {
        email: userEmail,
        name: nominationName,
      };

      const response = await Axios.delete(apiUrl, {
        headers: {
          Authorization: `Bearer ${authorizationToken}`,
        },
        data: requestBody,
      });

      if (response.status === 200) {
        console.log(`Successfully deleted nomination: ${nominationName}`);
        // Handle success (e.g., remove the deleted nomination from the state)
        const updatedNominations = nominations.filter((nom) => nom !== nominationName);
        setNominations(updatedNominations);
        toast({
          title: 'Success!!',
          description: `The nomination "${nominationName}" has been deleted.`,
        });
        // Reload the page to reflect the changes
        window.location.reload();
      } else {
        console.error('Error deleting nomination:', response.data);
        // Handle error cases here
        toast({
          title: 'There was a problem.',
          description: 'There was an error deleting the nomination',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('An error occurred:', error);
      // Handle any network or other errors here
    } finally {
      setSirLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (isLoading) {
      return; // Prevent multiple submissions while loading
    }

    try {
      setIsLoading(true); // Set loading state to true

      const apiUrl = 'https://virtual.chevroncemcs.com/voting/position';
      const authorizationToken = user?.token; // Replace with your actual authorization token

      // Loop through the nominations array and send a request for each nomination
      for (let i = 0; i < nominations.length; i++) {
        const nomination = nominations[i];

        // Skip empty nominations
        if (!nomination) continue;

        const requestBody = {
          email: userEmail,
          name: nomination,
        };

        const response = await Axios.post(apiUrl, requestBody, {
          headers: {
            Authorization: `Bearer ${authorizationToken}`,
          },
        });

        if (response.status === 200) {
          console.log(`Successfully submitted data for nomination ${i + 1}:`, response.data);
          toast({
            title: 'Success!!',
            description: 'The nomination position has been uploaded.',
          });
          // You can also handle any further actions here
          // Reload the page to reflect the changes
          window.location.reload();
        } else {
          console.error(`Error submitting data for nomination ${i + 1}:`, response.data);
          toast({
            title: 'There was a problem.',
            description: 'There was an error uploading the position',
            variant: 'destructive',
          });
          // Handle error cases here
        }
      }
    } catch (error) {
      console.error('An error occurred:', error);
      // Handle any network or other errors here
    } finally {
      setIsLoading(false); // Set loading state back to false when done
    }
  };

  return (
    <div>
      <Navbar />

      <div className="max-w-6xl mx-auto mt-20">
        <h1 className="mt-10 font-bold text-3xl">Add the Nomination Positions</h1>
        <div className="mt-8">
          {nominations.map((nomination, index) => (
            <div key={index} className="mb-4">
              <Input
                type="text"
                name={`nomination-${index}`}
                id={`nomination-${index}`}
                value={nomination}
                onChange={(e) => handleNominationChange(index, e.target.value)}
                placeholder={`Nomination Position ${index + 1}`}
                className="max-w-md"
              />
            </div>
          ))}
          <a href="#" onClick={addNomination} className="btn-add-nomination max-w-md">
            <div className="line"></div>
            <div className="plus-sign text-3xl">+</div>
            <div className="line"></div>
          </a>
          <Button onClick={handleSubmit} className="mb-10" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting Nominations...
              </>
            ) : (
              <>
                Submit
              </>
            )}
          </Button>
        </div>
      </div>
      <div className="mt-8 max-w-6xl mx-auto mb-10">
        {/* Render fetched data in a table */}
        {fetchedData && (
          <div>
            <h2 className="font-bold text-2xl">Nominations</h2>
            <table className="w-full  mt-4">
              {/* <thead>
                <tr className="bg-gray-200">
                  <th className="p-2">ID</th>
                  <th className="p-2">Name</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead> */}
              <tbody>
                {fetchedData.data.map((position) => (
                  <tr key={position.id} className="flex justify-between items-center">
                    {/* <td className="p-2">{position.id}</td> */}
                    <td className="p-2 font-bold text-xl">{position.name}</td>
                    <td className="p-2">
                    <Button 
                      onClick={() => handleDeleteNomination(position.name)}
                      className="mb-10" 
                      variant="destructive"
                      disabled={sirLoading}
                      >
                      {sirLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Deleting...
                        </>
                      ) : (
                        <>
                          Delete
                        </>
                      )}
                    </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ... Other UI elements ... */}
      </div>
    </div>
  );
}

export default UploadNominations;
