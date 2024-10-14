import '#lib/setup';
import { Client, Events } from 'discord.js';
import { intents } from '#lib/misc/constant';

const client = new Client({
	intents: intents
});

client.once(Events.ClientReady, (c) => {
	console.log('Logged in as %d', c.user.tag);
});

client.login();
