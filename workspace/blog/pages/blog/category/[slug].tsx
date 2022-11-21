import { getAllCategories } from "lib/api"
import Container from "components/container"
import PostHeader from "components/post-header"

export default function Category({ name }: { name: string }) {
  return (
    <Container>
      <PostHeader title={name} subtitle="Blog Category" />
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

  return {
    props: {
      name: cat.name,
    },
  }
}