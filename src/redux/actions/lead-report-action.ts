import { ErrorResponse } from './../../models/response/error-response';
import { Dispatch } from 'redux';
import { LeadService } from '../../services/lead-service';
import { fetchLeadReportAction, leadReportStartAction, leadReportFailureAction } from './lead-report-action-creator';
import { errorCallAction, serverErrorCallAction, errorCallResetAction } from './error-actions';

export const fetchLeadReport = (): ((dispatch: Dispatch, getState: any) => Promise<void>) => {
    return async (dispatch: Dispatch, getState) => {
        try {
            let isConnected = getState().connectionStateReducer.isConnected;
            if (!isConnected) {
                let response = getState().leadReportReducer.leadReport;
                dispatch(fetchLeadReportAction(response));
                return;
            }
            dispatch(errorCallResetAction());
            dispatch(leadReportStartAction());
            const response = await LeadService.fetchLeadReport();
            if (response && response.data) {
                dispatch(fetchLeadReportAction(response.data));
            } else {
                dispatch(errorCallAction(response.errors));
                dispatch(leadReportFailureAction(response.errors));
            }
        } catch (e) {
            let errors = Array<ErrorResponse>();
            errors.push(new ErrorResponse('Server', e.message));
            dispatch(serverErrorCallAction(errors));
            dispatch(leadReportFailureAction(e));
        }
    };
};
