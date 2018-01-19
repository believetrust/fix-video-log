function playVideo(a, b) {
    var c = window.$SINAPLAYEROBJ = window.$SINAPlayer.playerInit(a, b);
    
    return c.player
}

if (window.$SINAPlayer == undefined) {
    window.$SINAPlayer = {};
    window.$SINAPlayer.players = [];
    window.$SINAPlayer.configs = [];
    window.$SINAPlayer.util = {};
    window.$SINAPlayer.time = {};
    window.$SINAPlayer.time.firstOpenTime = (new Date).getTime();
    window.$SINAPlayer.player = {
        init: !1,
        type: 1,
        load: !1
    };
    window.$SINAPlayer.h5Info = {author:'shuqing'};
    window.$SINAPLAYEROBJ = null;
    window.$SINAFLASHURL = "//p.you.video.sina.com.cn/swf/opPlayer20180102_V5_1_1_59.swf"
}
;
/**
 * shuqing 写H5日志
 * 加油，书青娄
 */

/**
 * 定义视频播放事件日志
 */

window.$SINAPlayer.SnvdLog = function(){
    
    var deviceInfo = window.$SINAPlayer.util.platform;
    var videoInfo = window.$SINAPlayer.h5Info;

    //发送日志需要的参数
    this.sendCommonCfg = {
        //在线序号
         shno    : 0,
        // 事件序号
        sno     : 0,
        app     : 'sinaplayerH5',
        //程序
//          appv        : deviceInfo.browser,
        tpxi    : 'brws:' + deviceInfo.browser,
        //日志模板版本
        logv    : '0.0.1',
        //登录用户标识
        uid     : '',
        //访客id
        gusr    : '',
        //device id   cookie-> sinaGlobal
        did     : '',
        //设备类型 phone为手机 不是手机或无法判断填空串
        dv      : deviceInfo.ismobile,
        //程序环境  HTML5播放器-browser
        ape     : 'browser',
        //操作系统  android ios wins winphone macos linux
        os      : deviceInfo.os,
        //会话id 
        sid     : '',
        //视频内容标识
        vpid    : videoInfo.video_id,

        //视频文件标识
        fcid    : videoInfo.video_id,
       
        //视频标题
        vtl     : videoInfo.title,

        //点播直播 
        lov     : 'vod',

        //点播类型 点播非点播填空 , 结束的直播填endedlive
        vot     : '',

        //直播类型 实时直播 / 伪直播
        lt      : '',

        //媒体时长 秒
        vd      : videoInfo.length,

        //视频宽
        vwd     : videoInfo.length,
        //视频高
        vht     : videoInfo.height,
        //清晰度
        atq     : 1,
        //播放来源
        psrc    : 'bofanglaiyuan',
        //播放上下文
        pctx    : videoInfo.url,
        //播放视频url
        purl    : 'bofangshipinurl',
    };
    
};

window.$SINAPlayer.SnvdLog.prototype = function(){
    console.log('--prototype--');

    // _firstPlay : function(){
    //     console.log('--_firstPlay--');

    // }
    // _playFromPause : function(){
    //     console.log('--_playFromPause');
    // }
}


window.$SINAPlayer.cacheFuns = function() {
    var a = []
      , b = {};
    b.add = function(b, c) {
        a.push({
            name: b,
            args: c || []
        })
    }
    ;
    b.forExec = function(b) {
        for (i in a) {
            var c = a[i];
            b(c.name, c.args)
        }
    }
    ;
    b.clear = function() {
        a = []
    }
    ;
    return b
}();

window.$SINAPlayer.playersControl = function() {
    var a = {};
    return {
        add: function(b, c) {
            a[b] = {
                dom: document.getElementById(b),
                obj: c
            }
        },
        getplayer: function(b) {
            return a[b] ? a[b] : null
        }
    }
}();

window.$SINAPlayer.getPlayer = function() {
    var a = window.$SINAPlayer.playersControl;
    return {
        getPlayer: function(b) {
            return a.getplayer(b)
        }
    }
}();

