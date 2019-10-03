import { CLEAR_CAMPAIGN_SELECTED } from './../actions/action-types';
import { ATTENDANCE_UPDATE, SYNC_ATTENDANCE_SUCCESS, SYNC_ATTENDANCE_FAILURE, CAMPAIGN_SELECTED_ONLINE, CAMPAIGN_SELECTED_OFFLINE } from './../actions/action-types';
import {
    CAMPAIGN_SELECTED,
    LOAD_CAMPAIGN_START,
    LOAD_CAMPAIGN_SUCCESS,
    LOAD_CAMPAIGN_FAIL,
    FETCH_CAMPAIGN,
} from '../actions/action-types';
import { initialState } from '../init/campaign-initial-state';

export default function campaignReducer(state = initialState, action) {
    switch (action.type) {
        case FETCH_CAMPAIGN:
            return {
                ...state,
                status: 'done',
                isLoading: false,
                campaignList: action.payload,
            };
        case LOAD_CAMPAIGN_START:
            return {
                ...state,
                isLoading: true,
                error: '',
            };
        case LOAD_CAMPAIGN_SUCCESS:
            return {
                ...state,
                status: 'done',
                isLoading: false,
            };
        case LOAD_CAMPAIGN_FAIL:
            return {
                ...state,
                status: 'fail',
                isLoading: false,
                error: action.payload,
            };
        case CAMPAIGN_SELECTED:
            return {
                ...state,
                isLoading: false,
                selectedCampaign: action.payload,
            };
        case CLEAR_CAMPAIGN_SELECTED:
            return {
                ...state,
                isLoading: false,
                selectedCampaign: '',
            };
        case CAMPAIGN_SELECTED_ONLINE:
            return {
                ...state,
                isLoading: false,
                onlineSelection: action.payload,
            };
        case CAMPAIGN_SELECTED_OFFLINE:
            return {
                ...state,
                isLoading: false,
                attendance: action.payload,
                onlineSelection: ''
            };
        case SYNC_ATTENDANCE_SUCCESS:
            return {
                ...state,
                isLoading: false,
                attendance: action.payload,
            };

        default:
            return state;
    }
}
