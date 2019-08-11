import { CampaignResponse } from './campaign-response';
import { CountryResponse } from './country-response';
import { StateResponse } from './state-response';

export class LeadResponse {
    public id: string;
    public name: string;
    public parent_name: string;
    public email: string;
    public phone: string;
    public alternate_phone: string;
    public class_name: string;
    public school_board: string;
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
}
