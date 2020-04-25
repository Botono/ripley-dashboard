import Config from './config';
import { isNil } from 'lodash';
import moment from 'moment';

const CACHE_PREFIX = 'cache_';
const DATA_CONFIG = {
    water: {
        url: '/water',
        params: {},
        defaultValue: {},
    },
    activity_hourly: {
        url: '/fitbark/activity',
        params: {
            numberOfDays: 2000,
            resolution: 'hourly',
        },
        defaultValue: {},
    },
    activity_daily: {
        url: '/fitbark/activity',
        params: {
            numberOfDays: 2000,
            resolution: 'daily',
        },
        defaultValue: {},
    },
    changelog: {
        url: '/changelog',
        params: {},
        defaultValue: [],
    },
    bloodwork: {
        url: '/bloodwork',
        params: {},
        defaultValue: {},
    },
    bloodwork_labels: {
        url: '/bloodwork/labels',
        params: {},
        defaultValue: [],
    },
};

export const fetchData = (url, method, params, body) => {
    let fetchUrl = new URL(Config.api_url + url);

    if (isNil(method)) {
        method = 'GET';
    }

    if (isNil(body)) {
        body = {};
    }

    if (!isNil(params) && params !== {}) {
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

export const getData = (key) => {
    console.debug(`GET DATA: ${key}`);
    const currentCache = getCache(key);
    const currentDate = moment().format('YYYY-MM-DD');
    const dataConfig = DATA_CONFIG[key];
    let returnData = currentCache || dataConfig.defaultValue;

    const latestDate = getLatestDate(returnData);

    if (!currentCache) {
        fetchData(dataConfig.url, 'GET', dataConfig.params).then((json_data) => {
            returnData = json_data;
            setCache(key, json_data);
        });
    } else if (latestDate !== currentDate) {
        console.debug(`latestDate: ${latestDate} currentDate: ${currentDate}`);
        const start = moment(currentDate, "YYYY-MM-DD");
        const end = moment(latestDate, "YYYY-MM-DD");
        const dayDiff = Math.round(moment.duration(start.diff(end)).asDays());

        console.debug(`day diff: ${dayDiff}`);

        if (dayDiff > 1) {
            dataConfig.params = {
                ...dataConfig.params,
                numberOfDays: dayDiff + 1,
            };
            fetchData(dataConfig.url, 'GET', dataConfig.params).then((json_data) => {
                returnData = mergeCacheData(currentCache, json_data);
                setCache(key, returnData);
            });
        }
    }

    return returnData;
}


const getLatestDate = (data) => {
    let latestDate = moment().format('YYYY-MM-DD');
    if (Array.isArray(data) && data.length > 0) {
        if (data[0].date) {
            latestDate = data[0].date;
        }
    } else {
        const theKeys = Object.keys(data).sort().reverse();
        if (theKeys.length > 0) {
            latestDate = [0];
        }
    }

    return latestDate;
}

const setCache = (key, data) => {
    const cacheKey = `${CACHE_PREFIX}${key}`;
    console.debug(`Setting Cache Key: ${cacheKey}`);

    window.localStorage.setItem(cacheKey, JSON.stringify(data));
}

const mergeCacheData = (cacheData, newData) => {
    let mergedData;

    if (Array.isArray(cacheData)) {
        mergedData = [
            ...cacheData,
            ...newData,
        ];
    } else {
        mergedData = {
            ...cacheData,
            ...newData,
        };
    }

    return mergedData;
}

const getCache = (key) => {
    const cacheKey = `${CACHE_PREFIX}${key}`;
    console.debug(`Getting Cache Key: ${cacheKey}`);
    const cacheData = window.localStorage.getItem(cacheKey);
    let returnData = null;
    console.debug(`Cache present? ${!isNil(cacheData)}`);

    if (!isNil(cacheData)) {
        returnData = JSON.parse(cacheData);;
    }

    return returnData;
}

export const isApiKeyMissing = () => {
    return isNil(window.localStorage.getItem('ripley-dashboard-api-key'));
}

export const hexToRgbA = (hex, opacity) => {
    var c;
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
        c = hex.substring(1).split('');
        if (c.length === 3) {
            c = [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c = '0x' + c.join('');
        return 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ','+ opacity + ')';
    }
    return hex;
}
