import { Location } from './location-request';

export class AuthenticationRequest {
    public email: string;
    public password: string;
    public location: Location;

    constructor(email: string, password: string, location: Location) {
        this.email = email;
        this.password = password;
        this.location = location;
    }
}
