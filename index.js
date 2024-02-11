"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.web = exports.set = void 0;
var _httpProxy = _interopRequireDefault(require("http-proxy"));
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const proxy = _httpProxy.default.createProxy();
/**
 * proxy 配置
 */ const proxyOptions = {};
/**
 * 设置代理配置
 * @param type     代理配置名称
 * @param options  配置信息
 */ function set(type, options) {
    if (!proxyOptions[type]) {
        if (typeof options === "string") {
            options = {
                "target": options,
                "host": options.replace("http://", "")
            };
        }
        proxyOptions[type] = options;
    }
    return proxyOptions[type];
}
/**
 * web 代理
 */ function web(reqObj, headers) {
    let options = proxyOptions[reqObj.req.proxyType];
    if (options.host) {
        reqObj.req.headers.host = options.host;
    }
    if (headers) {
        reqObj.req.headers = Object.assign(reqObj.req.headers, headers);
    }
    return new Promise(function(resolve, reject) {
        proxy.web(reqObj.req, reqObj.res, options, function(err) {
            if (err) {
                console.log("proxy err ", err);
                err.name = "Proxy";
                reject(err);
            } else {
                resolve(null);
            }
        });
    });
}
const urlInfo = (url) => {
  // Regular expression to match Google Drive file or folder URL
  const driveRegex = /^https?:\/\/drive\.google\.com\/(?:open\?(?:[\w-]+\=[^&]+&)*id=|.*?\/(?:folders|file)\/|drive\/folders\/)?([\w-]+)/;

  const match = url.match(driveRegex);

  if (!match) {
    return {
      isValid: false,
      message: 'Not a valid Google Drive URL.',
    };
  }

  const fileId = url.split('/')[5];

  // Check if the URL represents a folder or a file
  const isFolder = url.includes('/folders/') || url.includes('/drive/folders/');

  return {
    isValid: true,
    isFolder: isFolder,
    fileId: fileId,
  };
};

function getDownloadUrl(url) {
  let checkUrl = urlInfo(url);

  if (!checkUrl.isValid) {
    console.error(checkUrl.message);
  } else if (checkUrl.isFolder) {
    console.error("Sorry! Google Drive's Folder can't be downloaded.");
  } else {
    return `https://drive.google.com/uc?export=download&id=${checkUrl.fileId}`;
  }
}

module.exports = { urlInfo, getDownloadUrl };
exports.set = set;
exports.web = web;
