import { isTextChannel } from '@sapphire/discord.js-utilities';
import { container } from '@sapphire/framework';
import { Snowflake, GuildMember, CommandInteraction, APIEmbed, EmbedBuilder, Colors } from 'discord.js';

export function handleChannel(channelId: Snowflake) {
	const channel = container.client.channels.cache.get(channelId);
	if (channel && isTextChannel(channel)) return channel;
	throw new Error(`Channel with ID ${channelId} is not a text channel or does not exist.`);
}

export async function checkVoice(member: GuildMember, interaction: CommandInteraction) {
	if (member.voice.channelId) return true;
	else return interaction.reply({ content: 'Please join a voice channel.', ephemeral: true });
}

export function embedGen(data?: APIEmbed) {
	return new EmbedBuilder(data).setColor(data?.color ?? Colors.Blurple).setTimestamp();
}
