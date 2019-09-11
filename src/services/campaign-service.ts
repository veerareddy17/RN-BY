import { HttpBaseService } from './http-base-service';
import { ResponseViewModel } from '../models/response/response-view-model';
import { CampaignResponse } from '../models/response/campaign-response';
import { PaginatedResponseModel } from '../models/response/paginated-response-model';
import { APIConstants } from '../helpers/api-constants';

export class CampaignService {
    public static fetchCampaigns = async (
        pgNo: number,
    ): Promise<ResponseViewModel<PaginatedResponseModel<CampaignResponse>>> => {
        const response = await HttpBaseService.get<CampaignResponse>(APIConstants.USER_CAMPAIGNS_URL + `${pgNo}`);
        return response;
    };
}
