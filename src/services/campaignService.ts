import axios from 'axios'
import AsyncStorage from '@react-native-community/async-storage'
import authHeader from '../helpers/authHeader'

const apiUrl = 'http://qa.krimzen.com'
const api = 'https://jsonplaceholder.typicode.com'

export const getCampaigns = async () => {
    let header = await authHeader();
    const options = {
      headers: { ...header, 'Content-Type': 'application/json' },
    };
    console.log(options)
    try {
      let response = await axios.get(`${apiUrl}/api/client` ,options)
      console.log(response.status);
      if(response.status == 200){
        console.log(response.data)
        try{
          await AsyncStorage.setItem('campaigns', JSON.stringify(response.data.data))
        }
        catch(error) {
          console.log('Error in storing asyncstorage', error)
        }
      }
    }
    catch(error) {
      // Error 😨
    if (error.response) {
      /*
       * The request was made and the server responded with a
       * status code that falls out of the range of 2xx
       */
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
  } else if (error.request) {
      /*
       * The request was made but no response was received, `error.request`
       * is an instance of XMLHttpRequest in the browser and an instance
       * of http.ClientRequest in Node.js
       */
      console.log(error.request);
  } else {
      // Something happened in setting up the request and triggered an Error
      console.log('Error', error.message);
  }
  console.log(error);
    }
  }