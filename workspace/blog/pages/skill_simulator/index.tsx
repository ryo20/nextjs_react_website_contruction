// 現状はmongodb/index.tsxのコピー
import clientPromise from "lib/mongodb";
import { Armor } from "lib/mongodb";
import Container from "components/container"
import Hero from "components/hero"


export default function Home({ armors }: { armors: Armor[] }) {
  return (
    <Container>
      <Hero
        title="MHRise Sunbreak スキルシミュレータ"
        subtitle="頑張る"
        imageOn={true}
      />
      <div className="grid grid-cols-5 gap-2 mt-2 mb-8 text-xl">
        <div className="form-control w-full max-w-x border-2 border-gray-200">
          <label className="label">
            <span className="label-text">Attack Boost</span>
          </label>
          <br />
          <select className="select select-primary w-full">
            <option disabled selected>lv0</option>
            <option>Star Wars</option>
            <option>Harry Potter</option>
            <option>Lord of the Rings</option>
            <option>Planet of the Apes</option>
            <option>Star Trek</option>
          </select>
        </div>
        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text">Attack Boost</span>
          </label>
          <br />
          <select className="select  select-lg select-bordered">
            <option disabled selected>lv0</option>
            <option>Star Wars</option>
            <option>Harry Potter</option>
            <option>Lord of the Rings</option>
            <option>Planet of the Apes</option>
            <option>Star Trek</option>
          </select>
        </div>
      </div>
    </Container>
  );
}

export async function getServerSideProps(context: any) {
  const client = await clientPromise;

  const db = client.db("mhrsb");

  let armors = await db.collection("sample_armors").find({}).limit(10).toArray();
  console.log(String(armors))
  armors = JSON.parse(JSON.stringify(armors));
  return {
    props: { armors },
  };
}