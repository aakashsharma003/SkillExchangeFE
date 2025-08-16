import { useEffect, useState } from 'react';
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from './ui/command';
import { useConfig } from '@/context/config/ConfigContext';
import { Loader2 } from 'lucide-react';

export default function SkillInput({ skills, addSkill, removeSkill }: any) {
  const { config, loading: configLoading } = useConfig();

  const [skillInput, setSkillInput] = useState('');
  const [open, setOpen] = useState(false);

  const [allSkills, setAllSkills] = useState(config.skills);
  useEffect(() => {
    setAllSkills(config.skills.filter(skill => !skills.includes(skill)));
  }, [config.skills.length]);

  return (
    <div>
      <label className='block mb-1 text-sm font-medium'>Skills</label>

      <div className='flex gap-2 mb-2'>
        <Command className='border rounded-md mb-2'>
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
                <CommandList>
                  {allSkills.map((skill, index) => (
                    <CommandItem
                      key={index}
                      className='cursor-pointer border rounded-none'
                      onSelect={() => {
                        addSkill(skill);
                        setAllSkills(allSkills.filter(val => skill !== val));
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

      <div className='flex flex-wrap gap-2'>
        {skills.map((skill: any, index: any) => (
          <div
            key={index}
            className='flex items-center bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm'
          >
            {skill}
            <button
              type='button'
              onClick={() => {
                removeSkill(skill);
                setAllSkills(prev => [...prev, skill]);
              }}
              className='cursor-pointer text-lg ml-2 text-blue-500 hover:text-red-500 font-bold'
            >
              x
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
