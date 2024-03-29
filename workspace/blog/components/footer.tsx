import Link from "next/link"
import Container from "components/container"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faTwitter,
  faGithub
} from '@fortawesome/free-brands-svg-icons'

export default function Footer() {
  return (
    <footer className="text-center lg:text-left bg-teal-500">
      <Container>
        <div className="flex justify-center gap-2" >
          <div>
            <Link href="/" className="mt-4  text-teal-200 hover:text-white mr-4">
              Home
            </Link>
          </div>
          <div>
            <Link href="/about" className="mt-4  text-teal-200 hover:text-white mr-4">
              About
            </Link>
          </div>
          <div>
            <Link href="/blog" className="mt-4  text-teal-200 hover:text-white mr-4">
              Blog
            </Link>
          </div>
          <div>
            <Link href="/mongodb" className="mt-4  text-teal-200 hover:text-white mr-4">
              Mongodb
            </Link>
          </div>
          <div>
            <Link href="/skill_simulator" className="mt-4  text-teal-200 hover:text-white mr-4">
              Skill Sim
            </Link>
          </div>
        </div>
        <ul className="flex justify-center gap-6 text-2xl ">
          <li className='text-teal-200 hover:text-white'>
            <a href="https://twitter.com/">
              <FontAwesomeIcon icon={faTwitter} />
              <span className="sr-only">Twitter</span>
            </a>
          </li>
          <li className='text-teal-200 hover:text-white'>
            <a href="https://github.com/">
              <FontAwesomeIcon icon={faGithub} />
              <span className="sr-only">GitHub</span>
            </a>
          </li>
        </ul>
        <div className="flex justify-center flex-shrink-0 text-white bg-teal-500">
          <svg className="fill-current h-8 w-8 mr-2" width="54" height="54" viewBox="0 0 54 54" xmlns="http://www.w3.org/2000/svg"><path d="M13.5 22.1c1.8-7.2 6.3-10.8 13.5-10.8 10.8 0 12.15 8.1 17.55 9.45 3.6.9 6.75-.45 9.45-4.05-1.8 7.2-6.3 10.8-13.5 10.8-10.8 0-12.15-8.1-17.55-9.45-3.6-.9-6.75.45-9.45 4.05zM0 38.3c1.8-7.2 6.3-10.8 13.5-10.8 10.8 0 12.15 8.1 17.55 9.45 3.6.9 6.75-.45 9.45-4.05-1.8 7.2-6.3 10.8-13.5 10.8-10.8 0-12.15-8.1-17.55-9.45-3.6-.9-6.75.45-9.45 4.05z" /></svg>
          <span className="font-semibold text-xl tracking-tight">CUBE</span>
        </div>
      </Container>
    </footer >
  )
}
