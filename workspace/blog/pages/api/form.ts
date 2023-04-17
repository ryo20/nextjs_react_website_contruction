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
  // console.log(req_body)
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
  // console.log(query)
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
  // console.log(armors)
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
  const max_iteration = Math.max(1000, candidate_sets.length)
  // FIXME:探索回数上限まで探索
  for (let i = 0; i < max_iteration; i++) {
    armor_sets.push(evaluate_armor_set(convert_to_armor_set(candidate_sets[i]), req_skills))
    // break;
  }
  // console.log(armor_sets)
  // 探索回数上限に達したら、要求を達成できているか>スコア総和降順という２段階のソートの上、組み合わせを返却する
  return armor_sets.sort((a, b) => b.score! - a.score!)
}

/**
 * 装備セットのスコアを評価する
 * @param candidate_set 評価する装備セット
 * @param req_skills 要求スキルセット
 * @returns candidate_set.scoreに算出結果の追加
 */
function evaluate_armor_set(candidate_set: ArmorSet, req_skills: Skill[]): ArmorSet {
  // 防御力の合計算出
  const defense_score = candidate_set.armor_array.reduce((sum, armor) => sum + armor.defense, 0) / 1000
  // スキルレベルの合計算出
  // Function to calculate skill level summation
  const get_skill_level_sum = (armor_array: Armor[], skill_name: string): number => {
    return armor_array
      .flatMap((armor) =>
        armor.skills.filter((skill) => skill.name === skill_name)
      )
      .reduce((sum, skill) => sum + skill.level, 0);
  };
  req_skills.map((req_skill) => {
    // スキルレベルの合計値算出
    req_skill.level = get_skill_level_sum(candidate_set.armor_array, req_skill.name)
    // 要求レベル超過を補正
    if (req_skill.level > req_skill.request_level!) {
      req_skill.level = req_skill.request_level
    }
  })
  // スコア及び達成できているか判定
  candidate_set.is_fulfill_request = req_skills.every((req_skill) => {
    return typeof req_skill.level === 'undefined' || typeof req_skill.request_level === 'undefined'
      ? false
      : req_skill.level >= req_skill.request_level
  })
  const skill_score = req_skills.reduce((acc, curr) => acc + curr.level! * curr.slot, 0)
  // TODO:装飾品の考慮
  // TODO:護石の考慮
  // 結果に追加
  candidate_set.score = defense_score + skill_score
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
function convert_to_armor_set(armors: Armor[]): ArmorSet {
  // TODO:装備箇所の重複チェックの追加

  let armor_set: ArmorSet = {
    head: armors.filter((armor) => armor.equipment_type === "head")[0],
    body: armors.filter((armor) => armor.equipment_type === "body")[0],
    arm: armors.filter((armor) => armor.equipment_type === "arm")[0],
    waist: armors.filter((armor) => armor.equipment_type === "waist")[0],
    leg: armors.filter((armor) => armor.equipment_type === "leg")[0],
    armor_array: armors
  }

  return armor_set
}