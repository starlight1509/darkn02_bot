import { handleChannel } from '#lib/utils/userUtils';
import { ApplyOptions } from '@sapphire/decorators';
import { container, Listener } from '@sapphire/framework';
import { Player } from 'magmastream';

@ApplyOptions<Listener.Options>({
	emitter: container.client.manager
})
export class TrackListeners extends Listener {
	public override async run(player: Player) {
		if (player.isAutoplay) player.setAutoplay(true, this.container.client);
		else player.destroy();
		handleChannel(player.textChannel!)!.send('Queue has ended.');
	}
}
