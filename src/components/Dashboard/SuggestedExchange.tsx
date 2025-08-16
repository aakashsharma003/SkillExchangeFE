export default function SuggestedExchange() {
  return (
    <section className='bg-white rounded-xl p-6 shadow'>
      <h2 className='text-2xl font-bold mb-4'>Skill Matching</h2>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div className='bg-gray-100 p-4 rounded-lg'>
          <h3 className='font-semibold'>Suggested Partner 1</h3>
          <p className='text-gray-600 mb-3'>Skills: Photography, Videography</p>
          <button className='bg-blue-500 text-white px-4 py-2 rounded'>
            Connect
          </button>
        </div>
        <div className='bg-gray-100 p-4 rounded-lg'>
          <h3 className='font-semibold'>Suggested Partner 2</h3>
          <p className='text-gray-600 mb-3'>Skills: SEO, Content Writing</p>
          <button className='bg-blue-500 text-white px-4 py-2 rounded'>
            Connect
          </button>
        </div>
      </div>
    </section>
  );
}
