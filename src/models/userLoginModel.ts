export class UserLoginModel {
    public id?: string;
    public role?: string;
    public token?: string;

    constructor(id: string, role: string, token: string) {
        this.id = id;
        this.role = role;
        this.token = token;
    }
}
