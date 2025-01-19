import { ApplyOptions } from '@sapphire/decorators';
import { Listener } from '@sapphire/framework';
import { VoiceState } from 'discord.js';

@ApplyOptions<Listener.Options>({})
export class ClientListener extends Listener {
	public override run(oldState: VoiceState, newState: VoiceState) {
		if (oldState.channel === null && newState !== null) return;
		this.container.logger.debug(newState);
	}
}
