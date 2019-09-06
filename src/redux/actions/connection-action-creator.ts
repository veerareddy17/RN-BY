import { CHANGE_CONNECTION_STATUS } from './action-types';

export const connectionStateStatus = status => {
    return {
        type: CHANGE_CONNECTION_STATUS,
        payload: status,
    };
};
