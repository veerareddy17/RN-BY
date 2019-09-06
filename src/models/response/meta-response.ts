export class MetaResponse {
    public id: string;
    public name: string;
    public created_at?: Date;

    constructor(id: string, name: string) {
        this.id = id;
        this.name = name;
    }
}
