import { useEffect, useState } from "react"

import { useConfig } from "@/context/config/ConfigContext"

/**
 * Shared hook to read the skills list from the global config.
 *
 * - Keeps all components using skills in sync.
 * - Centralises the `ConfigContext` wiring so UI components stay focused on rendering.
 *
 * You can optionally pass a list of skills to exclude (for example the ones
 * the user has already selected).
 */
export function useSkillsOptions(exclude: string[] = []) {
  const { config, loading } = useConfig()

  const [skills, setSkills] = useState<string[]>([])

  useEffect(() => {
    // Filter skills coming from the config so we never show duplicates
    // or already-selected values in the autocomplete.
    const next = config.skills.filter((skill) => !exclude.includes(skill))
    setSkills(next)
    // We only care about changes in the underlying skills array or the
    // exclusion list, not object identity.
  }, [config.skills, exclude.join(",")])

  return { skills, loading }
}


