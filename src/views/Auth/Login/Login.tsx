import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../../api/auth';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Spinner from '@/components/ui/Spinner';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/auth/useAuth';
import appRoutes from '@/routes/appRoutes';

const Login = () => {
  const navigate = useNavigate();
  const { fetchUser } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      if (email === '' || password === '')
        return toast.error('Please fill in all the details');

      const payload = { email, password };
      setLoading(true);
      const response = await login(payload);

      if (response.success === false) {
        setLoading(false);
        return toast.error(response.message);
      }

      localStorage.setItem('token', response.data.token);
      await fetchUser();
      console.log("i am reached here")
      navigate(appRoutes.dashboard);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
      toast.error('something went wrong. unable to login.');
    }
  };

  return (
    <div className='w-full min-h-screen flex items-center justify-center bg-gray-100'>
      {loading && <Spinner />}

      <Card className='w-full max-w-xl shadow-lg rounded-2xl'>
        <CardContent className=''>
          <h1 className='text-3xl font-bold text-center'>Welcome Back</h1>

          <div className='space-y-4'>
            <div>
              <label className='block mb-1 text-sm font-medium'>Email</label>
              <Input
                value={email}
                onChange={({ target }) => setEmail(target.value)}
                placeholder='Enter your email'
                type='email'
              />
            </div>

            <div>
              <label className='block mb-1 text-sm font-medium'>Password</label>
              <Input
                value={password}
                onChange={({ target }) => setPassword(target.value)}
                placeholder='Enter your password'
                type='password'
              />
            </div>
          </div>

          <Button className='w-full mt-4 cursor-pointer' onClick={handleLogin}>
            Log In
          </Button>

          <p className='text-sm text-center text-gray-600 mt-4'>
            Don't have an account?{' '}
            <span
              onClick={() => navigate(appRoutes.signup)}
              className='text-blue-500 hover:underline cursor-pointer'
            >
              Signup here
            </span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
