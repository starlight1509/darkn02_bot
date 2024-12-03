import { ArrayString, NumberString } from '@skyra/env-utilities';
import { Riffy } from 'riffy';

declare module '@skyra/env-utilities' {
	interface Env {
		OWNER_ID: ArrayString;
		APPLICATION_ID: string;
		LAVALINK_HOST: string;
		LAVALINK_PASS: string;
		LAVALINK_PORT: NumberString;
	}
}

declare module '@sapphire/framework' {
	interface Preconditions {
		OwnerOnly: never;
	}
}

declare module 'discord.js' {
	interface Client {
		manager: Riffy;
	}
}
