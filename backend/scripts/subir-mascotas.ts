// npm run mascotas:subir · añade o actualiza en la base de datos (MONGODB_URI) las mascotas de src/seed/pets.data.ts.
// A diferencia de «npm run seed», no toca las cuentas ni las solicitudes, y no vuelve a poner como disponibles
// las mascotas que ya se hayan adoptado: «disponible» solo se fija al crear una mascota nueva.
import mongoose from 'mongoose';
import { loadDotEnv } from './dotenv';
import { Pet, PetSchema } from '../src/pets/pet.schema';
import { PETS } from '../src/seed/pets.data';

async function main(): Promise<void> {
  loadDotEnv();
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('Falta MONGODB_URI (en backend/.env o en el entorno)');
  const conn = await mongoose.createConnection(uri).asPromise();
  try {
    const Pets = conn.model<Pet>(Pet.name, PetSchema);
    const antes = new Set((await Pets.find({}, { slug: 1 }).lean()).map((p) => p.slug));
    await Pets.bulkWrite(
      PETS.map((p, orden) => ({
        updateOne: { filter: { slug: p.slug }, update: { $set: { ...p, orden }, $setOnInsert: { disponible: true } }, upsert: true },
      })),
    );
    const nuevas = PETS.filter((p) => !antes.has(p.slug)).map((p) => p.nombre);
    const host = uri.replace(/^mongodb(\+srv)?:\/\/[^@]*@/, '').split(/[/?]/)[0];
    console.log(`✔ ${PETS.length} mascotas al día en ${host}${nuevas.length ? ` · nuevas: ${nuevas.join(', ')}` : ' · ninguna nueva'}`);
  } finally {
    await conn.close();
  }
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
