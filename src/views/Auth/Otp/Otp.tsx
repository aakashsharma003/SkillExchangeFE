import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import OtpInput from 'react-otp-input';
import toast from 'react-hot-toast';
import { verifyOtp } from '@/api/auth';
import Spinner from '@/components/ui/Spinner';
import appRoutes from '@/routes/appRoutes';

const Otp = () => {
  const navigate = useNavigate();

  const location = useLocation();
  const signupFormData = location.state;

  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmitOtp = async (otp: string) => {
    if (otp.length !== 6) return toast.error('Please enter a 6 digit OTP');
    if (!/^\d+$/.test(otp)) return toast.error('Please enter only numbers');

    try {
      setLoading(true);
      const numericOTP = parseInt(otp, 10);
      const payload = { userDetails: signupFormData, otp: numericOTP };
      const res = await verifyOtp(payload);

      if (!res.success) {
        setLoading(false);
        return toast.error(res.message);
      }

      navigate(appRoutes.login);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      toast.error('something went wrong');
      console.error('OTP Verification Error:', err);
    }
  };

  return (
    <div className='w-full min-h-screen flex items-center justify-center bg-gray-100'>
      {loading && <Spinner />}

      <Card className='w-full max-w-md p-8 shadow-xl rounded-2xl'>
        <CardContent className='space-y-6'>
          <h1 className='text-3xl font-bold text-center'>Verify OTP</h1>

          <div className='space-y-4'>
            <div className='flex flex-col gap-4 items-center'>
              <label className='block mb-1 text-sm font-medium self-start'>
                Enter 6-Digit OTP
              </label>

              <OtpInput
                value={otp}
                onChange={val => {
                  setOtp(val);
                  if (val.length === 6) handleSubmitOtp(val);
                }}
                numInputs={6}
                renderSeparator={<span className='w-2'></span>}
                renderInput={props => (
                  <input {...props} className='border text-5xl rounded-sm ' />
                )}
              />
            </div>

            <Button
              className='w-full cursor-pointer'
              onClick={() => handleSubmitOtp(otp)}
            >
              Submit OTP
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Otp;