window.$SINAPlayer.playerCallJs = function() {
    var a = {}
      , b = window.$SINAPlayer.cacheFuns
      , c = window.$SINAPlayer.getPlayer
      , d = !1
      , e = function() {
        if (arguments.length == 0)
            throw new Error("播放器回调js方我法必须传入播放器id");
        var a = Array.prototype.slice.call(arguments, 0);
        a.push((new Date).getTime());
        return a
    }
      , f = function(a) {
        $PlayerCallJs[a] = function() {
            var f = e.apply(null, arguments);
            b.add(a, f);
            if (a == "flashInitCompleted") {
                window.$SINAPlayer.player.load = !0;
                var g = setInterval(function() {
                    var a = c.getPlayer(f[f.length - 2])
                      , b = a.obj;
                    if (!d) {
                        d = !0;
                        b.callback.fire("flashInitCompleted", a.obj.playerid)
                    }
                    if (b.playVideo) {
                        clearInterval(g);
                        b.playVideo()
                    }
                    // console.log('--flashInitCompleted--',a);
                }, 20);
                clearInterval(initHD)
            }
            if (a == "h5RecordeValue") {
                var h = f[f.length - 3]
                  , i = c.getPlayer(f[f.length - 2]);
                i.obj.callback.fire("h5RecordeValue", h, i.obj.playerid);
            }
            var j = ["toFullScreen", "toNomalScreen", "volumeOn", "volumeOff", "playStart", "playComplete", "onFirstframe", "videoError"];
            for (var k = 0, l = j.length; k < l; k++)
                if (a == j[k]) {
                    var i = c.getPlayer(f[f.length - 2]);
                    i.obj.callback.fire(j[k], i.obj.playerid)
                }
            if (a == "toUrl" || a == "pauseNotify" || a == "unpauseNotify") {
                var h = f[f.length - 3]
                  , i = c.getPlayer(f[f.length - 2]);
                i.obj.callback.fire(a, h, i.obj.playerid)
            }
        }
    }
      , g = function(a, b) {
        $PlayerCallJs[a] = function() {
            var a = e.apply(null, arguments);
            b.apply(null, a)
        }
    };
    if (typeof window.$PlayerCallJs == "undefined") {
        window.$PlayerCallJs = {};
        window.$PlayerCallNameArr = ["flashInitCompleted", "playComplete", "playOutside", "videoError", "toWide", "toNarrow", "setLight", "recordValue", "h5RecordeValue", "adComplete", "pauseNotify", "unpauseNotify", "volumeOn", "volumeOff", "toFullScreen", "toNomalScreen", "playStart", "toUrl", "onFirstframe"]
    }
    for (var h = 0, i = $PlayerCallNameArr.length; h < i; h++) {
        var j = $PlayerCallNameArr[h];
        f(j)
    }
    a.addDelay = function(a) {
        if (a != "") {
            window.$PlayerCallNameArr.push(a);
            f(a)
        }
    }
    ;
    a.addNow = function(a, b) {
        a != "" && typeof b == "function" && g(a, b)
    }
    ;
    return a
}
;

