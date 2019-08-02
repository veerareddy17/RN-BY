import { userLoginModel } from './userLoginModel';

export const initialState = {
    user: new userLoginModel(),
    isLoggedIn: false,
    error: '',
};
