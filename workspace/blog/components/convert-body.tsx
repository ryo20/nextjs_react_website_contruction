import parse, { domToReact } from "html-react-parser"
import Image from "next/image"
import { Element } from 'domhandler/lib/node'
// import { ReactNode } from "react";

// interface node {
//   name: string;
// }

export default function ConvertBody({ contentHTML }: { contentHTML: string }) {
  const contentReact = parse(contentHTML, {
    replace: (node) => {
      const domelement: Element = node as Element;
      if (domelement.name === "img") {
        const { src, alt, width, height } = domelement.attribs
        return (
          <Image
            layout="responsive"
            src={src}
            width={parseInt(width)}
            height={parseInt(height)}
            alt={alt}
            sizes="(min-width: 768px) 768px, 100vw"
          />
        )
      }
      if (domelement.name === "span") {
        return (
          <span className="font-bold text-3xl">{domToReact(domelement.children)}</span>
        )
      }
    }
  })
  return <>{contentReact}</>
}