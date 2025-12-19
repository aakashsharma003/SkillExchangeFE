import React, { useEffect, useState } from 'react';

interface Review {
  user: string;
  review: string;
}

interface Badge {
  name: string;
  color: string;
  textColor: string;
}

interface UserProfile {
  name: string;
  photoUrl: string;
  bio: string;
  description: string;
  skills: string[];
  progress: number;
  reviews: Review[];
  badges: Badge[];
  sessions: string[];
}

const tmppage: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    // Simulating API call
    const fetchProfile = async () => {
      const data: UserProfile = {
        name: 'John Doe',
        photoUrl: 'https://via.placeholder.com/150',
        bio: 'Creative Designer & Web Developer',
        description:
          'Passionate about design and technology. I love to collaborate with others to create amazing user experiences. Always eager to learn and share knowledge!',
        skills: [
          'Graphic Design',
          'Web Development',
          'Digital Marketing',
          'Content Creation',
        ],
        progress: 60,
        reviews: [
          {
            user: 'Alice Smith',
            review:
              'John is a fantastic collaborator! He helped me improve my design skills significantly.',
          },
          {
            user: 'Bob Johnson',
            review:
              'Working with John was a great experience. Highly recommend!',
          },
        ],
        badges: [
          {
            name: 'Top Contributor',
            color: 'bg-blue-100',
            textColor: 'text-blue-700',
          },
          {
            name: 'Skill Master',
            color: 'bg-green-100',
            textColor: 'text-green-700',
          },
          {
            name: 'Community Builder',
            color: 'bg-yellow-100',
            textColor: 'text-yellow-700',
          },
        ],
        sessions: [
          'Skill exchange with Alice Smith - Graphic Design (Completed)',
          'Skill exchange with Bob Johnson - Web Development (In Progress)',
          'Skill exchange with Charlie Brown - Photography (Completed)',
        ],
      };
      setProfile(data);
    };

    fetchProfile();
  }, []);

  if (!profile) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        Loading...
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-100 p-6 space-y-6'>
      {/* Profile Header */}
      <div className='bg-white p-6 rounded shadow flex flex-col items-center text-center'>
        <img
          src={profile.photoUrl}
          alt='Profile'
          className='w-36 h-36 rounded-full mb-4'
        />
        <h1 className='text-2xl font-bold'>{profile.fullName}</h1>
        <p className='text-gray-600'>{profile.bio}</p>
        <p className='mt-4 text-gray-700'>{profile.description}</p>
      </div>

      {/* Skills Offered */}
      <div className='bg-white p-6 rounded shadow'>
        <h2 className='text-xl font-semibold mb-4'>Skills Offered</h2>
        <ul className='list-disc list-inside text-gray-700 space-y-1'>
          {profile.skills.map((skill, idx) => (
            <li key={idx}>{skill}</li>
          ))}
        </ul>
      </div>

      {/* Skill Learning Progress */}
      <div className='bg-white p-6 rounded shadow'>
        <h2 className='text-xl font-semibold mb-4'>Skill-Learning Progress</h2>
        <div className='w-full bg-gray-200 rounded-full h-4 mb-2'>
          <div
            className='bg-blue-500 h-4 rounded-full'
            style={{ width: `${profile.progress}%` }}
          ></div>
        </div>
        <p className='text-gray-600'>{profile.progress}% of skills learned!</p>
      </div>

      {/* User Reviews */}
      <div className='bg-white p-6 rounded shadow'>
        <h2 className='text-xl font-semibold mb-4'>User Reviews</h2>
        {profile.reviews.map((review, idx) => (
          <div key={idx} className='mb-4'>
            <p className='font-semibold'>{review.user}</p>
            <p className='text-gray-600'>"{review.review}"</p>
            {idx !== profile.reviews.length - 1 && (
              <hr className='my-4 border-gray-300' />
            )}
          </div>
        ))}
      </div>

      {/* Badges Earned */}
      <div className='bg-white p-6 rounded shadow'>
        <h2 className='text-xl font-semibold mb-4'>Badges Earned</h2>
        <div className='flex flex-wrap gap-4'>
          {profile.badges.map((badge, idx) => (
            <div
              key={idx}
              className={`px-4 py-2 rounded ${badge.color} ${badge.textColor} font-semibold text-sm`}
            >
              {badge.fullName}
            </div>
          ))}
        </div>
      </div>

      {/* Session History */}
      <div className='bg-white p-6 rounded shadow'>
        <h2 className='text-xl font-semibold mb-4'>Session History</h2>
        <ul className='list-disc list-inside text-gray-700 space-y-1'>
          {profile.sessions.map((session, idx) => (
            <li key={idx}>{session}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default tmppage;
