var _prototype = Array.prototype,
    $ = require("zepto"),
	_noop = function(){},
	_extend = function () {
        return $.extend.apply(this , arguments.length > 1?arguments : [this , arguments[0] || null]);
    },
    _handles = function(name , array){
        switch(Object.prototype.toString.call(array)){
            case "[object Function]":
                array = [array];
                break;
            case "[object Array]":
                break;
            default:
                return;
        }
        name = (name || '') + "Handles";
        DB.options[name] || (DB.options[name] = []);
        DB.options[name].unshift.apply(DB.options[name] , array);
    };

/**
 * DB
 * @class
 * @param {Object} options this is just a $.ajax setting
 *      @param {Array} options.errHandles
 *      @param {Array} options.succHandles
 *      @param {Function} options.succ
 *      @param {Function} options.err
 */

function DB(options){
	this._init(options);
}

_extend(DB.prototype , {
	_handles : ["beforeHandles" , "succHandles" , "errHandles" , "dataHandles"] , 
	//遍历handles
	_each : function(array , callback){
		var self = this;
		for(var i = 0, length = array.length ; i < length ; i++){
			if(callback.apply(self , [array[i] , i , array])){
				continue;
			}else{
				return false;
			}
		}
		return true;
	},
	_init : function(options){
		//增加数据是否成功，默认探测
		!options["dataHandles"] && (DB.options["dataHandles"] = [function(data){
			return data && ('retcode' in data) && data.retcode === 0;//默认成功数据处理
		}]);

		this._each(this._handles , function(value){
			this[value] = (DB.options[value] || []).concat(options[value] || []);//合并默认的options中的handles
		});

		options = this.options  = _extend({}, DB.options || {}, options);  
	},

	//执行handles
	_execute : function(name , data , options){
		var self = this,
			handles = (options && options[name]),
			res = data || false,
            selfHandles = self.options[name] || [];

        if(handles){
            _prototype.unshift.apply(handles , selfHandles);
        }else{
           handles = selfHandles;
        }

		this._each(handles , function(handle){
			if(typeof handle == "function"){
        		return (res = handle.call(self , res , options));
        	}else{
        		return res = false;
        	}
		});

		return res;
	},
    /**
     * _apply
     * @param {Array} handles 处理函数列队，每一个是一个管子
     * @param {*} data 要处理的数据
     * @param {Object} options 可选参数
     */
    _apply: function (name, data, options) {
        var self = this , res , handle = name + "Handles";
        res = self._execute(handle, data, options);       
        // if the handles return false, just break 
       	if (res === false) return;
       	var after = options[name];
       	(typeof after == "function") && after.call(self , res);

    },
    //格式化数据
    _wrap: function (options) {
    	var self = this ;

    	//hack the called with err and succ.
        options.success = function (data) {
            // you may want to modify this line for judging error or success
            if(self._execute("dataHandles" , data)){
            	self._apply("succ", data, options);
            }else{
            	self._apply("err", data, options);
            }
        };
        options.error = function (data) {
            self._apply("err", data, options);
        };

        return options;
    },
    /**
     * ajax
     * @param {Object} options this is just a $.ajax setting
     *      @param {Function} options.succ
     *      @param {Function} options.err
     */
    ajax: function (options) {
        options = this._wrap(_extend({}, this.options, options));
        !options.data &&
            (options.data = options.param);
        this._execute("beforeHandles", options);//execute before ajax，set the public data param.
        $.ajax(options);
    }
})

_extend(DB , {
	httpMethod: function (options) {
        var db = new DB(options);
        return function (opt) {
            db.ajax(opt);
            return this;
        };
    },
    extend: _extend,
    //以此为制定的name增加handle
    handles : function(name , handle){
    	var l = arguments.length,
    		i = 1;

    	if(!l) return;

    	if( i == l){//长度为1
    		 //|| (l < 2 && Object.prototype.toString.call(name) != "[object Object]")
    		 if(Object.prototype.toString.call(name) == "[object Object]"){
    		 	for(var i in name){
    		 		_handles(i , name[i]); 
    		 	}
    		 }
    		 return;
    	}
    	_handles(name , _prototype.slice.call(arguments , i));	
    },
    // default options
    options: {}
});

module.exports = DB;