window.$SINAPlayer.util.mobileos = function() {
    function a(a) {
        var b = {}
          , c = {}
          , d = a.match(/WebKit\/([\d.]+)/)
          , e = a.match(/(Android)\s+([\d.]+)/)
          , f = a.match(/(iPad).*OS\s([\d_]+)/)
          , g = !f && a.match(/(iPhone\sOS)\s([\d_]+)/)
          , h = a.match(/(webOS|hpwOS)[\s\/]([\d.]+)/)
          , i = h && a.match(/TouchPad/)
          , j = a.match(/Kindle\/([\d.]+)/)
          , k = a.match(/Silk\/([\d._]+)/)
          , l = a.match(/(BlackBerry).*Version\/([\d.]+)/)
          , m = a.match(/(BB10).*Version\/([\d.]+)/)
          , n = a.match(/(RIM\sTablet\sOS)\s([\d.]+)/)
          , o = a.match(/PlayBook/)
          , p = a.match(/Chrome\/([\d.]+)/) || a.match(/CriOS\/([\d.]+)/)
          , q = a.match(/Firefox\/([\d.]+)/);
        if (c.webkit = !!d)
            c.version = d[1];
        e && (b.android = !0,
        b.version = e[2]);
        g && (b.ios = b.iphone = !0,
        b.version = g[2].replace(/_/g, "."));
        f && (b.ios = b.ipad = !0,
        b.version = f[2].replace(/_/g, "."));
        h && (b.webos = !0,
        b.version = h[2]);
        i && (b.touchpad = !0);
        l && (b.blackberry = !0,
        b.version = l[2]);
        m && (b.bb10 = !0,
        b.version = m[2]);
        n && (b.rimtabletos = !0,
        b.version = n[2]);
        o && (c.playbook = !0);
        j && (b.kindle = !0,
        b.version = j[1]);
        k && (c.silk = !0,
        c.version = k[1]);
        !k && b.android && a.match(/Kindle Fire/) && (c.silk = !0);
        p && (c.chrome = !0,
        c.version = p[1]);
        q && (c.firefox = !0,
        c.version = q[1]);
        b.tablet = !!(f || o || e && !a.match(/Mobile/) || q && a.match(/Tablet/));
        b.phone = !b.tablet && !!(e || g || h || l || m || p && a.match(/Android/) || p && a.match(/CriOS\/([\d.]+)/) || q && a.match(/Mobile/));
        return {
            os: b,
            browser: c
        }
    }
    return a(navigator.userAgent)
}();

window.$SINAPlayer.util.extend = function(a, b) {
    var c = function(a) {
        return typeof a == "undefined" || a == null ? !1 : a.constructor == Object ? !0 : !1
    };
    for (i in b)
        c(b[i]) && c(a[i]) ? window.$SINAPlayer.util.extend(a[i], b[i]) : a[i] = b[i];
    return a
}
;

window.$SINAPlayer.util.platform = function() {
    var a = navigator.userAgent.toLowerCase()
      , b = window.$SINAPlayer.util.mobileos
      , c = window.$SINAPlayer.util.extend
      , d = {
        os: {
            win: /windows/i.test(a),
            mac: /mac/i.test(a)
        },
        browser: {
            uc: /ucweb/i.test(a) || /ucbrowser/i.test(a)
        }
    };
    c(d.os, b.os);
    c(d.browser, b.browser);
    d.ismobile = function() {
        var a = d.os;
        return "createTouch"in document || "onorientationchange"in window ? !0 : a.phone || a.tablet ? !0 : !1
    }();
    return d
}();

window.$SINAPlayer.util.buildH5 = function(a) {
    var b = {
        autoplay: !1,
        controls: !0,
        loop: !1,
        poster: "",
        preload: "auto"
    };
    window.$SINAPlayer.util.extend(b, a.h5attr || {});
    return ['<video id="' + a.id + '" name="' + a.id + '" src="" ', typeof a.width != "undefined" ? 'width="' + a.width + '" ' : "", typeof a.height != "undefined" ? 'height="' + a.height + '" ' : "", b.autoplay ? "autoplay " : "", b.controls ? "controls " : "", b.loop ? "loop " : "", 'preload="' + b.preload + '" ', 'poster="' + b.poster + '">', "</video>"].join("")
}
;

window.$SINAPlayer.util.jsonp = function(a, b) {
    var c = (new Date).getTime()
      , d = document.getElementsByTagName("head")[0] || document.documentElement
      , e = document.createElement("script")
      , f = "HTML5_" + c;
    e.src = a + "&jsonp=" + f;
    e.charset = "utf-8";
    window[f] = function(a) {
        if (b || typeof b == "function") {
            b(a);
            delete window[b];
            d.removeChild(e)
        }
    }
    ;
    d.appendChild(e)
}
;


window.$SINAPlayer.util.callback = function() {
    var a = {};
    this.add = function(b, c) {
        a[b] || (a[b] = []);
        a[b].push(c)
    }
    ;
    this.fire = function(b, c) {
        var d = Array.prototype.slice.call(arguments, 0);
        d.shift();
        var e = a[b];
        if (e) {
            var f = e.length;
            for (var g = 0; g < f; g++)
                try {
                    e[g].apply(null, d)
                } catch (h) {}
        }
    }
}
;

