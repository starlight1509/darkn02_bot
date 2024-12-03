import { embedGen, handleChannel } from '#lib/utils';
import { ApplyOptions } from '@sapphire/decorators';
import { container, Listener } from '@sapphire/framework';
import { Colors } from 'discord.js';
import { Player, Track } from 'riffy';

@ApplyOptions<Listener.Options>({
	emitter: container.client.manager,
	event: 'trackStart'
})
export class NodeListeners extends Listener {
	public override run(player: Player, track: Track) {
		handleChannel(player.textChannel).send({
			embeds: embedGen({
				title: 'Current',
				description: `Track title: ${track.info.title}\nTrack author: ${track.info.author}`,
				color: Colors.Blurple
			})
		});
	}
}
