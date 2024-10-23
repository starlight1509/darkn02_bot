import { ApplyOptions } from '@sapphire/decorators';
import { container, Listener } from '@sapphire/framework';
import { Player } from 'riffy';

@ApplyOptions<Listener.Options>({
	emitter: container.client.riffy,
	event: 'queueEnd'
})
export class NodeListeners extends Listener {
	public override run(player: Player) {
		const channel = this.container.client.channels.cache.get(player.textChannel);

		const autoplay = false;
		if (channel?.isTextBased && channel.isSendable()) {
			if (autoplay) {
				player.autoplay(player);
			} else {
				player.destroy();
				channel.send('Queue has ended.');
			}
		}
	}
}
