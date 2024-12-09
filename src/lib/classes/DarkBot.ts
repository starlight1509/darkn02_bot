import { botConfigs, lavaNodes as nodes } from '#lib/configs';
import { SapphireClient, Command } from '@sapphire/framework';
import { Events, PermissionFlagsBits } from 'discord.js';
import { Riffy } from 'riffy';

// Client
export class DarkBot extends SapphireClient {
	public constructor() {
		super(botConfigs);
		this.manager = new Riffy(this, nodes, {
			restVersion: 'v4',
			send: (p) => {
				const guild = this.guilds.cache.get(p.d.guild_id);
				if (guild) guild.shard.send(p);
			},
			defaultSearchPlatform: 'ytsearch'
		});

		this.on(Events.Raw, (d) => {
			this.manager.updateVoiceState(d);
		});
	}
}

// Command
export abstract class DarkCommand extends Command {
	public constructor(ctx: Command.LoaderContext, options: Command.Options) {
		super(ctx, {
			requiredClientPermissions: PermissionFlagsBits.EmbedLinks,
			...options
		});
	}
}
