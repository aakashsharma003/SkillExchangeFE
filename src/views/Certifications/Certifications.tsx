import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import CertificateCard from '@/components/Certifications/CertificateCard';

const certifications = [
  {
    title: 'Web Development Certificate',
    org: 'Tech Academy',
    issueDate: 'January 15, 2021',
    expiryDate: 'January 15, 2023',
    status: 'Verified',
  },
  {
    title: 'Digital Marketing Certification',
    org: 'Marketing Institute',
    issueDate: 'March 10, 2022',
    expiryDate: null,
    status: 'Pending',
  },
  {
    title: 'Graphic Design Certification',
    org: 'Design School',
    issueDate: 'February 5, 2021',
    expiryDate: 'February 5, 2024',
    status: 'Verified',
  },
];

export default function Certifications() {
  return (
    <div className='min-h-screen bg-gray-100 pt-8 px-4'>
      <div className='mx-auto'>
        <div className='text-center mb-6'>
          <h1 className='text-2xl font-bold text-blue-700'>
            Your Verified Certifications
          </h1>
          <p className='text-sm text-gray-500'>
            Showcase your skills and build trust in the community.
          </p>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-10'>
          {certifications.map((cert, index) => (
            <CertificateCard certificate={cert} key={index} />
          ))}
        </div>

        <div className='bg-white rounded-lg p-6 shadow mb-10'>
          <h3 className='text-lg font-semibold mb-4'>
            Upload New Certification
          </h3>
          <form className='space-y-4'>
            <div className='space-y-1'>
              <Label htmlFor='title'>Certificate Title</Label>
              <Input id='title' placeholder='Enter certificate title' />
            </div>
            <div className='space-y-1'>
              <Label htmlFor='org'>Issuing Organization</Label>
              <Input id='org' placeholder='Enter issuing organization' />
            </div>
            <div className='space-y-1'>
              <Label htmlFor='date'>Issue Date</Label>
              <Input id='date' type='date' />
            </div>
            <div className='space-y-1'>
              <Label htmlFor='file'>Upload Certificate</Label>
              <Input id='file' type='file' />
            </div>
            <Button type='submit'>Submit</Button>
          </form>
        </div>

        <div className='text-center text-sm text-gray-600'>
          <p>
            Our verification process ensures that all certifications are
            authentic and trustworthy. After submission, your certification will
            be reviewed by our team.
          </p>
          <Button variant='link' className='p-0 text-blue-600'>
            Learn more about how we verify certifications
          </Button>
        </div>
      </div>
    </div>
  );
}
