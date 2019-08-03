import AsyncStorage from '@react-native-community/async-storage';

export default class storage {
    public static storeData = async (key, value) => {
        try {
            await AsyncStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.log('AsyncStorage save error: ' + error.message);
        }
    };

    public static getDataByKey = async key => {
        try {
            const value = await AsyncStorage.getItem(key);
            return value;
        } catch (error) {
            console.log('AsyncStorage get error: ' + error.message);
        }
    };

    public static removeItemByKey = async key => {
        try {
            await AsyncStorage.removeItem(key);
        } catch (error) {
            console.log('AsyncStorage get error: ' + error.message);
        }
    };

    public static getUserToken = async () => {
        try {
            const user = await storage.getDataByKey('user');
            const userObj = JSON.parse(user);
            return userObj.token;
        } catch (error) {
            console.log('Get User Token error', error);
        }
    };
}
