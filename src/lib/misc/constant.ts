import { GatewayIntentBits } from "discord.js";

export const intents = [
	GatewayIntentBits.GuildMembers,
	GatewayIntentBits.GuildPresences,
	GatewayIntentBits.MessageContent,
	GatewayIntentBits.Guilds
]
