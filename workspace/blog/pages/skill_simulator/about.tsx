// skillsimulator.tsxのお試し用
import clientPromise, { Skill } from "lib/mongodb";
import { Armor } from "lib/mongodb";
import Container from "components/container"
import Hero from "components/hero"
import Select from "components/select";
import { FormEvent } from "react";



export default function Home({ armors, skills }: { armors: Armor[], skills: Skill[] }) {
  // Handle the submit event on form submit.
  const handleSubmit = async (event: FormEvent) => {
    // Stop the form from submitting and refreshing the page.
    event.preventDefault()

    // Cast the event target to an html form
    const form = event.target as HTMLFormElement

    // Get data from the form.
    const data = {
      first: form.first.value as string,
      last: form.last.value as string,
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
    alert(`Is this your full name: ${result.data}`)
  }
  return (
    <Container>
      <Hero
        title="MHRise Sunbreak スキルシミュレータ"
        subtitle="頑張る"
        imageOn={true}
      />
      <form className="w-full max-w-x" action="/api/form" method="post">
        <div className="grid grid-cols-5 gap-2 mt-2 mb-8 text-xl">
          {skills.map((skill) => <Select skill={skill} key={skill.name}></Select>)}
        </div>
        <input
          type="submit"
          value="Submit"
          className="btn btn-info"
          onClick={(e) => e.preventDefault()}
          onSubmit={(e) => e.preventDefault()}
        />
      </form>
      <form onSubmit={handleSubmit}>
        <label htmlFor="first">First Name</label>
        <input type="text" id="first" name="first" required />
        <label htmlFor="last">Last Name</label>
        <input type="text" id="last" name="last" required />
        <button type="submit">Submit</button>
      </form>
      <div>
        <p>検索結果</p>
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