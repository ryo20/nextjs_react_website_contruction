import Container from "components/container"
import Hero from "components/hero"
import Meta from "components/meta"
import Posts from "components/posts"
import Pagination from "components/pagination"
import { getAllPosts } from "lib/api"
import { getPlaiceholder } from "plaiceholder"
import { eyecatchLocal } from "lib/constants"

export default function Home({ posts }: {
  posts: { title: string, slug: string, eyecatch: { url: string, height: number, width: number } }[]
}) {
  return (
    <Container>
      <Meta />
      <Hero
        title="CUBE"
        subtitle="アウトプットしていくサイト"
        imageOn={true}
      />
      <Posts posts={posts} />
      <Pagination nextUrl="/blog" nextText="More Posts" />
    </Container>
  )
}

export async function getStaticProps() {
  const posts = await getAllPosts(4)
  for (const post of posts) {
    if (!Object.hasOwn(post, "eyecatch")) {
      post.eyecatch = eyecatchLocal
    }
  }
  return {
    props: {
      posts: posts,
    }
  }
}