import Header from "./header"
import Footer from "./footer"
import React from "react"

// childrenの型はどうすればいいかわからんかった
export default function Layout({ children }: any) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  )
}
