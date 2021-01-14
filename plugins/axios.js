// export default function ({ $axios, app, redirect}) {
// 	$axios.onError(error => {
// 		const code = parseInt(error.response && error.response.status)

// 		if ([401, 403].includes(code)) {
//     	app.$auth.reset();
// 			app.$auth.logout();
// 			redirect('/login')
// 		}

// 		return Promise.reject(error);
// 	})
// }

import axios from 'axios';

export default () => {
    let headers = {
        'cache-control': 'no-cache'
    };
    let accessToken = localStorage.getItem('jwt');

    if (accessToken && accessToken !== '') {
        headers.Authorization = accessToken;

    };
    const instance = axios.create({
        baseURL: 'http://www.api.com/api/v1',
        headers: headers
    });

    instance.interceptors.response.use((response) => {
        if(response.status === 401) {
             //add your code
             alert("You are not authorized");
        }
        return response;
    }, (error) => {
        if (error.response && error.response.data) {
             //add your code
             return Promise.reject(error.response.data);
        }
        return Promise.reject(error.message);
    });

    return instance;
}