import palx from 'palx';
import { keys } from 'lodash';

const Config = {};

Config.api_url = 'https://4nhxysbd2c.execute-api.us-west-2.amazonaws.com/v1';

Config.palette = palx('#D18B6B');

let skipColors = ['black', 'base', 'orange', 'gray'];
Config.bar_graph_colors = [];
keys(Config.palette).forEach(item => {
    if (!skipColors.includes(item)) {
         Config.bar_graph_colors.push(Config.palette[item][6]);
    }
})




export default Config;