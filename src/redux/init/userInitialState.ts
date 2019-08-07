import { UserLoginResponse } from '../../models/userLoginResponse';

export const initialState = {
    user: new UserLoginResponse(),
    isLoading: false,
    error: '',
};
