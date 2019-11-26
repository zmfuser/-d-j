import qs from 'qs';
const util = {
    deepClone: obj => {
        let objClone = Array.isArray(obj) ? [] : {};
        if(obj && typeof obj === "object"){
            for(let key in obj){
                if(obj.hasOwnProperty(key)){
                    if(obj[key] && typeof obj[key] === "object"){
                        objClone[key] = util.deepClone(obj[key]);
                    }else{
                        objClone[key] = obj[key];
                    }
                }
            }
        }
        return objClone;
    },
    unique: (arr, field) => {
        if(!arr && !field){
            return;
        }
        let arrCopy = util.deepClone(arr);
        for(let i=0; i<arrCopy.length-1; i++){
            let old = arrCopy[i];
            for(let j=i+1; j<arrCopy.length; j++){
                if(old[field] == arrCopy[j][field]){
                    arrCopy.splice(j, 1);
                    j--;
                }
            }
        }
        return arrCopy;
    },
    getUrlParams(){
        let searchStr = location.href.split('?')[1];
        let result = {};
        if (!searchStr) {
            return result;
        } else {
            return qs.parse(searchStr);
        }
    },
    isEmptyObject(object = {}){
        let objStr = JSON.stringify(object);
        if(objStr != '{}'){
            return false;
        }else{
            return true;
        }
    },
    initializationObject(object){
        if(Array.isArray(object)){
            return object;
        }
        let ret = util.deepClone(object);
        for(let item in ret){
            let value = ret[item];
            if(typeof value == 'string'){
                ret[item] = '';
            }else if(typeof value == 'number'){
                ret[item] = 0;
            }else if(typeof value == 'boolean'){
                ret[item] = false;
            }else if(Array.isArray(value)){
                ret[item] = [];
            }else{
                ret[item] = value;
            }
        }
        return ret;
    },
    translateDateTimeToStr(dateTime, fmt = 'yyyy-MM-dd'){
        if(!dateTime){
            return;
        }
        let dateObj = new Date(dateTime);
        let o = {   
            "M+" : dateObj.getMonth()+1,                 
            "d+" : dateObj.getDate(),                    
            "H+" : dateObj.getHours(),                   
            "m+" : dateObj.getMinutes(),                 
            "s+" : dateObj.getSeconds(),                 
            "q+" : Math.floor((dateObj.getMonth()+3)/3), 
            "S"  : dateObj.getMilliseconds()             
        };   
        if(/(y+)/.test(fmt)){
            fmt = fmt.replace(RegExp.$1, (dateObj.getFullYear()+"").substr(4 - RegExp.$1.length));
        }
        for(let k in o){
            if(new RegExp("("+ k +")").test(fmt)){
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
            }
        }
        return fmt; 
    },
    removeTagFromStr(str = ''){
        let ret = str.replace(/<[^>]+>/g,"");
        if(ret.indexOf('&nbsp;') != -1){
            ret = ret.replace(/&nbsp;/ig, "");
        }
        return ret;
    }
}

export default util;