window.$SINAPlayer.player = function() {
    function a(a, b) {
        if (!a || !a.container)
            throw new Error("未传入播放器容器id");
        if (typeof b != "function")
            throw new Error("未传入构建播放器dom的方法");
        var c = document.getElementById(a.container);
        if (!c)
            throw new Error("播放器容器无效");
        this.container = c;
        this.playerid = a.id;
        this.callback = new window.$SINAPlayer.util.callback;
        this.buildDom = function() {
            this.container.innerHTML = b(a);
            this.player = document.getElementById(a.id);
            a.classname && (this.player.className = a.classname)
        }
    }
    a.prototype.setSize = function(a) {
        if (!a)
            return;
        a.width && this.player.setAttribute("width", a.width);
        a.height && this.player.setAttribute("height", a.height)
    }
    ;
    a.prototype.playVideo = function() {}
    ;
    a.prototype.pause = function() {}
    ;
    a.prototype.play = function() {}
    ;
    return a
}();

window.$SINAPlayer.util.extendClass = function(a, b) {
    var c = function() {};
    c.prototype = b.prototype;
    a.prototype = new c;
    a.prototype.constructor = a;
    a.superclass = b.prototype;
    b.prototype.constructor == Object.prototype.constructor && (b.prototype.constructor = b)
}
;

window.$SINAPlayer.sinaH5Player = function() {
    function b(a, c) {
        this.playerConfig = a;
        this.videoConfig = c;
        this.playerConfig.h5attr = this.playerConfig.h5attr || {};
        b.superclass.constructor.call(this, this.playerConfig, window.$SINAPlayer.util.buildH5);
        var d = this.buildDom;
        this.buildDom = function(a) {
            d.call(this);
            this.callback.fire("playerInitCompleted", this.playerid);
            typeof a != "boolean" && (a = !0);
            a && this.bindEvt()
        }
    }

    var a = window.$SINAPlayer.util.jsonp;

    window.$SINAPlayer.util.extendClass(b, window.$SINAPlayer.player);


    b.prototype.playVideo = function(b) {


        console.log('--video object--',b);
        
        var b = b || this.videoConfig;
        if (!b || b == -1)
            return;
        var c = this;
        b.poster && (this.player.poster = b.poster);

        // window.$SINAPlayer.h5Info = b;
        // console.log('--playVideo--',b);

        
        // 设置视频播放地址
        var d = function(d) {

            // console.log('播放资源',d);

            var g = d.file_id;
            c.player.src = d.dispatch_result.url;

            a("//count.video.sina.com.cn/videoView?video_id=" + b.video_id + "&vid=" + g + "&r=" + window.location.href);

            window.$SINAPlayer.h5Info = window.$SINAPlayer.util.extend(b, d);

            // console.log('--videoInfo--test--',window.$SINAPlayer.h5Info);

            window.$SINAPlayer.SnvdLog();
            
            $PlayerCallJs.h5RecordeValue(d, c.playerid)
        }
          , e = ["mp4", "m3u8"];

        b ? a("//hpi.video.sina.com.cn/public/video/play?appver=1.1&appname=video&applt=web&tags=video&player=html5&video_id=" + b.video_id, function(a) {
            
            console.log('返回 hpi 数据',a);
            // if (result && result.code == '1') {
            //     var videos = result.data.videos;
            //     var istype = false;
            //     for(var i = 0, len = videotype.length;i<len;i++){
            //         var name = videotype[i];
            //         if (videos[name]) {
            //             istype = true;
            //             d(b[i]);
            //         }
            //     }
            // }

            if (a && a.code == "1") {

                var b = a.data.videos;
                var f = false;
                // d(b[0]);

                for (var g = 0, h = e.length; g < h; g++) {
                    var i = e[g];
                    // console.log('videotype-name',b[0]);
                    // d(b[0]);
                    if (b[0]) {
                        f = !0;
                        d(b[0]);
                        // c.callback.fire("playStart", c.playerid);
                        break
                    }
                }

                if (!f) {
                    console.log('如果没有指定类型就继续寻找可以播放的资源',f);
                    var j = !1
                      , k = "";
                    for (var i in b) {
                        k == "" && (k = i);
                        if (c.player.canPlayType("video/" + i)) {
                            j = !0;
                            d(b[i]);
                            break
                        }
                    }
                    !j && k != "" && d(b[k]);
                    console.log('--说明没有播放的类型--');
                }
            } else{
                 c.callback.fire("videoError", this.playerid);
                 console.log('通知发生错误了');
            }
        }) : this.callback.fire("videoError", this.playerid)
    }
    ;
    b.prototype.bindEvt = function() {
        var a = this
          , b = {
            ended: function() {
                console.log('--bindEvt--',a.playerid);
                a.callback.fire("playComplete", a.playerid)
            }
        };
        a.player.addEventListener("ended", b.ended)
    }
    ;
    b.prototype.pause = function() {

        this.player.pause();
    }
    ;
    b.prototype.play = function() {
        this.player.play();
        
    }
    ;
    b.prototype.on = function(a, b) {
        console.log('--on--');
        this.callback.add(a, b);
    }
    ;
    console.log('--sinaH5Player--',b);
    return b
}();

