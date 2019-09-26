import { Location } from './location-request';

export class Attendance {
    public campaign_id!: string;
    public location!: Location;
    public check_in!: string;
    public check_out!: string;
    public check_out_flag!: boolean;
}