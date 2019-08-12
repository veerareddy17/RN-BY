import { HttpBaseService } from './http-base-service';
import StorageService from '../database/storage-service';
import { ResponseViewModel } from '../models/response/response-view-model';
import { StorageConstants } from '../helpers/storage-constants';
import { CampaignResponse } from '../models/response/campaign-response';
import { PaginatedResponseModel } from '../models/response/paginated-response-model';
import { APIConstants } from '../helpers/api-constants';

export class CampaignService {
    public static fetchCampaigns = async (
        pgNo: number,
    ): Promise<ResponseViewModel<PaginatedResponseModel<CampaignResponse>>> => {
        const response = await HttpBaseService.get<CampaignResponse>(APIConstants.USER_CAMPAIGNS_URL + `${pgNo}`);
        console.log('Campaigns Response : ', response);
        if (response && response.data) {
            try {
                await StorageService.store(StorageConstants.USER_CAMPAIGNS, response.data.data);
            } catch (error) {
                console.log('Error in storing asyncstorage', error);
            }
        } else {
            console.log('Failure');
        }
        return response;
    };
}
