import { exec } from 'child_process';
import ShellRepo from '../../use-cases/repos/ShellRepo';

export default class ShellRepoImpl implements ShellRepo {

    exec(command: string): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            exec(command, (error, stdout, stderr) => {
                if (error) {
                    reject(error);
                    return;
                }
                if (stderr) {
                    reject(stderr);
                    return;
                }
                resolve(stdout);
            });
        });
    }

}
