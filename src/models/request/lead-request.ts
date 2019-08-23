export class LeadRequest {
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
    public country_id: number;
    public state_id: number;
    public city: string;
    public pin_code: number;
    public comments: string;
    public siblings: JSON;
    public campaign_id: string;
}
