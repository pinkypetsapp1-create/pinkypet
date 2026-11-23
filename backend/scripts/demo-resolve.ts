// npm run demo:resolve -- <id-solicitud> <finalizada|rechazada> [http://localhost:3000]
// Llama al endpoint de desarrollo que simula la respuesta de la protectora. Usa DEV_KEY (de .env).
import { loadDotEnv } from './dotenv';

async function main(): Promise<void> {
  loadDotEnv();
  const [id, resultado, base = process.env.API_URL ?? 'http://localhost:3000'] = process.argv.slice(2);
  if (!id || !['finalizada', 'rechazada'].includes(resultado)) {
    throw new Error('Uso: npm run demo:resolve -- <id-solicitud> <finalizada|rechazada> [url-api]');
  }
  const res = await fetch(`${base}/dev/requests/${id}/resolve`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Dev-Key': process.env.DEV_KEY ?? '' },
    body: JSON.stringify({ resultado }),
  });
  console.log(res.status, await res.text());
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
