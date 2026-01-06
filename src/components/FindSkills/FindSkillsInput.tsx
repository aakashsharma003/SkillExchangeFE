import { useState } from "react"

import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "../../components/ui/command"
import { Loader2 } from "lucide-react"

import { useSkillsOptions } from "@/hooks/use-skills-options"

/**
 * Single-skill autocomplete used on the Find Skills page.
 *
 * This component is intentionally "dumb" – it only handles the UX around
 * searching and selecting a value, while the source of truth for which
 * skills exist lives in `ConfigContext` via `useSkillsOptions`.
 */
export default function FindSkillInput({ onSelect }: { onSelect: (value: string) => void }) {
  const { skills, loading } = useSkillsOptions()

  const [skillInput, setSkillInput] = useState("")
  const [open, setOpen] = useState(false)

  return (
    <div className="mb-2 flex gap-2">
      <Command className="relative mb-2 overflow-visible rounded-md border">
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
              <CommandList className="absolute top-8 w-full rounded-sm bg-white">
                {skills.map((skill, index) => (
                  <CommandItem
                    key={index}
                    className="cursor-pointer border rounded-sm"
                    onSelect={() => {
                      onSelect(skill)
                      setSkillInput(skill)
                      setOpen(false)
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
  )
}
