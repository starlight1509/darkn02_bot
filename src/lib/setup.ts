process.env['NODE_ENV'] ??= 'development';

import '@sapphire/plugin-logger/register';
import '@sapphire/plugin-hmr/register';
import { setup } from '@skyra/env-utilities';
setup();
