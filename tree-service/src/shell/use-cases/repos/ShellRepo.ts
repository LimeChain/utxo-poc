export default interface ShellRepo {

    exec(command: string): Promise<string>;

}
