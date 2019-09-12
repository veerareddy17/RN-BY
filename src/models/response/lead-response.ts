import { CampaignResponse } from './campaign-response';
import { CountryResponse } from './country-response';
import { StateResponse } from './state-response';
import { UserResponse } from './user-response';
import { Location } from '../request/location-request';
import { MetaResponse } from './meta-response';

export class LeadResponse {
    public id: string;
    public name: string;
    public parent_name: string;
    public email: string;
    public phone: string;
    public alternate_phone: string;
    public classes: MetaResponse;
    public classes_id: number;
    public board: MetaResponse;
    public board_id: number;
    public school_name: string;
    public address: string;
    public country: CountryResponse;
    public state: StateResponse;
    public city: string;
    public pin_code: number;
    public comments: string;
    public siblings: JSON;
    public created_at: Date;
    public campaign: CampaignResponse;
    public campaign_id: string;
    public user: UserResponse;
    public location: Location;
    public sync_status: boolean;
}
