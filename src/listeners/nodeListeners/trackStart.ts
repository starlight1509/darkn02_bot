import { embedGen, handleChannel } from '#lib/utils';
import { ApplyOptions } from '@sapphire/decorators';
import { container, Listener } from '@sapphire/framework';
import { Colors, hyperlink, userMention } from 'discord.js';
import { Player, Track } from 'magmastream';
import { DurationFormatter } from '@sapphire/time-utilities';

@ApplyOptions<Listener.Options>({
	emitter: container.client.manager,
	event: 'trackStart'
})
export class NodeListeners extends Listener {
	public override async run(player: Player, track: Track) {
		const trackDuration = new DurationFormatter().format(track.duration);
		const p = await handleChannel(player.textChannel!)!.send({
			embeds: embedGen({
				title: 'Now Playing',
				description: `${hyperlink('Track URL', track.uri)}`,
				fields: [
					{
						name: 'Title',
						value: `${track.title}`
					},
					{
						name: 'Author',
						value: `${track.author}`,
						inline: true
					},
					{
						name: 'Duration',
						value: `${trackDuration}`,
						inline: true
					},
					{
						name: 'Requester',
						value: `${userMention(track.requester!.id)}`
					},
					{
						name: 'Volume',
						value: `${player.volume}%`
					}
				],
				thumbnail: {
					url: `${track.displayThumbnail()}`
				},
				color: Colors.Blurple
			})
		});
		player.setNowPlayingMessage(p);
	}
}
