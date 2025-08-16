import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/context/auth/useUser';
import Input from '@/components/Auth/Input';
import SkillInput from '@/components/SkillInput';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import Spinner from '@/components/ui/Spinner';
import { updateDetails } from '@/api/user';
import appRoutes from '@/routes/appRoutes';
import { IUpdateUser } from '@/types/user';

const EditProfile = () => {
  const navigate = useNavigate();
  const {
    user: { email, ...rest },
    fetchUser,
  } = useUser();
  const [formData, setFormData] = useState<IUpdateUser>(rest);
  const setFormValue = (label: string, value: string) => {
    setFormData(prev => ({ ...prev, [label]: value }));
  };
  const addSkill = (skill: string) =>
    setFormData({ ...formData, skills: [...formData.skills, skill] });

  const removeSkill = (skill: string) =>
    setFormData({
      ...formData,
      skills: formData.skills.filter(val => skill !== val),
    });

  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    if (formData.name === '' || formData.contact === '')
      return toast.error('Please fill in valid details');

    try {
      setLoading(true);
      const res = await updateDetails(formData);

      if (!res.success) {
        setLoading(false);
        return toast.error(res.message);
      }

      await fetchUser();
      setLoading(false);
      toast.success('Profile updated successfully!');
      navigate(appRoutes.dashboard);
    } catch (err) {
      setLoading(false);
      console.error('Error updating profile:', err);
      toast.error('something went wrong');
    }
  };

  return (
    <div className='min-h-screen pb-12'>
      {loading && <Spinner />}

      <div className='bg-white p-8 w-full gap-4 flex flex-col'>
        <h2 className='text-2xl font-bold text-center'>Update Profile</h2>

        <Input
          label='Name'
          placeholder='Enter your name'
          value={formData.name}
          onChange={(val: string) => {
            setFormValue('name', val);
          }}
        />

        <Input
          label='Email'
          placeholder='Enter your email'
          value={email}
          props={{ disabled: true }}
        />

        <Input
          label='Contact Number'
          placeholder='Enter your contact number'
          value={formData.contact}
          onChange={(value: string) =>
            setFormValue('contact', value.replace(/\D/g, ''))
          }
          props={{ maxLength: 10 }}
        />

        <SkillInput
          skills={formData.skills}
          addSkill={addSkill}
          removeSkill={removeSkill}
        />

        <Input
          label='Bio'
          placeholder='Enter something about yourself'
          value={formData.bio}
          onChange={(value: string) => setFormValue('bio', value)}
        />

        <Input
          label='Location'
          placeholder='Enter your location'
          value={formData.location}
          onChange={(value: string) => setFormValue('location', value)}
        />

        <Input
          label='Linkedin URL'
          placeholder='Enter your linkedin url'
          value={formData.linkedinLink}
          onChange={(value: string) => setFormValue('linkedinLink', value)}
        />

        <Input
          label='Github URL'
          placeholder='Enter your github url'
          value={formData.githubLink}
          onChange={(value: string) => setFormValue('githubLink', value)}
        />

        <Input
          label='Youtube URL'
          placeholder='Enter your youtube url'
          value={formData.youtubeLink}
          onChange={(value: string) => setFormValue('youtubeLink', value)}
        />

        <Input
          label='Instagram URL'
          placeholder='Enter your instagram url'
          value={formData.instagramLink}
          onChange={(value: string) => setFormValue('instagramLink', value)}
        />
      </div>

      <div className='fixed  bottom-0 w-full p-4 flex justify-center items-center bg-white'>
        <Button className='cursor-pointer px-8' onClick={handleUpdate}>
          Update Profile
        </Button>
      </div>
    </div>
  );
};

export default EditProfile;
