export default function UserReviews({ name }: any) {
  const reviews = [
    {
      user: 'Alice Smith',
      review:
        name +
        ' is a fantastic collaborator! He helped me improve my design skills significantly.',
    },
    {
      user: 'Bob Johnson',
      review:
        'Working with ' + name + ' was a great experience. Highly recommend!',
    },
  ];

  return (
    <div className='bg-white p-6 rounded shadow'>
      <h2 className='text-xl font-semibold mb-4'>User Reviews</h2>
      {reviews.map((review, idx) => (
        <div key={idx} className='mb-4'>
          <p className='font-semibold'>{review.user}</p>
          <p className='text-gray-600'>"{review.review}"</p>
          {idx !== reviews.length - 1 && (
            <hr className='my-4 border-gray-300' />
          )}
        </div>
      ))}
    </div>
  );
}
