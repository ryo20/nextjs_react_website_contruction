
import clientPromise from "lib/mongodb";
import { Armor, Ornament } from "lib/mongodb";


export default function Home({ armors, ornaments }: { armors: Armor[], ornaments: Ornament[] }) {
  return (
    <div className="container">
      <div>
        <h1>Armor</h1>
        {armors.map((armor, index) => {
          return (
            <div className="card" key={index}>
              <h2>{armor.name}</h2>
              <p>{armor.rarity}</p>
              <p>{armor.equipmentType}</p>
              <p>{armor.defense}</p>
              <p>{armor.resistance.fire}{armor.resistance.water}{armor.resistance.thunder}{armor.resistance.ice}{armor.resistance.dragon}</p>
              <p>{JSON.stringify(armor.skills)}</p>
              <p>{armor.slots}</p>
            </div>
          );
        })}
      </div>
      <div>
        <h1>Ornament</h1>
        {ornaments.map((ornament, index) => {
          return (
            <div className="card" key={index}>
              <h2>{ornament.name}</h2>
              <p>{ornament.rarity}</p>
              <p>{JSON.stringify(ornament.skill)}</p>
              <p>{ornament.slot}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export async function getServerSideProps(context: any) {
  const client = await clientPromise;

  const db = client.db("mhrsb");

  let armors = await db.collection("sample_armors").find({}).limit(10).toArray();
  armors = JSON.parse(JSON.stringify(armors));
  let ornaments = await db.collection("sample_ornaments").find({}).limit(10).toArray();
  ornaments = JSON.parse(JSON.stringify(ornaments));

  return {
    props: { armors, ornaments },
  };
}