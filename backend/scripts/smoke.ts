// npm run smoke -- <url-api>   Prueba básica contra el backend publicado (Fase 3):
// salud → registro → test → compatibilidad → solicitud → estado → cancelación. Crea una cuenta de prueba nueva.
const base = (process.argv[2] ?? process.env.API_URL ?? '').replace(/\/$/, '');
if (!base) throw new Error('Uso: npm run smoke -- https://pinky-pet-api.onrender.com');

const ANSWERS = {
  q1: 'No', q2: 'No', q3: 'Vivo sola o solo', q4: 'Piso con terraza o balcón', q5: 'Sí, el alquiler lo permite',
  q6: 'Entre 4 y 8 horas', q7: 'Entre 1 y 2 horas', q8: 'Familia o amistades', q9: 'Tranquilo', q10: 'Sí, en casa familiar',
  q11: 'Pequeño', q12: 'Medio', q13: 'Me da igual', q14: 'Entre 50 y 100 €', q15: 'Depende de sus necesidades',
};

async function call(method: string, path: string, body?: unknown, token?: string) {
  const t0 = Date.now();
  const res = await fetch(base + path, {
    method,
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: body === undefined ? undefined : JSON.stringify(body),
    signal: AbortSignal.timeout(90_000), // Render gratuito puede tardar ~1 min en despertar
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- script de prueba: la forma la comprueba cada paso
  const data: any = await res.json().catch(() => null);
  return { status: res.status, data, ms: Date.now() - t0 };
}

async function main(): Promise<void> {
  const ok = (cond: boolean, label: string, extra = '') => {
    console.log(`${cond ? '✔' : '✖'} ${label}${extra ? ' · ' + extra : ''}`);
    if (!cond) process.exitCode = 1;
    return cond;
  };
  const h = await call('GET', '/health');
  ok(h.status === 200 && h.data?.db === 'up', 'health', `${h.ms} ms (incluye el despertar si estaba dormido)`);
  const email = `smoke-${Date.now()}@ejemplo.com`;
  const r = await call('POST', '/auth/register', { email, password: `smoke-${Math.random().toString(36).slice(2)}-pass` });
  if (!ok(r.status === 201, 'registro', email)) return;
  const tk = r.data.accessToken as string;
  ok((await call('PUT', '/test/answers', { answers: ANSWERS }, tk)).status === 200, 'test guardado');
  const c = await call('GET', '/compatibility', undefined, tk);
  ok(c.status === 200 && c.data.items.length > 0, 'compatibilidad', c.data?.items?.map((p: { nombre: string; compatibilidad: { porcentaje: number } }) => `${p.nombre} ${p.compatibilidad.porcentaje} %`).join(', '));
  const first = c.data?.items?.[0]?.id;
  const s = await call('POST', '/requests', { petId: first }, tk);
  ok(s.status === 201 && s.data.estado === 'en_proceso', 'solicitud enviada', first);
  ok((await call('POST', '/requests', { petId: c.data.items[1]?.id }, tk)).data?.code === 'ACTIVE_REQUEST_EXISTS', 'una sola solicitud activa');
  const cur = await call('GET', '/requests/current', undefined, tk);
  ok(cur.data?.activa?.id === s.data?.id, 'estado de la solicitud');
  ok((await call('POST', `/requests/${s.data?.id}/cancel`, {}, tk)).data?.estado === 'cancelada', 'cancelación');
  ok((await call('POST', `/dev/requests/${s.data?.id}/resolve`, { resultado: 'finalizada' })).status === 404, 'el simulador de la protectora no es accesible desde fuera (404 sin clave)');
}

main().catch((e) => {
  console.error('✖', e instanceof Error ? e.message : e);
  process.exit(1);
});
