import { PaginatedResponseModel } from './paginated-response-model';

export class LeadFilterResponse {
    public filteredPaginatedLeadList = new PaginatedResponseModel<LeadFilterResponse>();
    public filteredLeadList = [];
    public flag = '';
}
