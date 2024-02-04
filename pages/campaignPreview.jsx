// pages/campaign-preview.js

import { useRouter } from 'next/router';
import Campaign from './campaign';
import Image from 'next/image';
import MemberNavbar from '@/components/MemberNavbar';
import { useNewAuth } from '@/services/NewAuthContext';

const CampaignPreview = () => {
  const router = useRouter();
  const { name } = useNewAuth();
  const { message, image } = router.query;

  // Display the image if it exists in the query parameters
  const renderImage = () => {
    if (image) {
      return <img src={decodeURIComponent(image)} alt="Selected" className="absolute inset-0 w-full h-full object-cover rounded-full" />;
    }
    return null;
  };

  return (
    <div>
      <MemberNavbar />
      <div className="main-content mt-10 mb-44">
          <div>
          <div className="bg-red-500 text-white p-5 text-center mt-14">
            <p className="font-bold text-xl">THIS IS A PREVIEW OF YOUR CAMPAIGN PAGE</p>
          </div>
            <div className="relative h-[300px] sm:h-[400px] lg:h-[300px] xl:h-[300px] 2xl:h-[300px]">
              <img src='/office2.jpg' layout="fill" objectFit="cover" alt="" className='h-[300px] w-full object-cover' />
              <div className="absolute bottom-[-70px] left-1/2 transform translate-x-[-50%]">
              <div className="relative w-32 h-32 cursor-pointer">
                {renderImage()}
            </div>

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
  <div
    className='mt-2 md:mt-5 prose'
    dangerouslySetInnerHTML={{ __html: message }}
  ></div>
</div>
            
          </div>
      </div>
    </div>
  );
};

export default CampaignPreview;
