import { getAllCategories, getAllPostsByCategory } from "lib/api"
import Container from "components/container"
import PostHeader from "components/post-header"
import Posts from "components/posts"
import { eyecatchLocal } from "lib/constants"
import Meta from "components/meta"

type Post = { title: string, slug: string, eyecatch: { url: string, height: number, width: number } }[]

export default function Category({ name, posts }: { name: string, posts: Post }) {
  return (
    <Container>
      <Meta pageTitle={name} pageDesc={`${name}に関する記事`} />
      <PostHeader title={name} subtitle="Blog Category" />
      <Posts posts={posts} />
    </Container>
  )
}

export async function getStaticPaths() {
  const allCats = await getAllCategories()
  return {
    paths: allCats.map(({ slug }: { slug: string }) => `/blog/category/${slug}`),
    fallback: false,
  }
}

// このあたりの型定義の方法は調べる
export async function getStaticProps(context: any) {
  const catSlug: string = context.params.slug

  const allCats = await getAllCategories()
  const cat = allCats.find(({ slug }: { slug: string }) => slug === catSlug)

  const posts = await getAllPostsByCategory(cat.id)

  for (const post of posts) {
    if (!Object.hasOwn(post, "eyecatch")) {
      post.eyecatch = eyecatchLocal
    }
  }

  return {
    props: {
      name: cat.name,
      posts: posts
    },
  }
}