import { ApplyOptions } from '@sapphire/decorators';
import { container, Listener } from '@sapphire/framework';
import { Node } from 'riffy';

@ApplyOptions<Listener.Options>({
	emitter: container.client.riffy,
	event: 'nodeConnect'
})
export class NodeListeners extends Listener {
	public override run(node: Node) {
		this.container.logger.info(`Connected to node: ${node.name}.`);
	}
}
