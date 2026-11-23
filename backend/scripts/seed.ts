// npm run seed · usa MONGODB_URI y SEED_DEMO_PASSWORD (de .env o del entorno).
import mongoose from 'mongoose';
import { loadDotEnv } from './dotenv';
import { runSeed } from '../src/seed/seed';

async function main(): Promise<void> {
  loadDotEnv();
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('Falta MONGODB_URI');
  const conn = await mongoose.createConnection(uri).asPromise();
  try {
    const r = await runSeed(conn, process.env.SEED_DEMO_PASSWORD ?? '');
    const counts = {
      pets: await conn.collection('pets').countDocuments(),
      questions: await conn.collection('questions').countDocuments(),
      users: await conn.collection('users').countDocuments({ email: { $in: r.demoUsers } }),
      activeRequests: await conn.collection('adoption_requests').countDocuments({ estado: 'en_proceso' }),
    };
    console.log('Seed completado:', JSON.stringify(counts));
  } finally {
    await conn.close();
  }
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