window.$SINAPlayer.util.buildFlash = function(a, b) {
    var c = {}
      , d = "undefined"
      , e = a.navagator
      , d = "undefined"
      , f = "object"
      , g = "Shockwave Flash"
      , h = "ShockwaveFlash.ShockwaveFlash"
      , j = "application/x-shockwave-flash"
      , k = "SWFObjectExprInst"
      , l = "onreadystatechange"
      , e = navigator
      , m = !1
      , n = function() {
        var c = typeof b.getElementById != d && typeof b.getElementsByTagName != d && typeof b.createElement != d
          , i = e.userAgent.toLowerCase()
          , k = e.platform.toLowerCase()
          , l = k ? /win/.test(k) : /win/.test(i)
          , n = k ? /mac/.test(k) : /mac/.test(i)
          , o = /webkit/.test(i) ? parseFloat(i.replace(/^.*webkit\/(\d+(\.\d+)?).*$/, "$1")) : !1
          , p = !1
          , q = [0, 0, 0]
          , r = null;


        if (typeof e.plugins != d && typeof e.plugins[g] == f) {
            r = e.plugins[g].description;
            if (r && (typeof e.mimeTypes == d || !e.mimeTypes[j] || !!e.mimeTypes[j].enabledPlugin)) {
                m = !0;
                p = !1;
                r = r.replace(/^.*\s+(\S+\s+\S+$)/, "$1");
                q[0] = parseInt(r.replace(/^(.*)\..*$/, "$1"), 10);
                q[1] = parseInt(r.replace(/^.*\.(.*)\s.*$/, "$1"), 10);
                q[2] = /[a-zA-Z]/.test(r) ? parseInt(r.replace(/^.*[a-zA-Z]+(.*)$/, "$1"), 10) : 0
            }
        } else if (typeof a.ActiveXObject != d)
            try {
                var s = new ActiveXObject(h);
                if (s) {
                    r = s.GetVariable("$version");
                    if (r) {
                        p = !0;
                        r = r.split(" ")[1].split(",");
                        q = [parseInt(r[0], 10), parseInt(r[1], 10), parseInt(r[2], 10)]
                    }
                }
            } catch (t) {}
        return {
            w3: c,
            pv: q,
            wk: o,
            ie: p,
            win: l,
            mac: n
        }
    }()
      , o = function(a, b) {
        if (n.ie && n.win) {
            var c = ""
              , b = b || {};
            for (var d in a)
                a[d] != Object.prototype[d] && (d.toLowerCase() == "data" ? b.movie = a[d] : d.toLowerCase() == "styleclass" ? c += ' class="' + a[d] + '"' : d.toLowerCase() != "classid" && (c += " " + d + '="' + a[d] + '"'));
            var e = "";
            for (var f in b)
                b[f] != Object.prototype[f] && (e += '<param name="' + f + '" value="' + b[f] + '" />');
            return '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"' + c + ">" + e + "</object>"
        }
        var g = '<embed pluginspage="//www.macromedia.com/go/getflashplayer" type="' + j + '" ';
        for (var d in a)
            a[d] != Object.prototype[d] && (d.toLowerCase() == "data" ? g += 'src="' + a[d] + '" ' : d.toLowerCase() == "styleclass" ? g += ' class="' + a[d] + '" ' : d.toLowerCase() != "classid" && (g += " " + d + '="' + a[d] + '" '));
        for (var h in b)
            g += h + '="' + b[h] + '" ';
        g += "/>";
        return g
    }
      , p = function(a, b) {
        for (i in b)
            typeof b[i] == "object" && typeof a[i] == "object" ? window.$SINAPlayer.util.extend(a[i], b[i]) : a[i] = b[i];
        return a
    };
    c.getFlashHTML = function(a) {
        var b = {
            url: "",
            id: "vPlayer",
            flashvars: {},
            params: {
                allowNetworking: "all",
                allowScriptAccess: "always",
                wmode: "transparent",
                allowFullScreen: "true",
                quality: "high",
                bgcolor: "#000000"
            },
            attributes: {}
        };
        p(b, a);
        var c = {}
          , d = {};
        c.data = b.url;
        typeof b.width != "undefined" && (c.width = b.width + "");
        typeof b.height != "undefined" && (c.height = b.height + "");
        c.id = b.id;
        c.name = b.id;
        for (var e in b.attributes)
            c[e] = b.attributes[e];
        for (var e in b.params)
            d[e] = b.params[e];
        d.flashvars = "";
        for (var e in b.flashvars)
            d.flashvars ? d.flashvars += "&" + e + "=" + b.flashvars[e] : d.flashvars = e + "=" + b.flashvars[e];
        return o(c, d)
    }
    ;
    c.isSupport = function() {}
    ;
    c.isSupportVersion = function(a) {}
    ;
    return c
}(window, document);

