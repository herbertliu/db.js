# db.js [![lego version](http://lego.oa.com/badge/db.js)](http://lego.oa.com/package/db.js) 

## Author

[Herbertliu](https://github.com/herbertliu)

---

db.js，基于zepto，或者jquery。所有的逻辑处理都以插件的形式来扩展DB，这里只提供一份核心的DB。

## Install

```
$ lego install db.js --save
```

## API

### DB.options(Object);

+   ajax配置

    DB的全局配置，该配置主要是jquery/zepto的ajax配置，如果单个请求没有配置对应的ajax参数，将会使用这个全局配置，参见[zepto](http://zeptojs.com/#$.ajax)。
+   handles配置

    支持配置全局的Handles，handles的目的是在ajax请求前、后（成功、失败）需要处理的逻辑。
    ```
    DB.optopns({
        "beforeHandles" :[function(){}], //发送请求之前
        "succHandles" :[function(){}], //成功请求之后
        "errHandles" : [function(){}], //失败请求之后
        "dataHandles" : [function(){}]//成功之后，统一过滤数据，只有满足这个条件的数据才会被succ捕获，一般状态码统一处理放在这里
    });

    ```

### DB.handles

增加系统的handles配置，支持不同条件下的处理回调。

```

DB.handles("succ",function(){});

or

DB.handles({
    "succ" : function(){},
    "err" : function(){},
    "before" : function(){}
});

```


### DB.extend

扩展方法，使用同jquery/zeptode [extend](http://zeptojs.com/#$.extend)

### DB.httpMethod

此方法的主要作用是用在扩展DB的ajax请求的具体实现。创建一个DB的实例，每个DB实例有自己的数据配置，互不影响。

```
DB.httpMethod(options) //options 同DB.options


var index =  DB.httpMethod(options);

index(options) //optiosn同ajax options同时兼容之前的param发送数据

```

## Usage

```js

var DB = require('db.js');

```



