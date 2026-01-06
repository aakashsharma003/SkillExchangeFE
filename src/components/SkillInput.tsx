import { useState } from "react"

import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command"
import { Loader2 } from "lucide-react"

import { useSkillsOptions } from "@/hooks/use-skills-options"

type SkillInputProps = {
  skills: string[]
  addSkill: (value: string) => void
  removeSkill: (value: string) => void
}

/**
 * Multi-select wrapper around the shared skills autocomplete.
 *
 * Uses `useSkillsOptions` so the source of truth for available skills
 * lives in one place and is automatically filtered to avoid already-selected
 * entries.
 */
export default function SkillInput({ skills, addSkill, removeSkill }: SkillInputProps) {
  const { skills: availableSkills, loading } = useSkillsOptions(skills)

  const [skillInput, setSkillInput] = useState("")
  const [open, setOpen] = useState(false)

  return (
    <div>
      <label className="mb-1 block text-sm font-medium">Skills</label>

      <div className="mb-2 flex gap-2">
        <Command className="mb-2 rounded-md border">
          <CommandInput
            placeholder="Search skills..."
            value={skillInput}
            onValueChange={(val: string) => {
              setSkillInput(val)
              if (val === "") setOpen(false)
              else if (!open) setOpen(true)
            }}
            onFocus={() => setOpen(true)}
          />

          {open &&
            (loading ? (
              <Loader2 className="mx-auto my-2 h-6 w-6 animate-spin" />
            ) : (
              <>
                {skillInput !== "" && (
                  <CommandEmpty className="py-2 text-center">no results found</CommandEmpty>
                )}
                <CommandList>
                  {availableSkills.map((skill, index) => (
                    <CommandItem
                      key={index}
                      className="cursor-pointer border rounded-none"
                      onSelect={() => {
                        addSkill(skill)
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

      <div className="flex flex-wrap gap-2">
        {skills.map((skill, index) => (
          <div
            key={index}
            className="flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700"
          >
            {skill}
            <button
              type="button"
              onClick={() => {
                removeSkill(skill)
              }}
              className="ml-2 cursor-pointer text-lg font-bold text-blue-500 hover:text-red-500"
            >
              x
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
