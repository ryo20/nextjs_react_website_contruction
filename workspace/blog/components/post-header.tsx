import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClock } from '@fortawesome/free-regular-svg-icons'
import ConvertDate from 'components/convert-date'

export default function PostHeader({ title, subtitle, publish = "" }:
  { title: string, subtitle: string, publish: string }) {
  return (
    <div className="py-9 px-0">
      <p className="text-xl font-bold">{subtitle}</p>
      <h1 className='text-6xl font-bold'>{title}</h1>
      {publish && (
        <div className='text-gray-500'>
          <FontAwesomeIcon icon={faClock} size="lg" color="#aaaaaa" />
          <ConvertDate dateISO={publish} />
        </div>)}
    </div>
  )
}