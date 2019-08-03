import { userLoginModel } from './userLoginModel';

export const initialState = {
    user: new userLoginModel(),
    isLoading: false,
    error: '',
};
