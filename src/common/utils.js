import Config from './config';
import { isNil } from 'lodash';

export const fetchData = (url, method, params, body) => {
    let fetchUrl = new URL(Config.api_url + url);

    if (isNil(method)) {
        method = 'GET';
    }

    if (isNil(body)) {
        body = {};
    }

    if (!isNil(params)) {
        Object.keys(params).forEach(key => fetchUrl.searchParams.append(key, params[key]));
    }


    return fetch(fetchUrl, {
        method: method,
        headers: {
            "x-api-key": window.localStorage.getItem('ripley-dashboard-api-key'),
        },
    })
        .then(function (response) {
            return response.json();
        });
}

export const isApiKeyMissing = () => {
    return isNil(window.localStorage.getItem('ripley-dashboard-api-key'));
}
