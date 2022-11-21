import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircleChevronDown, faCircleChevronUp } from "@fortawesome/free-solid-svg-icons"
import { useState, useRef } from "react"

export default function Accordion({ heading, children }: { heading: any, children: any }) {
  const [textIsOpen, setTextIsOpen] = useState(false)

  const toggleText = () => {
    setTextIsOpen((prev) => !prev)
  }

  const refText = useRef(null)

  const childrenClassName = textIsOpen
    ? "overflow-hidden h-auto transition-all duration-200"
    : "overflow-hidden h-0 transition-all duration-200"

  return (
    <div className="border border-gray-200 mt-4">
      <div className={"p-4 flex justify-between"}>
        <h3 className="font-semibold">
          <button onClick={toggleText}>
            {heading}
          </button>
        </h3>
        <button onClick={toggleText}>
          <FontAwesomeIcon icon={textIsOpen ? faCircleChevronUp : faCircleChevronDown} />
        </button>
      </div>
      <div className={childrenClassName}>
        <div className="p-4">{children}</div>
      </div>
    </div>
  )
}