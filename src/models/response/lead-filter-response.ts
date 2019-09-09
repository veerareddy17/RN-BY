import { PaginatedResponseModel } from './paginated-response-model';
import { LeadResponse } from './lead-response';

export class LeadFilterResponse {
    public paginatedLeadList = new PaginatedResponseModel<LeadResponse>();
    public leadList = [];
    public flag = '';
}
