import { LogLevel, SapphireClient } from '@sapphire/framework';
import { GatewayIntentBits, Partials } from 'discord.js';

export class DarkBot extends SapphireClient {
	public constructor() {
		super({
			intents: [GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildPresences, GatewayIntentBits.MessageContent, GatewayIntentBits.Guilds],
			allowedMentions: {
				parse: ['roles', 'users'],
				repliedUser: false
			},
			logger: {
				level: LogLevel.Debug
			},
			partials: [Partials.Channel]
		});
	}
}
