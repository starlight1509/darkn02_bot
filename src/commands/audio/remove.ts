import { N02Command } from '#lib/classes/N02Command';
import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import { ChatInputCommandInteraction, inlineCode } from 'discord.js';

@ApplyOptions<Command.Options>({
	description: 'Remove a song from the queue',
	preconditions: ['GuildVoiceOnly']
})
export class MusicCommand extends N02Command {
	public override registerApplicationCommands(registry: Command.Registry) {
		registry.registerChatInputCommand((builder) =>
			builder
				.setName(this.name)
				.setDescription(this.description)
				.addIntegerOption((num) => num.setName('id').setDescription('Song ID to remove').setRequired(true))
		);
	}
	public override async chatInputRun(interaction: ChatInputCommandInteraction) {
		const player = this.container.client.manager.players.get(interaction.guildId!)!;
		const id = interaction.options.getInteger('id', true);

		if (!player || !player.queue.size) {
			return interaction.reply({ content: 'The queue is currently empty.', flags: ['Ephemeral'] });
		}

		if (id < 0 || id >= player.queue.size) {
			return interaction.reply({ content: 'Invalid song ID.', flags: ['Ephemeral'] });
		}

		const removedTrack = player.queue.remove(id);
		return interaction.reply({ content: `Removed: ${inlineCode(removedTrack[0].title)}` });
	}
}
