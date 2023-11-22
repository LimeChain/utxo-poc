import injector from './core/utilities/injector/Injector';
import EthObserver from './eth-observer/presentation/EthObserver';
import RestServer from './rest/presentation/RestServer';

export default class App {

    async start() {
        await injector.init();

        const restServer = new RestServer();
        restServer.start();

        const ethObserver = new EthObserver();
        ethObserver.start();
    }

}
