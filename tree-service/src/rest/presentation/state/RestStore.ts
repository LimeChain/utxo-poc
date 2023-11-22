import { Request, Response, Next } from 'restify';

import RestUseCases from '../../use-cases/RestUseCases';

export default class RestStore {

    restUseCases: RestUseCases;

    constructor(restUseCases: RestUseCases) {
        this.restUseCases = restUseCases;
    }

    handlePing = (req: Request, res: Response, next: Next) => {
        this.restUseCases.handlePing(req, res, next);
    }

}
