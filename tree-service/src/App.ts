import injector from './core/utilities/injector/Injector';
import EthObserver from './eth-observer/presentation/EthObserver';

export default class App {

    async start() {
        await injector.init();

        const ethObserver = new EthObserver();
        ethObserver.start();
    }

}
