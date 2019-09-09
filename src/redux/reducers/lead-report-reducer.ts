import { LEAD_REPORT_FAIL, FETCH_LEAD_REPORT, LEAD_REPORT_START } from '../actions/action-types';
import { initialState } from '../init/report-initial-state';

export default function leadReportReducer(state = initialState, action) {
    switch (action.type) {
        case FETCH_LEAD_REPORT:
            return {
                ...state,
                isLoading: false,
                leadReport: action.payload,
            };
        case LEAD_REPORT_START:
            return {
                ...state,
                isLoading: true,
                error: '',
            };
        case LEAD_REPORT_FAIL:
            return {
                ...state,
                isLoading: false,
                error: action.payload,
            };
        default:
            return state;
    }
}
