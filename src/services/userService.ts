import axios from 'axios'
import {
  requestAction,
  successAction,
  failureAction,
  logoutAction,
} from '../redux/actions/userActions'
import AsyncStorage from '@react-native-community/async-storage'

import { ResponseModel } from '../models/responseModel'

const apiUrl = 'http://qa.krimzen.com/api'

// export const login = (username: string, password: string) => {
//   console.log('login service', username)
//   const options = {
//     headers: {
//         'Accept': 'application/json',
//         'Content-Type': 'application/json'
//     },
//   };
//   const body = JSON.stringify({
//       email: username, 
//       password: password, 
//   })
//   return dispatch => {
//     // dispatch(requestAction({ username }))
//     return axios
//       .post(`${apiUrl}/login`, body, options)
//       .then(response => {
//         console.log(response.data)
//         // dispatch(successAction(response.data))
//       })
//       .catch(error => {
//         console.log(error)
//         // dispatch(failureAction(error.toString()))
//         throw error
//       })
//   }
// }

export const logout = () => {
  return dispatch => {
    return axios
      .get(`${apiUrl}/logout/`)
      .then(response => {
        dispatch(logoutAction())
      })
      .catch(error => {
        console.log(error)
        dispatch(failureAction(error.toString()))
        throw error
      })
  }
}


export const login = async (username: string, password: string) => {
  console.log('login service', username)
  const options = {
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
  };
  const body = JSON.stringify({
      email: username, 
      password: password, 
  })
  try {
    let response = await axios.post(`${apiUrl}/login`, body, options)
    console.log(response.status);
  if(response.status == 200){
    console.log(response.data)
    try{
      await AsyncStorage.setItem('user', JSON.stringify(response.data))
    }
    catch(error) {
      console.log('Error in storing asyncstorage', error)
    }
  }
  }
  catch(error) {
    console.log(error)
    return error;
  }
}