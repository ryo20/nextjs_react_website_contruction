
import clientPromise from "lib/mongodb";
import { Armor } from "lib/mongodb";


export default function Home({ armors }: { armors: Armor[] }) {
  return (
    <div className="container">
      <div>
        {armors.map((armor, index) => {
          return (
            <div className="card">
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
    </div>
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