// 現状はmongodb/index.tsxのコピー
import clientPromise, { ArmorSet, Skill } from "lib/mongodb";
import { Armor } from "lib/mongodb";
import Container from "components/container"
import Hero from "components/hero"
import Select from "components/select";
import { FormEvent, useState } from "react";

// type SkillSet = {
//   value: string;
//   readonly id: number;
// };

export default function Home({ skills }: { skills: Skill[] }) {
  const [armor_sets, setArmorSets] = useState<ArmorSet[]>([]);
  const handleSubmit = async (event: FormEvent) => {
    // デフォルト動作の削除
    event.preventDefault()

    // form入力の取得
    const form = event.target as HTMLFormElement
    let data: any = {}
    for (let i = 0, len = form.elements.length; i < len; i++) {
      let element = form.elements[i] as HTMLInputElement
      if (element.id !== "" && Number(element.value) > 0) {
        data[element.id] = element.value
      }
    }

    // 入力を利用してAPIへリクエストを作成する
    const response = await fetch('/api/form', {
      // Body of the request is the JSON data we created above.
      body: JSON.stringify(data),
      // Tell the server we're sending JSON.
      headers: {
        'Content-Type': 'application/json',
      },
      // The method is POST because we are sending data.
      method: 'POST',
    })

    // APIからレスポンスを取得する
    const result = await response.json()
    const res_data = JSON.parse(result.data)
    // レスポンスをステートに反映する
    const newArmorSet: ArmorSet[] = res_data.map((sample: ArmorSet, index: number) => {
      return {
        ...sample,
        // id: new Date().getTime() // ダメ
        // id: index // 非推奨
        id: sample.armor_array.map((armor) => armor.name).join("")
      }
    })
    // 追加していく場合
    // setSkillSets([newSkillSet, ...skill_sets]);
    // 最新のみ利用する場合
    // FIXME:最新のみになってない
    setArmorSets(newArmorSet);
    // setArmorSets([newArmorSet[0]]);
  }
  return (
    <Container>
      <Hero
        title="MHRise Sunbreak スキルシミュレータ"
        subtitle="頑張る"
        imageOn={true}
      />
      <form className="w-full max-w-x" onSubmit={handleSubmit}>
        <div className="grid grid-cols-5 gap-2 mt-2 mb-8 text-xl">
          {skills.map((skill) => <Select skill={skill} key={skill.name}></Select>)}
        </div>
        <input
          type="submit"
          value="Submit"
          className="btn btn-info"
        />
      </form>
      <div>
        <p>検索結果</p>
        <ul>
          {armor_sets.map((armor_set) => {
            return (
              <li key={armor_set.id}>
                {/* {armor_set.head.name}
                {armor_set.body.name}
                {armor_set.arm.name}
                {armor_set.waist.name}
                {armor_set.leg.name}
                {armor_set.score} */}
                <div className="grid grid-cols-5 mt-2">
                  {armor_set.armor_array.map((armor) => <p key={String(armor._id)}>{armor.equipment_type}:{armor.name}</p>)}
                  <p key="score">{armor_set.score}</p>
                  <p key="is_fulfill_request">{armor_set.is_fulfill_request ? "達成" : "未達成"}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </Container>
  );
}

export async function getServerSideProps(context: any) {
  const client = await clientPromise;

  const db = client.db("mhrsb");

  let armors = await db.collection("sample_armors").find({}).limit(10).toArray();
  armors = JSON.parse(JSON.stringify(armors));
  let skills = await db.collection("skills").find({}).sort({ kana: 1 }).toArray();
  skills = JSON.parse(JSON.stringify(skills));
  return {
    props: { armors, skills },
  };
}