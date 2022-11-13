import { convert } from "html-to-text"

export function extractText(html: string, length = 80, more = "…") {
  const text: string = convert(html, {
    selectors: [
      { selector: "img", format: "skip" },
      { selector: "a", options: { ignoreHref: true } },
    ]
  })

  return text.slice(0, length) + more
}