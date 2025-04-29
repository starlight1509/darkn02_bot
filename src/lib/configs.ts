import { LogLevel } from '@sapphire/framework';
import { GatewayIntentBits } from 'discord.js';
import { NodeOptions } from 'magmastream';

const lavaNodes: NodeOptions[] = [
	{
		host: '0.0.0.0',
		password: 'youshallnotpass',
		port: 2333,
		secure: false,
		identifier: 'DummyNode',
		retryAmount: 5
	}
];

const intents: GatewayIntentBits[] = [
	GatewayIntentBits.GuildMembers,
	GatewayIntentBits.GuildPresences,
	GatewayIntentBits.MessageContent,
	GatewayIntentBits.Guilds,
	GatewayIntentBits.GuildVoiceStates
];

const logs = {
	level: process.env['NODE_ENV'] === 'development' ? LogLevel.Debug : LogLevel.Info
};

export default {
	client: {
		intents,
		logs
	},
	lavaNodes
};
