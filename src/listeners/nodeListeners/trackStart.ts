import { embedGen, handleChannel } from '#lib/utils';
import { ApplyOptions } from '@sapphire/decorators';
import { container, Listener } from '@sapphire/framework';
import { Colors } from 'discord.js';
import { Player, Track } from 'magmastream';

@ApplyOptions<Listener.Options>({
	emitter: container.client.manager,
	event: 'trackStart'
})
export class NodeListeners extends Listener {
	public override run(player: Player, track: Track) {
		handleChannel(player.textChannel!).send({
			embeds: embedGen({
				title: 'Current track',
				description: `Title: ${track.title}\nAuthor: ${track.author}`,
				thumbnail: {
					url: `${track.displayThumbnail()}`
				},
				color: Colors.Blurple
			})
		});
	}
}
