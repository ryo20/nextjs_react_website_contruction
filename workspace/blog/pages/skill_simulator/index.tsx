// 現状はmongodb/index.tsxのコピー
import clientPromise, { Skill } from "lib/mongodb";
import { Armor } from "lib/mongodb";
import Container from "components/container"
import Hero from "components/hero"
import Select from "components/select";
import { FormEvent, useState } from "react";

type SkillSet = {
  value: string;
  readonly id: number;
};

export default function Home({ armors, skills }: { armors: Armor[], skills: Skill[] }) {
  const [skill_sets, setSkillSets] = useState<SkillSet[]>([]);
  const handleSubmit = async (event: FormEvent) => {
    // デフォルト動作の削除
    event.preventDefault()

    // form入力の取得
    const form = event.target as HTMLFormElement
    let data: any = {}
    for (let i = 0, len = form.elements.length; i < len; i++) {
      let element = form.elements[i] as HTMLInputElement
      if (element.id !== "") {
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

    // レスポンスをステートに反映する
    const newSkillSet: SkillSet = {
      value: result.data,
      id: new Date().getTime(),
    };
    // 追加していく場合
    // setSkillSets([newSkillSet, ...skill_sets]);
    // 最新のみ利用する場合
    setSkillSets([newSkillSet]);
  }
  return (
    <Container>
      <Hero
        title="MHRise Sunbreak スキルシミュレータ"
        subtitle="頑張る"
        imageOn={true}
      />
      {/* TODO:ボタンクリック時にレベル選択したスキルの名前とそのレベルを取得する */}
      <form className="w-full max-w-x" onSubmit={handleSubmit}>
        <div className="grid grid-cols-5 gap-2 mt-2 mb-8 text-xl">
          {skills.map((skill, _) => <Select skill={skill}></Select>)}
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
          {skill_sets.map((skill_set, _) => {
            return (
              <li key={skill_set.id}>
                {skill_set.value}
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
  let skills = await db.collection("sample_skills").find({}).sort({ kana: 1 }).limit(10).toArray();
  skills = JSON.parse(JSON.stringify(skills));
  return {
    props: { armors, skills },
  };
}