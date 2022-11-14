import { getPostBySlug, getAllSlugs } from "lib/api"
import Container from "components/container"
import PostHeader from "components/post-header"
import Image from "next/image"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFolderOpen } from '@fortawesome/free-regular-svg-icons'
import ConvertBody from "components/convert-body"
import Link from "next/link"
import Meta from "components/meta"
import { extractText } from "lib/extract-text"
import { eyecatchLocal } from "lib/constants"
import { prevNextPost } from "lib/prev-next-post"
import Pagination from "components/pagination"

export default function Post({
  title,
  publish,
  content,
  eyecatch,
  categories,
  description,
  prevPost,
  nextPost
}: {
  title: string,
  publish: string,
  content: string,
  eyecatch: { url: string, height: number, width: number },
  categories: { name: string, slug: string }[],
  description: string,
  prevPost: { title: string, slug: string },
  nextPost: { title: string, slug: string },
}) {
  return (
    <Container>
      <Meta
        pageTitle={title}
        pageDesc={description}
        pageImg={eyecatch.url}
        pageImgW={eyecatch.width}
        pageImgH={eyecatch.height}
      />
      <article>
        <PostHeader title={title} subtitle="Blog Article" publish={publish} />

        <figure>
          {/* nextjs 13で変更があったのでエラー出るかも */}
          <Image
            src={eyecatch.url}
            alt=""
            layout="responsive"
            width={eyecatch.width}
            height={eyecatch.height}
            sizes="(min-width: 1152px) 1152px, 100vw"
            priority
          />
        </figure>

        <div className="flex flex-col md:flex-row md:justify-between gap-12 mt-12 mb-20 mx-0">
          <div className="w-[768px] max-w-full">
            <ConvertBody contentHTML={content} />
          </div>
          <div className="mt-1 w-[240px] max-w-full text-right sticky top-10 self-start text">
            <FontAwesomeIcon icon={faFolderOpen} />
            <ul className="flex md:flex-col justify-end text-base gap-1">
              {categories.map(({ name, slug }) => (
                <li key={slug}>
                  <Link href={`/blog/category/${slug}`}>{name}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <Pagination
          prevText={prevPost.title}
          prevUrl={`/blog/${prevPost.slug}`}
          nextText={nextPost.title}
          nextUrl={`/blog/${nextPost.slug}`}
        />
      </article>

    </Container>
  )
}

export async function getStaticPaths() {
  const allSlugs = await getAllSlugs()
  return {
    paths: allSlugs.map(({ slug }: { slug: string }) => `/blog/${slug}`),
    fallback: false,
  }
}

// このあたりの型定義の方法は調べる
export async function getStaticProps(context: any) {
  const slug = context.params.slug
  const post = await getPostBySlug(slug)
  const description = extractText(post.content)
  const eyecatch = post.eyecatch ?? eyecatchLocal

  const allSlugs = await getAllSlugs()
  const [prevPost, nextPost] = prevNextPost(allSlugs, slug)

  return {
    props: {
      title: post.title,
      publish: post.publishDate,
      content: post.content,
      eyecatch: eyecatch,
      categories: post.categories,
      description: description,
      prevPost: prevPost,
      nextPost: nextPost,
    },
  }
}