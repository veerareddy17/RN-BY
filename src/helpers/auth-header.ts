import storage from '../database/storage-service';

export default async function authHeader() {
    // return authorization header with jwt token
    try {
        let userToken = await storage.getUserToken();
        console.log('Auth-Header - token :', userToken);
        if (userToken) {
            return { Authorization: 'jwt ' + userToken };
        } else {
            return {};
        }
    } catch (error) {
        console.log('Something went wrong', error);
    }
}
