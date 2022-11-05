import Nav from "components/nav";
import Container from "components//container";

export default function Header() {
  return (
    <header className="bg-teal-500">
      {/* <Logo /> */}
      <Container>
        <Nav />
      </Container>
    </header>
  )
}