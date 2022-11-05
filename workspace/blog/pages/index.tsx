import Container from "components/container"
import Hero from "components/hero"

export default function Home() {
  return (
    <Container>
      <Hero
        title="CUBE"
        subtitle="会うトップっとしていくサイト"
        imageOn={true}
      />
    </Container>
  )
}
