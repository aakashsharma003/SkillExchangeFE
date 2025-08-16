import { useEffect, useState } from 'react';
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from '../../components/ui/command';
import { useConfig } from '@/context/config/ConfigContext';
import { Loader2 } from 'lucide-react';

export default function FindSkillInput({ onSelect }: any) {
  const { config, loading: configLoading } = useConfig();

  const [skillInput, setSkillInput] = useState('');
  const [open, setOpen] = useState(false);

  const [allSkills, setAllSkills] = useState(config.skills);
  useEffect(() => {
    setAllSkills(config.skills);
  }, [config.skills.length]);

  return (
    <div className='flex gap-2 mb-2'>
      <Command className='border rounded-md mb-2 relative overflow-visible'>
        <CommandInput
          placeholder='Search skills...'
          value={skillInput}
          onValueChange={(val: string) => {
            setSkillInput(val);
            if (val === '') setOpen(false);
            else if (!open) setOpen(true);
          }}
          onFocus={() => setOpen(true)}
        />

        {open &&
          (configLoading ? (
            <Loader2 className='h-6 w-6 animate-spin mx-auto my-2' />
          ) : (
            <>
              {skillInput !== '' && (
                <CommandEmpty className='py-2 text-center'>
                  no results found
                </CommandEmpty>
              )}
              <CommandList className='absolute w-full bg-white top-8 rounded-sm'>
                {allSkills.map((skill, index) => (
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
          ))}
      </Command>
    </div>
  );
}
