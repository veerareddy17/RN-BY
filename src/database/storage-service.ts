import AsyncStorage from '@react-native-community/async-storage';

export default class StorageService {
    private static storageProvider = AsyncStorage;

    public static setStorageProvider = (storageProvider: any) => {
        StorageService.storageProvider = AsyncStorage;
    };

    public static store = async <T>(key: string, value: T | null) => {
        if (value === null || value === undefined) {
            StorageService.storageProvider.removeItem(key);
            return;
        }
        StorageService.storageProvider.setItem(key, JSON.stringify(value));
        // try {
        //     await AsyncStorage.setItem(key, JSON.stringify(value));
        // } catch (error) {
        //     console.log('AsyncStorage save error: ' + error.message);
        // }
    };

    public static get = async <T>(key: string): Promise<T | null> => {
        const value = await StorageService.storageProvider.getItem(key);
        if (!value) {
            return null;
        }
        return JSON.parse(value) as T;
        // try {
        //     const value = await AsyncStorage.getItem(key);
        //     return value;
        // } catch (error) {
        //     console.log('AsyncStorage get error: ' + error.message);
        // }
    };

    public static removeKey = async (key: string) => {
        StorageService.storageProvider.removeItem(key);
        // try {
        //     await AsyncStorage.removeItem(key);
        // } catch (error) {
        //     console.log('AsyncStorage get error: ' + error.message);
        // }
    };

    public static getUserToken = async () => {
        try {
            const user = await StorageService.get<string>('user');
            console.log('GetUserToken :---', user);
            if (user) {
                const userObj = JSON.parse(user);
                return userObj.token;
            }
            return null;
        } catch (error) {
            console.log('Get User Token error', error);
            // Promise.reject(error);
        }
    };
}
