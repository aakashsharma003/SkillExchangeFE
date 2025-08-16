import React from 'react';

function NotFound() {
  return (
    <div className='w-screen h-screen flex flex-col items-center justify-center'>
      <h1 className='text-2xl font-semibold'>
        Sorry, this page isn't available.
      </h1>
      <h2 className=''>
        the link you followed may be broken, or the page may have been removed.
        Go back to{' '}
        <a href='/' className='text-blue-600'>
          Home
        </a>
        .
      </h2>
    </div>
  );
}

export default NotFound;
