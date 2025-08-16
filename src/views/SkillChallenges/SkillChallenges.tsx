import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const challenges = [
  {
    title: 'Guitar Challenge',
    skill: 'Music',
    timeRemaining: '5 Days',
    participants: 10,
  },
  {
    title: 'Web Development Bootcamp',
    skill: 'Coding',
    timeRemaining: '2 Weeks',
    participants: 25,
  },
  {
    title: 'Painting Masterclass',
    skill: 'Painting',
    timeRemaining: '1 Month',
    participants: 5,
  },
];

const activeChallenges = [
  {
    title: 'Guitar Challenge',
    skill: 'Music',
    timeRemaining: '5 Days',
  },
  {
    title: 'Web Development Bootcamp',
    skill: 'Coding',
    timeRemaining: '2 Weeks',
  },
  {
    title: 'Photography Challenge',
    skill: 'Photography',
    timeRemaining: '1 Week',
  },
];

export default function SkillChallenges() {
  return (
    <div className='p-6'>
      <div className='text-center mb-6'>
        <h1 className='text-2xl font-bold text-blue-700'>
          Join Skill Challenges!
        </h1>
        <p className='text-sm text-gray-500'>
          Participate in community challenges and enhance your skills!
        </p>
      </div>

      <div className='flex flex-wrap gap-4 justify-center mt-6'>
        <Select>
          <SelectTrigger className='w-[150px]'>
            <SelectValue placeholder='Filter by Skill' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='music'>Music</SelectItem>
            <SelectItem value='coding'>Coding</SelectItem>
            <SelectItem value='painting'>Painting</SelectItem>
          </SelectContent>
        </Select>

        <Select>
          <SelectTrigger className='w-[150px]'>
            <SelectValue placeholder='Duration' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='short'>Short</SelectItem>
            <SelectItem value='medium'>Medium</SelectItem>
            <SelectItem value='long'>Long</SelectItem>
          </SelectContent>
        </Select>

        <Select>
          <SelectTrigger className='w-[150px]'>
            <SelectValue placeholder='Popularity' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='most'>Most Popular</SelectItem>
            <SelectItem value='least'>Least Popular</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Challenge Cards */}
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6'>
        {challenges.map((challenge, index) => (
          <Card key={index}>
            <CardContent className='p-4 space-y-2'>
              <h2 className='text-lg font-semibold'>{challenge.title}</h2>
              <p className='text-sm'>Skill: {challenge.skill}</p>
              <p className='text-sm'>
                Time Remaining: {challenge.timeRemaining}
              </p>
              <p className='text-sm'>Participants: {challenge.participants}</p>
              <Button className='mt-2 cursor-pointer'>Join Now</Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Active Challenges */}
      <div className='mt-10'>
        <h2 className='text-xl font-semibold mb-4 text-center'>
          My Active Challenges
        </h2>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
          {activeChallenges.map((challenge, index) => (
            <Card key={index}>
              <CardContent className='p-4 space-y-2'>
                <h3 className='font-semibold'>{challenge.title}</h3>
                <p className='text-sm'>Skill: {challenge.skill}</p>
                <p className='text-sm'>
                  Time Remaining: {challenge.timeRemaining}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
