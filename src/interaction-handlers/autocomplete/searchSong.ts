import { ApplyOptions } from '@sapphire/decorators';
import { InteractionHandler, InteractionHandlerTypes } from '@sapphire/framework';
import { AutocompleteInteraction } from 'discord.js';

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
				const res = await this.container.client.manager.search(focused.value, interaction.user);

				return this.some(res.tracks.slice(0, 20).map((track) => ({ name: `${track.title} by ${track.author}`, value: track.uri })));
			}
			default:
				return this.none();
		}
	}
}
