import { useRouteError } from 'react-router-dom';
export function RootErrorBoundary() {
  const error = useRouteError() as Error;

  return (
    <div className='h-screen w-screen flex flex-col justify-center items-center'>
      <h1>Uh oh, something went terribly wrong 😩</h1>
      <pre>{error.message || JSON.stringify(error)}</pre>
      <a href='/'>Click here to reload the app</a>
    </div>
  );
}
