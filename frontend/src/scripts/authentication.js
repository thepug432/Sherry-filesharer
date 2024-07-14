import { getCookie  } from './cookies';

export async function login(username, password){
    const credentials = `${username}:${password}`;
    const encodedCredentials = btoa(credentials);
    const response = await fetch(`/user/auth/login`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${encodedCredentials}`
        },
        method: 'POST',
    });
    const body = await response.json()
    updateToken(body.token, body.expiry)
    return {
        'status': response.status,
        'body': body
    }
}

export async function checkLoginAndRedirect(nav){
    const token = getToken()
    const tokenUndefined = (token.token === undefined || token.token === null)
    const tokenExpired = (token.token === undefined || token.token === null || new Date() > new Date(token.expiry))
    if (tokenUndefined || tokenExpired){
        return nav('/login')
    }
    const response = await fetch(`/user/auth/check`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token.token}`,
        },
        method: 'GET',
    });

    if (response.status !== 200){
        updateToken(null, null)
        return nav('/login')
    }
} 

export function updateToken(token, expiry){
    localStorage.setItem('token', token)
    localStorage.setItem('expiry', expiry)
}

export function getToken(){
    return {
        'expiry': localStorage.getItem('expiry'),
        'token': localStorage.getItem('token')
    }
}