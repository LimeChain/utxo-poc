import restify from 'restify';
import RestStore from './state/RestStore';
import injector from '../../core/utilities/injector/Injector';
import RestEndpoints from '../utilities/RestEndpoints';

export default class RestServer {

    restStore: RestStore;

    constructor() {
        this.restStore = injector.getRestStore();
    }

    async start() {
        var server = restify.createServer();

        server.get(RestEndpoints.PING_ENDPOINT, this.restStore.handlePing);

        server.listen(parseInt(process.env.REST_PORT ?? "8080"), () => {
            console.log('%s listening at %s', server.name, server.url);
        });
    }

}
