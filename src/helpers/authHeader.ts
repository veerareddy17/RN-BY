import storage from '../database/storage';

export default async function authHeader() {
    // return authorization header with jwt token
    try {
        let userToken = await storage.getUserToken();
        if (userToken) {
            return { Authorization: 'jwt ' + userToken };
        } else {
            return {};
        }
    } catch (error) {
        console.log('Something went wrong', error);
    }
}
