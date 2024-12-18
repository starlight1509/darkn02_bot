// import { handleChannel } from '#lib/utils';
import { ApplyOptions } from '@sapphire/decorators';
import { Subcommand } from '@sapphire/plugin-subcommands';
import { GuildMember, inlineCode } from 'discord.js';

@ApplyOptions<Subcommand.Options>({
	description: 'Music & Audio',
	subcommands: [
		{
			name: 'play',
			chatInputRun: 'audioPlay'
		},
		{
			name: 'pause',
			chatInputRun: 'audioPause'
		},
		{
			name: 'skip',
			chatInputRun: 'audioSkip'
		},
		{
			name: 'queue',
			type: 'group',
			entries: [
				{
					name: 'list',
					chatInputRun: 'queueList'
				},
				{
					name: 'remove',
					chatInputRun: 'queueRemove'
				}
			]
		},
		{
			name: 'volume',
			chatInputRun: 'audioVolume'
		},
		{
			name: 'stop',
			chatInputRun: 'audioDisconnect'
		}
	]
})
export class MusicCommand extends Subcommand {
	public override registerApplicationCommands(registry: Subcommand.Registry) {
		registry.registerChatInputCommand((builder) =>
			builder
				.setName(this.name)
				.setDescription(this.description)
				.addSubcommand((command) =>
					command
						.setName('play')
						.setDescription('Play a music')
						.addStringOption((input) => input.setName('query').setDescription('Search for music').setAutocomplete(true).setRequired(true))
				)
				.addSubcommand((command) => command.setName('pause').setDescription('Pause the music player'))
				.addSubcommand((command) =>
					command
						.setName('volume')
						.setDescription('Player volume to adjust')
						.addIntegerOption((num) =>
							num.setName('vol').setDescription('Volume percentage').setMinValue(10).setMaxValue(100).setRequired(true)
						)
				)
				.addSubcommand((command) =>
					command
						.setName('skip')
						.setDescription('Skip the current song')
						.addIntegerOption((num) => num.setName('id').setDescription('Song id to skip to'))
				)
				.addSubcommand((command) => command.setName('stop').setDescription('Stop the music player and disconnect from Voice Channel'))
				.addSubcommandGroup((group) =>
					group
						.setName('queue')
						.setDescription('Music Queue')
						.addSubcommand((command) => command.setName('list').setDescription('Queue List'))
						.addSubcommand((command) =>
							command
								.setName('remove')
								.setDescription('Remove song from queue')
								.addIntegerOption((input) =>
									input.setName('id').setDescription('Song ID to remove').setAutocomplete(true).setRequired(true).setMaxValue(25)
								)
						)
				)
		);
	}
	public async audioPlay(interaction: Subcommand.ChatInputCommandInteraction) {
		await interaction.deferReply();
		const member = interaction.member as GuildMember;
		const query = interaction.options.getString('query', true);

		await this.checkVoice(member, interaction);

		const player = this.container.client.manager.create({
			guild: interaction.guildId!,
			voiceChannel: member.voice.channelId!,
			textChannel: interaction.channelId,
			selfDeafen: true,
			volume: 50
		});

		const res = await this.container.client.manager.search(query, interaction.user);

		player.connect();

		switch (res.loadType) {
			case 'playlist':
				player.queue.add(res.playlist!.tracks);
				if (!player.playing && !player.paused && player.queue.size === res.playlist!.tracks.length) player.play();
				return interaction.editReply({
					content: `Added ${inlineCode(`${res.playlist!.tracks.length}`)} track(s) from ${inlineCode(`${res.playlist!.name}`)}`
				});
			case 'search':
			case 'track':
				const track = res.tracks.shift()!;

				player.queue.add(track);
				if (!player.playing && !player.paused && !player.queue.length) player.play();
				return interaction.editReply({ content: `Added: ${inlineCode(track.title)}` });
			default:
				return interaction.editReply({ content: 'Query not found', options: { ephemeral: true } });
		}
	}
	public async audioPause(interaction: Subcommand.ChatInputCommandInteraction) {
		const player = this.container.client.manager.players.get(interaction.guildId!)!;
		const member = interaction.member as GuildMember;

		await this.checkVoice(member, interaction);

		if (!player.paused && player.playing) {
			player.pause(true);
			return interaction.reply({ content: 'Paused', ephemeral: true });
		} else {
			player.pause(false);
			return interaction.reply({ content: 'Resumed', ephemeral: true });
		}
	}
	public async audioVolume(interaction: Subcommand.ChatInputCommandInteraction) {
		const vol = interaction.options.getInteger('vol', true);
		const player = this.container.client.manager.players.get(interaction.guildId!)!;
		const member = interaction.member as GuildMember;

		await this.checkVoice(member, interaction);

		if (player.paused && !player.playing) {
			return interaction.reply({ content: `The audio player is either ${inlineCode('paused')} or ${inlineCode('stopped')}.` });
		} else {
			player.setVolume(vol);
			return interaction.reply({ content: `The volume has changed to ${inlineCode(`${vol}%`)}.` });
		}
	}
	public async audioSkip(interaction: Subcommand.ChatInputCommandInteraction) {
		const player = this.container.client.manager.players.get(interaction.guildId!)!;
		const id = interaction.options.getInteger('id');
		const member = interaction.member as GuildMember;

		await this.checkVoice(member, interaction);

		if (id) {
			player.stop(id);
			await interaction.reply({ content: `Skipped to song id ${id}` });
		} else {
			player.stop();
			await interaction.reply({ content: 'Song skipped' });
		}
	}
	public async audioDisconnect(interaction: Subcommand.ChatInputCommandInteraction) {
		const player = this.container.client.manager.players.get(interaction.guildId!)!;
		const member = interaction.member as GuildMember;

		await this.checkVoice(member, interaction);

		if (player.queue) player.destroy();
		return interaction.reply({ content: 'Player Stopped', ephemeral: true });
	}
	// public async queueList(interaction: Subcommand.ChatInputCommandInteraction) {
	// 	const player = this.container.client.manager.players.get(interaction.guildId!)!;

	// }

	// public async queueRemove(interaction: Subcommand.ChatInputCommandInteraction) {}

	private async checkVoice(member: GuildMember, interaction: Subcommand.ChatInputCommandInteraction) {
		if (member.voice.channelId) return;
		else return interaction.reply({ content: 'Please join a voice channel.', options: { ephemeral: true } });
	}
}
