import { handleChannel } from '#lib/utils';
import { ApplyOptions } from '@sapphire/decorators';
import { container, Listener } from '@sapphire/framework';
import { Player } from 'magmastream';

@ApplyOptions<Listener.Options>({
	emitter: container.client.manager,
	event: 'queueEnd'
})
export class NodeListeners extends Listener {
	public override async run(player: Player) {
		if (player.isAutoplay) player.isAutoplay;
		else player.destroy();
		handleChannel(player.textChannel!).send('Queue has ended.');
	}
}
