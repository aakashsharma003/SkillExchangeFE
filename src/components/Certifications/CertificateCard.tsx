import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';

export default function CertificateCard({ certificate }: any) {
  const getBadgeColor = (status: string) => {
    switch (status) {
      case 'Verified':
        return 'bg-green-200 text-green-800';
      case 'Pending':
        return 'bg-yellow-200 text-yellow-800';
      default:
        return 'bg-gray-200 text-gray-800';
    }
  };

  return (
    <Card className='shadow relative'>
      <CardContent className='px-4 space-y-2 flex flex-col h-full'>
        <h2 className='font-semibold'>{certificate.title}</h2>
        <p className='text-sm text-gray-500'>Issued by: {certificate.org}</p>
        <p className='text-sm text-gray-500'>
          Issue Date: {certificate.issueDate}
        </p>
        {/* {certificate.expiryDate && (
          <p className='text-sm text-gray-500'>
            Expiry Date: {certificate.expiryDate}
          </p>
        )} */}
        <div className='absolute right-4 top-4'>
          <Badge className={getBadgeColor(certificate.status)}>
            {certificate.status}
          </Badge>
        </div>
        <div className='flex justify-between pt-2 mt-auto'>
          <Button variant='link' className='p-0 h-auto cursor-pointer'>
            View
          </Button>
          <Button
            variant='ghost'
            className='text-red-500 p-0 h-auto cursor-pointer'
          >
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
