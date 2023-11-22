import { Request, Response, Next } from 'restify';

export default class RestUseCases {

    handlePing(req: Request, res: Response, next: Next) {
        res.send('hello ' + req.params.name);
        next();
    }

}
