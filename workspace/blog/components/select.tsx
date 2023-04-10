import { Skill } from "lib/mongodb"
import { useState, ChangeEvent } from "react"

export default function Select({ skill }:
  { skill: Skill }) {
  const [value, setValue] = useState("0")
  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setValue(e.target.value)
  }
  const levels = [0].concat([...Array(skill.max_level)].map((_, i) => i + 1))

  return (
    <>
      <div className="form-control w-full max-w-x border-2 border-gray-200">
        <label className="label">
          <span className="label-text">{skill.name}</span>
        </label>
        <select id={skill.name} className="select select-primary w-full" onChange={handleChange}>
          {levels.map((level) => <option value={level} key={level}>lv.{level}</option>)}
        </select>
      </div>
    </>
  )
}