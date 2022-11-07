import { getPostBySlug } from "lib/api"
import Container from "components/container"

export default function Schedule({
  title,
  publish,
  content,
  eyecatch,
  categories,
}: {
  title: string,
  publish: string,
  content: string,
  eyecatch: string,
  categories: string,
}) {
  return (
    <Container>
      <h1 className="text-4xl font-bold">{title}</h1>
    </Container>
  )
}

export async function getStaticProps() {
  const slug = "schedule"
  const post = await getPostBySlug(slug)

  return {
    props: {
      title: post.title,
      publish: post.publishDate,
      content: post.content,
      eyecatch: post.eyecatch,
      categories: post.categories,
    },
  }
}