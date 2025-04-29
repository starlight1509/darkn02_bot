import { N02Command } from '#lib/classes/N02Command';
import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import { ChatInputCommandInteraction } from 'discord.js';

@ApplyOptions<Command.Options>({
	description: 'Skip a song (or to specific one)',
	preconditions: ['GuildVoiceOnly']
})
export class MusicCommand extends N02Command {
	public override registerApplicationCommands(registry: Command.Registry) {
		registry.registerChatInputCommand((builder) =>
			builder
				.setName(this.name)
				.setDescription(this.description)
				.addIntegerOption((num) => num.setName('id').setDescription('Song id to skip to'))
		);
	}
	public override async chatInputRun(interaction: ChatInputCommandInteraction) {
		const player = this.container.client.manager.players.get(interaction.guildId!)!;
		const id = interaction.options.getInteger('id');

		if (player.queue.size < id! || player.queue.size < 0) interaction.reply({ content: "There's no song left after the current song" });

		if (id && (id < 1 || id > player.queue.size)) {
			return interaction.reply({ content: 'Invalid song ID.', flags: ['Ephemeral'] });
		}

		player.stop();

		if (id) {
			player.stop(id - 1);
			return interaction.reply({ content: `Skipped to song id ${id}`, flags: ['Ephemeral'] });
		} else {
			return interaction.reply({ content: 'Song skipped', flags: ['Ephemeral'] });
		}
	}
}
