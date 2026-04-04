import Github from '@/assets/icons/Github';
import Linkedin from '@/assets/icons/Linkedin';
import Youtube from '@/assets/icons/Youtube';
import Instagram from '@/assets/icons/instagram-icon.png';

import { User } from '@/types/user';

export default function ProfileHeader({ user }: { user: User }) {
  const {
    fullName,
    skills,
    bio,
    location,
    githubProfile,
    linkedinProfile,
    youtubeProfile,
    instagramProfile,
  } = user;
  const skillString = (skills ?? []).join(', ');

  return (
    <section className='bg-white rounded-xl p-6 shadow'>
      <div className='flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 sm:gap-6'>
        <div className='relative inline-flex items-center justify-center w-24 h-24 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600 '>
          <span className=' text-5xl text-gray-600 dark:text-gray-300'>
            {fullName.substring(0, 1).toUpperCase()}
          </span>
        </div>

        <div className='flex-1'>
          <h3 className='text-xl font-semibold'>{fullName}</h3>
          {location && <p className='text-gray-400 text-md'>{location}</p>}
          <p className='text-gray-600'>Can Teach: {skillString}</p>
        </div>

        <div className='sm:ml-auto self-center sm:self-start flex gap-2 items-center mt-2 sm:mt-0'>
          {youtubeProfile && (
            <a href={youtubeProfile} target='_blank'>
              <Youtube />
            </a>
          )}

          {githubProfile && (
            <a href={githubProfile} target='_blank'>
              <Github />
            </a>
          )}

          {linkedinProfile && (
            <a href={linkedinProfile} target='_blank'>
              <Linkedin />
            </a>
          )}

          {instagramProfile && (
            <a href={instagramProfile} target='_blank' title='Instagram'>
              <img
                src={Instagram}
                alt='instagram'
                className='object-contain max-w-6'
              />
            </a>
          )}
        </div>
      </div>

      {bio && <p className='mt-4 text-gray-700'>{bio}</p>}
    </section>
  );
}
