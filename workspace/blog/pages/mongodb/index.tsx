
import clientPromise from "lib/mongodb";
import { Armor, Ornament, Talisman, Skill } from "lib/mongodb";


export default function Home({ armors, ornaments, talismans, skills }: {
  armors: Armor[],
  ornaments: Ornament[],
  talismans: Talisman[],
  skills: Skill[]
}) {
  return (
    <div className="container">
      <div>
        <h1>Armor</h1>
        {armors.map((armor, index) => {
          return (
            <div className="card" key={index}>
              <h2>{armor.name}</h2>
              <p>{armor.rarity}</p>
              <p>{armor.equipment_type}</p>
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
      <div>
        <h1>Talisman</h1>
        {talismans.map((talismans, index) => {
          return (
            <div className="card" key={index}>
              <h2>{talismans.name}</h2>
              <p>{talismans.rarity}</p>
              <p>{JSON.stringify(talismans.skills)}</p>
              <p>{talismans.slots}</p>
            </div>
          );
        })}
      </div>
      <div>
        <h1>Skill</h1>
        {skills.map((skill, index) => {
          return (
            <div className="card" key={index}>
              <h2>{skill.name}</h2>
              <p>{skill.slot}</p>
              <p>{skill.max_level}</p>
              <p>{skill.description}</p>
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
  let talismans = await db.collection("sample_talismans").find({}).limit(10).toArray();
  talismans = JSON.parse(JSON.stringify(talismans));
  let skills = await db.collection("sample_skills").find({}).limit(10).toArray();
  skills = JSON.parse(JSON.stringify(skills));

  return {
    props: { armors, ornaments, talismans, skills },
  };
}