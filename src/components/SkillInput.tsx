import { useState } from "react"
import { Input } from "./ui/input"

type SkillInputProps = {
  skills: string[]
  addSkill: (value: string) => void
  removeSkill: (value: string) => void
  label?: string
}

/**
 * Direct text input for skills.
 * Users can type any skill they have or want to learn and add it directly.
 * No autocomplete or search - just free text input.
 */
export default function SkillInput({ skills, addSkill, removeSkill, label = "Skills" }: SkillInputProps) {
  const [skillInput, setSkillInput] = useState("")

  const handleAddSkill = () => {
    const trimmedSkill = skillInput.trim()
    if (!trimmedSkill) return
    
    // Check if skill already exists
    if (skills.some(s => s.toLowerCase() === trimmedSkill.toLowerCase())) {
      setSkillInput("")
      return
    }
    
    addSkill(trimmedSkill)
    setSkillInput("")
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAddSkill()
    }
  }

  return (
    <div>
      <label className="mb-2 block text-sm font-medium">{label}</label>

      <div className="flex gap-2 mb-3">
        <Input
          placeholder={`Enter a ${label.toLowerCase()}...`}
          value={skillInput}
          onChange={(e) => setSkillInput(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1"
        />
        <button
          type="button"
          onClick={handleAddSkill}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
        >
          Add
        </button>
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
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
