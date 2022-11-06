import Head from "next/head"
import Container from "components/container"
import Hero from "components/hero"
import Image from "next/image"
import eyecatch from "images/about.jpg"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faTwitter,
  faGithub
} from '@fortawesome/free-brands-svg-icons'

export default function About() {
  return (
    <Container>
      <Hero
        title="About"
        subtitle="About development activities"
        imageOn={false}
      />
      <figure className="duration-200">
        <Image src={eyecatch} alt="" layout="responsive" sizes="(min-width: 1152px) 1152px, 100vw"
          placeholder="blur" />
      </figure>
      <div className="flex flex-col md:flex-row md:justify-between gap-12 mt-12 mb-20 mx-0">
        <div className="w-[768px] max-w-full">
          <p className="text-base">
            Cubeが得意とする分野はモノづくりです。3次元から2次元の造形、プログラミングやデザインなど、さまざまな技術を組み合わせることによって社会や環境と結びつけるクリエイティブを提案し続けています。
          </p>
          <h2 className="text-xl font-bold pt-4">モノづくりで目指していること</h2>
          <p>
            モノづくりではデータの解析からクリエイティブまで幅広いことを担当しています。新しいことを取り入れながら、ユーザーにマッチした提案を実現するのが目標です。たくさんの開発・提供が数多くありますが、特にそこを磨く作業に力を入れています。
          </p>
          <p className="pt-1">
            単純に形にするだけでなく、作る過程や、なぜそのようにしたのかを大事にしながらものづくりをしています。毎回課題解決テーマをもって「モノ」と向き合い制作をし、フィードバックしてもらうことで自分の中にあるモヤモヤを言葉にして「問い」への答えを出しています。
          </p>
          <h3 className="text-lg font-bold pt-2">新しいことへのチャレンジ</h3>
          <p>
            今までと違うものを作ることで愛着が湧いてきます。そこで興味を持ったことは小さなことでもいいから取り入れて、良いものを作れるようにしています。小さなヒントから新しいものを生み出すようなモノづくりは、これからも続けていきたいです。
          </p>
        </div>
        <div className="mt-1 w-[240px] max-w-full text-right sticky top-10 self-start text">
          <h3 className="text-lg font-bold">Contact</h3>
          <ul className="flex justify-end gap-6 text-3xl ">
            <li>
              <a href="https://twitter.com/">
                <FontAwesomeIcon icon={faTwitter} />
                <span className="sr-only">Twitter</span>
              </a>
            </li>
            <li>
              <a href="https://github.com/">
                <FontAwesomeIcon icon={faGithub} />
                <span className="sr-only">GitHub</span>
              </a>
            </li>
          </ul>
          <address>cube@webmail.address</address>
        </div>
      </div>
    </Container>
  )
}
