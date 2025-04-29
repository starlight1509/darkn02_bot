import { ArrayString } from '@skyra/env-utilities';
import { Manager, NodeOptions, SearchPlatform } from 'magmastream';

declare module '@skyra/env-utilities' {
	interface Env {
		OWNER_ID: ArrayString;
		APPLICATION_ID: string;
		LAVALINK_HOST: ArrayString;
		LASTFM_KEY: string;
		SEARCH_ENGINES: SearchPlatform;
	}
}

declare module '@sapphire/framework' {
	interface Preconditions {
		OwnerOnly: never;
	}
}

declare module 'discord.js' {
	interface Client {
		manager: Manager;
	}
}
