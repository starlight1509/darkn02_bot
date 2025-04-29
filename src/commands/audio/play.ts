import { N02Command } from '#lib/classes/N02Command';
import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import { ChatInputCommandInteraction, inlineCode } from 'discord.js';

@ApplyOptions<Command.Options>({
	description: 'Play from any music provider (spotify source is mirrored to youtube)',
	preconditions: ['GuildVoiceOnly']
})
export class MusicCommand extends N02Command {
	public override registerApplicationCommands(registry: Command.Registry) {
		registry.registerChatInputCommand((builder) =>
			builder
				.setName(this.name)
				.setDescription(this.description)
				.addStringOption((input) => input.setName('query').setDescription('Search for music').setAutocomplete(true).setRequired(true))
		);
	}
	public override async chatInputRun(interaction: ChatInputCommandInteraction) {
		const memberVoice = (interaction.member as any).voice;
		const query = interaction.options.getString('query', true);
		let player = this.container.client.manager.get(interaction.guildId!);

		if (!player)
			player = this.container.client.manager.create({
				guildId: interaction.guildId!,
				voiceChannelId: memberVoice.channelId!,
				textChannelId: interaction.channelId,
				selfDeafen: true
			});

		const res = await this.container.client.manager.search(query, interaction.user);

		if (player) player.connect();

		switch (res.loadType) {
			case 'playlist':
				player.queue.add(res.playlist!.tracks);
				if (!player.playing && !player.paused && player.queue.size === res.playlist!.tracks.length) player.play();
				return interaction.reply({
					content: `Added ${inlineCode(`${res.playlist!.tracks.length}`)} track(s) from ${inlineCode(`${res.playlist!.name}`)}`
				});
			case 'track':
				const track = res.tracks.shift()!;

				player.queue.add(track);
				if (!player.playing && !player.paused && !player.queue.length) player.play();
				return interaction.reply({ content: `Added: ${inlineCode(track.title)}` });
			default:
				return interaction.reply({ content: 'Query not found', flags: ['Ephemeral'] });
		}
	}
}
