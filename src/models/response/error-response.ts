export class ErrorResponse {
    public property!: string;
    public message!: string;

    constructor(property: string, message: string) {
        this.message = message;
        this.property = property;
    }
}