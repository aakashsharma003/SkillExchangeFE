import React from 'react';

export default function Badges() {
  const badges = [
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
  ];

  return (
    <div className='bg-white p-6 rounded shadow'>
      <h2 className='text-xl font-semibold mb-4'>Badges Earned</h2>
      <div className='flex flex-wrap gap-4'>
        {badges.map((badge, idx) => (
          <div
            key={idx}
            className={`px-4 py-2 rounded ${badge.color} ${badge.textColor} font-semibold text-sm`}
          >
            {badge.name}
          </div>
        ))}
      </div>
    </div>
  );
}
