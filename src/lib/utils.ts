import { container } from '@sapphire/framework';
import { ActionRowBuilder, APIEmbed, ButtonBuilder, ButtonStyle, Colors, EmbedBuilder, Snowflake, StringSelectMenuBuilder } from 'discord.js';
import { isTextChannel } from '@sapphire/discord.js-utilities';
import { Queue } from 'magmastream';

export function embedGen(data?: APIEmbed): EmbedBuilder[] {
	return [new EmbedBuilder(data).setTimestamp().setColor(Colors.Blurple)];
}

export function handleChannel(channelId: Snowflake) {
	const channel = container.client.channels.cache.get(channelId)!;
	if (isTextChannel(channel)) return channel;
	else return;
}

export function queueListBuilder(row: ActionRowBuilder, queue: Queue) {
	const listForward = new ButtonBuilder().setCustomId('list-forward').setEmoji(':arrow_forward:').setStyle(ButtonStyle.Primary);
	const listBackward = new ButtonBuilder().setCustomId('list-backward').setEmoji(':arrow_backward:').setStyle(ButtonStyle.Primary);
	const listJump = new StringSelectMenuBuilder().setCustomId('list-jump');
	const listClose = new ButtonBuilder().setCustomId('list-close').setStyle(ButtonStyle.Danger);

	for (const mapped of queue) {
		listJump.setOptions({ label: `${mapped.title}`, value: `${queue.length++}` });
	}

	return row.addComponents(listBackward, listForward, listClose, listJump);
}
