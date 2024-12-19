// import { queueListBuilder } from "#lib/utils";
// import { ApplyOptions } from "@sapphire/decorators";
// import { InteractionHandler, InteractionHandlerTypes } from "@sapphire/framework";
// import { ActionRowBuilder, ButtonInteraction } from "discord.js";

// @ApplyOptions<InteractionHandler.Options>({
// 	interactionHandlerType: InteractionHandlerTypes.Button
// })
// export class ButtonHandler extends InteractionHandler {
// 	public override async run(interaction: ButtonInteraction, result: InteractionHandler.ParseResult<this>) {
// 		return interaction.editReply({ components: [result] });
// 	}

// 	public override async parse(interaction: ButtonInteraction) {
// 		await interaction.deferReply();
// 		const { queue } = this.container.client.manager.players.get(interaction.guildId!)!;

// 		const q = queueListBuilder(new ActionRowBuilder(), queue);

// 		switch (interaction.customId) {
// 			case 'list-forward':
// 			case 'list-backward':

// 			default:
// 				return this.none();
// 		}
// 	}
// }
