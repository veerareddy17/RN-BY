import { Location } from "./location-request";

export class LeadRequest {
    public id: string | undefined;
    public name: string | undefined;
    public parent_name: string | undefined;
    public email: string | undefined;
    public phone: string | undefined;
    public alternate_phone: string | undefined;
    public classes_id: string | undefined;
    public board_id: string | undefined;
    public school_name: string | undefined;
    public address: string | undefined;
    public country_id: string | undefined;
    public state_id: string | undefined;
    public city: string | undefined;
    public pin_code: number | undefined;
    public comments: string | undefined;
    public siblings: JSON | undefined;
    public campaign_id: string | undefined;
    public location: Location | undefined
}