window.$SINAPlayer.util.cookie = {
    get: function(a) {
        a = a.replace(/([\.\[\]\$])/g, "\\$1");
        var b = new RegExp(a + "=([^;]*)?;","i")
          , c = document.cookie + ";"
          , d = c.match(b);
        return d ? d[1] || "" : ""
    },
    set: function(a, b, c) {
        var d = [], e, f, g = window.$LivePlayer.util.extend({
            expire: null,
            path: "/",
            domain: null,
            secure: null,
            encode: !0
        }, c);
        g.encode == 1 && (b = escape(b));
        d.push(a + "=" + b);
        g.path != null && d.push("path=" + g.path);
        g.domain != null && d.push("domain=" + g.domain);
        g.secure != null && d.push(g.secure);
        if (g.expire != null) {
            e = new Date;
            f = e.getTime() + g.expire * 36e5;
            e.setTime(f);
            d.push("expires=" + e.toGMTString())
        }
        document.cookie = d.join(";")
    }
};

window.$SINAPlayer.util.queryToJson = function(b, c) {
    var d = b.replace(/^\s+|\s+$/, "").split("&")
      , e = {}
      , f = function(a) {
        return c ? decodeURIComponent(a) : a
    };
    for (var g = 0, h = d.length; g < h; g++)
        if (d[g]) {
            var i = d[g].split("=")
              , j = i[0]
              , k = i[1];
            if (i.length < 2) {
                k = j;
                j = "$nullName"
            }
            if (!e[j])
                e[j] = f(k);
            else {
                a.isArray(e[j]) != 1 && (e[j] = [e[j]]);
                e[j].push(f(k))
            }
        }
    return e
}
;

window.$SINAPlayer.getUser = function() {
    var a = window.$SINAPlayer.util.cookie.get("SUP")
      , b = !1;
    a && (b = window.$SINAPlayer.util.queryToJson(unescape(a), !0));
    console.log('user',b);
    return b
}
;

