export default class Websocket {
    public name: string;
    public function: any;

    constructor(name: string, func: any) {
        this.name = name;
        this.function = func;
    }
}