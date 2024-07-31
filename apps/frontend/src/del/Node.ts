export abstract class Node {
    name: string

    protected constructor(conf: {name: string}) {
        this.name = conf.name;
    }

}

export class Hello {

    public world() {
        return "world"
    }
}