import { N02Command } from '#lib/classes/N02Command';
import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import { ChatInputCommandInteraction } from 'discord.js';

@ApplyOptions<Command.Options>({
	description: 'Pause the player',
	preconditions: ['GuildVoiceOnly']
})
export class MusicCommand extends N02Command {
	public override registerApplicationCommands(registry: Command.Registry) {
		registry.registerChatInputCommand((builder) => builder.setName(this.name).setDescription(this.description));
	}
	public override async chatInputRun(interaction: ChatInputCommandInteraction) {
		const player = this.container.client.manager.players.get(interaction.guildId!)!;
		if (!player.paused && player.playing) {
			player.pause(true);
			return interaction.reply({ content: 'Paused', flags: ['Ephemeral'] });
		} else {
			player.pause(false);
			return interaction.reply({ content: 'Resumed', flags: ['Ephemeral'] });
		}
	}
}
