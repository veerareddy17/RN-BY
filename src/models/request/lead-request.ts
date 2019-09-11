import { Location } from './location-request';
export class LeadRequest {
    public id = '';
    public name = '';
    public parent_name = '';
    public email = '';
    public phone = '';
    public alternate_phone = '';
    public classes_id = '';
    public board_id = '';
    public school_name = '';
    public address = '';
    public country_id = '';
    public state_id = '';
    public city = '';
    public pin_code = 0;
    public comments = '';
    public siblings = Array<SiblingRequest>();
    public campaign_id = '';
    public location: Location;
    public sync_status = false;
    public created_at = '';
}

export class SiblingRequest {
    public name = '';
    public classes_id = '';
}
