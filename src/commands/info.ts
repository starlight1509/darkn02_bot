import { embedGen } from '#lib/utils/userUtils';
import { ApplyOptions } from '@sapphire/decorators';
import { Subcommand } from '@sapphire/plugin-subcommands';
import { DurationFormatter } from '@sapphire/time-utilities';
import { bold, GuildMember, hyperlink, time, TimestampStyles, userMention, version as djsVersion } from 'discord.js';
import { version as SapphireVersion } from '@sapphire/framework';
import { arch, cpus, release, uptime, freemem, totalmem, type } from 'node:os';
import { toTitleCase, roundNumber } from '@sapphire/utilities';
import { N02Subcommand } from '#lib/classes/N02Command';

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
export class InfoCommand extends N02Subcommand {
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
		const activities = member.presence?.activities.map((activity) => `\n- ${activity.name}`).join('') ?? 'None';

		this.embeds = embedGen({
			title: 'User Informations',
			description: `Current Activity: ${activities}`,
			fields: [
				{
					name: 'Identifier',
					value: `${bold('Username')}: ${member.user.tag} | ${userMention(member.id)}\n${bold('User/ID')}: ${member.id}`
				},
				{
					name: 'User Stats',
					value: `${bold('Joined Discord')}: ${time(member.user.createdAt, TimestampStyles.RelativeTime)}\n${bold('Joined Server')}: ${time(member.joinedAt!, TimestampStyles.RelativeTime)}`
				},
				{
					name: 'Other Stats',
					value: `${bold('Presence/Status')}: ${toTitleCase(member.presence!.status)}\n${bold('Role(s)')}: ${member.roles.cache.size}\n${bold('Bot?')} ${(member.user.bot ? member.user.bot : 'Yes', 'No')}`
				}
			],
			thumbnail: {
				url: member.user.displayAvatarURL({ size: 1024 })
			}
		});

		return interaction.reply({ embeds: [this.embeds] });
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
					value: `${bold('Name')}: ${interaction.guild!.name}\n${bold('ID')}: ${interaction.guildId!}\n${bold('Owner')}: ${userMention(interaction.guild!.ownerId)}\n${bold('Created In')}: ${time(interaction.guild!.createdAt, TimestampStyles.RelativeTime)}`
				},
				{
					name: 'Size/Total',
					value: `${bold('Member(s)')}:\n- All: ${interaction.guild?.members.cache.size} (User(s): ${memberFilter} | Bot(s): ${botFilter})\n${bold('Channel(s)')}: ${interaction.guild!.channels.cache.size}\n${bold('Role(s)')}: ${interaction.guild!.roles.cache.size}`
				},
				{
					name: 'Presence/Status',
					value: `${bold('Online')}: ${interaction.guild!.presences.cache.filter((p) => p.status === 'online').size}\n${bold('Idle')}: ${interaction.guild!.presences.cache.filter((p) => p.status === 'idle').size}\n${bold('DND/Do Not Disturb')}: ${interaction.guild!.presences.cache.filter((p) => p.status === 'dnd').size}\n${bold('Invisible/Offline')}: ${interaction.guild!.presences.cache.filter((p) => p.status === 'invisible' || p.status === 'offline').size}`
				},
				{
					name: 'Misc',
					value: `${bold('Verified?')}: ${(interaction.guild!.verified ? interaction.guild!.verified : 'Yes', 'No')}\n${bold('NotSafeForWork (NSFW) Level')}: ${nsfwLevel[interaction.guild!.nsfwLevel]}\n${bold('Explicit Filter')}: ${explicitFilter[interaction.guild!.explicitContentFilter]}`
				}
			],
			thumbnail: {
				url: interaction.guild!.iconURL({ size: 1024 })!
			}
		});

		return interaction.reply({ embeds: [this.embeds] });
	}
	public async botInfo(interaction: Subcommand.ChatInputCommandInteraction) {
		const owner = this.container.client.users.cache.get(process.env['OWNER_ID'])!;
		const cId = this.container.client.user!.id || process.env['APPLICATION_ID'];

		this.embeds = embedGen({
			title: 'Bot Informations',
			description: `A ${hyperlink('discord.js', 'https://discord.js.org/')} | ${hyperlink('Sapphire Framework', 'https://sapphirejs.dev/')} bot created by ${userMention(owner.id)}`,
			fields: [
				{
					name: 'Identifier',
					value: `${bold('User/Tag')}: ${this.container.client.user!.tag}\n${bold('ID')}: ${cId}\n${bold('Created since')}: ${time(this.container.client.user!.createdAt, TimestampStyles.RelativeTime)}`
				},
				{
					name: 'Stats',
					value: `${bold('Uptime')}: ${this.duration.format(this.container.client.uptime!)}\n${bold('Guild(s)')}: ${this.container.client.guilds.cache.size}\n${bold('Channel(s)')}: ${`${this.container.client.channels.cache.size}`}\n${bold('User(s)')}: ${this.container.client.users.cache.size}\n${bold('Ping/Latency')}: Bot: ${roundNumber(interaction.createdAt.getSeconds())}ms | API: ${roundNumber(this.container.client.ws.ping)}ms`
				},
				{
					name: 'Libraries',
					value: `${bold('Nodejs')}: ${process.version}\n${bold('Discordjs')}: ${djsVersion}\n${bold('Sapphire Framework')}: ${SapphireVersion}`
				}
			],
			thumbnail: {
				url: this.container.client.user!.displayAvatarURL({ size: 1024 })
			}
		});
		return interaction.reply({ embeds: [this.embeds] });
	}
	public async sysInfo(interaction: Subcommand.ChatInputCommandInteraction) {
		this.embeds = embedGen({
			title: 'System Informations',
			fields: [
				{
					name: 'OS Stats',
					value: `${bold('System')}: ${toTitleCase(release())} (${type()})\n${bold('Architecture')}: ${arch()}`
				},
				{
					name: 'System Stats',
					value: `${this.getHardwareUsage()}`
				},
				{
					name: 'Other Stats',
					value: `${bold('Uptime')}: ${this.duration.format(uptime() * 1000)}`
				}
			]
		});
		return interaction.reply({ embeds: [this.embeds] });
	}
	private getHardwareUsage() {
		const memUsageTotal = roundNumber(totalmem() / 1048576);
		const memUsageFree = roundNumber(freemem() / 1048576);

		return `${bold('CPU/Model')}: ${cpus()[0].model}\n${bold('CPU/Speed')}: ${cpus()[0].speed}MHz\n${bold('CPU/Core')}: ${cpus().length}\n${bold('Mem Usage')}\n- Free: ${memUsageFree}MB\n- Total: ${memUsageTotal}MB`;
	}
}
