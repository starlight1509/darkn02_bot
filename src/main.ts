import '#lib/setup';
import { DarkBot } from '#lib/classes';

const client = new DarkBot();

void (async () => {
	try {
		client.logger.info('Loading Entrance');
		await client.login();
		client.logger.info(`Entrance Loaded \n User: ${client.user?.tag}`);
	} catch {
		client.logger.fatal('Loading Entrance failed.');
		await client.destroy();
		process.exit(1);
	}
})();