window.$SINAPlayer.sinaFlashPlayer = function() {
    function a(b, c) {
        this.playerConfig = b;
        this.videoConfig = c;
        a.superclass.constructor.call(this, this.playerConfig, window.$SINAPlayer.util.buildFlash.getFlashHTML)
    }
    window.$SINAPlayer.util.extendClass(a, window.$SINAPlayer.player);
    a.prototype.playVideo = function(a) {
        var a = a || this.videoConfig;
        if (a == -1)
            this.player.playVideo(-1);
        else if (typeof a == "object" && a.video_id) {
            var b = {
                pid: a.pid,
                videoTitle: a.title,
                videoURL: a.url || location.href,
                tokenURL: a.swfOutsideUrl || ""
            }
              , c = window.$SINAPlayer.getUser();
            c && c.uid && (b.uid = c.uid);
            var d = this
              , e = setInterval(function() {
                if (d.player && d.player.playVideo) {
                    d.player.playVideo(a.video_id, b);
                    clearInterval(e)
                }
            }, 50)
        }
    }
    ;
    a.prototype.pause = function() {
        try {
            this.player.jsPause()
        } catch (a) {}
        return this
    }
    ;
    a.prototype.play = function() {
        try {
            this.player.jsPlay()
        } catch (a) {}
        return this
    }
    ;
    a.prototype.setVolume = function(a) {
        this.player.setVolume(a);
        return this
    }
    ;
    a.prototype.on = function(a, b) {
        this.callback.add(a, b)
    }
    ;
    return a
}();

window.$SINAPlayer.util.checkFlashPlugins = function() {
    function b(a) {
        var b = {
            max: -1,
            min: -1
        };
        a = a.replace(/,/g, ".");
        var c = a.match(/\d+.\d+/);
        if (c) {
            c = c[0];
            var d = c.split(".");
            b.max = parseInt(d[0] || 0);
            b.min = parseInt(d[1] || 0)
        }
        return b
    }
    function c() {
        try {
            if (navigator.plugins && navigator.plugins["Shockwave Flash"]) {
                a.flash = !0;
                var c = navigator.plugins["Shockwave Flash"]
                  , d = b(c.description);
                a.maxversion = d.max;
                a.minversion = d.min
            } else if (new ActiveXObject("ShockwaveFlash.ShockwaveFlash")) {
                a.flash = !0;
                var e = new ActiveXObject("ShockwaveFlash.ShockwaveFlash")
                  , d = b(e.GetVariable("$version"));
                a.maxversion = d.max;
                a.minversion = d.min
            }
        } catch (f) {}
    }
    var a = {};
    a.maxversion = 0;
    a.minversion = 0;
    a.flash = !1;
    c();
    a.support = function(b, c) {
        if (!a.flash)
            return !1;
        if (a.maxversion > b)
            return !0;
        if (a.maxversion != b)
            return !1;
        if (c != undefined)
            return a.minversion >= c ? !0 : !1
    }
    ;
    return a
}();

window.$SINAPlayer.checkFlash = function(a) {
    function d() {
        var a = navigator.userAgent
          , b = a.indexOf("compatible") > -1 && a.indexOf("MSIE") > -1
          , c = a.indexOf("Edge") > -1 && !b
          , d = a.indexOf("Trident") > -1 && a.indexOf("rv:11.0") > -1;
        if (!b)
            return c ? "edge" : d ? "IE11" : -1;
        var e = new RegExp("MSIE (\\d+\\.\\d+);");
        e.test(a);
        var f = parseFloat(RegExp.$1);
        if (f <= 10)
            return "IE10"
    }
    function e() {
        var a = navigator.userAgent;
        return a.indexOf("Opera") > -1 ? "Opera" : a.indexOf("Firefox") > -1 ? "FF" : a.indexOf("Chrome") > -1 ? "Chrome" : a.indexOf("Safari") > -1 ? "Safari" : d()
    }
    var b = window.$SINAPlayer.util.checkFlashPlugins
      , c = function(b, c) {
        b ? a.innerHTML = '<div style="text-align: center;">亲，您没有安装flash插件不能播放哦~  请 <a href="' + b + '" target="_blank">立即安装' + "</a>" + c + "</div>" : a.innerHTML = '<div style="text-align: center;">' + c + "</div>"
    }
      , f = e();
    if (b.flash) {
        if (!b.support(11, 0)) {
            c("//www.adobe.com/go/getflashplayer", "升级您的Flash Player版本，最低版本要求：11.0");
            return !1
        }
        return !0
    }
    "Safari" == f ? window.location.href = "//www.adobe.com/go/getflashplayer" : "FF" == f ? confirm("因本页面视频需要flash插件支持，请确定您的浏览器已安装flash插件并允许开启") && (window.location.href = "https://support.mozilla.org/zh-CN/kb/flash-blocklists") : c("//www.adobe.com/go/getflashplayer", "")
}
;

