import { N02Command } from '#lib/classes/N02Command';
import { ApplyOptions, RequiresClientPermissions } from '@sapphire/decorators';
import { ChatInputCommand } from '@sapphire/framework';
import { PermissionFlagsBits, subtext } from 'discord.js';

@ApplyOptions<ChatInputCommand.Options>({
	description: 'Gay.',
	preconditions: ['OwnerOnly'],
	enabled: false
})
export class TestCommand extends N02Command {
	public override registerApplicationCommands(registry: ChatInputCommand.Registry) {
		registry.registerChatInputCommand((builder) => {
			builder.setName(this.name).setDescription(this.description);
		});
	}
	@RequiresClientPermissions(PermissionFlagsBits.SendMessages)
	public override async chatInputRun(interaction: ChatInputCommand.Interaction) {
		return interaction.reply(`Pong!\n${subtext(`Command used: ${interaction.commandName}`)}`);
	}
}
