import MemberNavbar from '@/components/MemberNavbar';
import React, { useEffect, useState, useRef } from 'react';
import Profile from '@/public/profile.jpg';
import White from '@/public/white.jpg';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/router';
import { useNewAuth } from '@/services/NewAuthContext';
import axios from 'axios';
import { useToast } from '@/components/ui/use-toast';
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TipTapMenuBar from '@/components/TipTapMenuBar';

import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import { PacmanLoader } from 'react-spinners';
import { Textarea } from "@/components/ui/textarea"
import Head from 'next/head';
import { User } from 'lucide-react';
import Placeholder from '@tiptap/extension-placeholder';

function Campaign() {
  const [editorHtml, setEditorHtml] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isMessage, setIsMessage] = useState('');
  const [showSubmitButton, setShowSubmitButton] = useState(true); // Control whether to show the submit button
  const [hasCreatedCampaign, setHasCreatedCampaign] = useState(false); // Check if the user has already created a campaign
  const [currentStageData, setCurrentStageData] = useState(null);

  const inputRef = useRef(null);
  const inputRefs = useRef(null);

  const { employeeNumber } = useNewAuth();
  const { code, name } = useNewAuth();
  const { currentStage } = useNewAuth();
  const router = useRouter();
  const [empno, setEmpno] = useState(employeeNumber);

  const [editorState, setEditorState] = useState('');
  const editor = useEditor({
    autofocus: true,
    extensions: [
        StarterKit,
        Placeholder.configure({
            placeholder: "Enter your campaign message here...", // Example placeholder text
        }),
    ],
    content: editorState,
    onUpdate: ({ editor }) => {
        setEditorState(editor.getHTML());
    },
});


  console.log(employeeNumber)

  // Set empno to employeeNumber on initial component load
  useEffect(() => {
    setEmpno(employeeNumber);
  }, [employeeNumber]);

  const handleChange = (html) => {
    setEditorHtml(html);
  };

  const handleEmpnoChange = (e) => {
    setEmpno(e.target.value);
  };

  const handleIsMessageChange = (e) => {
    setIsMessage(e.target.value);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  const handleImageChanges = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  const openFileInput = () => {
    inputRef.current.click();
  };

  const openFileInputs = () => {
    inputRefs.current.click();
  };

  useEffect(() => {
    async function fetchCurrentStage() {
      try {
        const response = await axios.get('https://virtual.chevroncemcs.com/voting/stage/current', {
          headers: {
            Authorization: `Bearer ${code}`,
          },
        });
        setCurrentStageData(response.data.data.name);
        console.log('Current Stage Data:', response.data.data.name);
      } catch (error) {
        console.error('Error fetching current stage:', error);
      }
    }

    fetchCurrentStage();
  }, [code]); // Ensure to include the necessary dependencies in the dependency array

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Show loader while the API request is in progress
    setIsLoading(true);

    const url = 'https://virtual.chevroncemcs.com/voting/Campaign';
    const apiKey = code; // Replace with your actual API key or token

    const formData = new FormData();
    formData.append('empno', empno);
    if (selectedImage) {
      formData.append('image', selectedImage);
    }
    formData.append('message', editorState);

    try {
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('API Response:', data);

        if (data.message === "You have set your campaign message") {
          // Show a custom alert message when the response message matches
          alert("Campaign message set successfully!");
          // Push to the /seecampaigns page only on success
          router.push('/seecampaigns');
          setShowSubmitButton(false); // Hide the submit button
          setHasCreatedCampaign(true); // Set the flag to indicate the user has created a campaign
        } else {
          alert("Campaign message was not set: " + data.message);
        }
      } else {
        console.error('API Request Failed:', response.statusText);
        // Handle the failure case here, if needed
      }
    } catch (error) {
      console.error('An error occurred:', error);
    } finally {
      // Hide the loader when the API request is complete
      setIsLoading(false);
    }
  };

  const checkEmployeeInResponse = async () => {
    try {
      const apiUrl = 'https://virtual.chevroncemcs.com/voting/campaign';

      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          Authorization: 'YourAuthorizationTokenHere',
        },
      });

      if (response.ok) {
        const data = await response.json();
        const isEmployeeInResponse = data.data.some(item => item.empno === employeeNumber);
        setShowSubmitButton(!isEmployeeInResponse);
        setHasCreatedCampaign(isEmployeeInResponse); // Set the flag based on whether the user's empno is in the response

      } else {
        console.error('Failed to fetch campaign data');
      }
    } catch (error) {
      console.error('Error fetching campaign data', error);
    }
  };

  useEffect(() => {
    if (employeeNumber) {
      checkEmployeeInResponse();
    }
  }, [employeeNumber]); // Include checkEmployeeInResponse as a dependency

  const handlePreview = () => {
    const previewUrl = `/campaignPreview?empno=${empno}&message=${encodeURIComponent(editorState)}&image=${encodeURIComponent(URL.createObjectURL(selectedImage))}`;
  
    window.open(previewUrl, '_blank');
  };

  // Update the condition for enabling the Publish button
