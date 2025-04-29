import configs from '#lib/configs';
import { SapphireClient } from '@sapphire/framework';
import { envParseString } from '@skyra/env-utilities';
import { ActivityType, Events, Partials } from 'discord.js';
import { Manager, VoiceServer } from 'magmastream';

export class N02Client extends SapphireClient {
	public constructor() {
		super({
			intents: configs.client.intents,
			allowedMentions: {
				parse: ['users'],
				repliedUser: false
			},
			logger: configs.client.logs,
			partials: [Partials.Channel, Partials.GuildMember],
			hmr: {
				enabled: process.env['NODE_ENV'] === 'development'
			}
		});
		this.options.presence = {
			status: 'idle',
			activities: [
				{
					name: 'Jump High',
					type: ActivityType.Watching
				}
			]
		};
		this.manager = new Manager({
			lastFmApiKey: envParseString('LASTFM_KEY'),
			nodes: process.env['LAVALINK_HOST'] || configs.lavaNodes,
			autoPlay: true,
			defaultSearchPlatform: envParseString('SEARCH_PROVIDERS'),
			send: (id, payload) => {
				const guild = this.guilds.cache.get(id);
				if (guild) guild.shard.send(payload);
			},
			clientName: `${this.user?.username}`
		});

		this.once(Events.ClientReady, () => {
			this.manager.init(this.user!.id);
		});

		this.on(Events.Raw, (d) => {
			this.manager.updateVoiceState(d as VoiceServer);
		});
	}
}
