import { UserLoginResponse } from '../../models/user-login-response';

export const initialState = {
    user: new UserLoginResponse(),
    isLoading: false,
    error: '',
};
