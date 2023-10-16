import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from '@/services/AuthContext';
import { useState } from "react";
import * as XLSX from "xlsx";
import axios from 'axios'; // Import Axios
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

function Uploaded({ ballotId }) {
  const { user } = useAuth();
  const { toast } = useToast()
  const [data, setData] = useState([]);
  const [jsonData, setJsonData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const userEmail = user?.email

  const userToken = user?.token;

  console.log(userToken);

  const handleFileUpload = (e) => {
    const reader = new FileReader();
    reader.readAsBinaryString(e.target.files[0]);
    reader.onload = (e) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const parsedData = XLSX.utils.sheet_to_json(sheet);
      setData(parsedData);
  
      // Create the API data object matching the endpoint structure
      const apiData = {
        email: userEmail,
        data: parsedData.map((row) => ({
          empno: row["Employee Number"], // Replace "Employee Number" with the actual column name
          name: row["Name"], // Replace "Name" with the actual column name
          eligibleEmail: row["Eligible Email"], // Replace "Eligible Email" with the actual column name
        })), 
      };
  
      setJsonData(apiData);
    };
  };
  

  const submitDataToAPI = () => {
    if (!userToken) {
      // User is not logged in, show a toast notification
      toast({
        title: 'Not Logged In',
        description: 'Please log in to submit data.',
        variant: 'destructive',
        action: <Link className={buttonVariants({
          className: 'mt-4 mb-6 bg-red-600'
        })} href='/signin'>Sign In</Link>,
      });
      return;
    }

    if (jsonData && !isLoading) { // Add isLoading check to prevent multiple submissions
      setIsLoading(true); // Set isLoading to true when submitting

      // Log the payload before sending the request
      console.log("Payload to be sent to the API:", jsonData);
  
      axios.post("https://virtual.chevroncemcs.com/voting/eligible/bulk", jsonData, {
        headers: {
          'Authorization': `Bearer ${userToken}`,
          'Content-Type': 'application/json',
        },
      })
      .then((response) => {
        // Handle API response here
        console.log("API Response:", response.data);
        toast({
          title: 'Voting',
          description: `${response.data.message}`,
        });
      })
      .catch((error) => {
        // Handle API request error here
        console.error("API Request Error:", error);
        toast({
          title: 'There was a problem.',
          description: 'There was an error uploading the data',
          variant: 'destructive',
        });
      })
      .finally(() => {
        setIsLoading(false); // Set isLoading back to false when the request is complete
      });
    }
  };
  

  return (
    <div className="App">
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label>Candidate Bulk Upload</Label>
        <Input id="picture" type="file" accept=".xlsx, .xls, .csv" onChange={handleFileUpload} />
      </div>

      {data.length > 0 && (
        <table className="table">
          <thead>
            <tr>
              {Object.keys(data[0]).map((key) => (
                <th key={key}>{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index}>
                {Object.values(row).map((value, index) => (
                  <td key={index}>{value}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <br /><br />

      <Button onClick={submitDataToAPI} className="mb-10" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Submitting...
          </>
        ) : (
          <>
            Submit Candidate Data
          </>
        )}
      </Button>
    </div>
  );
}

export default Uploaded;
