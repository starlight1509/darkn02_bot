import { ApplyOptions } from '@sapphire/decorators';
import { container, Listener } from '@sapphire/framework';
import { Node } from 'magmastream';

@ApplyOptions<Listener.Options>({
	emitter: container.client.manager
})
export class NodeListeners extends Listener {
	public override run(node: Node, error: Error) {
		this.container.logger.info(`Encountered an error in node: ${node.options.identifier}\nError: ${error.message}`);
	}
}
