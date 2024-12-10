import { LogLevel } from '@sapphire/framework';
import { envParseNumber, envParseString } from '@skyra/env-utilities';
import { GatewayIntentBits } from 'discord.js';
import { NodeOptions } from 'magmastream';

const lavaNodes: NodeOptions[] = [
	{
		host: envParseString('LAVALINK_HOST', '0.0.0.0'),
		password: envParseString('LAVALINK_PASS', 'youshallnotpass'),
		port: envParseNumber('LAVALINK_PORT', 2333),
		secure: false,
		identifier: 'DarkNode'
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
