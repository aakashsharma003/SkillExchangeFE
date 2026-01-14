import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

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
    <div className="mx-auto max-w-5xl space-y-10 p-6 md:p-8 lg:p-10">
      <div className="mb-4 text-center">
        <h1 className="text-2xl font-bold text-blue-700 md:text-3xl">
          Join Skill Challenges!
        </h1>
        <p className="mt-2 text-sm text-gray-500 md:text-base">
          Participate in community challenges and enhance your skills!
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap justify-center gap-4">
        <Select>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Filter by Skill" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="music">Music</SelectItem>
            <SelectItem value="coding">Coding</SelectItem>
            <SelectItem value="painting">Painting</SelectItem>
          </SelectContent>
        </Select>

        <Select>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Duration" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="short">Short</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="long">Long</SelectItem>
          </SelectContent>
        </Select>

        <Select>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Popularity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="most">Most Popular</SelectItem>
            <SelectItem value="least">Least Popular</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Challenge Cards */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Available Challenges</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {challenges.map((challenge, index) => (
            <Card key={index} className="shadow-sm">
              <CardContent className="space-y-2 p-4">
                <h3 className="text-lg font-semibold">{challenge.title}</h3>
                <p className="text-sm text-gray-700">Skill: {challenge.skill}</p>
                <p className="text-sm text-gray-700">
                  Time Remaining: {challenge.timeRemaining}
                </p>
                <p className="text-sm text-gray-700">
                  Participants: {challenge.participants}
                </p>
                <Button className="mt-2 cursor-pointer">Join Now</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Active Challenges */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-center">My Active Challenges</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {activeChallenges.map((challenge, index) => (
            <Card key={index} className="shadow-sm">
              <CardContent className="space-y-2 p-4">
                <h3 className="font-semibold">{challenge.title}</h3>
                <p className="text-sm text-gray-700">Skill: {challenge.skill}</p>
                <p className="text-sm text-gray-700">
                  Time Remaining: {challenge.timeRemaining}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}
