import { LOCATION_CAPTURE_SUCCESS, LOCATION_CAPTURE_FAILURE, LOCATION_CAPTURE_START } from '../actions/action-types';

export interface Location {
    latitude: number;
    longitude: number;
}
export interface LocationState {
    location: Location;
    isLoading: boolean;
    status: string;
}

interface LoadLocationStart {
    type: typeof LOCATION_CAPTURE_START;
}
interface LoadLocationSuccess {
    type: typeof LOCATION_CAPTURE_SUCCESS;
    payload: Location;
}
interface LoadLocationError {
    type: typeof LOCATION_CAPTURE_FAILURE;
    err: string;
}
export type LocationActionTypes = LoadLocationStart | LoadLocationSuccess | LoadLocationError;
