import AsyncStorage from '@react-native-community/async-storage';

export default async function authHeader() {
    // return authorization header with jwt token
    try {
        let userData = await AsyncStorage.getItem('user');
        let user = JSON.parse(userData);
        if (user && user.token) {
            return { Authorization: 'jwt ' + user.token };
        } else {
            return {};
        }
    } catch (error) {
        console.log('Something went wrong', error);
    }
}
