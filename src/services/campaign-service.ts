import { HttpBaseService } from './http-base-service';
import { ResponseViewModel } from '../models/response/response-view-model';
import { CampaignResponse } from '../models/response/campaign-response';
import { APIConstants } from '../helpers/api-constants';

export class CampaignService {
    public static fetchCampaigns = async (): Promise<ResponseViewModel<CampaignResponse>> => {
        const response = await HttpBaseService._get<CampaignResponse>(APIConstants.CAMPAIGNS_URL);
        return response;
    };
}
