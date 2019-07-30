import AsyncStorage from '@react-native-community/async-storage'

export default async function authHeader(){
    // return authorization header with jwt token
    try {
        let userData = await AsyncStorage.getItem('user')
        let user = JSON.parse(userData)
        if (user && user.data.token) {
            console.log('user-----',user.data.token);
            return { 'Authorization': 'Bearer ' + user.data.token };
        } else {
            return {};
        }
        } catch (error) {
          console.log("Something went wrong", error);
        }
}