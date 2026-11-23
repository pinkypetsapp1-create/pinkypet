// Lee y valida las variables de entorno una sola vez. Si falta algo obligatorio, la API no arranca.
export interface Env {
  nodeEnv: 'development' | 'test' | 'production';
  port: number;
  mongodbUri: string;
  jwtSecret: string;
  jwtRefreshSecret: string;
  accessTtlSeconds: number;
  refreshTtlDays: number;
  corsOrigins: string[];
  authThrottleLimit: number;
  devKey: string | null;
}

export const ENV = Symbol('ENV');

export function loadEnv(source: NodeJS.ProcessEnv = process.env): Env {
  const errors: string[] = [];
  const required = (name: string): string => {
    const v = source[name]?.trim();
    if (!v) errors.push(`Falta la variable ${name}`);
    return v ?? '';
  };
  const secret = (name: string): string => {
    const v = required(name);
    if (v && v.length < 32) errors.push(`${name} debe tener al menos 32 caracteres`);
    return v;
  };

  const nodeEnv = (source.NODE_ENV ?? 'development') as Env['nodeEnv'];
  if (!['development', 'test', 'production'].includes(nodeEnv)) errors.push(`NODE_ENV no válido: ${nodeEnv}`);

  const env: Env = {
    nodeEnv,
    port: Number(source.PORT ?? 3000),
    mongodbUri: required('MONGODB_URI'),
    jwtSecret: secret('JWT_SECRET'),
    jwtRefreshSecret: secret('JWT_REFRESH_SECRET'),
    accessTtlSeconds: Number(source.JWT_ACCESS_TTL_SECONDS ?? 15 * 60),
    refreshTtlDays: Number(source.REFRESH_TTL_DAYS ?? 30),
    corsOrigins: (source.CORS_ORIGINS ?? '').split(',').map((o) => o.trim()).filter(Boolean),
    authThrottleLimit: Number(source.AUTH_THROTTLE_LIMIT ?? 5),
    // El endpoint de simulación no existe en producción, aunque alguien defina DEV_KEY.
    devKey: nodeEnv !== 'production' && source.DEV_KEY?.trim() ? source.DEV_KEY.trim() : null,
  };
  if (env.jwtSecret && env.jwtSecret === env.jwtRefreshSecret) {
    errors.push('JWT_SECRET y JWT_REFRESH_SECRET deben ser distintos');
  }
  if (errors.length) throw new Error(`Configuración no válida:\n  - ${errors.join('\n  - ')}`);
  return env;
}
