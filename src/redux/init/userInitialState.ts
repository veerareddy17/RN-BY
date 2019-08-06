import { UserLoginModel } from '../../models/userLoginModel';

export const initialState = {
    user: new UserLoginModel(),
    isLoading: false,
    error: '',
};
