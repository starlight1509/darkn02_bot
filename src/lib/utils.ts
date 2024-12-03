import { container } from '@sapphire/framework';
import { APIEmbed, Colors, EmbedBuilder, Snowflake, TextChannel } from 'discord.js';

export function embedGen(data?: APIEmbed): EmbedBuilder[] {
	return [new EmbedBuilder(data).setTimestamp().setColor(Colors.Blurple)];
}

export function handleChannel(channelId: Snowflake) {
	const channel = container.client.channels.cache.get(channelId) as TextChannel;
	return channel;
}
