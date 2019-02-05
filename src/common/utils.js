import Config from './config';

export const fetchData = (url, method, body) => {
    let result;

    fetch(Config.api_url + url)
        .then(function (response) {
            return response.json();
        })
        .then(function (myJson) {
            result = myJson;
        });

    return result;

}