import axios from 'axios';

window.$axios = axios.create({
    headers: {
        'Content-Type': 'application/json;charset=UTF-8'
    },
    transformRequest: [function(data) {
        return JSON.stringify(data)
    }],
    transformResponse: [function(res) {
        try {
            res = JSON.parse(res);
        } catch (error) {
            console.log(error);
        }
        return res;
    }]
});