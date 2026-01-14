import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { signUp } from '../../../api/auth';
import Spinner from '@/components/ui/Spinner';
import toast from 'react-hot-toast';
import { ISignUp } from '@/types/user';
import Input from '@/components/Auth/Input';
import SkillInput from '@/components/SkillInput';
import appRoutes from '@/routes/appRoutes';

const Signup = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ISignUp>({
    fullName: '',
    email: '',
    phone: '',
    skillsOffered: [],
    interests: [],
    password: '',
  });
  const { fullName, email, phone, skillsOffered, interests, password } = formData;

  const setFormValue = (label: string, value: string) =>
    setFormData({ ...formData, [label]: value });

  const addSkillOffered = (skill: string) =>
    setFormData({ ...formData, skillsOffered: [...formData.skillsOffered, skill] });

  const removeSkillOffered = (skill: string) =>
    setFormData({
      ...formData,
      skillsOffered: formData.skillsOffered.filter((val) => skill !== val),
    });

  const addInterest = (skill: string) =>
    setFormData({ ...formData, interests: [...formData.interests, skill] });

  const removeInterest = (skill: string) =>
    setFormData({
      ...formData,
      interests: formData.interests.filter((val) => skill !== val),
    });

  const handleSignup = async () => {
    if (fullName === '' || email === '' || password === '' || phone === '')
      return toast.error('Please fill in all the details');
    if (phone.length !== 10)
      return toast.error('Please enter a valid contact number');
    if (password.length < 8)
      return toast.error('password length must be at least 8');

    try {
      setLoading(true);

      const response = await signUp(formData);

      if (response.success === false) {
        setLoading(false);
        return toast.error(response.message);
      }

      navigate(appRoutes.otp, { state: formData });

      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      toast.error('Something went wrong');
    }
  };

  return (
    <div className='w-full min-h-screen flex items-center justify-center bg-gray-100 py-8'>
      {loading && <Spinner />}

      <Card className='w-full max-w-xl shadow-lg rounded-2xl'>
        <CardContent>
          <h1 className='text-3xl font-bold text-center'>Create an Account</h1>

          <div className='space-y-4'>
            <Input
              label='Name'
              placeholder='Enter your name'
              value={fullName}
              onChange={(value: string) => setFormValue('fullName', value)}
            />

            <Input
              label='Email'
              placeholder='Enter your email'
              value={email}
              onChange={(value: string) => setFormValue('email', value)}
            />

            <Input
              label='Contact Number'
              placeholder='Enter your contact number'
              value={phone}
              onChange={(value: string) =>
                setFormValue('phone', value.replace(/\D/g, ''))
              }
              props={{ maxLength: 10 }}
            />

            <SkillInput
              label="Can Teach"
              skills={skillsOffered}
              addSkill={addSkillOffered}
              removeSkill={removeSkillOffered}
            />

            <SkillInput
              label="Wants to Learn"
              skills={interests}
              addSkill={addInterest}
              removeSkill={removeInterest}
            />

            <Input
              label='Password'
              placeholder='Enter your password'
              value={password}
              onChange={(value: string) => setFormValue('password', value)}
            />
          </div>

          <Button className='w-full mt-4 cursor-pointer' onClick={handleSignup}>
            Sign Up
          </Button>

          <p className='text-sm text-center text-gray-600 mt-4'>
            Already have an account?{' '}
            <span
              onClick={() => navigate(appRoutes.login)}
              className='text-blue-500 hover:underline cursor-pointer'
            >
              Login here
            </span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Signup;
