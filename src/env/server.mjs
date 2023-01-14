// @ts-check
/* eslint-disable no-underscore-dangle, @typescript-eslint/naming-convention, prefer-const  */
/**
 * This file is included in `/next.config.mjs` which ensures the app isn't built with invalid env vars.
 * It has to be a `.mjs`-file to be imported there.
 */
import { serverSchema } from './schema.mjs';
import { env as clientEnv, formatErrors } from './client.mjs';

/**
 * You can't destruct `process.env` as a regular object, so we do
 * a workaround. This is because Next.js evaluates this at build time,
 * and only used environment variables are included in the build.
 * @type {{ [key: string]: string | undefined; }}
 */
let serverEnv = {};
Object.keys(serverSchema.shape).forEach(
  // eslint-disable-next-line no-return-assign
  (key) => (serverEnv[key] = process.env[key])
);

const _serverEnv = serverSchema.safeParse(serverEnv);

if (!_serverEnv.success) {
  // eslint-disable-next-line no-console
  console.error(
    '❌ Invalid environment variables:\n',
    ...formatErrors(_serverEnv.error.format())
  );
  throw new Error('Invalid environment variables');
}

for (let key of Object.keys(_serverEnv.data)) {
  if (key.startsWith('NEXT_PUBLIC_')) {
    // eslint-disable-next-line no-console
    console.warn('❌ You are exposing a server-side env-variable:', key);

    throw new Error('You are exposing a server-side env-variable');
  }
}

export const env = { ..._serverEnv.data, ...clientEnv };
