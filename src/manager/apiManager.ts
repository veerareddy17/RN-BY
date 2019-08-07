import axios from 'axios';

export class APIManager {
    public static post = async <T>(url: string, body: string, callback: (response: T) => void) => {
        console.log('In API Manager..POST');
        const options = {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        };
        try {
            const response = await axios.post(url, body, options);
            return response.data;
            console.log('Success response');
        } catch (error) {
            console.log(error);
        }
    };
}
