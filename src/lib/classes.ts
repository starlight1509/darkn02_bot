import { SapphireClient } from '@sapphire/framework';
import { Subcommand } from '@sapphire/plugin-subcommands';
import { botConfigs, lavaNodes as nodes } from '#lib/configs';
import { Riffy } from 'riffy';
import { Events, PermissionFlagsBits } from 'discord.js';

// Client
export class DarkBot extends SapphireClient {
	public constructor() {
		super(botConfigs);
		this.riffy = new Riffy(this, nodes, {
			restVersion: 'v4',
			defaultSearchPlatform: 'ytsearch',
			send: (payload) => {
				const guild = this.guilds.cache.get(payload.d.guild_id);
				if (guild) guild.shard.send(payload);
			}
		});
		this.once(Events.ClientReady, () => {
			this.riffy.init(this.user!.id);
		});
		this.on(Events.Raw, (d) => {
			this.riffy.updateVoiceState(d);
		});
	}
}

// Command
export abstract class DarkCommand extends Subcommand {
	public constructor(ctx: Subcommand.LoaderContext, options: Subcommand.Options) {
		super(ctx, {
			requiredClientPermissions: PermissionFlagsBits.EmbedLinks,
			...options
		});
	}
}
