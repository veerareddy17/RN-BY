import Config from '../helpers/config';
import axios from 'axios';
import StorageService from '../database/storage-service';
import { ResponseViewModel } from '../models/response/response-view-model';
import { StorageConstants } from '../helpers/storage-constants';
import { PaginatedResponseModel } from '../models/response/paginated-response-model';
interface AxiosErrorResponse {
    status: number;
}
interface AxiosError {
    response: AxiosErrorResponse;
}
export class HttpBaseService {
    public static init(unAuthorizedCallback: () => void) {
        axios.defaults.baseURL = Config.api.baseURL;
        axios.defaults.headers = {
            'content-type': 'application/json',
            'vnd_source': 'APP'
        };
        axios.interceptors.request.use(
            async config => {
                const token = await StorageService.get<string>(StorageConstants.TOKEN_KEY);
                if (token) {
                    config.headers = {
                        ...config.headers,
                        Authorization: `jwt ${token}`,
                    };
                }
                // console.log('request headers', config.headers);
                return config;
            },
            (error: any) => {
                return Promise.reject(error);
            },
        );
        axios.interceptors.response.use(
            response => {
                return response;
            },
            async (error: AxiosError) => {
                console.log('error in getting response', error);
                if (error.response && error.response.status === 401) {
                    console.log('unauthorized');
                    if (unAuthorizedCallback) {
                        await StorageService.removeKey(StorageConstants.TOKEN_KEY);
                        unAuthorizedCallback();
                        Promise.reject(error);
                        return;
                    }
                }
                return Promise.reject(error);
            },
        );
    }

    // Paginated GET
    public static async get<T>(url: string): Promise<ResponseViewModel<PaginatedResponseModel<T>>> {
        try {
            let response = await axios.get<ResponseViewModel<PaginatedResponseModel<T>>>(url);
            return response.data;
        } catch (e) {
            throw e;
        }
    }

    // Non-Paginated GET
    public static async _get<T>(url: string): Promise<ResponseViewModel<T>> {
        try {
            let response = await axios.get<ResponseViewModel<T>>(url);
            return response.data;
        } catch (e) {
            throw e;
        }
    }

    public static async post<Req, Res>(url: string, body: Req) {
        let response = await axios.post<ResponseViewModel<Res>>(url, JSON.stringify(body));
        return response.data;
    }
}
