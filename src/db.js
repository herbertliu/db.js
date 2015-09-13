var DB = require("./core");
//var utils = require("utils");


/*
 * @description 加密skey
 * @param skey生成hash
 */
function encryptSkey(str) {
    if (!str) {

        return "";
    }
    var hash = 5381;
    for (var i = 0, len = str.length; i < len; ++i) {
        hash += (hash << 5) + str.charAt(i).charCodeAt(); // jshint ignore:line
    }
    return hash & 0x7fffffff; // jshint ignore:line
}

function handleError(data, options){
	var self = this;
    //todo 
    switch (data.retcode) {
    	//need login
        case 100000:
        case 100021:
            return false;
            break;
    }
    return data;
}

function handleSucc(data, options){

	 return data;
}
//临时，后续依赖util
function getCookie (n) {
    var m = document.cookie.match(new RegExp("(^| )" + n + "=([^;]*)(;|$)"));
    return !m ? "" : decodeURIComponent(m[2]);
}

function beforeAjax(options){
	options.data.bkn = encryptSkey(getCookie("skey"));
}

//注册handles
DB.handles({
	"succ" : handleSucc,
	"err" : handleError,
	"before" : beforeAjax
});

// just set DB options
DB.extend(DB.options , {
	//errHandles: [handleError],
    //succHandles: [handleSucc],
    // cross origin
    xhrFields: {
        withCredentials: true
    },
    dataType: 'json',
    type: 'POST'
});


module.exports = DB;