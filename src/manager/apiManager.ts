import axios from 'axios';

export class APIManager {
    public static post = async (url: string, body: any) => {
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
