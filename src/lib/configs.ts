import { LogLevel } from '@sapphire/framework';
import { ClientOptions, GatewayIntentBits, Partials } from 'discord.js';
import { LavalinkNode } from 'riffy';

const lavaNodes: LavalinkNode[] = [
	{
		host: process.env['LAVALINK_HOST'],
		password: process.env['LAVALINK_PASS'],
		port: 2333,
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
