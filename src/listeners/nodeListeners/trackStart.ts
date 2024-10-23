import { embedGen } from '#lib/utils';
import { ApplyOptions } from '@sapphire/decorators';
import { container, Listener } from '@sapphire/framework';
import { Colors } from 'discord.js';
import { Player, Track } from 'riffy';

@ApplyOptions<Listener.Options>({
	emitter: container.client.riffy,
	event: 'trackStart'
})
export class NodeListeners extends Listener {
	public override run(player: Player, track: Track) {
		const channel = this.container.client.channels.cache.get(player.textChannel!);
		if (channel?.isTextBased && channel.isSendable()) {
			channel.send({
				embeds: embedGen({
					title: 'Current',
					description: `Track title: ${track.info.title}\nTrack author: ${track.info.author}`,
					color: Colors.Blurple
				})
			});
		}
	}
}
