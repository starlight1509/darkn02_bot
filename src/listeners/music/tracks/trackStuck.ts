import { ApplyOptions } from '@sapphire/decorators';
import { container, Listener } from '@sapphire/framework';
import { Player } from 'magmastream';

@ApplyOptions<Listener.Options>({
	emitter: container.client.manager
})
export class TrackListener extends Listener {
	public override run(_: Player, err: Error) {
		this.container.logger.error(`Unable to play the current track.\n${err}`);
	}
}
