import { LogLevel } from '@sapphire/framework';
import { GatewayIntentBits } from 'discord.js';
import { NodeOptions } from 'magmastream';

const lavaNodes: NodeOptions[] = JSON.parse(process.env['LAVALINK_HOST']);

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
