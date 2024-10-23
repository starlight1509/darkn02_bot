import { ApplyOptions } from '@sapphire/decorators';
import { container, Listener } from '@sapphire/framework';
import { Node } from 'riffy';

@ApplyOptions<Listener.Options>({
	emitter: container.client.riffy,
	event: 'nodeError'
})
export class NodeListeners extends Listener {
	public override run(node: Node, error: Error) {
		this.container.logger.info(`Encountered an error in node: ${node.name}\nError: ${error.message}`);
	}
}
