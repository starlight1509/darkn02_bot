import { N02Command } from '#lib/classes/N02Command';
import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import { ChatInputCommandInteraction, inlineCode } from 'discord.js';

@ApplyOptions<Command.Options>({
	description: 'Change audio volume (10-100)',
	preconditions: ['GuildVoiceOnly']
})
export class MusicCommand extends N02Command {
	public override registerApplicationCommands(registry: Command.Registry) {
		registry.registerChatInputCommand((builder) =>
			builder
				.setName(this.name)
				.setDescription(this.description)
				.addIntegerOption((num) => num.setName('vol').setDescription('Volume percentage').setMinValue(10).setMaxValue(100).setRequired(true))
		);
	}
	public override async chatInputRun(interaction: ChatInputCommandInteraction) {
		const player = this.container.client.manager.players.get(interaction.guildId!)!;
		const vol = interaction.options.getInteger('vol', true);

		if (player.paused && !player.playing && !player.queue.size) {
			return interaction.reply({ content: `The audio player is either ${inlineCode('paused')} or ${inlineCode('stopped')}.` });
		} else {
			player.setVolume(vol);
			return interaction.reply({ content: `The volume has changed to ${inlineCode(`${vol}%`)}.` });
		}
	}
}
