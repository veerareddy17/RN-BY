import { FETCH_BOARD, FETCH_STATES, FETCH_CLASSES, META_DATA_ERROR } from './../actions/action-types';
import { initialState } from "../init/meta-data-initial-state";

export default function metaDataReducer(state = initialState, action) {
    switch (action.type) {
        case FETCH_BOARD:
            return {
                ...state,
                boardResponse: action.payload,
            };
        case FETCH_CLASSES:
            return {
                ...state,
                classesResponse: action.payload,
            };
        case FETCH_STATES:
            return {
                ...state,
                stateResponse: action.payload,
            };
        case META_DATA_ERROR:
            return {
                ...state,
                error: action.payload,
            };
        default:
            return state;
    }
}