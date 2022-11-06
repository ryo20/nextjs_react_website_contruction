import Head from "next/head"
import { useRouter } from "next/router"

// サイトに関する情報
import { siteMeta } from "lib/constants"

import siteImg from "images/ogp.jpg"

export default function Meta({ pageTitle = "", pageDesc = "", pageImg = "", pageImgH = 0, pageImgW = 0 }:
  { pageTitle?: string, pageDesc?: string, pageImg?: string, pageImgH?: number, pageImgW?: number }) {
  const title = pageTitle === "" ? siteMeta.siteTitle : `${pageTitle} | ${siteMeta.siteTitle}`
  const desc = pageDesc === "" ? siteMeta.siteDesc : pageDesc
  const router = useRouter()
  const url = `${siteMeta.siteUrl}${router.asPath}`

  const img = pageImg === "" ? siteImg.src : pageDesc
  const imgW = pageImgW === 0 ? siteImg.width.toString() : pageImgW.toString()
  const imgH = pageImgW === 0 ? siteImg.height.toString() : pageImgH.toString()
  const imgUrl = img.startsWith("https") ? img : `${siteMeta.siteUrl}${img}`

  return (
    <Head>
      <title>{title}</title>
      <meta property="og:title" content={title} />

      <meta name="description" content={desc} />
      <meta property="og:description" content={desc} />

      <link rel="canonical" href={url} />
      <meta property="og:url" content={url} />

      <meta property="og:site_name" content={siteMeta.siteTitle} />
      <meta property="og:type" content={siteMeta.siteType} />
      <meta property="og:locale" content={siteMeta.siteLocale} />

      <link rel="icon" href={siteMeta.siteIcon} />
      <link rel="apple-touch-icon" href={siteMeta.siteIcon} />

      <meta property="og:image" content={imgUrl} />
      <meta property="og:image:width" content={imgW} />
      <meta property="og:image:height" content={imgH} />
      <meta name="twitter:card" content="summary_large_image" />
    </Head>
  )
}