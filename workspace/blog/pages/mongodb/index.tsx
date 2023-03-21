
import clientPromise from "lib/mongodb";

export default function Home({ armors }) {
  return (
    <div className="container">
      <div>
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
    </div>
  );
}

export async function getServerSideProps(context) {
  const client = await clientPromise;

  const db = client.db("mhrsb");

  let armors = await db.collection("sample_armors").find({},).limit(10).toArray();
  armors = JSON.parse(JSON.stringify(armors));
  return {
    props: { armors },
  };
}