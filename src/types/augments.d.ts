import { ArrayString } from '@skyra/env-utilities';

declare module '@skyra/env-utilities' {
	interface Env {
		OWNER_ID: ArrayString;
		APPLICATION_ID: string;
	}
}

declare module '@sapphire/framework' {
	interface Preconditions {
		OwnerOnly: never;
	}
}
