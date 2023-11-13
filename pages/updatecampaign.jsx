import MemberNavbar from '@/components/MemberNavbar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { useNewAuth } from '@/services/NewAuthContext';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

function Updatecampaign() {
    const { toast } = useToast();
  const { employeeNumber } = useNewAuth();
  const { code } = useNewAuth();
  const { currentStage } = useNewAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [campaignMessage, setCampaignMessage] = useState(""); // State to store the campaign message
  const router = useRouter();

  console.log(code)


  const updateCampaignMessage = async () => {
    if (isLoading) {
      return; // Prevent multiple simultaneous requests
    }

    setIsLoading(true);

    const apiUrl = "https://virtual.chevroncemcs.com/voting/campaign/message";

    try {
      const response = await fetch(apiUrl, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${code}`, // Replace with your actual authorization token
        },
        body: JSON.stringify({
          "empno": employeeNumber,
          "message": campaignMessage // Use the campaign message from the state
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (!data.error) {
          console.log("Campaign message updated successfully:", data.message);
          toast({
            title: 'Voting',
            description: `${data.message}`,
          });
          router.push('/seecampaigns');
        } else {
          console.error("Error updating campaign message:", data.message);
          toast({
            title: 'There was a problem.',
            description: `${data.message}`,
            variant: 'destructive',
          });
        }
      } else {
        console.error("Failed to update campaign message. Status:", response.status);
      }
    } catch (error) {
      console.error("An error occurred:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <MemberNavbar />
      <div className='mt-20 max-w-6xl mx-auto'>
        <h1 className='font-bold text-2xl mb-5'>UPDATE YOUR CAMPAIGN</h1>
        <div className='w-1/2'>
          <Textarea
            placeholder="Type your campaign message here."
            style={{ height: '200px' }}
            type="text"
            value={campaignMessage}
            onChange={(e) => setCampaignMessage(e.target.value)}
          />
        </div>
        <Button onClick={updateCampaignMessage} className="mt-5" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Updating Campaign...
            </>
          ) : (
            <>
              Update Campaign
            </>
          )}
        </Button>
      </div>
    </div>
  )
}

export default Updatecampaign;
