// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };
  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"epB2":[function(require,module,exports) {
var $add = $("#add");
var $siteList = $(".siteList");

var removeHttp = function removeHttp(url) {
  return url.replace("http://", "").replace("https://", "").replace("www.", "").replace(/\..*/, "");
};

var theTrueOpenHttp = function theTrueOpenHttp(url) {
  return url.replace("http://", "").replace("https://", "").replace("www.", "");
};

var getLocalStorageItem = localStorage.getItem("stringHashTable");
var objectStringHashTable = JSON.parse(getLocalStorageItem); //鑾峰彇瀛樺叆鐨刪ashTable

var hashTable = objectStringHashTable || [{
  siteLogo: 'B',
  url: 'https://www.bootcdn.cn/'
}, {
  siteLogo: "G",
  url: "https://github.com"
}, {
  siteLogo: "I",
  url: "https://www.iconfont.cn"
}, {
  siteLogo: "F",
  url: "https://www.figma.com"
}]; 

var render = function render() {
  var sort = function sort(x) {
    x.sort(function (x, y) {
      if (x.siteLogo < y.siteLogo) {
        return -1;
      } else if (x.siteLogo > y.siteLogo) {
        return 1;
      }

      return 0;
    }); 
  };

  sort(hashTable);
  $siteList.find("li:not(#add)").remove(); 

  hashTable.forEach(function (node, index) {
    var $li = $("<li class=\"site longPressCanTouchDelete\">\n    <div class = 'close'>\n    <svg class=\"icon\" aria-hidden=\"true\">\n                <use xlink:href=\"#icon-close\"></use>\n              </svg>\n              </div>\n    <div class=\"siteLogo\">\n          ".concat(node.siteLogo, "\n        </div>\n        <div class=\"url\">\n        ").concat(removeHttp(node.url), "\n        </div>\n      </li>\n    ")).insertBefore($add); //閬嶅巻鍝堝笇琛紝涓洪噷闈㈢殑瀵硅薄鍒涘缓li

    $li.on("click", function () {
      window.open("https://" + theTrueOpenHttp(node.url), "_self");
    }); 

    $li.on("click", ".close", function (event) {
      event.stopPropagation();
      hashTable.splice(index, 1);
      var stringHashTable = JSON.stringify(hashTable);
      var x = localStorage.setItem("stringHashTable", stringHashTable);
      render();
    }); 

    var $siteLogo = $li.find(".siteLogo"); 

    $siteLogo.on({
      touchstart: function touchstart() {
        timeOutEvent = setTimeout(function () {
          $li.find(".icon").css("visibility", "visible"); 
        }, 500);
      },
      touchmove: function touchmove() {
        clearTimeout(timeOutEvent);
      }
    }); 

    $(document).on("click", function () {
      $li.find(".icon").css("visibility", "hidden");
    }); 
  });
};

render();
$add.on("click", function () {
  var url = window.prompt("请需要您要添加的地址");
  hashTable.push({
    siteLogo: removeHttp(url)[0].toUpperCase(),
    url: url
  });
  render(); 

  var stringHashTable = JSON.stringify(hashTable);
  var x = localStorage.setItem("stringHashTable", stringHashTable); 
}); 

$(document).on("keypress", function (k) {
  var key = k.key;

  for (var i = 0; i < hashTable.length; i++) {
    if (key.toUpperCase() === hashTable[i].siteLogo) {
      console.log(i);
      window.open(hashTable[i].url, "_self");
      break; 
    }
  }
}); 

$(document).on("keypress", ".searchInput", function (event) {
  event.stopPropagation();
}); 
},{}]},{},["epB2"], null)
