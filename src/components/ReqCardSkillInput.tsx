import { useState } from 'react';
import {
  Command,
  CommandEmpty,
  CommandItem,
  CommandList,
} from '../components/ui/command';
import { Command as CommandPrimitive } from 'cmdk';
import { cn } from '@/lib/utils';

export default function ReqCardSkillInput({ onSelect, allSkills }: any) {
  const [skillInput, setSkillInput] = useState('');
  const [open, setOpen] = useState(false);

  return (
    <div className='flex gap-2'>
      <Command className=' relative overflow-visible'>
        <div
          data-slot='command-input-wrapper'
          className='flex items-center gap-2 px-1 py-1 border-b'
        >
          <CommandPrimitive.Input
            data-slot='command-input'
            className={cn(
              'placeholder:text-muted-foreground flex w-full bg-transparent py-0 text-sm outline-hidden disabled:cursor-not-allowed disabled:opacity-50 ',
            )}
            placeholder='Search skills...'
            value={skillInput}
            onValueChange={(val: string) => {
              setSkillInput(val);
              if (val === '') setOpen(false);
              else if (!open) setOpen(true);
            }}
            onFocus={() => setOpen(true)}
          />
        </div>

        {open && (
          <>
            {skillInput !== '' && (
              <CommandEmpty className='py-2 text-center'>
                no results found
              </CommandEmpty>
            )}
            <CommandList className='absolute w-full bg-white top-8 rounded-sm'>
              {allSkills.map((skill: any, index: any) => (
                <CommandItem
                  key={index}
                  className='cursor-pointer border rounded-sm'
                  onSelect={() => {
                    onSelect(skill);
                    setSkillInput(skill);
                    setOpen(false);
                  }}
                >
                  {skill}
                </CommandItem>
              ))}
            </CommandList>
          </>
        )}
      </Command>
    </div>
  );
}
