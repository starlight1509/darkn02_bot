import '#lib/setup';
import { N02Client } from '#lib/classes/N02Client';

const client = new N02Client();

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
