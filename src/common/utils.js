import Config from './config';

export const fetchData = (url, method, body) => {
    return fetch(Config.api_url + url, {
        headers: {
            "x-api-key": window.localStorage.getItem('api-key'),
        },
    })
        .then(function (response) {
            return response.json();
        });
}