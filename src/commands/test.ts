import { ApplyOptions, RequiresClientPermissions } from '@sapphire/decorators';
import { ApplicationCommandRegistry, type ChatInputCommand, Command } from '@sapphire/framework';
import { ChatInputCommandInteraction, PermissionFlagsBits, subtext } from 'discord.js';

@ApplyOptions<ChatInputCommand.Options>({
	description: 'Gay.',
	preconditions: ['OwnerOnly']
})
export class TestCommand extends Command {
	public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand((builder) => {
			builder.setName(this.name).setDescription(this.description);
		});
	}
	@RequiresClientPermissions(PermissionFlagsBits.SendMessages)
	public override async chatInputRun(interaction: ChatInputCommandInteraction, context: ChatInputCommand.RunContext) {
		return interaction.reply(subtext(`Pong! \n Command used: ${context.commandName}`));
	}
}
