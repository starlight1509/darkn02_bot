import { isTextChannel } from '@sapphire/discord.js-utilities';
import { container } from '@sapphire/framework';
import { Snowflake, APIEmbed, EmbedBuilder, Colors } from 'discord.js';

export function handleChannel(channelId: Snowflake) {
	const channel = container.client.channels.cache.get(channelId);
	if (channel && isTextChannel(channel)) return channel;
	throw new Error(`Channel with ID ${channelId} is not a text channel or does not exist.`);
}

export function embedGen(data?: APIEmbed) {
	return new EmbedBuilder(data).setColor(data?.color ?? Colors.Blurple).setTimestamp();
}
