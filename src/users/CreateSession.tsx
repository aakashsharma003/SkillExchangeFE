import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const ScheduleSkillexchangeSession = () => {
  const [selectedTime, setSelectedTime] = useState<string>('');

  const timeSlots = ['10:00 AM', '1:00 PM', '3:00 PM'];

  return (
    <div className="w-full max-w-7xl mx-auto p-10 space-y-8">
      <h1 className="text-3xl font-bold">Schedule a Skill exchange Session</h1>
      <p className="text-lg">Select an available time slot and send invites to your skill exchange partner.</p>

      {/* Select Date and Time */}
      <Card>
        <CardContent className="p-8">
          <h2 className="text-xl font-semibold mb-6">Select Date and Time</h2>
          <div className="flex gap-10">
            <div className="flex flex-col gap-4 w-1/2">
              <Input placeholder="Select Date" type="date" />
              {timeSlots.map((time) => (
                <Button
                  key={time}
                  variant={selectedTime === time ? 'default' : 'secondary'}
                  onClick={() => setSelectedTime(time)}
                  className="w-full"
                >
                  {time}
                </Button>
              ))}
            </div>
            <div className="flex-1 p-6 bg-gray-100 rounded-xl">
              <p className="font-medium text-lg">Selected Time Slot</p>
              <p className="text-gray-600 mt-4 text-md">{selectedTime || 'No time slot selected yet.'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Session Details */}
      <Card>
        <CardContent className="p-8">
          <h2 className="text-xl font-semibold mb-6">Session Details</h2>
          <div className="space-y-6">
            <Input placeholder="Enter session title" />
            <Textarea placeholder="Enter session description" rows={4} />
          </div>
        </CardContent>
      </Card>

      {/* Send Invites */}
      <Card>
        <CardContent className="p-8">
          <h2 className="text-xl font-semibold mb-6">Send Invites</h2>
          <div className="flex gap-6">
            <Input placeholder="Enter email address" className="flex-1" />
            <Button>Send Invite</Button>
          </div>
        </CardContent>
      </Card>

      {/* Confirmation */}
      <Card>
        <CardContent className="p-8">
          <h2 className="text-xl font-semibold mb-6">Confirmation</h2>
          <p className="text-md">Once the invite is sent, you will receive a confirmation email with the session details.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ScheduleSkillexchangeSession;