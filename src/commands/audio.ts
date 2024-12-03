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
			name: 'queue',
			type: 'group',
			entries: [
				{
					name: 'list',
					chatInputRun: 'queueList'
				},
				{
					name: 'add',
					chatInputRun: 'queueAdd'
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
			chatInputRun: 'queueDestroy'
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
						.addNumberOption((input) => input.setName('num').setDescription('Volume percentage').setMinValue(10).setMaxValue(100))
				)
				.addSubcommand((command) => command.setName('stop').setDescription('Stop the music player'))
				.addSubcommandGroup((group) =>
					group
						.setName('queue')
						.setDescription('Music Queue')
						.addSubcommand((command) => command.setName('list').setDescription('Queue List'))
						.addSubcommand((command) =>
							command
								.setName('add')
								.setDescription('Add song to queue')
								.addStringOption((input) => input.setName('url').setDescription('The URL of the song to add').setRequired(true))
						)
						.addSubcommand((command) =>
							command
								.setName('remove')
								.setDescription('Remove song from queue')
								.addNumberOption((input) =>
									input.setName('id').setDescription('Song ID to remove').setAutocomplete(true).setRequired(true).setMaxValue(25)
								)
						)
				)
		);
	}
	public async audioPlay(interaction: Subcommand.ChatInputCommandInteraction) {
		await interaction.deferReply({ ephemeral: false });
		const member = interaction.member as GuildMember;
		const query = interaction.options.getString('query', true);

		if (!member.voice.channel)
			return interaction.editReply({
				content: 'Please join a Voice Channel first.',
				options: {
					ephemeral: true
				}
			});

		const player = this.container.client.manager.createConnection({
			guildId: interaction.guildId!,
			voiceChannel: member.voice.channelId!,
			textChannel: interaction.channelId,
			deaf: true,
			defaultVolume: 100
		});

		const resolve = await this.container.client.manager.resolve({ query, requester: interaction.user });

		switch (resolve.loadType) {
			case 'playlist':
				for (const track of resolve.tracks) {
					track.info.requester = interaction.user;
					player.queue.add(track);
				}
				if (!player.playing && !player.paused) player.play();
				return interaction.editReply({
					content: `Added ${inlineCode(`${resolve.tracks.length} tracks`)} from ${inlineCode(`${resolve.playlistInfo?.name}`)}`
				});
			case 'search':
			case 'track':
				const track = resolve.tracks.shift()!;
				track.info.requester = interaction.user;

				player.queue.add(track);
				if (!player.playing && !player.paused) player.play();
				return interaction.editReply({ content: `Added: ${inlineCode(track.info.title)}` });
			default:
				return interaction.editReply({ content: 'No results found', options: { ephemeral: true } });
		}
	}
	public async audioPause(interaction: Subcommand.ChatInputCommandInteraction) {
		const player = this.container.client.manager.get(interaction.guild!.id);

		if (!player.paused && player.playing && player.voiceChannel) {
			player.pause(true);
			return interaction.reply({ content: 'Paused', ephemeral: true });
		} else {
			player.pause(false);
			return interaction.reply({ content: 'Unpaused', ephemeral: true });
		}
	}
	public async audioVolume(interaction: Subcommand.ChatInputCommandInteraction) {
		const vol = interaction.options.getNumber('num', true);
		const player = this.container.client.manager.get(interaction.guildId!)!;

		if (player.paused && !player.playing && player.voiceChannel) {
			return interaction.reply({ content: `The audio player is either ${inlineCode('paused')} or ${inlineCode('stopped')}.` });
		} else {
			player.setVolume(vol);
			return interaction.reply({ content: `The volume has changed to ${inlineCode(`${vol}%`)}.` });
		}
	}
	// public async queueList(interaction: Subcommand.ChatInputCommandInteraction) {}
	// public async queueAdd(interaction: Subcommand.ChatInputCommandInteraction) {}
	// public async queueRemove(interaction: Subcommand.ChatInputCommandInteraction) {}
	public async queueDestroy(interaction: Subcommand.ChatInputCommandInteraction) {
		const player = this.container.client.manager.get(interaction.guild!.id);

		if (player.queue && player.voiceChannel) player.destroy();
		return interaction.reply({ content: 'Player Stopped', ephemeral: true });
	}
}
