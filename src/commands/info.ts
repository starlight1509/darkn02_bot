import { embedGen } from '#lib/utils';
import { ApplyOptions } from '@sapphire/decorators';
import { Subcommand } from '@sapphire/plugin-subcommands';
import { GuildMember } from 'discord.js';

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
		const tag = (interaction.options.getMember('tag') as GuildMember) ?? interaction.member;

		this.embeds = embedGen({
			title: tag.user.globalName!,
			fields: [
				{
					name: 'Nickname',
					value: tag.nickname || tag.user.globalName!
				}
			]
		});
		return interaction.reply({ embeds: this.embeds });
	}
	public async serverInfo(interaction: Subcommand.ChatInputCommandInteraction) {
		return interaction.reply({ embeds: this.embeds });
	}
	public async botInfo(interaction: Subcommand.ChatInputCommandInteraction) {
		const owner = this.container.client.users.cache.filter((u, _) => u.id).get(process.env['OWNER_ID'])!;

		this.embeds = embedGen({
			title: 'Bot Informations',
			description: `Bot owner: ${owner}`
		});
		return interaction.reply({ embeds: this.embeds });
	}
	public async sysInfo(interaction: Subcommand.ChatInputCommandInteraction) {
		this.embeds = embedGen({
			title: 'System Informations'
		});
		return interaction.reply({ embeds: this.embeds });
	}
}
