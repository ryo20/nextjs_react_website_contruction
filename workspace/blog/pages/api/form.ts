// ref:フォーム作成 https://nextjs.org/docs/guides/building-forms
// ref:検索クエリ https://fits.hatenablog.com/entry/2018/12/10/004155
// https://www.mongodb.com/docs/manual/reference/operator/query/or/
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import clientPromise, { Armor, Skill, EquipmentType, ArmorSet } from "lib/mongodb";

type Data = {
  data: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  // 検索対象スキルの確認
  const req_body = JSON.parse(JSON.stringify(req.body))
  console.log(req_body)
  const query = Object.getOwnPropertyNames(req_body).map((name) => { return { "skills.name": `${name}` } })
  // db検索
  const client = await clientPromise;
  const db = client.db("mhrsb");
  let armors = await db.collection("sample_armors").find({
    // $or: query
    // }).limit(10).toArray() as Armor[]
  }).toArray() as Armor[]
  // FIXME:装備組み合わせの検索
  const results = await explore_armor_set(armors, req_body)
  // console.log(armors)
  // res.json({ data: JSON.stringify(armors) })
  res.json({ data: JSON.stringify(results) })
}


// TODO:any型の置き換え
/** 装備の組み合わせを探索する */
async function explore_armor_set(armors: Armor[], req_body: any) {
  const query = Object.getOwnPropertyNames(req_body).map((name) => { return { "name": `${name}` } })
  console.log(query)
  // db検索より対象スキルの重みを取得（skill.slot）
  const client = await clientPromise;
  const db = client.db("mhrsb");
  let req_skills = await db.collection("skills").find({
    $or: query
  }).toArray() as Skill[]
  req_skills.map((skill) => skill.request_level = Number(req_body[skill.name]))
  // console.log(skills)
  // 装備にスコアリング(score = sum(skill.slot * armor.skill.level) + defense/1000)
  armors.map((armor) => armor.score = calculate_armor_score(armor, req_skills))
  console.log(armors)
  // 部位ごとに上位を取得
  const head = extract_top_armors(armors, "head")
  const body = extract_top_armors(armors, "body")
  const arm = extract_top_armors(armors, "arm")
  const waist = extract_top_armors(armors, "waist")
  const leg = extract_top_armors(armors, "leg")
  // 組み合わせを総当たりする
  let armor_sets: ArmorSet[] = []
  const candidate_sets = product([head, body, arm, waist, leg])

  // TODO:反復回数の設定をユーザーから受け取る
  const max_iteration = 1000
  // FIXME:探索回数上限まで以下を繰り返す
  // スキルレベルと防御力の合計算出
  // スキルレベル補正
  // 要求スキルと突合し、スコア及び達成できているか判定
  // 結果に追加
  for (let i = 0; i < max_iteration; i++) {
    // armor_sets.push(evaluate_armor_set(convert_to_armor_set(candidate_sets[i]), req_skills))
    convert_to_armor_set(candidate_sets[i])
    break;
  }


  // 探索回数上限に達したら、要求を達成できているか>スコア総和降順という２段階のソートの上、組み合わせを返却する
  return head
}

function evaluate_armor_set(candidate_set: ArmorSet, req_skills: Skill[]) {
  let results = candidate_set
  return candidate_set
}

/**
 * 指定部位のスコア上位から指定件数の装備を取得する
 * @param armors 検索対象装備
 * @param equipment_type 抽出する装備部位
 * @param limit 取得件数（default=10）
 * @returns 抽出した装備の配列（スコア降順）
 */
function extract_top_armors(armors: Armor[], equipment_type: EquipmentType, limit: number = 2): Armor[] {
  // deep copyの作成：https://zenn.dev/kata_n/articles/87e7b3d644c6cc
  const armors_copy = JSON.parse(JSON.stringify(armors)) as Armor[]
  const results = armors_copy.filter(function (armor, index) {
    if (armor.equipment_type === equipment_type) return true;
  }).sort(function (a, b) {
    return (a.score! < b.score!) ? 1 : -1  // スコア降順ソート
  }).slice(0, limit)
  return results
}

/**
 * 装備にスコアリング(score = sum(skill.slot * armor.skill.level) + defense/1000 + sum(slots))
 * @param armor スコア付与対象の装備
 * @param skills 要求スキルセット
 * @returns armorに対するskillsに基づくスコア
 */
function calculate_armor_score(armor: Armor, skills: Skill[]): number {
  // TODO:この関数のテストを書いてみる
  let score = armor.defense / 1000
  score += armor.slots.reduce((accumulator, current_value) => accumulator + current_value)
  for (let armor_skill of armor.skills) {
    for (let req_skill of skills) {
      if (armor_skill.name === req_skill.name) {
        score += req_skill.slot * armor_skill.level
      }
    }
  }
  return score
}


function is2dArray(arg: any): boolean {
  if (Array.isArray(arg) && arg.length > 0 && arg.every(Array.isArray)) {
    return true;
  } else {
    return false;
  }
}

/** 配列のデカルト積(ref:https://cyanatlas.hatenablog.com/entry/2021/12/06/203028#TypeScript%E3%81%A7%E6%9B%B8%E3%81%8F)
 * usage
 * const x = [1, 2, 3];
 * const y = [4, 5];
 * console.log(product([x, y]));
*/
export function product<T>(array2d: T[][]): T[][] {
  if (!is2dArray(array2d)) {
    throw new RangeError("Invalid argument");
  }
  if (array2d.length === 0) {
    return [[]];
  } else {
    const head: T[] = array2d[0];
    const tail: T[][] = array2d.slice(1);
    const productTail: T[][] = tail.length === 0 ? [[]] : product(tail);
    return head
      .map((ahead) => productTail.map((atail) => [ahead].concat(atail)))
      .flat(1);
  }
}

// FIXME:実装する
/**
 * 受け取った装備をArmorSet型に変換する
 * @param armors 装備の配列
 * @return ArmorSet
 */
function convert_to_armor_set(armors: Armor[]): void {
  const head = armors.filter((armor) => armor.equipment_type === "head")[0]
  console.log(head)

  // let armor_set = {
  //   head:
  // }
}