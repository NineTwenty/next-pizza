// @ts-check
/* eslint-disable no-underscore-dangle, @typescript-eslint/naming-convention, prefer-const */
import { clientSchema } from './schema.mjs';

/**
 * You can't destruct `process.env` as a regular object, so we do
 * a workaround. This is because Next.js evaluates this at build time,
 * and only used environment variables are included in the build.
 * @type {{ [key: string]: string | undefined; }}
 */
let clientEnv = {};
Object.keys(clientSchema.shape).forEach(
  // eslint-disable-next-line no-return-assign
  (key) => (clientEnv[key] = process.env[key])
);

const _clientEnv = clientSchema.safeParse(clientEnv);

export const formatErrors = (
  /** @type {import('zod').ZodFormattedError<Map<string,string>,string>} */
  errors
) =>
  Object.entries(errors)
    .map(([name, value]) => {
      if (value && '_errors' in value)
        return `${name}: ${value._errors.join(', ')}\n`;
      return undefined;
    })
    .filter(Boolean);

if (!_clientEnv.success) {
  // eslint-disable-next-line no-console
  console.error(
    '❌ Invalid environment variables:\n',
    ...formatErrors(_clientEnv.error.format())
  );
  throw new Error('Invalid environment variables');
}

for (const key of Object.keys(_clientEnv.data)) {
  if (!key.startsWith('NEXT_PUBLIC_')) {
    // eslint-disable-next-line no-console
    console.warn(
      `❌ Invalid public environment variable name: ${key}. It must begin with 'NEXT_PUBLIC_'`
    );

    throw new Error('Invalid public environment variable name');
  }
}

export const env = _clientEnv.data;
