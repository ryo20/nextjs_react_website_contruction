import Link from "next/link"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons"

export default function Pagination({
  prevText = "",
  prevUrl = "",
  nextText = "",
  nextUrl = "",
}) {
  prevText = prevUrl === "/blog/" ? "一覧" : prevText
  nextText = nextUrl === "/blog/" ? "一覧" : nextText
  return (
    <ul className="flex flex-row justify-between">
      <li>
        <Link href={prevUrl}>
          <FontAwesomeIcon icon={faChevronLeft} className="text-gray-400" />
          <span>{prevText}</span></Link>
      </li>
      <li>
        <Link href={nextUrl}>
          <FontAwesomeIcon icon={faChevronRight} className="text-gray-400" />
          <span>{nextText}</span></Link>
      </li>
    </ul>
  )
}