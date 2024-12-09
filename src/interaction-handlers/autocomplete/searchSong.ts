import { ApplyOptions } from '@sapphire/decorators';
import { InteractionHandler, InteractionHandlerTypes, Command } from '@sapphire/framework';
import { YouTube } from 'youtube-sr';

@ApplyOptions<InteractionHandler.Options>({
	interactionHandlerType: InteractionHandlerTypes.Autocomplete
})
export class AutocompleteHandler extends InteractionHandler {
	public override async run(interaction: Command.AutocompleteInteraction, result: InteractionHandler.ParseResult<this>) {
		return interaction.respond(result);
	}
	public override async parse(interaction: Command.AutocompleteInteraction) {
		if (
			interaction.commandName !== 'audio' || //
			interaction.options.getSubcommand() !== 'play'
		)
			return this.none();

		const focused = interaction.options.getFocused(true);

		switch (focused.name) {
			case 'query': {
				const searches = await YouTube.search(focused.value, {
					limit: 25,
					type: 'video'
				});

				return this.some(searches.map((matches) => ({ name: matches.title!, value: matches.url })));
			}
			default:
				return this.none();
		}
	}
}
