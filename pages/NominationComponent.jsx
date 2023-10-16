import React, { useEffect } from 'react';
import axios from 'axios';

function NominationComponent() {
  useEffect(() => {
    // Define the request data
    const requestData = {
      empno: '110234R',
      positionId: '20',
      nomineeno: '110434'
    };

    // Define the request headers
    const headers = {
      'Content-Type': 'application/json',
      Authorization: 'Bearer 025209'
    };

    // Define the URL
    const apiUrl = 'https://virtual.chevroncemcs.com/voting/nominate';

    // Send the GET request using Axios
    axios
      .get(apiUrl, {
        params: requestData, // Include the request data as params
        headers: headers // Set the request headers
      })
      .then((response) => {
        console.log('Nomination Response:', JSON.stringify(response.data));
      })
      .catch((error) => {
        console.log('Error:', error);
      });
  }, []); // The empty dependency array ensures that this effect runs only once when the component mounts

  return (
    <div>
      {/* Your React component content */}
    </div>
  );
}

export default NominationComponent;
