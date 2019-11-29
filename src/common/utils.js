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

export const hexToRgbA = (hex, opacity) => {
    var c;
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
        c = hex.substring(1).split('');
        if (c.length == 3) {
            c = [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c = '0x' + c.join('');
        return 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ','+ opacity + ')';
    }
    return hex;
}
