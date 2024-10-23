import { ApplyOptions, RequiresClientPermissions } from '@sapphire/decorators';
import { ChatInputCommand, Command } from '@sapphire/framework';
import { PermissionFlagsBits, subtext } from 'discord.js';

@ApplyOptions<ChatInputCommand.Options>({
	description: 'Gay.',
	preconditions: ['OwnerOnly']
})
export class TestCommand extends Command {
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
