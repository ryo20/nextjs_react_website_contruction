export default function Hero({ title, subtitle, imageOn }:
  { title: string, subtitle: string, imageOn: boolean }) {
  return (
    <div className="flex flex-col md:flex-row md:justify-between items-center text-center">
      <div className="text-black py-12">
        <h1 className="text-8xl font-sans font-bold tracking-widest">{title}</h1>
        <p className="text-base">{subtitle}</p>
      </div>
      {imageOn && <figure>[画像]</figure>}
    </div>
  )
}
