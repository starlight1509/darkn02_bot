import { ApplyOptions } from '@sapphire/decorators';
import { InteractionHandler, InteractionHandlerTypes } from '@sapphire/framework';
import { AutocompleteInteraction } from 'discord.js';
import { YouTube } from 'youtube-sr';

@ApplyOptions<InteractionHandler.Options>({
	interactionHandlerType: InteractionHandlerTypes.Autocomplete
})
export class AutocompleteHandler extends InteractionHandler {
	public override async run(interaction: AutocompleteInteraction, result: InteractionHandler.ParseResult<this>) {
		return interaction.respond(result);
	}
	public override async parse(interaction: AutocompleteInteraction) {
		if (interaction.commandName !== 'audio' || interaction.options.getSubcommand() !== 'play') return this.none();

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
