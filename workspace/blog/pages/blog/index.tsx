import Container from "components/container"
import Hero from "components/hero"
import Meta from "components/meta"
import { getAllPosts } from "lib/api"
import Posts from "components/posts"
import { eyecatchLocal } from "lib/constants"

export default function Blog({ posts }: {
  posts: { title: string, slug: string, eyecatch: { url: string, height: number, width: number } }[]
}) {
  return (
    <Container>
      <Meta pageTitle="ブログ"
        pageDesc="ブログの記事一覧" />
      <Hero
        title="Blog"
        subtitle="Recent Posts"
        imageOn={false}
      />
      <Posts posts={posts} />
    </Container>
  )
}

export async function getStaticProps() {
  const posts = await getAllPosts()
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