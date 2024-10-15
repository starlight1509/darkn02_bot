import { AllFlowsPrecondition } from '@sapphire/framework';
import { envParseArray } from '@skyra/env-utilities';
import type { CommandInteraction, ContextMenuCommandInteraction, Message, Snowflake } from 'discord.js';

const ownerIds = envParseArray('OWNER_ID');

export class UserPrecondition extends AllFlowsPrecondition {
	#message = 'This command can only be used by the owner.';

	public override chatInputRun(interaction: CommandInteraction) {
		return this.doOwnerCheck(interaction.user.id);
	}

	public override contextMenuRun(interaction: ContextMenuCommandInteraction) {
		return this.doOwnerCheck(interaction.user.id);
	}

	public override messageRun(message: Message) {
		return this.doOwnerCheck(message.author.id);
	}

	private doOwnerCheck(userId: Snowflake) {
		return ownerIds.includes(userId) ? this.ok() : this.error({ message: this.#message });
	}
}
