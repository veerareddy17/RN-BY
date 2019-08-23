export class Location {
    public latitude: number;
    public longitude: number;

    constructor(latitude: number, longitude: number) {
        this.latitude = latitude;
        this.longitude = longitude;
    }
}

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
