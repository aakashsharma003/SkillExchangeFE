export default function ProgressTracker() {
  return (
    <div className='bg-white p-6 rounded shadow'>
      <h2 className='text-xl font-semibold mb-4'>Skill-Learning Progress</h2>
      <div className='w-full bg-gray-200 rounded-full h-4 mb-2'>
        <div
          className='bg-blue-500 h-4 rounded-full'
          style={{ width: `70%` }}
        ></div>
      </div>
      <p className='text-gray-600'>70% of skills learned!</p>
    </div>
  );
}