const isPublishEnabled = editorState.trim() !== '' && selectedImage !== null;

// Update the condition for enabling the Preview button
const isPreviewEnabled = editorState.trim() !== '' && selectedImage !== null;

  return (
    <div>
      <MemberNavbar />
      {isLoading ? ( // Check if isLoading is true
        <div className="fixed top-0 left-0 w-screen h-screen flex flex-col justify-center items-center bg-white opacity-100 z-50">
          <h1 className='font-bold text-xl'>Campaign is uploading...</h1>
          <PacmanLoader size={50} color="#272E3F" />
        </div>
      ) : (
      <div className="main-content mt-10 mb-44">
          <div>
            <div className="relative h-[300px] sm:h-[400px] lg:h-[300px] xl:h-[300px] 2xl:h-[300px]">
              <img src='/office2.jpg' layout="fill" objectFit="cover" alt="" className='h-[300px] w-full object-cover' />
              <div className="absolute bottom-[-70px] left-1/2 transform translate-x-[-50%]">

<div className="relative w-32 h-32 cursor-pointer" onClick={openFileInput}>
  <img src='/white.jpg' layout="fill" alt="" className="absolute inset-0 w-full h-full object-cover rounded-full" />
  {selectedImage ? (
    <img
      src={URL.createObjectURL(selectedImage)}
      alt="Selected"
      className="absolute inset-0 w-full h-full object-cover rounded-full"
    />
  ) : (
    <>
      <p className='absolute inset-0 flex justify-center items-center text-center font-bold'>Click to Select Image</p>
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        style={{ display: 'none' }}
        onChange={handleImageChange}
      />
    </>
  )}
</div>

{selectedImage && (
  <>
  <input
        type="file"
        accept="image/*"
        ref={inputRefs}
        style={{ display: 'none' }}
        onChange={handleImageChanges}
      />
    <button
      className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      onClick={openFileInputs}
    >
      Change Picture
    </button>
  </>
)}


              </div>
            </div>

            <div className="flex flex-col space-y-1 justify-center items-center mt-24">
              <h1 className='font-extrabold text-2xl'>
                {name}
              </h1>
              <div className='flex justify-center mt-3'>

            </div>
              {/* <p className='text-lg text-gray-500 text-center'>
                Running for the Position of President
              </p> */}
            </div>

            <div className='max-w-6xl mx-auto flex flex-col justify-center items-center'>
              <h1 className='font-extrabold text-2xl md:text-4xl mt-4 text-center'>
                Campaign Message
              </h1>
              {/* <p className='mt-2 md:mt-5 text-center p-5 md:p-0'>
                I am the man for the job.
              </p> */}
              {/* <EditorContent editor={editor} /> */}
              <div className="border-stone-200 shadow-xl border rounded-lg px-16 py-8 w-9/12 mt-5">
                <div className='flex w-full'>
                  {editor && <TipTapMenuBar editor={editor} />}
                </div>
                <div className='prose w-full'>
                  <EditorContent editor={editor} />
                </div>
              </div>
              
            </div>
            
          </div>
        
        <div className="flex justify-center items-center space-x-5">
          <div className='flex justify-center'>
          {/* {showSubmitButton && ( */}
                    <Button onClick={handleSubmit} className="mt-5 mb-10 bg-[#1E2C8A]" disabled={!isPublishEnabled}>
                      Publish
                    </Button>
                  {/* )} */}
          </div>
          <div>
            <Button onClick={handlePreview} className="mt-5 mb-10 bg-[#1E2C8A]" disabled={!isPreviewEnabled}>
                Preview Page
            </Button>
          </div>

        </div>
      </div>
      )}
    </div>
  )
}

export default Campaign
