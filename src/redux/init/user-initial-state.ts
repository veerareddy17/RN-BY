import { AuthenticationResponse } from '../../models/response/authentication-response';

export const initialState = {
    user: new AuthenticationResponse(),
    isLoading: false,
    error: '',
};
