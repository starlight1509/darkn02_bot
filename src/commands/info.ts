import { embedGen } from '#lib/utils';
import { ApplyOptions } from '@sapphire/decorators';
import { Subcommand } from '@sapphire/plugin-subcommands';
import { DurationFormatter } from '@sapphire/time-utilities';
import { bold, escapeEscape, GuildMember, hyperlink, time, TimestampStyles, userMention, version as djsVersion } from 'discord.js';
import { version as SapphireVersion } from '@sapphire/framework';
import { arch, cpus, platform, release, uptime, version as kVersion } from 'node:os';
import { memoryUsage } from 'node:process';
import { toTitleCase, roundNumber } from '@sapphire/utilities';

@ApplyOptions<Subcommand.Options>({
	description: 'Informations',
	subcommands: [
		{
			name: 'user',
			chatInputRun: 'userInfo'
		},
		{
			name: 'server',
			chatInputRun: 'serverInfo'
		},
		{
			name: 'misc',
			type: 'group',
			entries: [
				{
					name: 'bot',
					chatInputRun: 'botInfo'
				},
				{
					name: 'system',
					chatInputRun: 'sysInfo'
				}
			]
		}
	]
})
export class InfoCommand extends Subcommand {
	private embeds = embedGen();
	private duration = new DurationFormatter();
	public override registerApplicationCommands(registry: Subcommand.Registry) {
		registry.registerChatInputCommand((builder) =>
			builder
				.setName(this.name)
				.setDescription(this.description)
				.addSubcommand((command) =>
					command
						.setName('user')
						.setDescription('User Informations')
						.addUserOption((input) => input.setName('tag').setDescription('User tags'))
				)
				.addSubcommand((command) => command.setName('server').setDescription('Server Informations'))
				.addSubcommandGroup((group) =>
					group
						.setName('misc')
						.setDescription('Misc Informations')
						.addSubcommand((command) => command.setName('bot').setDescription('The Bot'))
						.addSubcommand((command) => command.setName('system').setDescription('The System'))
				)
		);
	}
	public async userInfo(interaction: Subcommand.ChatInputCommandInteraction) {
		const member = (interaction.options.getMember('tag') as GuildMember) ?? interaction.member;

		this.embeds = embedGen({
			title: 'User Informations',
			fields: [
				{
					name: 'Identifier',
					value: `${bold('Username')}: ${escapeEscape(member.user.tag)} ${bold('User/ID')}: ${member.id}`
				},
				{
					name: 'User Stats',
					value: `${bold('Joined Discord')}: ${escapeEscape(time(member.user.createdTimestamp, TimestampStyles.RelativeTime))} ${bold('Joined Server')}: ${time(member.joinedTimestamp!, TimestampStyles.RelativeTime)}`
				},
				{
					name: 'Other Stats',
					value: `${bold('Presence/Status')}: ${escapeEscape(toTitleCase(member.presence?.status ? 'offline' : 'invisible (offline)'))} ${bold('Role(s)')}: ${escapeEscape(`${member.roles.cache.size}`)} ${bold('Bot?')} ${(member.user.bot ? member.user.bot : 'Yes', 'No')}`
				}
			]
		});
		return interaction.reply({ embeds: this.embeds });
	}
	public async serverInfo(interaction: Subcommand.ChatInputCommandInteraction) {
		const memberFilter = interaction.guild!.members.cache.filter((m) => !m.user.bot).size;
		const botFilter = interaction.guild!.members.cache.filter((m) => m.user.bot).size;

		const nsfwLevel = {
			0: 'Default',
			1: 'Explicit',
			2: 'Safe',
			3: 'Age Restricted'
		};

		const explicitFilter = {
			0: 'Disabled',
			1: 'Member(s) (Without Role(s))',
			2: 'All Member(s)'
		};

		this.embeds = embedGen({
			title: 'Server Informations',
			fields: [
				{
					name: 'General',
					value: `${bold('Name')}: ${escapeEscape(interaction.guild!.name)} ${bold('ID')}: ${escapeEscape(interaction.guildId!)} ${bold('Owner')}: ${escapeEscape(userMention(interaction.guild!.ownerId))} ${bold('Created In')}: ${time(interaction.guild!.createdTimestamp, TimestampStyles.RelativeTime)}`
				},
				{
					name: 'Size/Total',
					value: `${bold('Member(s)')}: ${escapeEscape(`- All: ${interaction.guild?.members.cache.size} (User(s): ${memberFilter} | Bots: ${botFilter})`)} ${bold('Channel(s)')}: ${escapeEscape(`${interaction.guild!.channels.cache.size}`)} ${bold('Role(s)')}: ${interaction.guild!.roles.cache.size}`
				},
				{
					name: 'Presence/Status',
					value: `${bold('Online')}: ${escapeEscape(`${interaction.guild!.presences.cache.filter((p) => p.status === 'online').size}`)} ${bold('Idle')}: ${escapeEscape(`${interaction.guild!.presences.cache.filter((p) => p.status === 'idle').size}`)} ${bold('DND/Do Not Disturb')}: ${escapeEscape(`${interaction.guild!.presences.cache.filter((p) => p.status === 'dnd').size}`)} ${bold('Invisible/Offline')}: ${escapeEscape(`${interaction.guild!.presences.cache.filter((p) => p.status === 'invisible' || p.status === 'offline').size}`)}`
				},
				{
					name: 'Misc',
					value: `${bold('Verified?')}: ${escapeEscape(`${(interaction.guild!.verified ? interaction.guild!.verified : 'Yes', 'No')}`)} ${bold('NotSafeForWork (NSFW) Level')}: ${escapeEscape(nsfwLevel[interaction.guild!.nsfwLevel])} ${bold('Explicit Filter')}: ${explicitFilter[interaction.guild!.explicitContentFilter]}`
				}
			]
		});

		return interaction.reply({ embeds: this.embeds });
	}
	public async botInfo(interaction: Subcommand.ChatInputCommandInteraction) {
		const owner = this.container.client.users.cache.filter((u, _) => u.id).get(process.env['OWNER_ID'])!;
		const cId = this.container.client.user!.id || process.env['APPLICATION_ID'];

		this.embeds = embedGen({
			title: 'Bot Informations',
			description: `A ${hyperlink('discord.js', 'https://discord.js.org/')} | ${hyperlink('Sapphire Framework', 'https://sapphirejs.dev/')} bot created by ${userMention(owner.id)}`,
			fields: [
				{
					name: 'Identifier',
					value: `${bold('User/Tag')}: ${escapeEscape(this.container.client.user!.tag)} ${bold('ID')}: ${escapeEscape(cId)} ${bold('Created since')}: ${escapeEscape(time(this.container.client.user!.createdTimestamp, TimestampStyles.RelativeTime))}`
				},
				{
					name: 'Stats',
					value: `${bold('Uptime')}: ${escapeEscape(`${this.duration.format(this.container.client.uptime!)} | ${time(this.container.client.uptime!, TimestampStyles.RelativeTime)}`)} ${bold('Guild(s)')}: ${escapeEscape(`${this.container.client.guilds.cache.size}`)} ${bold('Channel(s)')}: ${escapeEscape(`${this.container.client.channels.cache.size}`)} ${bold('User(s)')}: ${escapeEscape(`${this.container.client.users.cache.size}`)} ${bold('Ping/Latency')}: Bot: ${roundNumber(Date.now() - interaction.createdTimestamp)}ms | API: ${roundNumber(this.container.client.ws.ping)}ms`
				},
				{
					name: 'Libraries',
					value: `${bold('Nodejs')}: ${escapeEscape(process.version)} ${bold('Discordjs')}: ${escapeEscape(djsVersion)} ${bold('Sapphire Framework')}: ${SapphireVersion}`
				}
			],
			thumbnail: {
				url: this.container.client.user?.avatarURL({ forceStatic: false }) ? '' : ''
			}
		});
		return interaction.reply({ embeds: this.embeds });
	}
	public async sysInfo(interaction: Subcommand.ChatInputCommandInteraction) {
		this.embeds = embedGen({
			title: 'System Informations',
			fields: [
				{
					name: 'OS Stats',
					value: `${bold('Distro')}: ${escapeEscape(`${toTitleCase(release())} (${platform()})`)} ${bold('Architecture')}: ${escapeEscape(arch())} ${bold('Kernel Version')}: ${kVersion()}`
				},
				{
					name: 'System Stats',
					value: `${this.getHardwareUsage()}`
				},
				{
					name: 'Other Stats',
					value: `${bold('Uptime')}: ${time(uptime(), TimestampStyles.RelativeTime)}`
				}
			]
		});
		return interaction.reply({ embeds: this.embeds });
	}
	private getHardwareUsage() {
		const cpuMap = cpus()
			.slice(0, 2)
			.map(
				(v, i) =>
					`${bold('CPU/Model')}: ${escapeEscape(v.model)} ${bold('CPU/Speed')}: ${escapeEscape(`${v.speed}`)} ${bold('CPU/Core(s)')}: ${i}`
			)
			.join('');
		const memUsageTotal = roundNumber(memoryUsage().heapTotal / 1000000);
		const memUsageUsed = roundNumber(memoryUsage().heapUsed / 1000000);

		return `${escapeEscape(cpuMap)} ${escapeEscape(bold('Mem Usage'))} - ${bold('Used')}: ${escapeEscape(`${memUsageUsed}`)} - ${bold('Total')}: ${memUsageTotal}`;
	}
}