window.$SINAPlayer.playerInit = function(a, b) {

    // console.log('--playerInit--',a,b);
    var mediaInfo = b;

    function k() {
        var b = a.flashvars;
        for (var c in a.flashvars)
            encodeURIComponent(b[c]);
        d(h, a || {});
        h.url || (h.url = window.$SINAFLASHURL);
        h.flashvars.playerId = h.id;
        h.flashvars.jsNamespace = "window.$PlayerCallJs";
        j = document.getElementById(h.container)
    }
    function l() {
        f.add(i.player.playerid, i.player);
    }
    function m() {
        if (window.$SINAPlayer.checkFlash(j)) {
            i.player = new window.$SINAPlayer.sinaFlashPlayer(h,b);

            window.$SINAPlayer.player.type = 1;
            window.$SINAPlayer.player.init = !0;
            i.player.buildDom();
            l()
        }
    }
    function n() {
        i.player = new window.$SINAPlayer.sinaH5Player(h,b);
        window.$SINAPlayer.player.type = 2;
        window.$SINAPlayer.player.init = !0;
        var a = [{
            playerInitCompleted: "flashInitCompleted"
        }, {
            // playStart: "playStart"
        }, {
            // videoError: "videoError"
        }, {
            // playComplete: "playComplete"
        }];
        for (var c = 0, d = a.length; c < d; c++)
            (function() {
                var b = a[c];

                for (var d in b)
                    i.player.callback.add(d, function() {
                        try {
                            
                            // console.log('sinaH5Player--调用开始 ');
                            
                            // window.$SINAPlayer.SnvdLog(mediaInfo);

                            // console.log('sinaH5Player--初始化完毕',d);

                            $PlayerCallJs[b[d]].apply(null, arguments);

                        } catch (a) {}
                    })
            }
            )();
        i.player.buildDom(!0);
        l()
    }
    function o() {
        window.$SINAPlayer.time.initPlayerStart = (new Date).getTime();
        window.$SINAPlayer.player.init = !1;
        /phone|pad|android/i.test(navigator.userAgent) ? n() : m()
    }
    function p() {
        k();
        c();
        o()
    }
    function q() {
        var a = r.length;
        if (typeof r[0].player.playerConfig.isSingle == "undefined")
            return !1;
        var b = r[0].player.playerConfig.isSingle;
        if (a !== 1) {
            for (var c = 1; c < a; c++)
                b = b || r[c].player.playerConfig.isSingle;
            if (!b)
                return !1;
            for (var c = 0; c < a; c++) {
                var d = r[c].player;
                (function(b) {
                    b.on("playStart", function() {
                        for (var c = 0; c < a; c++) {
                            if (b == r[c].player)
                                continue;
                            r[c].player.pause();

                        }
                    })
                }
                )(d);
                (function(b) {
                    b.on("unpauseNotify", function() {
                        for (var c = 0; c < a; c++) {
                            if (b == r[c].player)
                                continue;
                            r[c].player.pause()
                        }
                    })
                }
                )(d)
            }
        }
    }
    var c = window.$SINAPlayer.playerCallJs
      , d = window.$SINAPlayer.util.extend
      , e = window.$SINAPlayer.util.platform
      , f = window.$SINAPlayer.playersControl
      , g = window.$SINAPlayer.util.jsonp
      , h = {
        url: window.$SINAFLASHURL,
        id: "sinaPlayer",
        container: "sinaPlayerContainer",
        classname: "",
        isSingle: !1,
        params: {
            allowNetworking: "all",
            allowScriptAccess: "always",
            wmode: "opaque",
            allowFullScreen: "true",
            quality: "high"
        },
        attributes: {},
        flashvars: {
            brg: "0",
            brgon: "0",
            brginput: "0",
            tj: 1
        },
        h5attr: {
            autoPlay: !1,
            controls: !0,
            loop: !1,
            poster: "",
            preload: "auto"
        }
    }
      , i = {}
      , j = null;
    p();
    var r = window.$SINAPlayer.players;
    if (r) {
        r.push(i);
        r[0].player && q()
    }
    return i
}
;
