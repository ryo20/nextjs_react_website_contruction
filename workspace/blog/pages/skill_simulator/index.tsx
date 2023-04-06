// 現状はmongodb/index.tsxのコピー
import clientPromise, { Skill } from "lib/mongodb";
import { Armor } from "lib/mongodb";
import Container from "components/container"
import Hero from "components/hero"
import Select from "components/select";
import { FormEvent, useState } from "react";

type Todo = {
  value: string;
  readonly id: number;
};

export default function Home({ armors, skills }: { armors: Armor[], skills: Skill[] }) {
  const [todos, setTodos] = useState<Todo[]>([]);
  // Handle the submit event on form submit.
  const handleSubmit = async (event: FormEvent) => {
    // Stop the form from submitting and refreshing the page.
    event.preventDefault()

    // Cast the event target to an html form
    const form = event.target as HTMLFormElement
    console.log(form)
    // Get data from the form.
    const data = {
      kaihi: form.回避距離UP.value as string,
      kougeki: form.攻撃.value as string,
      bougyo: form.防御.value as string,
    }

    // Send the form data to our API and get a response.
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

    // Get the response data from server as JSON.
    // If server returns the name submitted, that means the form works.
    const result = await response.json()
    // alert(`${result.data}`)
    //新しい Todo を作成
    const newTodo: Todo = {
      value: result.data,
      id: new Date().getTime(),
    };
    setTodos([newTodo, ...todos]);
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
          {skills.map((skill) => <Select skill={skill}></Select>)}
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
          {todos.map((todo) => {
            return (
              <li key={todo.id}>
                {todo.value}
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