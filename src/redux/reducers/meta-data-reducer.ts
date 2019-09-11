import { FETCH_BOARD, FETCH_STATES, FETCH_CLASSES, META_DATA_ERROR, FETCH_COMPLETE } from './../actions/action-types';
import { initialState } from "../init/meta-data-initial-state";

export default function metaDataReducer(state = initialState, action) {
    switch (action.type) {
        case FETCH_COMPLETE:
            return {
                ...state,
                isLoading: false,
            };
        case FETCH_BOARD:
            return {
                ...state,
                isLoading: true,
                boardResponse: action.payload,
            };
        case FETCH_CLASSES:
            return {
                ...state,
                isLoading: true,
                classesResponse: action.payload,
            };
        case FETCH_STATES:
            return {
                ...state,
                isLoading: true,
                stateResponse: action.payload,
            };
        case META_DATA_ERROR:
            return {
                ...state,
                isLoading: false,
                error: action.payload,
            };
        default:
            return state;
    }
} 