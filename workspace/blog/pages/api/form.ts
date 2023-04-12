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
  console.log(body)
  const query = Object.getOwnPropertyNames(body).map((name) => { return { "skills.name": `${name}` } })
  console.log(query)
  // db検索
  const client = await clientPromise;
  const db = client.db("mhrsb");
  let armors = await db.collection("sample_armors").find({
    $or: query
  }).limit(10).toArray() as Armor[]

  // TODO:装備組み合わせの検索
  explore_armor_set(armors, body)
  armors = JSON.parse(JSON.stringify(armors))
  // console.log(armors)
  res.json({ data: JSON.stringify(armors) })
}

// FIXME:any型の置き換え
/** 装備の組み合わせを探索する */
async function explore_armor_set(armors: Armor[], body: any) {
  const query = Object.getOwnPropertyNames(body).map((name) => { return { "name": `${name}` } })
  console.log(query)
  // db検索より対象スキルの重みを取得（skill.slot）
  const client = await clientPromise;
  const db = client.db("mhrsb");
  let skills = await db.collection("skills").find({
    $or: query
  }).toArray() as Skill[]
  skills.map((skill) => skill.request_level = Number(body[skill.name]))
  armors.map((armor) => armor.score = calculate_armor_score(armor, skills))
  // console.log(skills)
  console.log(armors)
  // 装備にスコアリング(score = sum(skill.slot * armor.skill.level) + defense/1000)

  // 各部位のスコア上位から組み合わせを探索する
  // 探索回数上限に達したら、要求を達成できているか>スコア総和降順という２段階のソートの上、組み合わせを返却する
}

/**
 *
 * @param armor スコア付与対象の装備
 * @param skills 要求スキルセット
 * @returns armorに対するskillsに基づくスコア
 */
function calculate_armor_score(armor: Armor, skills: Skill[]): number {
  let score = 0
  return score
}