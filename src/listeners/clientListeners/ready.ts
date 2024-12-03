import { ApplyOptions } from '@sapphire/decorators';
import { Listener } from '@sapphire/framework';

@ApplyOptions<Listener.Options>({
	once: true
})
export class ClientListeners extends Listener {
	public override run() {
		this.container.client.manager.init(this.container.client.user!.id);
	}
}
