import { fetchReceivedRequests, fetchSentRequests } from '@/api/exchange-request';
import ReceivedReqCard from '@/components/ReceivedReqCard';
import SentReqCard from '@/components/SentReqCard';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { IexchangeRequest } from '@/types/swal-request';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const SkillExchangeRequests = () => {
  const [sent, setSent] = useState<IexchangeRequest[]>([]);
  const [filteredSent, setFilteredSent] = useState<IexchangeRequest[]>([]);
  const [sentLoading, setSentLoading] = useState(false);

  const [received, setReceived] = useState<IexchangeRequest[]>([]);
  const [filteredReceived, setFilteredReceived] = useState<IexchangeRequest[]>([]);
  const [receivedLoading, setReceivedLoading] = useState(false);

  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const filters = ['PENDING', 'ACCEPTED', 'REJECTED'];

  useEffect(() => {
    const loadAllRequests = async () => {
      try {
        setSentLoading(true);
        setReceivedLoading(true);

        // Fetching both simultaneously
        const [sentRes, receivedRes] = await Promise.all([
          fetchSentRequests(),
          fetchReceivedRequests(),
        ]);

        if (sentRes.success) setSent(sentRes.data);
        if (receivedRes.success) setReceived(receivedRes.data);

      } catch (err) {
        toast.error('Failed to load requests');
        console.error(err);
      } finally {
        setSentLoading(false);
        setReceivedLoading(false);
      }
    };

    loadAllRequests();
  }, []);

  // Update logic: No more .request.id, directly use .id
  const handleActionUpdate = (updatedReq: IexchangeRequest) => {
    setReceived(prev =>
      prev.map(item => (item.id !== updatedReq.id ? item : updatedReq))
    );
  };

  const onToggleFilter = (filter: string) => {
    setSelectedFilters(prev =>
      prev.includes(filter)
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  // Sync filtered lists whenever source data or filters change
  useEffect(() => {
    const applyFilter = (list: IexchangeRequest[]) =>
      list.filter(req => 
        selectedFilters.length === 0 || selectedFilters.includes(req.status)
      );

    setFilteredSent(applyFilter(sent));
    setFilteredReceived(applyFilter(received));
  }, [selectedFilters, sent, received]);

  return (
    <div className='max-w-2xl mx-auto p-6'>
      <h1 className='text-center text-5xl font-bold mb-8'>SkillExchange Requests</h1>

      <Tabs defaultValue='received' className='w-full'>
        <TabsList className='grid grid-cols-2 mb-6 h-14 w-full'>
          <TabsTrigger value='received' className='text-xl cursor-pointer'>Received</TabsTrigger>
          <TabsTrigger value='sent' className='text-xl cursor-pointer'>Sent</TabsTrigger>
        </TabsList>

        {/* --- Filter Section --- */}
        <div className='flex gap-4 px-2 pb-6 items-center border-b mb-6'>
          <span className="font-semibold">Filter Status:</span>
          <div className='flex gap-4'>
            {filters.map(filter => (
              <div className='flex gap-2 items-center' key={filter}>
                <input
                  type='checkbox'
                  id={`filter-${filter}`}
                  className="cursor-pointer"
                  checked={selectedFilters.includes(filter)}
                  onChange={() => onToggleFilter(filter)}
                />
                <Label htmlFor={`filter-${filter}`} className="cursor-pointer">{filter}</Label>
              </div>
            ))}
          </div>
        </div>

        {/* --- Received Content --- */}
        <TabsContent value='received' className="space-y-4">
          {receivedLoading ? (
            <Loader2 className='h-10 w-10 animate-spin mx-auto' />
          ) : filteredReceived.length === 0 ? (
            <p className='text-center text-muted-foreground py-10'>No received requests matching filters.</p>
          ) : (
            filteredReceived.map(req => (
              <ReceivedReqCard
                key={req.id}
                req={req}
                onAction={handleActionUpdate}
              />
            ))
          )}
        </TabsContent>

        {/* --- Sent Content --- */}
        <TabsContent value='sent' className="space-y-4">
          {sentLoading ? (
            <Loader2 className='h-10 w-10 animate-spin mx-auto' />
          ) : filteredSent.length === 0 ? (
            <p className='text-center text-muted-foreground py-10'>No sent requests found.</p>
          ) : (
            filteredSent.map(req => (
              <SentReqCard key={req.id} req={req} />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SkillExchangeRequests;