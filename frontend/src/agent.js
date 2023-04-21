import superagentPromise from 'superagent-promise';
import _superagent from 'superagent';

const superagent = superagentPromise(_superagent, global.Promise);

const API_ROOT = 'http://10.214.241.122:8080';

const encode = encodeURIComponent;
const responseBody = res => res.body;

// let token ="Bearer eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJkNTBlYmMyOC0zNTJlLTQ2NjgtOTQ3MS1hZTlhYmNjYzhjOTYiLCJzdWIiOiI4IiwiaXNzIjoiemp1bHNzMiIsImlhdCI6MTY4MTQ1ODkxNSwiZXhwIjoxNjgxNDYyNTE1fQ.9yIXyXbXyF9HV0ljkUXInxUaht0fYW0M6nr3E8ccPNE"
let token = ""

const tokenPlugin = req => {
	token = localStorage.getItem('token')
    if (token) {
        req.set('Authorization', `${token}`);
    }
}

const queue = []; // 请求队列
let isRefreshing = false; // 是否正在更新 token
let refreshPromise = null; // 更新 token 的 Promise

const handleError = err => {
	console.error(err);
  };

const requests = {
	del: url =>
	  superagent
		.del(`${API_ROOT}${url}`)
		.use(tokenPlugin)
		.then(responseBody)
		.catch(handleError),
	get: url =>
	  superagent
		.get(`${API_ROOT}${url}`)
		.use(tokenPlugin)
		.then(responseBody)
		.catch(handleError),
	put: (url, body) =>
	  superagent
		.put(`${API_ROOT}${url}`, body)
		.use(tokenPlugin)
		.then(responseBody)
		.catch(handleError),
	post: (url, body) =>
	  superagent
		.post(`${API_ROOT}${url}`, body)
		.use(tokenPlugin)
		.then(responseBody)
		.catch(handleError),
  };

const Auth = {
    login: ( password,phoneNumber) =>
        requests
			.post('/user/login', { password:password,phoneNumber:phoneNumber}),
    register: (code, password, userName, phoneNumber) =>
        requests
			.post('/user/register', { code:code,password:password,userName:userName,phoneNumber:phoneNumber }),
    sendMessage: (phoneNumber) =>
        requests.get('/code/send,${phoneNumber}'),
    changePassword: (code, newPassword)=>
        requests.post('/user/changePassword',{code:code,newPassword:newPassword}),
	// refreshToken: () => {
    //     if (isRefreshing) {
    //         // 如果正在更新 token，将当前请求放入队列中
    //         return new Promise((resolve, reject) => {
    //             queue.push({resolve, reject});
    //         });
    //     } else {
    //         isRefreshing = true;
    //         refreshPromise = Auth.login();
    //         return refreshPromise.then(newToken => {
	// 			console.log(newToken)
    //             token = newToken.msg;
    //             isRefreshing = false;
    //             // 更新 token 后，处理队列中的所有请求
    //             queue.forEach(({resolve}) => resolve(newToken));
    //             queue.length = 0;
    //         }).catch(err => {
    //             isRefreshing = false;
    //             queue.forEach(({reject}) => reject(err));
    //             queue.length = 0;
    //         });
    //     }
	// }
};

const Profile ={
    getUserInfo:()=>
        requests.get('/user/userinfo/'),
    getBuy :() =>
        requests.get('/goodwanted/get'),
    getSell :() =>
        requests.get('/good/list'),
    getCart:() =>
        requests.get('/cart/detail')

}




export default {
    Auth,
    Profile,
    // setToken: _token => { token = _token; },
    token
};
