import { Location } from '../request/location-request';

export class LocationResponse {
    public id: string;
    public name: string;
    public location: Location;
    public check_in: Date;
    public check_out: Date;
    public city: string;
    public campaign_name: string;
}
