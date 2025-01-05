import { Command } from '@sapphire/framework';
import { Subcommand } from '@sapphire/plugin-subcommands';
import { PermissionFlagsBits } from 'discord.js';

// Normal Slash command
export class N02Command extends Command {
	public constructor(ctx: Command.LoaderContext, options: Command.Options) {
		super(ctx, {
			requiredClientPermissions: PermissionFlagsBits.EmbedLinks,
			...options
		});
	}
}

// Slash Subcommand
export class N02Subcommand extends Subcommand {
	public constructor(ctx: Subcommand.LoaderContext, options: Subcommand.Options) {
		super(ctx, {
			requiredClientPermissions: PermissionFlagsBits.EmbedLinks,
			...options
		});
	}
}
