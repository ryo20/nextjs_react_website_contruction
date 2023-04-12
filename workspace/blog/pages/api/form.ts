// ref:フォーム作成 https://nextjs.org/docs/guides/building-forms
// ref:検索クエリ https://fits.hatenablog.com/entry/2018/12/10/004155
// https://www.mongodb.com/docs/manual/reference/operator/query/or/
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import clientPromise, { Armor, Skill } from "lib/mongodb";

type Data = {
  data: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  // 検索対象スキルの確認
  const body = JSON.parse(JSON.stringify(req.body))
  const query = Object.getOwnPropertyNames(body).map((name) => { return { "skills.name": `${name}` } })
  console.log(query)
  // db検索
  const client = await clientPromise;
  const db = client.db("mhrsb");
  let armors = await db.collection("sample_armors").find({
    $or: query
  }).limit(10).toArray()

  // TODO:装備組み合わせの検索
  armors = JSON.parse(JSON.stringify(armors))
  // console.log(armors)
  res.json({ data: JSON.stringify(armors) })
}

// FIXME:any型の置き換え
/** 装備の組み合わせを探索する */
function explore_armor_set(armors: Armor[], body: any) {
  // 対象スキルの名前とそのレベルを取得
  // 対象スキルの重みを取得（skill.slot）
  // 装備にスコアリング(score = sum(skill.slot * armor.skill.level) + defense/1000)
  // 各部位
}