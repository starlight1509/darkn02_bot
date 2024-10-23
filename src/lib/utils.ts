import { APIEmbed, EmbedBuilder } from 'discord.js';

export function embedGen(data?: APIEmbed): EmbedBuilder[] {
	return [new EmbedBuilder(data)];
}
