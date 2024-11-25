import { LogLevel } from '@sapphire/framework';
import { envParseNumber, envParseString } from '@skyra/env-utilities';
import { ClientOptions, GatewayIntentBits, Partials } from 'discord.js';
import { LavalinkNode } from 'riffy';

const lavaNodes: LavalinkNode[] = [
	{
		host: envParseString('LAVALINK_HOST', '0.0.0.0'),
		password: envParseString('LAVALINK_PASS', 'youshallnotpass'),
		port: envParseNumber('LAVALINK_PORT', 2333),
		secure: false
	}
];

const botConfigs: ClientOptions = {
	intents: [
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildPresences,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildVoiceStates
	],
	allowedMentions: {
		parse: ['roles', 'users'],
		repliedUser: false
	},
	logger: {
		level: process.env['NODE_ENV'] === 'development' ? LogLevel.Debug : LogLevel.Info
	},
	partials: [Partials.Channel]
};

export { lavaNodes, botConfigs };
