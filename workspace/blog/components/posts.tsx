import Link from "next/link"
import Image from "next/legacy/image"
export default function Posts({ posts }: {
  posts: { title: string, slug: string, eyecatch: { url: string, height: number, width: number } }[]
}) {
  return (
    <div className="grid grid-cols-2 gap-2 mt-2 mb-8">
      {posts.map(({ title, slug, eyecatch }) => (
        <div key={slug}>
          <article>
            <Link href={`/blog/${slug}`} className="font-bold">
              <figure className="relative aspect-video">
                <Image
                  src={eyecatch.url}
                  alt=""
                  layout="fill"
                  objectFit="cover"
                  sizes="(min-width: 1152px) 576px, 50vw"
                  width={eyecatch.width}
                  height={eyecatch.height}
                />
              </figure>
              {title}
            </Link>
          </article>
        </div>
      ))}
    </div>)
}