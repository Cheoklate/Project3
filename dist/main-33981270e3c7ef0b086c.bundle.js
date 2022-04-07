/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/axios/index.js":
/*!*************************************!*\
  !*** ./node_modules/axios/index.js ***!
  \*************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__(/*! ./lib/axios */ "./node_modules/axios/lib/axios.js");

/***/ }),

/***/ "./node_modules/axios/lib/adapters/xhr.js":
/*!************************************************!*\
  !*** ./node_modules/axios/lib/adapters/xhr.js ***!
  \************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");
var settle = __webpack_require__(/*! ./../core/settle */ "./node_modules/axios/lib/core/settle.js");
var cookies = __webpack_require__(/*! ./../helpers/cookies */ "./node_modules/axios/lib/helpers/cookies.js");
var buildURL = __webpack_require__(/*! ./../helpers/buildURL */ "./node_modules/axios/lib/helpers/buildURL.js");
var buildFullPath = __webpack_require__(/*! ../core/buildFullPath */ "./node_modules/axios/lib/core/buildFullPath.js");
var parseHeaders = __webpack_require__(/*! ./../helpers/parseHeaders */ "./node_modules/axios/lib/helpers/parseHeaders.js");
var isURLSameOrigin = __webpack_require__(/*! ./../helpers/isURLSameOrigin */ "./node_modules/axios/lib/helpers/isURLSameOrigin.js");
var createError = __webpack_require__(/*! ../core/createError */ "./node_modules/axios/lib/core/createError.js");

module.exports = function xhrAdapter(config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    var requestData = config.data;
    var requestHeaders = config.headers;
    var responseType = config.responseType;

    if (utils.isFormData(requestData)) {
      delete requestHeaders['Content-Type']; // Let the browser set it
    }

    var request = new XMLHttpRequest();

    // HTTP basic authentication
    if (config.auth) {
      var username = config.auth.username || '';
      var password = config.auth.password ? unescape(encodeURIComponent(config.auth.password)) : '';
      requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
    }

    var fullPath = buildFullPath(config.baseURL, config.url);
    request.open(config.method.toUpperCase(), buildURL(fullPath, config.params, config.paramsSerializer), true);

    // Set the request timeout in MS
    request.timeout = config.timeout;

    function onloadend() {
      if (!request) {
        return;
      }
      // Prepare the response
      var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
      var responseData = !responseType || responseType === 'text' ||  responseType === 'json' ?
        request.responseText : request.response;
      var response = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config: config,
        request: request
      };

      settle(resolve, reject, response);

      // Clean up request
      request = null;
    }

    if ('onloadend' in request) {
      // Use onloadend if available
      request.onloadend = onloadend;
    } else {
      // Listen for ready state to emulate onloadend
      request.onreadystatechange = function handleLoad() {
        if (!request || request.readyState !== 4) {
          return;
        }

        // The request errored out and we didn't get a response, this will be
        // handled by onerror instead
        // With one exception: request that using file: protocol, most browsers
        // will return status as 0 even though it's a successful request
        if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
          return;
        }
        // readystate handler is calling before onerror or ontimeout handlers,
        // so we should call onloadend on the next 'tick'
        setTimeout(onloadend);
      };
    }

    // Handle browser request cancellation (as opposed to a manual cancellation)
    request.onabort = function handleAbort() {
      if (!request) {
        return;
      }

      reject(createError('Request aborted', config, 'ECONNABORTED', request));

      // Clean up request
      request = null;
    };

    // Handle low level network errors
    request.onerror = function handleError() {
      // Real errors are hidden from us by the browser
      // onerror should only fire if it's a network error
      reject(createError('Network Error', config, null, request));

      // Clean up request
      request = null;
    };

    // Handle timeout
    request.ontimeout = function handleTimeout() {
      var timeoutErrorMessage = 'timeout of ' + config.timeout + 'ms exceeded';
      if (config.timeoutErrorMessage) {
        timeoutErrorMessage = config.timeoutErrorMessage;
      }
      reject(createError(
        timeoutErrorMessage,
        config,
        config.transitional && config.transitional.clarifyTimeoutError ? 'ETIMEDOUT' : 'ECONNABORTED',
        request));

      // Clean up request
      request = null;
    };

    // Add xsrf header
    // This is only done if running in a standard browser environment.
    // Specifically not if we're in a web worker, or react-native.
    if (utils.isStandardBrowserEnv()) {
      // Add xsrf header
      var xsrfValue = (config.withCredentials || isURLSameOrigin(fullPath)) && config.xsrfCookieName ?
        cookies.read(config.xsrfCookieName) :
        undefined;

      if (xsrfValue) {
        requestHeaders[config.xsrfHeaderName] = xsrfValue;
      }
    }

    // Add headers to the request
    if ('setRequestHeader' in request) {
      utils.forEach(requestHeaders, function setRequestHeader(val, key) {
        if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
          // Remove Content-Type if data is undefined
          delete requestHeaders[key];
        } else {
          // Otherwise add header to the request
          request.setRequestHeader(key, val);
        }
      });
    }

    // Add withCredentials to request if needed
    if (!utils.isUndefined(config.withCredentials)) {
      request.withCredentials = !!config.withCredentials;
    }

    // Add responseType to request if needed
    if (responseType && responseType !== 'json') {
      request.responseType = config.responseType;
    }

    // Handle progress if needed
    if (typeof config.onDownloadProgress === 'function') {
      request.addEventListener('progress', config.onDownloadProgress);
    }

    // Not all browsers support upload events
    if (typeof config.onUploadProgress === 'function' && request.upload) {
      request.upload.addEventListener('progress', config.onUploadProgress);
    }

    if (config.cancelToken) {
      // Handle cancellation
      config.cancelToken.promise.then(function onCanceled(cancel) {
        if (!request) {
          return;
        }

        request.abort();
        reject(cancel);
        // Clean up request
        request = null;
      });
    }

    if (!requestData) {
      requestData = null;
    }

    // Send the request
    request.send(requestData);
  });
};


/***/ }),

/***/ "./node_modules/axios/lib/axios.js":
/*!*****************************************!*\
  !*** ./node_modules/axios/lib/axios.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./utils */ "./node_modules/axios/lib/utils.js");
var bind = __webpack_require__(/*! ./helpers/bind */ "./node_modules/axios/lib/helpers/bind.js");
var Axios = __webpack_require__(/*! ./core/Axios */ "./node_modules/axios/lib/core/Axios.js");
var mergeConfig = __webpack_require__(/*! ./core/mergeConfig */ "./node_modules/axios/lib/core/mergeConfig.js");
var defaults = __webpack_require__(/*! ./defaults */ "./node_modules/axios/lib/defaults.js");

/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 * @return {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  var context = new Axios(defaultConfig);
  var instance = bind(Axios.prototype.request, context);

  // Copy axios.prototype to instance
  utils.extend(instance, Axios.prototype, context);

  // Copy context to instance
  utils.extend(instance, context);

  return instance;
}

// Create the default instance to be exported
var axios = createInstance(defaults);

// Expose Axios class to allow class inheritance
axios.Axios = Axios;

// Factory for creating new instances
axios.create = function create(instanceConfig) {
  return createInstance(mergeConfig(axios.defaults, instanceConfig));
};

// Expose Cancel & CancelToken
axios.Cancel = __webpack_require__(/*! ./cancel/Cancel */ "./node_modules/axios/lib/cancel/Cancel.js");
axios.CancelToken = __webpack_require__(/*! ./cancel/CancelToken */ "./node_modules/axios/lib/cancel/CancelToken.js");
axios.isCancel = __webpack_require__(/*! ./cancel/isCancel */ "./node_modules/axios/lib/cancel/isCancel.js");

// Expose all/spread
axios.all = function all(promises) {
  return Promise.all(promises);
};
axios.spread = __webpack_require__(/*! ./helpers/spread */ "./node_modules/axios/lib/helpers/spread.js");

// Expose isAxiosError
axios.isAxiosError = __webpack_require__(/*! ./helpers/isAxiosError */ "./node_modules/axios/lib/helpers/isAxiosError.js");

module.exports = axios;

// Allow use of default import syntax in TypeScript
module.exports["default"] = axios;


/***/ }),

/***/ "./node_modules/axios/lib/cancel/Cancel.js":
/*!*************************************************!*\
  !*** ./node_modules/axios/lib/cancel/Cancel.js ***!
  \*************************************************/
/***/ ((module) => {

"use strict";


/**
 * A `Cancel` is an object that is thrown when an operation is canceled.
 *
 * @class
 * @param {string=} message The message.
 */
function Cancel(message) {
  this.message = message;
}

Cancel.prototype.toString = function toString() {
  return 'Cancel' + (this.message ? ': ' + this.message : '');
};

Cancel.prototype.__CANCEL__ = true;

module.exports = Cancel;


/***/ }),

/***/ "./node_modules/axios/lib/cancel/CancelToken.js":
/*!******************************************************!*\
  !*** ./node_modules/axios/lib/cancel/CancelToken.js ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var Cancel = __webpack_require__(/*! ./Cancel */ "./node_modules/axios/lib/cancel/Cancel.js");

/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @class
 * @param {Function} executor The executor function.
 */
function CancelToken(executor) {
  if (typeof executor !== 'function') {
    throw new TypeError('executor must be a function.');
  }

  var resolvePromise;
  this.promise = new Promise(function promiseExecutor(resolve) {
    resolvePromise = resolve;
  });

  var token = this;
  executor(function cancel(message) {
    if (token.reason) {
      // Cancellation has already been requested
      return;
    }

    token.reason = new Cancel(message);
    resolvePromise(token.reason);
  });
}

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
CancelToken.prototype.throwIfRequested = function throwIfRequested() {
  if (this.reason) {
    throw this.reason;
  }
};

/**
 * Returns an object that contains a new `CancelToken` and a function that, when called,
 * cancels the `CancelToken`.
 */
CancelToken.source = function source() {
  var cancel;
  var token = new CancelToken(function executor(c) {
    cancel = c;
  });
  return {
    token: token,
    cancel: cancel
  };
};

module.exports = CancelToken;


/***/ }),

/***/ "./node_modules/axios/lib/cancel/isCancel.js":
/*!***************************************************!*\
  !*** ./node_modules/axios/lib/cancel/isCancel.js ***!
  \***************************************************/
/***/ ((module) => {

"use strict";


module.exports = function isCancel(value) {
  return !!(value && value.__CANCEL__);
};


/***/ }),

/***/ "./node_modules/axios/lib/core/Axios.js":
/*!**********************************************!*\
  !*** ./node_modules/axios/lib/core/Axios.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");
var buildURL = __webpack_require__(/*! ../helpers/buildURL */ "./node_modules/axios/lib/helpers/buildURL.js");
var InterceptorManager = __webpack_require__(/*! ./InterceptorManager */ "./node_modules/axios/lib/core/InterceptorManager.js");
var dispatchRequest = __webpack_require__(/*! ./dispatchRequest */ "./node_modules/axios/lib/core/dispatchRequest.js");
var mergeConfig = __webpack_require__(/*! ./mergeConfig */ "./node_modules/axios/lib/core/mergeConfig.js");
var validator = __webpack_require__(/*! ../helpers/validator */ "./node_modules/axios/lib/helpers/validator.js");

var validators = validator.validators;
/**
 * Create a new instance of Axios
 *
 * @param {Object} instanceConfig The default config for the instance
 */
function Axios(instanceConfig) {
  this.defaults = instanceConfig;
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  };
}

/**
 * Dispatch a request
 *
 * @param {Object} config The config specific for this request (merged with this.defaults)
 */
Axios.prototype.request = function request(config) {
  /*eslint no-param-reassign:0*/
  // Allow for axios('example/url'[, config]) a la fetch API
  if (typeof config === 'string') {
    config = arguments[1] || {};
    config.url = arguments[0];
  } else {
    config = config || {};
  }

  config = mergeConfig(this.defaults, config);

  // Set config.method
  if (config.method) {
    config.method = config.method.toLowerCase();
  } else if (this.defaults.method) {
    config.method = this.defaults.method.toLowerCase();
  } else {
    config.method = 'get';
  }

  var transitional = config.transitional;

  if (transitional !== undefined) {
    validator.assertOptions(transitional, {
      silentJSONParsing: validators.transitional(validators.boolean, '1.0.0'),
      forcedJSONParsing: validators.transitional(validators.boolean, '1.0.0'),
      clarifyTimeoutError: validators.transitional(validators.boolean, '1.0.0')
    }, false);
  }

  // filter out skipped interceptors
  var requestInterceptorChain = [];
  var synchronousRequestInterceptors = true;
  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    if (typeof interceptor.runWhen === 'function' && interceptor.runWhen(config) === false) {
      return;
    }

    synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;

    requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
  });

  var responseInterceptorChain = [];
  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
  });

  var promise;

  if (!synchronousRequestInterceptors) {
    var chain = [dispatchRequest, undefined];

    Array.prototype.unshift.apply(chain, requestInterceptorChain);
    chain = chain.concat(responseInterceptorChain);

    promise = Promise.resolve(config);
    while (chain.length) {
      promise = promise.then(chain.shift(), chain.shift());
    }

    return promise;
  }


  var newConfig = config;
  while (requestInterceptorChain.length) {
    var onFulfilled = requestInterceptorChain.shift();
    var onRejected = requestInterceptorChain.shift();
    try {
      newConfig = onFulfilled(newConfig);
    } catch (error) {
      onRejected(error);
      break;
    }
  }

  try {
    promise = dispatchRequest(newConfig);
  } catch (error) {
    return Promise.reject(error);
  }

  while (responseInterceptorChain.length) {
    promise = promise.then(responseInterceptorChain.shift(), responseInterceptorChain.shift());
  }

  return promise;
};

Axios.prototype.getUri = function getUri(config) {
  config = mergeConfig(this.defaults, config);
  return buildURL(config.url, config.params, config.paramsSerializer).replace(/^\?/, '');
};

// Provide aliases for supported request methods
utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, config) {
    return this.request(mergeConfig(config || {}, {
      method: method,
      url: url,
      data: (config || {}).data
    }));
  };
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, data, config) {
    return this.request(mergeConfig(config || {}, {
      method: method,
      url: url,
      data: data
    }));
  };
});

module.exports = Axios;


/***/ }),

/***/ "./node_modules/axios/lib/core/InterceptorManager.js":
/*!***********************************************************!*\
  !*** ./node_modules/axios/lib/core/InterceptorManager.js ***!
  \***********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

function InterceptorManager() {
  this.handlers = [];
}

/**
 * Add a new interceptor to the stack
 *
 * @param {Function} fulfilled The function to handle `then` for a `Promise`
 * @param {Function} rejected The function to handle `reject` for a `Promise`
 *
 * @return {Number} An ID used to remove interceptor later
 */
InterceptorManager.prototype.use = function use(fulfilled, rejected, options) {
  this.handlers.push({
    fulfilled: fulfilled,
    rejected: rejected,
    synchronous: options ? options.synchronous : false,
    runWhen: options ? options.runWhen : null
  });
  return this.handlers.length - 1;
};

/**
 * Remove an interceptor from the stack
 *
 * @param {Number} id The ID that was returned by `use`
 */
InterceptorManager.prototype.eject = function eject(id) {
  if (this.handlers[id]) {
    this.handlers[id] = null;
  }
};

/**
 * Iterate over all the registered interceptors
 *
 * This method is particularly useful for skipping over any
 * interceptors that may have become `null` calling `eject`.
 *
 * @param {Function} fn The function to call for each interceptor
 */
InterceptorManager.prototype.forEach = function forEach(fn) {
  utils.forEach(this.handlers, function forEachHandler(h) {
    if (h !== null) {
      fn(h);
    }
  });
};

module.exports = InterceptorManager;


/***/ }),

/***/ "./node_modules/axios/lib/core/buildFullPath.js":
/*!******************************************************!*\
  !*** ./node_modules/axios/lib/core/buildFullPath.js ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var isAbsoluteURL = __webpack_require__(/*! ../helpers/isAbsoluteURL */ "./node_modules/axios/lib/helpers/isAbsoluteURL.js");
var combineURLs = __webpack_require__(/*! ../helpers/combineURLs */ "./node_modules/axios/lib/helpers/combineURLs.js");

/**
 * Creates a new URL by combining the baseURL with the requestedURL,
 * only when the requestedURL is not already an absolute URL.
 * If the requestURL is absolute, this function returns the requestedURL untouched.
 *
 * @param {string} baseURL The base URL
 * @param {string} requestedURL Absolute or relative URL to combine
 * @returns {string} The combined full path
 */
module.exports = function buildFullPath(baseURL, requestedURL) {
  if (baseURL && !isAbsoluteURL(requestedURL)) {
    return combineURLs(baseURL, requestedURL);
  }
  return requestedURL;
};


/***/ }),

/***/ "./node_modules/axios/lib/core/createError.js":
/*!****************************************************!*\
  !*** ./node_modules/axios/lib/core/createError.js ***!
  \****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var enhanceError = __webpack_require__(/*! ./enhanceError */ "./node_modules/axios/lib/core/enhanceError.js");

/**
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The created error.
 */
module.exports = function createError(message, config, code, request, response) {
  var error = new Error(message);
  return enhanceError(error, config, code, request, response);
};


/***/ }),

/***/ "./node_modules/axios/lib/core/dispatchRequest.js":
/*!********************************************************!*\
  !*** ./node_modules/axios/lib/core/dispatchRequest.js ***!
  \********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");
var transformData = __webpack_require__(/*! ./transformData */ "./node_modules/axios/lib/core/transformData.js");
var isCancel = __webpack_require__(/*! ../cancel/isCancel */ "./node_modules/axios/lib/cancel/isCancel.js");
var defaults = __webpack_require__(/*! ../defaults */ "./node_modules/axios/lib/defaults.js");

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }
}

/**
 * Dispatch a request to the server using the configured adapter.
 *
 * @param {object} config The config that is to be used for the request
 * @returns {Promise} The Promise to be fulfilled
 */
module.exports = function dispatchRequest(config) {
  throwIfCancellationRequested(config);

  // Ensure headers exist
  config.headers = config.headers || {};

  // Transform request data
  config.data = transformData.call(
    config,
    config.data,
    config.headers,
    config.transformRequest
  );

  // Flatten headers
  config.headers = utils.merge(
    config.headers.common || {},
    config.headers[config.method] || {},
    config.headers
  );

  utils.forEach(
    ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
    function cleanHeaderConfig(method) {
      delete config.headers[method];
    }
  );

  var adapter = config.adapter || defaults.adapter;

  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);

    // Transform response data
    response.data = transformData.call(
      config,
      response.data,
      response.headers,
      config.transformResponse
    );

    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config);

      // Transform response data
      if (reason && reason.response) {
        reason.response.data = transformData.call(
          config,
          reason.response.data,
          reason.response.headers,
          config.transformResponse
        );
      }
    }

    return Promise.reject(reason);
  });
};


/***/ }),

/***/ "./node_modules/axios/lib/core/enhanceError.js":
/*!*****************************************************!*\
  !*** ./node_modules/axios/lib/core/enhanceError.js ***!
  \*****************************************************/
/***/ ((module) => {

"use strict";


/**
 * Update an Error with the specified config, error code, and response.
 *
 * @param {Error} error The error to update.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The error.
 */
module.exports = function enhanceError(error, config, code, request, response) {
  error.config = config;
  if (code) {
    error.code = code;
  }

  error.request = request;
  error.response = response;
  error.isAxiosError = true;

  error.toJSON = function toJSON() {
    return {
      // Standard
      message: this.message,
      name: this.name,
      // Microsoft
      description: this.description,
      number: this.number,
      // Mozilla
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      // Axios
      config: this.config,
      code: this.code
    };
  };
  return error;
};


/***/ }),

/***/ "./node_modules/axios/lib/core/mergeConfig.js":
/*!****************************************************!*\
  !*** ./node_modules/axios/lib/core/mergeConfig.js ***!
  \****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ../utils */ "./node_modules/axios/lib/utils.js");

/**
 * Config-specific merge-function which creates a new config-object
 * by merging two configuration objects together.
 *
 * @param {Object} config1
 * @param {Object} config2
 * @returns {Object} New object resulting from merging config2 to config1
 */
module.exports = function mergeConfig(config1, config2) {
  // eslint-disable-next-line no-param-reassign
  config2 = config2 || {};
  var config = {};

  var valueFromConfig2Keys = ['url', 'method', 'data'];
  var mergeDeepPropertiesKeys = ['headers', 'auth', 'proxy', 'params'];
  var defaultToConfig2Keys = [
    'baseURL', 'transformRequest', 'transformResponse', 'paramsSerializer',
    'timeout', 'timeoutMessage', 'withCredentials', 'adapter', 'responseType', 'xsrfCookieName',
    'xsrfHeaderName', 'onUploadProgress', 'onDownloadProgress', 'decompress',
    'maxContentLength', 'maxBodyLength', 'maxRedirects', 'transport', 'httpAgent',
    'httpsAgent', 'cancelToken', 'socketPath', 'responseEncoding'
  ];
  var directMergeKeys = ['validateStatus'];

  function getMergedValue(target, source) {
    if (utils.isPlainObject(target) && utils.isPlainObject(source)) {
      return utils.merge(target, source);
    } else if (utils.isPlainObject(source)) {
      return utils.merge({}, source);
    } else if (utils.isArray(source)) {
      return source.slice();
    }
    return source;
  }

  function mergeDeepProperties(prop) {
    if (!utils.isUndefined(config2[prop])) {
      config[prop] = getMergedValue(config1[prop], config2[prop]);
    } else if (!utils.isUndefined(config1[prop])) {
      config[prop] = getMergedValue(undefined, config1[prop]);
    }
  }

  utils.forEach(valueFromConfig2Keys, function valueFromConfig2(prop) {
    if (!utils.isUndefined(config2[prop])) {
      config[prop] = getMergedValue(undefined, config2[prop]);
    }
  });

  utils.forEach(mergeDeepPropertiesKeys, mergeDeepProperties);

  utils.forEach(defaultToConfig2Keys, function defaultToConfig2(prop) {
    if (!utils.isUndefined(config2[prop])) {
      config[prop] = getMergedValue(undefined, config2[prop]);
    } else if (!utils.isUndefined(config1[prop])) {
      config[prop] = getMergedValue(undefined, config1[prop]);
    }
  });

  utils.forEach(directMergeKeys, function merge(prop) {
    if (prop in config2) {
      config[prop] = getMergedValue(config1[prop], config2[prop]);
    } else if (prop in config1) {
      config[prop] = getMergedValue(undefined, config1[prop]);
    }
  });

  var axiosKeys = valueFromConfig2Keys
    .concat(mergeDeepPropertiesKeys)
    .concat(defaultToConfig2Keys)
    .concat(directMergeKeys);

  var otherKeys = Object
    .keys(config1)
    .concat(Object.keys(config2))
    .filter(function filterAxiosKeys(key) {
      return axiosKeys.indexOf(key) === -1;
    });

  utils.forEach(otherKeys, mergeDeepProperties);

  return config;
};


/***/ }),

/***/ "./node_modules/axios/lib/core/settle.js":
/*!***********************************************!*\
  !*** ./node_modules/axios/lib/core/settle.js ***!
  \***********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var createError = __webpack_require__(/*! ./createError */ "./node_modules/axios/lib/core/createError.js");

/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 */
module.exports = function settle(resolve, reject, response) {
  var validateStatus = response.config.validateStatus;
  if (!response.status || !validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(createError(
      'Request failed with status code ' + response.status,
      response.config,
      null,
      response.request,
      response
    ));
  }
};


/***/ }),

/***/ "./node_modules/axios/lib/core/transformData.js":
/*!******************************************************!*\
  !*** ./node_modules/axios/lib/core/transformData.js ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");
var defaults = __webpack_require__(/*! ./../defaults */ "./node_modules/axios/lib/defaults.js");

/**
 * Transform the data for a request or a response
 *
 * @param {Object|String} data The data to be transformed
 * @param {Array} headers The headers for the request or response
 * @param {Array|Function} fns A single function or Array of functions
 * @returns {*} The resulting transformed data
 */
module.exports = function transformData(data, headers, fns) {
  var context = this || defaults;
  /*eslint no-param-reassign:0*/
  utils.forEach(fns, function transform(fn) {
    data = fn.call(context, data, headers);
  });

  return data;
};


/***/ }),

/***/ "./node_modules/axios/lib/defaults.js":
/*!********************************************!*\
  !*** ./node_modules/axios/lib/defaults.js ***!
  \********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./utils */ "./node_modules/axios/lib/utils.js");
var normalizeHeaderName = __webpack_require__(/*! ./helpers/normalizeHeaderName */ "./node_modules/axios/lib/helpers/normalizeHeaderName.js");
var enhanceError = __webpack_require__(/*! ./core/enhanceError */ "./node_modules/axios/lib/core/enhanceError.js");

var DEFAULT_CONTENT_TYPE = {
  'Content-Type': 'application/x-www-form-urlencoded'
};

function setContentTypeIfUnset(headers, value) {
  if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
    headers['Content-Type'] = value;
  }
}

function getDefaultAdapter() {
  var adapter;
  if (typeof XMLHttpRequest !== 'undefined') {
    // For browsers use XHR adapter
    adapter = __webpack_require__(/*! ./adapters/xhr */ "./node_modules/axios/lib/adapters/xhr.js");
  } else if (typeof process !== 'undefined' && Object.prototype.toString.call(process) === '[object process]') {
    // For node use HTTP adapter
    adapter = __webpack_require__(/*! ./adapters/http */ "./node_modules/axios/lib/adapters/xhr.js");
  }
  return adapter;
}

function stringifySafely(rawValue, parser, encoder) {
  if (utils.isString(rawValue)) {
    try {
      (parser || JSON.parse)(rawValue);
      return utils.trim(rawValue);
    } catch (e) {
      if (e.name !== 'SyntaxError') {
        throw e;
      }
    }
  }

  return (encoder || JSON.stringify)(rawValue);
}

var defaults = {

  transitional: {
    silentJSONParsing: true,
    forcedJSONParsing: true,
    clarifyTimeoutError: false
  },

  adapter: getDefaultAdapter(),

  transformRequest: [function transformRequest(data, headers) {
    normalizeHeaderName(headers, 'Accept');
    normalizeHeaderName(headers, 'Content-Type');

    if (utils.isFormData(data) ||
      utils.isArrayBuffer(data) ||
      utils.isBuffer(data) ||
      utils.isStream(data) ||
      utils.isFile(data) ||
      utils.isBlob(data)
    ) {
      return data;
    }
    if (utils.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils.isURLSearchParams(data)) {
      setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
      return data.toString();
    }
    if (utils.isObject(data) || (headers && headers['Content-Type'] === 'application/json')) {
      setContentTypeIfUnset(headers, 'application/json');
      return stringifySafely(data);
    }
    return data;
  }],

  transformResponse: [function transformResponse(data) {
    var transitional = this.transitional;
    var silentJSONParsing = transitional && transitional.silentJSONParsing;
    var forcedJSONParsing = transitional && transitional.forcedJSONParsing;
    var strictJSONParsing = !silentJSONParsing && this.responseType === 'json';

    if (strictJSONParsing || (forcedJSONParsing && utils.isString(data) && data.length)) {
      try {
        return JSON.parse(data);
      } catch (e) {
        if (strictJSONParsing) {
          if (e.name === 'SyntaxError') {
            throw enhanceError(e, this, 'E_JSON_PARSE');
          }
          throw e;
        }
      }
    }

    return data;
  }],

  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,

  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  maxContentLength: -1,
  maxBodyLength: -1,

  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  }
};

defaults.headers = {
  common: {
    'Accept': 'application/json, text/plain, */*'
  }
};

utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
  defaults.headers[method] = {};
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
});

module.exports = defaults;


/***/ }),

/***/ "./node_modules/axios/lib/helpers/bind.js":
/*!************************************************!*\
  !*** ./node_modules/axios/lib/helpers/bind.js ***!
  \************************************************/
/***/ ((module) => {

"use strict";


module.exports = function bind(fn, thisArg) {
  return function wrap() {
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }
    return fn.apply(thisArg, args);
  };
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/buildURL.js":
/*!****************************************************!*\
  !*** ./node_modules/axios/lib/helpers/buildURL.js ***!
  \****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

function encode(val) {
  return encodeURIComponent(val).
    replace(/%3A/gi, ':').
    replace(/%24/g, '$').
    replace(/%2C/gi, ',').
    replace(/%20/g, '+').
    replace(/%5B/gi, '[').
    replace(/%5D/gi, ']');
}

/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @returns {string} The formatted url
 */
module.exports = function buildURL(url, params, paramsSerializer) {
  /*eslint no-param-reassign:0*/
  if (!params) {
    return url;
  }

  var serializedParams;
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params);
  } else if (utils.isURLSearchParams(params)) {
    serializedParams = params.toString();
  } else {
    var parts = [];

    utils.forEach(params, function serialize(val, key) {
      if (val === null || typeof val === 'undefined') {
        return;
      }

      if (utils.isArray(val)) {
        key = key + '[]';
      } else {
        val = [val];
      }

      utils.forEach(val, function parseValue(v) {
        if (utils.isDate(v)) {
          v = v.toISOString();
        } else if (utils.isObject(v)) {
          v = JSON.stringify(v);
        }
        parts.push(encode(key) + '=' + encode(v));
      });
    });

    serializedParams = parts.join('&');
  }

  if (serializedParams) {
    var hashmarkIndex = url.indexOf('#');
    if (hashmarkIndex !== -1) {
      url = url.slice(0, hashmarkIndex);
    }

    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/combineURLs.js":
/*!*******************************************************!*\
  !*** ./node_modules/axios/lib/helpers/combineURLs.js ***!
  \*******************************************************/
/***/ ((module) => {

"use strict";


/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 * @returns {string} The combined URL
 */
module.exports = function combineURLs(baseURL, relativeURL) {
  return relativeURL
    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL;
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/cookies.js":
/*!***************************************************!*\
  !*** ./node_modules/axios/lib/helpers/cookies.js ***!
  \***************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs support document.cookie
    (function standardBrowserEnv() {
      return {
        write: function write(name, value, expires, path, domain, secure) {
          var cookie = [];
          cookie.push(name + '=' + encodeURIComponent(value));

          if (utils.isNumber(expires)) {
            cookie.push('expires=' + new Date(expires).toGMTString());
          }

          if (utils.isString(path)) {
            cookie.push('path=' + path);
          }

          if (utils.isString(domain)) {
            cookie.push('domain=' + domain);
          }

          if (secure === true) {
            cookie.push('secure');
          }

          document.cookie = cookie.join('; ');
        },

        read: function read(name) {
          var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
          return (match ? decodeURIComponent(match[3]) : null);
        },

        remove: function remove(name) {
          this.write(name, '', Date.now() - 86400000);
        }
      };
    })() :

  // Non standard browser env (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return {
        write: function write() {},
        read: function read() { return null; },
        remove: function remove() {}
      };
    })()
);


/***/ }),

/***/ "./node_modules/axios/lib/helpers/isAbsoluteURL.js":
/*!*********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/isAbsoluteURL.js ***!
  \*********************************************************/
/***/ ((module) => {

"use strict";


/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */
module.exports = function isAbsoluteURL(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/isAxiosError.js":
/*!********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/isAxiosError.js ***!
  \********************************************************/
/***/ ((module) => {

"use strict";


/**
 * Determines whether the payload is an error thrown by Axios
 *
 * @param {*} payload The value to test
 * @returns {boolean} True if the payload is an error thrown by Axios, otherwise false
 */
module.exports = function isAxiosError(payload) {
  return (typeof payload === 'object') && (payload.isAxiosError === true);
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/isURLSameOrigin.js":
/*!***********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/isURLSameOrigin.js ***!
  \***********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs have full support of the APIs needed to test
  // whether the request URL is of the same origin as current location.
    (function standardBrowserEnv() {
      var msie = /(msie|trident)/i.test(navigator.userAgent);
      var urlParsingNode = document.createElement('a');
      var originURL;

      /**
    * Parse a URL to discover it's components
    *
    * @param {String} url The URL to be parsed
    * @returns {Object}
    */
      function resolveURL(url) {
        var href = url;

        if (msie) {
        // IE needs attribute set twice to normalize properties
          urlParsingNode.setAttribute('href', href);
          href = urlParsingNode.href;
        }

        urlParsingNode.setAttribute('href', href);

        // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
        return {
          href: urlParsingNode.href,
          protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
          host: urlParsingNode.host,
          search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
          hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
          hostname: urlParsingNode.hostname,
          port: urlParsingNode.port,
          pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
            urlParsingNode.pathname :
            '/' + urlParsingNode.pathname
        };
      }

      originURL = resolveURL(window.location.href);

      /**
    * Determine if a URL shares the same origin as the current location
    *
    * @param {String} requestURL The URL to test
    * @returns {boolean} True if URL shares the same origin, otherwise false
    */
      return function isURLSameOrigin(requestURL) {
        var parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
        return (parsed.protocol === originURL.protocol &&
            parsed.host === originURL.host);
      };
    })() :

  // Non standard browser envs (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return function isURLSameOrigin() {
        return true;
      };
    })()
);


/***/ }),

/***/ "./node_modules/axios/lib/helpers/normalizeHeaderName.js":
/*!***************************************************************!*\
  !*** ./node_modules/axios/lib/helpers/normalizeHeaderName.js ***!
  \***************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ../utils */ "./node_modules/axios/lib/utils.js");

module.exports = function normalizeHeaderName(headers, normalizedName) {
  utils.forEach(headers, function processHeader(value, name) {
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = value;
      delete headers[name];
    }
  });
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/parseHeaders.js":
/*!********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/parseHeaders.js ***!
  \********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

// Headers whose duplicates are ignored by node
// c.f. https://nodejs.org/api/http.html#http_message_headers
var ignoreDuplicateOf = [
  'age', 'authorization', 'content-length', 'content-type', 'etag',
  'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
  'last-modified', 'location', 'max-forwards', 'proxy-authorization',
  'referer', 'retry-after', 'user-agent'
];

/**
 * Parse headers into an object
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 *
 * @param {String} headers Headers needing to be parsed
 * @returns {Object} Headers parsed into an object
 */
module.exports = function parseHeaders(headers) {
  var parsed = {};
  var key;
  var val;
  var i;

  if (!headers) { return parsed; }

  utils.forEach(headers.split('\n'), function parser(line) {
    i = line.indexOf(':');
    key = utils.trim(line.substr(0, i)).toLowerCase();
    val = utils.trim(line.substr(i + 1));

    if (key) {
      if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
        return;
      }
      if (key === 'set-cookie') {
        parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
      } else {
        parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
      }
    }
  });

  return parsed;
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/spread.js":
/*!**************************************************!*\
  !*** ./node_modules/axios/lib/helpers/spread.js ***!
  \**************************************************/
/***/ ((module) => {

"use strict";


/**
 * Syntactic sugar for invoking a function and expanding an array for arguments.
 *
 * Common use case would be to use `Function.prototype.apply`.
 *
 *  ```js
 *  function f(x, y, z) {}
 *  var args = [1, 2, 3];
 *  f.apply(null, args);
 *  ```
 *
 * With `spread` this example can be re-written.
 *
 *  ```js
 *  spread(function(x, y, z) {})([1, 2, 3]);
 *  ```
 *
 * @param {Function} callback
 * @returns {Function}
 */
module.exports = function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/validator.js":
/*!*****************************************************!*\
  !*** ./node_modules/axios/lib/helpers/validator.js ***!
  \*****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var pkg = __webpack_require__(/*! ./../../package.json */ "./node_modules/axios/package.json");

var validators = {};

// eslint-disable-next-line func-names
['object', 'boolean', 'number', 'function', 'string', 'symbol'].forEach(function(type, i) {
  validators[type] = function validator(thing) {
    return typeof thing === type || 'a' + (i < 1 ? 'n ' : ' ') + type;
  };
});

var deprecatedWarnings = {};
var currentVerArr = pkg.version.split('.');

/**
 * Compare package versions
 * @param {string} version
 * @param {string?} thanVersion
 * @returns {boolean}
 */
function isOlderVersion(version, thanVersion) {
  var pkgVersionArr = thanVersion ? thanVersion.split('.') : currentVerArr;
  var destVer = version.split('.');
  for (var i = 0; i < 3; i++) {
    if (pkgVersionArr[i] > destVer[i]) {
      return true;
    } else if (pkgVersionArr[i] < destVer[i]) {
      return false;
    }
  }
  return false;
}

/**
 * Transitional option validator
 * @param {function|boolean?} validator
 * @param {string?} version
 * @param {string} message
 * @returns {function}
 */
validators.transitional = function transitional(validator, version, message) {
  var isDeprecated = version && isOlderVersion(version);

  function formatMessage(opt, desc) {
    return '[Axios v' + pkg.version + '] Transitional option \'' + opt + '\'' + desc + (message ? '. ' + message : '');
  }

  // eslint-disable-next-line func-names
  return function(value, opt, opts) {
    if (validator === false) {
      throw new Error(formatMessage(opt, ' has been removed in ' + version));
    }

    if (isDeprecated && !deprecatedWarnings[opt]) {
      deprecatedWarnings[opt] = true;
      // eslint-disable-next-line no-console
      console.warn(
        formatMessage(
          opt,
          ' has been deprecated since v' + version + ' and will be removed in the near future'
        )
      );
    }

    return validator ? validator(value, opt, opts) : true;
  };
};

/**
 * Assert object's properties type
 * @param {object} options
 * @param {object} schema
 * @param {boolean?} allowUnknown
 */

function assertOptions(options, schema, allowUnknown) {
  if (typeof options !== 'object') {
    throw new TypeError('options must be an object');
  }
  var keys = Object.keys(options);
  var i = keys.length;
  while (i-- > 0) {
    var opt = keys[i];
    var validator = schema[opt];
    if (validator) {
      var value = options[opt];
      var result = value === undefined || validator(value, opt, options);
      if (result !== true) {
        throw new TypeError('option ' + opt + ' must be ' + result);
      }
      continue;
    }
    if (allowUnknown !== true) {
      throw Error('Unknown option ' + opt);
    }
  }
}

module.exports = {
  isOlderVersion: isOlderVersion,
  assertOptions: assertOptions,
  validators: validators
};


/***/ }),

/***/ "./node_modules/axios/lib/utils.js":
/*!*****************************************!*\
  !*** ./node_modules/axios/lib/utils.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var bind = __webpack_require__(/*! ./helpers/bind */ "./node_modules/axios/lib/helpers/bind.js");

// utils is a library of generic helper functions non-specific to axios

var toString = Object.prototype.toString;

/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Array, otherwise false
 */
function isArray(val) {
  return toString.call(val) === '[object Array]';
}

/**
 * Determine if a value is undefined
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if the value is undefined, otherwise false
 */
function isUndefined(val) {
  return typeof val === 'undefined';
}

/**
 * Determine if a value is a Buffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Buffer, otherwise false
 */
function isBuffer(val) {
  return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor)
    && typeof val.constructor.isBuffer === 'function' && val.constructor.isBuffer(val);
}

/**
 * Determine if a value is an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */
function isArrayBuffer(val) {
  return toString.call(val) === '[object ArrayBuffer]';
}

/**
 * Determine if a value is a FormData
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an FormData, otherwise false
 */
function isFormData(val) {
  return (typeof FormData !== 'undefined') && (val instanceof FormData);
}

/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */
function isArrayBufferView(val) {
  var result;
  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
    result = ArrayBuffer.isView(val);
  } else {
    result = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
  }
  return result;
}

/**
 * Determine if a value is a String
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a String, otherwise false
 */
function isString(val) {
  return typeof val === 'string';
}

/**
 * Determine if a value is a Number
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Number, otherwise false
 */
function isNumber(val) {
  return typeof val === 'number';
}

/**
 * Determine if a value is an Object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Object, otherwise false
 */
function isObject(val) {
  return val !== null && typeof val === 'object';
}

/**
 * Determine if a value is a plain Object
 *
 * @param {Object} val The value to test
 * @return {boolean} True if value is a plain Object, otherwise false
 */
function isPlainObject(val) {
  if (toString.call(val) !== '[object Object]') {
    return false;
  }

  var prototype = Object.getPrototypeOf(val);
  return prototype === null || prototype === Object.prototype;
}

/**
 * Determine if a value is a Date
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Date, otherwise false
 */
function isDate(val) {
  return toString.call(val) === '[object Date]';
}

/**
 * Determine if a value is a File
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a File, otherwise false
 */
function isFile(val) {
  return toString.call(val) === '[object File]';
}

/**
 * Determine if a value is a Blob
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Blob, otherwise false
 */
function isBlob(val) {
  return toString.call(val) === '[object Blob]';
}

/**
 * Determine if a value is a Function
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */
function isFunction(val) {
  return toString.call(val) === '[object Function]';
}

/**
 * Determine if a value is a Stream
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Stream, otherwise false
 */
function isStream(val) {
  return isObject(val) && isFunction(val.pipe);
}

/**
 * Determine if a value is a URLSearchParams object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */
function isURLSearchParams(val) {
  return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
}

/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 * @returns {String} The String freed of excess whitespace
 */
function trim(str) {
  return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, '');
}

/**
 * Determine if we're running in a standard browser environment
 *
 * This allows axios to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  navigator.product -> 'ReactNative'
 * nativescript
 *  navigator.product -> 'NativeScript' or 'NS'
 */
function isStandardBrowserEnv() {
  if (typeof navigator !== 'undefined' && (navigator.product === 'ReactNative' ||
                                           navigator.product === 'NativeScript' ||
                                           navigator.product === 'NS')) {
    return false;
  }
  return (
    typeof window !== 'undefined' &&
    typeof document !== 'undefined'
  );
}

/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 */
function forEach(obj, fn) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  // Force an array if not already something iterable
  if (typeof obj !== 'object') {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (var i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj);
      }
    }
  }
}

/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 * @returns {Object} Result of all merge properties
 */
function merge(/* obj1, obj2, obj3, ... */) {
  var result = {};
  function assignValue(val, key) {
    if (isPlainObject(result[key]) && isPlainObject(val)) {
      result[key] = merge(result[key], val);
    } else if (isPlainObject(val)) {
      result[key] = merge({}, val);
    } else if (isArray(val)) {
      result[key] = val.slice();
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 * @return {Object} The resulting value of object a
 */
function extend(a, b, thisArg) {
  forEach(b, function assignValue(val, key) {
    if (thisArg && typeof val === 'function') {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  });
  return a;
}

/**
 * Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
 *
 * @param {string} content with BOM
 * @return {string} content value without BOM
 */
function stripBOM(content) {
  if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1);
  }
  return content;
}

module.exports = {
  isArray: isArray,
  isArrayBuffer: isArrayBuffer,
  isBuffer: isBuffer,
  isFormData: isFormData,
  isArrayBufferView: isArrayBufferView,
  isString: isString,
  isNumber: isNumber,
  isObject: isObject,
  isPlainObject: isPlainObject,
  isUndefined: isUndefined,
  isDate: isDate,
  isFile: isFile,
  isBlob: isBlob,
  isFunction: isFunction,
  isStream: isStream,
  isURLSearchParams: isURLSearchParams,
  isStandardBrowserEnv: isStandardBrowserEnv,
  forEach: forEach,
  merge: merge,
  extend: extend,
  trim: trim,
  stripBOM: stripBOM
};


/***/ }),

/***/ "./src/styles.scss":
/*!*************************!*\
  !*** ./src/styles.scss ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./node_modules/axios/package.json":
/*!*****************************************!*\
  !*** ./node_modules/axios/package.json ***!
  \*****************************************/
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"name":"axios","version":"0.21.4","description":"Promise based HTTP client for the browser and node.js","main":"index.js","scripts":{"test":"grunt test","start":"node ./sandbox/server.js","build":"NODE_ENV=production grunt build","preversion":"npm test","version":"npm run build && grunt version && git add -A dist && git add CHANGELOG.md bower.json package.json","postversion":"git push && git push --tags","examples":"node ./examples/server.js","coveralls":"cat coverage/lcov.info | ./node_modules/coveralls/bin/coveralls.js","fix":"eslint --fix lib/**/*.js"},"repository":{"type":"git","url":"https://github.com/axios/axios.git"},"keywords":["xhr","http","ajax","promise","node"],"author":"Matt Zabriskie","license":"MIT","bugs":{"url":"https://github.com/axios/axios/issues"},"homepage":"https://axios-http.com","devDependencies":{"coveralls":"^3.0.0","es6-promise":"^4.2.4","grunt":"^1.3.0","grunt-banner":"^0.6.0","grunt-cli":"^1.2.0","grunt-contrib-clean":"^1.1.0","grunt-contrib-watch":"^1.0.0","grunt-eslint":"^23.0.0","grunt-karma":"^4.0.0","grunt-mocha-test":"^0.13.3","grunt-ts":"^6.0.0-beta.19","grunt-webpack":"^4.0.2","istanbul-instrumenter-loader":"^1.0.0","jasmine-core":"^2.4.1","karma":"^6.3.2","karma-chrome-launcher":"^3.1.0","karma-firefox-launcher":"^2.1.0","karma-jasmine":"^1.1.1","karma-jasmine-ajax":"^0.1.13","karma-safari-launcher":"^1.0.0","karma-sauce-launcher":"^4.3.6","karma-sinon":"^1.0.5","karma-sourcemap-loader":"^0.3.8","karma-webpack":"^4.0.2","load-grunt-tasks":"^3.5.2","minimist":"^1.2.0","mocha":"^8.2.1","sinon":"^4.5.0","terser-webpack-plugin":"^4.2.3","typescript":"^4.0.5","url-search-params":"^0.10.0","webpack":"^4.44.2","webpack-dev-server":"^3.11.0"},"browser":{"./lib/adapters/http.js":"./lib/adapters/xhr.js"},"jsdelivr":"dist/axios.min.js","unpkg":"dist/axios.min.js","typings":"./index.d.ts","dependencies":{"follow-redirects":"^1.14.0"},"bundlesize":[{"path":"./dist/axios.min.js","threshold":"5kB"}]}');

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! axios */ "./node_modules/axios/index.js");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _styles_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./styles.scss */ "./src/styles.scss");
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }


 // DOM Elements

var allCells = document.querySelectorAll('.cell:not(.row-top)');
var topCells = document.querySelectorAll('.cell.row-top');
var resetButton = document.querySelector('.reset');
var statusSpan = document.querySelector('.status'); // columns

var column0 = [allCells[35], allCells[28], allCells[21], allCells[14], allCells[7], allCells[0], topCells[0]];
var column1 = [allCells[36], allCells[29], allCells[22], allCells[15], allCells[8], allCells[1], topCells[1]];
var column2 = [allCells[37], allCells[30], allCells[23], allCells[16], allCells[9], allCells[2], topCells[2]];
var column3 = [allCells[38], allCells[31], allCells[24], allCells[17], allCells[10], allCells[3], topCells[3]];
var column4 = [allCells[39], allCells[32], allCells[25], allCells[18], allCells[11], allCells[4], topCells[4]];
var column5 = [allCells[40], allCells[33], allCells[26], allCells[19], allCells[12], allCells[5], topCells[5]];
var column6 = [allCells[41], allCells[34], allCells[27], allCells[20], allCells[13], allCells[6], topCells[6]];
var columns = [column0, column1, column2, column3, column4, column5, column6]; // rows

var topRow = [topCells[0], topCells[1], topCells[2], topCells[3], topCells[4], topCells[5], topCells[6]];
var row0 = [allCells[0], allCells[1], allCells[2], allCells[3], allCells[4], allCells[5], allCells[6]];
var row1 = [allCells[7], allCells[8], allCells[9], allCells[10], allCells[11], allCells[12], allCells[13]];
var row2 = [allCells[14], allCells[15], allCells[16], allCells[17], allCells[18], allCells[19], allCells[20]];
var row3 = [allCells[21], allCells[22], allCells[23], allCells[24], allCells[25], allCells[26], allCells[27]];
var row4 = [allCells[28], allCells[29], allCells[30], allCells[31], allCells[32], allCells[33], allCells[34]];
var row5 = [allCells[35], allCells[36], allCells[37], allCells[38], allCells[39], allCells[40], allCells[41]];
var rows = [row0, row1, row2, row3, row4, row5, topRow]; // variables

var gameIsLive = true;
var yellowIsNext = true; // Functions

var getClassListArray = function getClassListArray(cell) {
  var classList = cell.classList;
  return _toConsumableArray(classList);
};

var getCellLocation = function getCellLocation(cell) {
  var classList = getClassListArray(cell);
  var rowClass = classList.find(function (className) {
    return className.includes('row');
  });
  var colClass = classList.find(function (className) {
    return className.includes('col');
  });
  var rowIndex = rowClass[4];
  var colIndex = colClass[4];
  var rowNumber = parseInt(rowIndex, 10);
  var colNumber = parseInt(colIndex, 10);
  return [rowNumber, colNumber];
};

var getFirstOpenCellForColumn = function getFirstOpenCellForColumn(colIndex) {
  var column = columns[colIndex];
  var columnWithoutTop = column.slice(0, 6);

  var _iterator = _createForOfIteratorHelper(columnWithoutTop),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var cell = _step.value;
      var classList = getClassListArray(cell);

      if (!classList.includes('yellow') && !classList.includes('red')) {
        return cell;
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  return null;
};

var clearColorFromTop = function clearColorFromTop(colIndex) {
  var topCell = topCells[colIndex];
  topCell.classList.remove('yellow');
  topCell.classList.remove('red');
};

var getColorOfCell = function getColorOfCell(cell) {
  var classList = getClassListArray(cell);
  if (classList.includes('yellow')) return 'yellow';
  if (classList.includes('red')) return 'red';
  return null;
};

var checkWinningCells = function checkWinningCells(cells) {
  if (cells.length < 4) return false;
  gameIsLive = false;

  var _iterator2 = _createForOfIteratorHelper(cells),
      _step2;

  try {
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      var cell = _step2.value;
      cell.classList.add('win');
    }
  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }

  statusSpan.textContent = "".concat(yellowIsNext ? 'Yellow' : 'Red', " has won!");
  return true;
};

var checkStatusOfGame = function checkStatusOfGame(cell) {
  var color = getColorOfCell(cell);
  if (!color) return;

  var _getCellLocation = getCellLocation(cell),
      _getCellLocation2 = _slicedToArray(_getCellLocation, 2),
      rowIndex = _getCellLocation2[0],
      colIndex = _getCellLocation2[1]; // Check horizontally


  var winningCells = [cell];
  var rowToCheck = rowIndex;
  var colToCheck = colIndex - 1;

  while (colToCheck >= 0) {
    var cellToCheck = rows[rowToCheck][colToCheck];

    if (getColorOfCell(cellToCheck) === color) {
      winningCells.push(cellToCheck);
      colToCheck--;
    } else {
      break;
    }
  }

  colToCheck = colIndex + 1;

  while (colToCheck <= 6) {
    var _cellToCheck = rows[rowToCheck][colToCheck];

    if (getColorOfCell(_cellToCheck) === color) {
      winningCells.push(_cellToCheck);
      colToCheck++;
    } else {
      break;
    }
  }

  var isWinningCombo = checkWinningCells(winningCells);
  if (isWinningCombo) return; // Check vertically

  winningCells = [cell];
  rowToCheck = rowIndex - 1;
  colToCheck = colIndex;

  while (rowToCheck >= 0) {
    var _cellToCheck2 = rows[rowToCheck][colToCheck];

    if (getColorOfCell(_cellToCheck2) === color) {
      winningCells.push(_cellToCheck2);
      rowToCheck--;
    } else {
      break;
    }
  }

  rowToCheck = rowIndex + 1;

  while (rowToCheck <= 5) {
    var _cellToCheck3 = rows[rowToCheck][colToCheck];

    if (getColorOfCell(_cellToCheck3) === color) {
      winningCells.push(_cellToCheck3);
      rowToCheck++;
    } else {
      break;
    }
  }

  isWinningCombo = checkWinningCells(winningCells);
  if (isWinningCombo) return; // Check diagonally /

  winningCells = [cell];
  rowToCheck = rowIndex + 1;
  colToCheck = colIndex - 1;

  while (colToCheck >= 0 && rowToCheck <= 5) {
    var _cellToCheck4 = rows[rowToCheck][colToCheck];

    if (getColorOfCell(_cellToCheck4) === color) {
      winningCells.push(_cellToCheck4);
      rowToCheck++;
      colToCheck--;
    } else {
      break;
    }
  }

  rowToCheck = rowIndex - 1;
  colToCheck = colIndex + 1;

  while (colToCheck <= 6 && rowToCheck >= 0) {
    var _cellToCheck5 = rows[rowToCheck][colToCheck];

    if (getColorOfCell(_cellToCheck5) === color) {
      winningCells.push(_cellToCheck5);
      rowToCheck--;
      colToCheck++;
    } else {
      break;
    }
  }

  isWinningCombo = checkWinningCells(winningCells);
  if (isWinningCombo) return; // Check diagonally \

  winningCells = [cell];
  rowToCheck = rowIndex - 1;
  colToCheck = colIndex - 1;

  while (colToCheck >= 0 && rowToCheck >= 0) {
    var _cellToCheck6 = rows[rowToCheck][colToCheck];

    if (getColorOfCell(_cellToCheck6) === color) {
      winningCells.push(_cellToCheck6);
      rowToCheck--;
      colToCheck--;
    } else {
      break;
    }
  }

  rowToCheck = rowIndex + 1;
  colToCheck = colIndex + 1;

  while (colToCheck <= 6 && rowToCheck <= 5) {
    var _cellToCheck7 = rows[rowToCheck][colToCheck];

    if (getColorOfCell(_cellToCheck7) === color) {
      winningCells.push(_cellToCheck7);
      rowToCheck++;
      colToCheck++;
    } else {
      break;
    }
  }

  isWinningCombo = checkWinningCells(winningCells);
  if (isWinningCombo) return; // Check to see if we have a tie

  var rowsWithoutTop = rows.slice(0, 6);

  var _iterator3 = _createForOfIteratorHelper(rowsWithoutTop),
      _step3;

  try {
    for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
      var row = _step3.value;

      var _iterator4 = _createForOfIteratorHelper(row),
          _step4;

      try {
        for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
          var _cell = _step4.value;
          var classList = getClassListArray(_cell);

          if (!classList.includes('yellow') && !classList.includes('red')) {
            return;
          }
        }
      } catch (err) {
        _iterator4.e(err);
      } finally {
        _iterator4.f();
      }
    }
  } catch (err) {
    _iterator3.e(err);
  } finally {
    _iterator3.f();
  }

  gameIsLive = false;
  statusSpan.textContent = 'Game is a tie!';
}; // Event Handlers


var handleCellMouseOver = function handleCellMouseOver(e) {
  if (!gameIsLive) return;
  var cell = e.target;

  var _getCellLocation3 = getCellLocation(cell),
      _getCellLocation4 = _slicedToArray(_getCellLocation3, 2),
      rowIndex = _getCellLocation4[0],
      colIndex = _getCellLocation4[1];

  var topCell = topCells[colIndex];
  topCell.classList.add(yellowIsNext ? 'yellow' : 'red');
};

var handleCellMouseOut = function handleCellMouseOut(e) {
  var cell = e.target;

  var _getCellLocation5 = getCellLocation(cell),
      _getCellLocation6 = _slicedToArray(_getCellLocation5, 2),
      rowIndex = _getCellLocation6[0],
      colIndex = _getCellLocation6[1];

  clearColorFromTop(colIndex);
};

var handleCellClick = function handleCellClick(e) {
  if (!gameIsLive) return;
  saveJSON();
  var cell = e.target;

  var _getCellLocation7 = getCellLocation(cell),
      _getCellLocation8 = _slicedToArray(_getCellLocation7, 2),
      rowIndex = _getCellLocation8[0],
      colIndex = _getCellLocation8[1];

  var openCell = getFirstOpenCellForColumn(colIndex);
  if (!openCell) return;
  openCell.classList.add(yellowIsNext ? 'yellow' : 'red');
  checkStatusOfGame(openCell);
  yellowIsNext = !yellowIsNext;
  clearColorFromTop(colIndex);

  if (gameIsLive) {
    var topCell = topCells[colIndex];
    topCell.classList.add(yellowIsNext ? 'yellow' : 'red');
  }
};

var saveJSON = function saveJSON() {
  var data = {
    board: []
  };

  for (var i = 0; i < allCells.length; i++) {
    var _getCellLocation9 = getCellLocation(allCells[i]),
        _getCellLocation10 = _slicedToArray(_getCellLocation9, 2),
        rowIndex = _getCellLocation10[0],
        colIndex = _getCellLocation10[1];

    var colour = getColorOfCell(allCells[i]);
    var cellEntry = {
      row: rowIndex,
      col: colIndex,
      type: 'all',
      colour: colour
    };
    data.board.push(cellEntry);
  }

  for (var _i2 = 0; _i2 < topCells.length; _i2++) {
    var _getCellLocation11 = getCellLocation(topCells[_i2]),
        _getCellLocation12 = _slicedToArray(_getCellLocation11, 2),
        _rowIndex = _getCellLocation12[0],
        _colIndex = _getCellLocation12[1];

    var _colour = getColorOfCell(topCells[_i2]);

    var cellEntry = {
      row: _rowIndex,
      col: _colIndex,
      type: 'top',
      colour: _colour
    };
    data.board.push(cellEntry);
  }

  var dataJSON = JSON.stringify(data);
  console.log(dataJSON);
}; // Adding Event Listeners


for (var _i3 = 0, _rows = rows; _i3 < _rows.length; _i3++) {
  var row = _rows[_i3];

  var _iterator5 = _createForOfIteratorHelper(row),
      _step5;

  try {
    for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
      var cell = _step5.value;
      cell.addEventListener('mouseover', handleCellMouseOver);
      cell.addEventListener('mouseout', handleCellMouseOut);
      cell.addEventListener('click', handleCellClick);
    }
  } catch (err) {
    _iterator5.e(err);
  } finally {
    _iterator5.f();
  }
}

resetButton.addEventListener('click', function () {
  var _iterator6 = _createForOfIteratorHelper(rows),
      _step6;

  try {
    for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
      var _row = _step6.value;

      var _iterator7 = _createForOfIteratorHelper(_row),
          _step7;

      try {
        for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
          var _cell2 = _step7.value;

          _cell2.classList.remove('red');

          _cell2.classList.remove('yellow');

          _cell2.classList.remove('win');
        }
      } catch (err) {
        _iterator7.e(err);
      } finally {
        _iterator7.f();
      }
    }
  } catch (err) {
    _iterator6.e(err);
  } finally {
    _iterator6.f();
  }

  gameIsLive = true;
  yellowIsNext = true;
  statusSpan.textContent = '';
});
var topContainerDiv = document.createElement('div');
topContainerDiv.classList.add('top-container');
document.body.appendChild(topContainerDiv);
var loginBtn = document.createElement('button'); // contents of login div

var loginDiv = document.createElement('div');
loginDiv.classList.add('login-div');
loginModal.appendChild(loginDiv); // user email input

var emailDiv = document.createElement('div');
emailDiv.classList.add('email');
loginDiv.appendChild(emailDiv);
var emailLabel = document.createElement('label');
emailLabel.setAttribute('for', 'email');
emailLabel.textContent = 'email: ';
emailDiv.appendChild(emailLabel);
var emailInput = document.createElement('input');
emailInput.setAttribute('id', 'email');
emailDiv.appendChild(emailInput); // user password input

var passwordDiv = document.createElement('div');
passwordDiv.classList.add('password');
loginDiv.appendChild(passwordDiv);
var passwordLabel = document.createElement('label');
passwordLabel.setAttribute('for', 'password');
passwordLabel.textContent = 'password: ';
passwordDiv.appendChild(passwordLabel);
var passwordInput = document.createElement('input');
passwordInput.setAttribute('id', 'password');
passwordInput.setAttribute('type', 'password');
passwordDiv.appendChild(passwordInput); // submit login button

var loginBtnDiv = document.createElement('div');
loginBtnDiv.classList.add('login-btn');
loginDiv.appendChild(loginBtnDiv);
loginBtn.setAttribute('type', 'submit');
loginBtn.textContent = 'log in';
loginBtnDiv.appendChild(loginBtn); // start game button

var startGameBtn = document.createElement('button');
startGameBtn.setAttribute('type', 'submit');
startGameBtn.classList.add('start-btn');
startGameBtn.textContent = 'START/ JOIN GAME'; // dashboard div which contains the buttons div and user details div

var dashboardDiv = document.createElement('div');
dashboardDiv.classList.add('dashboard'); // contains start button, to be replaced by game buttons when start button is clicked

var startGameButtonDiv = document.createElement('div');
startGameButtonDiv.classList.add('start-btn-div'); // container which holds player cards

var gameplayContainerDiv = document.createElement('div');
gameplayContainerDiv.classList.add('main-gameplay'); // contains logout button and user details

var userDiv = document.createElement('div'); // logout button

var logoutBtnDiv = document.createElement('div');
logoutBtnDiv.classList.add('logout-container');
userDiv.appendChild(logoutBtnDiv);
var logoutBtn = document.createElement('button');
logoutBtn.classList.add('logout-btn');
logoutBtn.textContent = 'Log out';
logoutBtnDiv.appendChild(logoutBtn); // when the login button is clicked

loginBtn.addEventListener('click', function () {
  axios__WEBPACK_IMPORTED_MODULE_0___default().post('/login', {
    email: document.querySelector('#email').value,
    password: document.querySelector('#password').value
  }).then(function (response) {
    console.log(response.data); // clear login elements

    loginDiv.remove(); // replace them with dashboard elements

    topContainerDiv.appendChild(dashboardDiv); // contains logged in user's details

    dashboardDiv.appendChild(userDiv);
    userDiv.classList.add('user-details');
    var emailDiv = document.createElement('div');
    userDiv.appendChild(emailDiv);
    emailDiv.textContent = "user email: ".concat(response.data.user.email); // append start game button container to dashboard div

    dashboardDiv.appendChild(startGameButtonDiv); // append start game button tp container in dashboard

    startGameButtonDiv.appendChild(startGameBtn);
  })["catch"](function (error) {
    return console.log(error);
  });
});
logoutBtn.addEventListener('click', function () {
  axios__WEBPACK_IMPORTED_MODULE_0___default().put("/logout/".concat(currentGame.id)).then(function (response) {
    console.log(response.data);
  })["catch"](function (error) {
    return console.log(error);
  });
}); // create deal and refresh buttons

var dealBtn = document.createElement('button');
dealBtn.innerText = 'DEAL';
var refreshBtn = document.createElement('button');
refreshBtn.textContent = 'REFRESH'; // set current game variable

var currentGame; // player cards

var card1 = document.createElement('div');
card1.classList.add('card');
var card2 = document.createElement('div');
card2.classList.add('card'); // where results are displayed

var resultDiv = document.createElement('div'); // when start button is clicked

startGameBtn.addEventListener('click', function () {
  startGameBtn.remove(); // append deal and refresh buttons to dashboard

  startGameButtonDiv.appendChild(dealBtn);
  startGameButtonDiv.appendChild(refreshBtn); // display gameplay container

  document.body.appendChild(gameplayContainerDiv); // if there already is a game in progress

  axios__WEBPACK_IMPORTED_MODULE_0___default().get('/start').then(function (response) {
    console.log(response);
    currentGame = response.data;
    console.log('current game', currentGame);
    dealBtn.addEventListener('click', function () {
      card1.innerHTML = '';
      card2.innerHTML = '';
      resultDiv.innerHTML = '';
      axios__WEBPACK_IMPORTED_MODULE_0___default().put("./deal/".concat(currentGame.id)).then(function (response1) {
        console.log(response1);
        currentGame = response1.data; // change content of scorecard

        resultDiv.innerHTML = "".concat(response1.data.result, "<br>player 1: ").concat(response1.data.score.player1, "<br>player 2: ").concat(response1.data.score.player2); // change content of cards

        card1.innerHTML = "".concat(response1.data.player1Card.name, " of ").concat(response1.data.player1Card.suit);
        card2.innerHTML = "".concat(response1.data.player2Card.name, " of ").concat(response1.data.player2Card.suit);
      })["catch"](function (error) {
        return console.log(error);
      });
    }); // div that holds player's scores

    var scoreCardDiv = document.createElement('div');
    scoreCardDiv.classList.add('scorecard');
    gameplayContainerDiv.appendChild(scoreCardDiv); // displays result of current game

    resultDiv.innerHTML = "".concat(response.data.result, "<br>player 1: ").concat(response.data.score.player1, "<br>player 2: ").concat(response.data.score.player2);
    scoreCardDiv.appendChild(resultDiv); // container that holds both players' cards

    var playerCardsDiv = document.createElement('div');
    playerCardsDiv.classList.add('cards-container');
    gameplayContainerDiv.appendChild(playerCardsDiv); // player cards

    card1.textContent = "".concat(response.data.player1Card.name, " of ").concat(response.data.player1Card.suit);
    playerCardsDiv.appendChild(card1);
    card2.textContent = "".concat(response.data.player2Card.name, " of ").concat(response.data.player2Card.suit);
    playerCardsDiv.appendChild(card2);
  })["catch"](function (error) {
    return console.log(error);
  });
}); // displays the latest game to the user

refreshBtn.addEventListener('click', function () {
  axios__WEBPACK_IMPORTED_MODULE_0___default().post('/refresh', {
    id: currentGame.id
  }).then(function (response) {
    console.log(response); // clear contents of cards

    card1.innerHTML = '';
    card2.innerHTML = '';
    resultDiv.innerHTML = ''; // change content of scorecard

    resultDiv.innerHTML = "".concat(response.data.result, "<br>player 1: ").concat(response.data.score.player1, "<br>player 2: ").concat(response.data.score.player2); // change content of cards

    card1.innerHTML = "".concat(response.data.player1Card.name, " of ").concat(response.data.player1Card.suit);
    card2.innerHTML = "".concat(response.data.player2Card.name, " of ").concat(response.data.player2Card.suit);
  })["catch"](function (error) {
    return console.log(error);
  });
});
var modal = document.querySelector('#loginModal');
var openModal = document.querySelector('.open-button');
var closeModal = document.querySelector('.close-button');
openModal.addEventListener('click', function () {
  modal.showModal();
});
closeModal.addEventListener('click', function () {
  modal.close();
});
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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RCxDQU5NLEVBT2RBLFFBQVEsQ0FBQyxDQUFELENBUE0sQ0FBZjtBQVNBLElBQU1hLElBQUksR0FBRyxDQUNaaEIsUUFBUSxDQUFDLENBQUQsQ0FESSxFQUVaQSxRQUFRLENBQUMsQ0FBRCxDQUZJLEVBR1pBLFFBQVEsQ0FBQyxDQUFELENBSEksRUFJWkEsUUFBUSxDQUFDLENBQUQsQ0FKSSxFQUtaQSxRQUFRLENBQUMsQ0FBRCxDQUxJLEVBTVpBLFFBQVEsQ0FBQyxDQUFELENBTkksRUFPWkEsUUFBUSxDQUFDLENBQUQsQ0FQSSxDQUFiO0FBU0EsSUFBTWlCLElBQUksR0FBRyxDQUNaakIsUUFBUSxDQUFDLENBQUQsQ0FESSxFQUVaQSxRQUFRLENBQUMsQ0FBRCxDQUZJLEVBR1pBLFFBQVEsQ0FBQyxDQUFELENBSEksRUFJWkEsUUFBUSxDQUFDLEVBQUQsQ0FKSSxFQUtaQSxRQUFRLENBQUMsRUFBRCxDQUxJLEVBTVpBLFFBQVEsQ0FBQyxFQUFELENBTkksRUFPWkEsUUFBUSxDQUFDLEVBQUQsQ0FQSSxDQUFiO0FBU0EsSUFBTWtCLElBQUksR0FBRyxDQUNabEIsUUFBUSxDQUFDLEVBQUQsQ0FESSxFQUVaQSxRQUFRLENBQUMsRUFBRCxDQUZJLEVBR1pBLFFBQVEsQ0FBQyxFQUFELENBSEksRUFJWkEsUUFBUSxDQUFDLEVBQUQsQ0FKSSxFQUtaQSxRQUFRLENBQUMsRUFBRCxDQUxJLEVBTVpBLFFBQVEsQ0FBQyxFQUFELENBTkksRUFPWkEsUUFBUSxDQUFDLEVBQUQsQ0FQSSxDQUFiO0FBU0EsSUFBTW1CLElBQUksR0FBRyxDQUNabkIsUUFBUSxDQUFDLEVBQUQsQ0FESSxFQUVaQSxRQUFRLENBQUMsRUFBRCxDQUZJLEVBR1pBLFFBQVEsQ0FBQyxFQUFELENBSEksRUFJWkEsUUFBUSxDQUFDLEVBQUQsQ0FKSSxFQUtaQSxRQUFRLENBQUMsRUFBRCxDQUxJLEVBTVpBLFFBQVEsQ0FBQyxFQUFELENBTkksRUFPWkEsUUFBUSxDQUFDLEVBQUQsQ0FQSSxDQUFiO0FBU0EsSUFBTW9CLElBQUksR0FBRyxD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VCxDQUF1QixhQUF2QixDQUFkO0FBQ0EsSUFBTWtJLFNBQVMsR0FBR3RJLFFBQVEsQ0FBQ0ksYUFBVCxDQUF1QixjQUF2QixDQUFsQjtBQUNBLElBQU1tSSxVQUFVLEdBQUd2SSxRQUFRLENBQUNJLGFBQVQsQ0FBdUIsZUFBdkIsQ0FBbkI7QUFFQWtJLFNBQVMsQ0FBQ3RELGdCQUFWLENBQTJCLE9BQTNCLEVBQW9DLFlBQU07QUFDekNxRCxFQUFBQSxLQUFLLENBQUNHLFNBQU47QUFDQSxDQUZEO0FBR0FELFVBQVUsQ0FBQ3ZELGdCQUFYLENBQTRCLE9BQTVCLEVBQXFDLFlBQU07QUFDMUNxRCxFQUFBQSxLQUFLLENBQUNJLEtBQU47QUFDQSxDQUZELEUiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly93ZWJwYWNrLW12Yy1iYXNlLWJvb3RjYW1wLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2luZGV4LmpzIiwid2VicGFjazovL3dlYnBhY2stbXZjLWJhc2UtYm9vdGNhbXAvLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2FkYXB0ZXJzL3hoci5qcyIsIndlYnBhY2s6Ly93ZWJwYWNrLW12Yy1iYXNlLWJvb3RjYW1wLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9heGlvcy5qcyIsIndlYnBhY2s6Ly93ZWJwYWNrLW12Yy1iYXNlLWJvb3RjYW1wLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jYW5jZWwvQ2FuY2VsLmpzIiwid2VicGFjazovL3dlYnBhY2stbXZjLWJhc2UtYm9vdGNhbXAvLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2NhbmNlbC9DYW5jZWxUb2tlbi5qcyIsIndlYnBhY2s6Ly93ZWJwYWNrLW12Yy1iYXNlLWJvb3RjYW1wLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jYW5jZWwvaXNDYW5jZWwuanMiLCJ3ZWJwYWNrOi8vd2VicGFjay1tdmMtYmFzZS1ib290Y2FtcC8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvY29yZS9BeGlvcy5qcyIsIndlYnBhY2s6Ly93ZWJwYWNrLW12Yy1iYXNlLWJvb3RjYW1wLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jb3JlL0ludGVyY2VwdG9yTWFuYWdlci5qcyIsIndlYnBhY2s6Ly93ZWJwYWNrLW12Yy1iYXNlLWJvb3RjYW1wLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jb3JlL2J1aWxkRnVsbFBhdGguanMiLCJ3ZWJwYWNrOi8vd2VicGFjay1tdmMtYmFzZS1ib290Y2FtcC8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvY29yZS9jcmVhdGVFcnJvci5qcyIsIndlYnBhY2s6Ly93ZWJwYWNrLW12Yy1iYXNlLWJvb3RjYW1wLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jb3JlL2Rpc3BhdGNoUmVxdWVzdC5qcyIsIndlYnBhY2s6Ly93ZWJwYWNrLW12Yy1iYXNlLWJvb3RjYW1wLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jb3JlL2VuaGFuY2VFcnJvci5qcyIsIndlYnBhY2s6Ly93ZWJwYWNrLW12Yy1iYXNlLWJvb3RjYW1wLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9jb3JlL21lcmdlQ29uZmlnLmpzIiwid2VicGFjazovL3dlYnBhY2stbXZjLWJhc2UtYm9vdGNhbXAvLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2NvcmUvc2V0dGxlLmpzIiwid2VicGFjazovL3dlYnBhY2stbXZjLWJhc2UtYm9vdGNhbXAvLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2NvcmUvdHJhbnNmb3JtRGF0YS5qcyIsIndlYnBhY2s6Ly93ZWJwYWNrLW12Yy1iYXNlLWJvb3RjYW1wLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9kZWZhdWx0cy5qcyIsIndlYnBhY2s6Ly93ZWJwYWNrLW12Yy1iYXNlLWJvb3RjYW1wLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL2JpbmQuanMiLCJ3ZWJwYWNrOi8vd2VicGFjay1tdmMtYmFzZS1ib290Y2FtcC8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy9idWlsZFVSTC5qcyIsIndlYnBhY2s6Ly93ZWJwYWNrLW12Yy1iYXNlLWJvb3RjYW1wLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL2NvbWJpbmVVUkxzLmpzIiwid2VicGFjazovL3dlYnBhY2stbXZjLWJhc2UtYm9vdGNhbXAvLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvY29va2llcy5qcyIsIndlYnBhY2s6Ly93ZWJwYWNrLW12Yy1iYXNlLWJvb3RjYW1wLy4vbm9kZV9tb2R1bGVzL2F4aW9zL2xpYi9oZWxwZXJzL2lzQWJzb2x1dGVVUkwuanMiLCJ3ZWJwYWNrOi8vd2VicGFjay1tdmMtYmFzZS1ib290Y2FtcC8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy9pc0F4aW9zRXJyb3IuanMiLCJ3ZWJwYWNrOi8vd2VicGFjay1tdmMtYmFzZS1ib290Y2FtcC8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy9pc1VSTFNhbWVPcmlnaW4uanMiLCJ3ZWJwYWNrOi8vd2VicGFjay1tdmMtYmFzZS1ib290Y2FtcC8uL25vZGVfbW9kdWxlcy9heGlvcy9saWIvaGVscGVycy9ub3JtYWxpemVIZWFkZXJOYW1lLmpzIiwid2VicGFjazovL3dlYnBhY2stbXZjLWJhc2UtYm9vdGNhbXAvLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvcGFyc2VIZWFkZXJzLmpzIiwid2VicGFjazovL3dlYnBhY2stbXZjLWJhc2UtYm9vdGNhbXAvLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvc3ByZWFkLmpzIiwid2VicGFjazovL3dlYnBhY2stbXZjLWJhc2UtYm9vdGNhbXAvLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL2hlbHBlcnMvdmFsaWRhdG9yLmpzIiwid2VicGFjazovL3dlYnBhY2stbXZjLWJhc2UtYm9vdGNhbXAvLi9ub2RlX21vZHVsZXMvYXhpb3MvbGliL3V0aWxzLmpzIiwid2VicGFjazovL3dlYnBhY2stbXZjLWJhc2UtYm9vdGNhbXAvLi9zcmMvc3R5bGVzLnNjc3M/MDI5YSIsIndlYnBhY2s6Ly93ZWJwYWNrLW12Yy1iYXNlLWJvb3RjYW1wL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3dlYnBhY2stbXZjLWJhc2UtYm9vdGNhbXAvd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vd2VicGFjay1tdmMtYmFzZS1ib290Y2FtcC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vd2VicGFjay1tdmMtYmFzZS1ib290Y2FtcC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL3dlYnBhY2stbXZjLWJhc2UtYm9vdGNhbXAvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly93ZWJwYWNrLW12Yy1iYXNlLWJvb3RjYW1wLy4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9saWIvYXhpb3MnKTsiLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vLi4vdXRpbHMnKTtcbnZhciBzZXR0bGUgPSByZXF1aXJlKCcuLy4uL2NvcmUvc2V0dGxlJyk7XG52YXIgY29va2llcyA9IHJlcXVpcmUoJy4vLi4vaGVscGVycy9jb29raWVzJyk7XG52YXIgYnVpbGRVUkwgPSByZXF1aXJlKCcuLy4uL2hlbHBlcnMvYnVpbGRVUkwnKTtcbnZhciBidWlsZEZ1bGxQYXRoID0gcmVxdWlyZSgnLi4vY29yZS9idWlsZEZ1bGxQYXRoJyk7XG52YXIgcGFyc2VIZWFkZXJzID0gcmVxdWlyZSgnLi8uLi9oZWxwZXJzL3BhcnNlSGVhZGVycycpO1xudmFyIGlzVVJMU2FtZU9yaWdpbiA9IHJlcXVpcmUoJy4vLi4vaGVscGVycy9pc1VSTFNhbWVPcmlnaW4nKTtcbnZhciBjcmVhdGVFcnJvciA9IHJlcXVpcmUoJy4uL2NvcmUvY3JlYXRlRXJyb3InKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB4aHJBZGFwdGVyKGNvbmZpZykge1xuICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gZGlzcGF0Y2hYaHJSZXF1ZXN0KHJlc29sdmUsIHJlamVjdCkge1xuICAgIHZhciByZXF1ZXN0RGF0YSA9IGNvbmZpZy5kYXRhO1xuICAgIHZhciByZXF1ZXN0SGVhZGVycyA9IGNvbmZpZy5oZWFkZXJzO1xuICAgIHZhciByZXNwb25zZVR5cGUgPSBjb25maWcucmVzcG9uc2VUeXBlO1xuXG4gICAgaWYgKHV0aWxzLmlzRm9ybURhdGEocmVxdWVzdERhdGEpKSB7XG4gICAgICBkZWxldGUgcmVxdWVzdEhlYWRlcnNbJ0NvbnRlbnQtVHlwZSddOyAvLyBMZXQgdGhlIGJyb3dzZXIgc2V0IGl0XG4gICAgfVxuXG4gICAgdmFyIHJlcXVlc3QgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcblxuICAgIC8vIEhUVFAgYmFzaWMgYXV0aGVudGljYXRpb25cbiAgICBpZiAoY29uZmlnLmF1dGgpIHtcbiAgICAgIHZhciB1c2VybmFtZSA9IGNvbmZpZy5hdXRoLnVzZXJuYW1lIHx8ICcnO1xuICAgICAgdmFyIHBhc3N3b3JkID0gY29uZmlnLmF1dGgucGFzc3dvcmQgPyB1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoY29uZmlnLmF1dGgucGFzc3dvcmQpKSA6ICcnO1xuICAgICAgcmVxdWVzdEhlYWRlcnMuQXV0aG9yaXphdGlvbiA9ICdCYXNpYyAnICsgYnRvYSh1c2VybmFtZSArICc6JyArIHBhc3N3b3JkKTtcbiAgICB9XG5cbiAgICB2YXIgZnVsbFBhdGggPSBidWlsZEZ1bGxQYXRoKGNvbmZpZy5iYXNlVVJMLCBjb25maWcudXJsKTtcbiAgICByZXF1ZXN0Lm9wZW4oY29uZmlnLm1ldGhvZC50b1VwcGVyQ2FzZSgpLCBidWlsZFVSTChmdWxsUGF0aCwgY29uZmlnLnBhcmFtcywgY29uZmlnLnBhcmFtc1NlcmlhbGl6ZXIpLCB0cnVlKTtcblxuICAgIC8vIFNldCB0aGUgcmVxdWVzdCB0aW1lb3V0IGluIE1TXG4gICAgcmVxdWVzdC50aW1lb3V0ID0gY29uZmlnLnRpbWVvdXQ7XG5cbiAgICBmdW5jdGlvbiBvbmxvYWRlbmQoKSB7XG4gICAgICBpZiAoIXJlcXVlc3QpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgLy8gUHJlcGFyZSB0aGUgcmVzcG9uc2VcbiAgICAgIHZhciByZXNwb25zZUhlYWRlcnMgPSAnZ2V0QWxsUmVzcG9uc2VIZWFkZXJzJyBpbiByZXF1ZXN0ID8gcGFyc2VIZWFkZXJzKHJlcXVlc3QuZ2V0QWxsUmVzcG9uc2VIZWFkZXJzKCkpIDogbnVsbDtcbiAgICAgIHZhciByZXNwb25zZURhdGEgPSAhcmVzcG9uc2VUeXBlIHx8IHJlc3BvbnNlVHlwZSA9PT0gJ3RleHQnIHx8ICByZXNwb25zZVR5cGUgPT09ICdqc29uJyA/XG4gICAgICAgIHJlcXVlc3QucmVzcG9uc2VUZXh0IDogcmVxdWVzdC5yZXNwb25zZTtcbiAgICAgIHZhciByZXNwb25zZSA9IHtcbiAgICAgICAgZGF0YTogcmVzcG9uc2VEYXRhLFxuICAgICAgICBzdGF0dXM6IHJlcXVlc3Quc3RhdHVzLFxuICAgICAgICBzdGF0dXNUZXh0OiByZXF1ZXN0LnN0YXR1c1RleHQsXG4gICAgICAgIGhlYWRlcnM6IHJlc3BvbnNlSGVhZGVycyxcbiAgICAgICAgY29uZmlnOiBjb25maWcsXG4gICAgICAgIHJlcXVlc3Q6IHJlcXVlc3RcbiAgICAgIH07XG5cbiAgICAgIHNldHRsZShyZXNvbHZlLCByZWplY3QsIHJlc3BvbnNlKTtcblxuICAgICAgLy8gQ2xlYW4gdXAgcmVxdWVzdFxuICAgICAgcmVxdWVzdCA9IG51bGw7XG4gICAgfVxuXG4gICAgaWYgKCdvbmxvYWRlbmQnIGluIHJlcXVlc3QpIHtcbiAgICAgIC8vIFVzZSBvbmxvYWRlbmQgaWYgYXZhaWxhYmxlXG4gICAgICByZXF1ZXN0Lm9ubG9hZGVuZCA9IG9ubG9hZGVuZDtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gTGlzdGVuIGZvciByZWFkeSBzdGF0ZSB0byBlbXVsYXRlIG9ubG9hZGVuZFxuICAgICAgcmVxdWVzdC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbiBoYW5kbGVMb2FkKCkge1xuICAgICAgICBpZiAoIXJlcXVlc3QgfHwgcmVxdWVzdC5yZWFkeVN0YXRlICE9PSA0KSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gVGhlIHJlcXVlc3QgZXJyb3JlZCBvdXQgYW5kIHdlIGRpZG4ndCBnZXQgYSByZXNwb25zZSwgdGhpcyB3aWxsIGJlXG4gICAgICAgIC8vIGhhbmRsZWQgYnkgb25lcnJvciBpbnN0ZWFkXG4gICAgICAgIC8vIFdpdGggb25lIGV4Y2VwdGlvbjogcmVxdWVzdCB0aGF0IHVzaW5nIGZpbGU6IHByb3RvY29sLCBtb3N0IGJyb3dzZXJzXG4gICAgICAgIC8vIHdpbGwgcmV0dXJuIHN0YXR1cyBhcyAwIGV2ZW4gdGhvdWdoIGl0J3MgYSBzdWNjZXNzZnVsIHJlcXVlc3RcbiAgICAgICAgaWYgKHJlcXVlc3Quc3RhdHVzID09PSAwICYmICEocmVxdWVzdC5yZXNwb25zZVVSTCAmJiByZXF1ZXN0LnJlc3BvbnNlVVJMLmluZGV4T2YoJ2ZpbGU6JykgPT09IDApKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIC8vIHJlYWR5c3RhdGUgaGFuZGxlciBpcyBjYWxsaW5nIGJlZm9yZSBvbmVycm9yIG9yIG9udGltZW91dCBoYW5kbGVycyxcbiAgICAgICAgLy8gc28gd2Ugc2hvdWxkIGNhbGwgb25sb2FkZW5kIG9uIHRoZSBuZXh0ICd0aWNrJ1xuICAgICAgICBzZXRUaW1lb3V0KG9ubG9hZGVuZCk7XG4gICAgICB9O1xuICAgIH1cblxuICAgIC8vIEhhbmRsZSBicm93c2VyIHJlcXVlc3QgY2FuY2VsbGF0aW9uIChhcyBvcHBvc2VkIHRvIGEgbWFudWFsIGNhbmNlbGxhdGlvbilcbiAgICByZXF1ZXN0Lm9uYWJvcnQgPSBmdW5jdGlvbiBoYW5kbGVBYm9ydCgpIHtcbiAgICAgIGlmICghcmVxdWVzdCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHJlamVjdChjcmVhdGVFcnJvcignUmVxdWVzdCBhYm9ydGVkJywgY29uZmlnLCAnRUNPTk5BQk9SVEVEJywgcmVxdWVzdCkpO1xuXG4gICAgICAvLyBDbGVhbiB1cCByZXF1ZXN0XG4gICAgICByZXF1ZXN0ID0gbnVsbDtcbiAgICB9O1xuXG4gICAgLy8gSGFuZGxlIGxvdyBsZXZlbCBuZXR3b3JrIGVycm9yc1xuICAgIHJlcXVlc3Qub25lcnJvciA9IGZ1bmN0aW9uIGhhbmRsZUVycm9yKCkge1xuICAgICAgLy8gUmVhbCBlcnJvcnMgYXJlIGhpZGRlbiBmcm9tIHVzIGJ5IHRoZSBicm93c2VyXG4gICAgICAvLyBvbmVycm9yIHNob3VsZCBvbmx5IGZpcmUgaWYgaXQncyBhIG5ldHdvcmsgZXJyb3JcbiAgICAgIHJlamVjdChjcmVhdGVFcnJvcignTmV0d29yayBFcnJvcicsIGNvbmZpZywgbnVsbCwgcmVxdWVzdCkpO1xuXG4gICAgICAvLyBDbGVhbiB1cCByZXF1ZXN0XG4gICAgICByZXF1ZXN0ID0gbnVsbDtcbiAgICB9O1xuXG4gICAgLy8gSGFuZGxlIHRpbWVvdXRcbiAgICByZXF1ZXN0Lm9udGltZW91dCA9IGZ1bmN0aW9uIGhhbmRsZVRpbWVvdXQoKSB7XG4gICAgICB2YXIgdGltZW91dEVycm9yTWVzc2FnZSA9ICd0aW1lb3V0IG9mICcgKyBjb25maWcudGltZW91dCArICdtcyBleGNlZWRlZCc7XG4gICAgICBpZiAoY29uZmlnLnRpbWVvdXRFcnJvck1lc3NhZ2UpIHtcbiAgICAgICAgdGltZW91dEVycm9yTWVzc2FnZSA9IGNvbmZpZy50aW1lb3V0RXJyb3JNZXNzYWdlO1xuICAgICAgfVxuICAgICAgcmVqZWN0KGNyZWF0ZUVycm9yKFxuICAgICAgICB0aW1lb3V0RXJyb3JNZXNzYWdlLFxuICAgICAgICBjb25maWcsXG4gICAgICAgIGNvbmZpZy50cmFuc2l0aW9uYWwgJiYgY29uZmlnLnRyYW5zaXRpb25hbC5jbGFyaWZ5VGltZW91dEVycm9yID8gJ0VUSU1FRE9VVCcgOiAnRUNPTk5BQk9SVEVEJyxcbiAgICAgICAgcmVxdWVzdCkpO1xuXG4gICAgICAvLyBDbGVhbiB1cCByZXF1ZXN0XG4gICAgICByZXF1ZXN0ID0gbnVsbDtcbiAgICB9O1xuXG4gICAgLy8gQWRkIHhzcmYgaGVhZGVyXG4gICAgLy8gVGhpcyBpcyBvbmx5IGRvbmUgaWYgcnVubmluZyBpbiBhIHN0YW5kYXJkIGJyb3dzZXIgZW52aXJvbm1lbnQuXG4gICAgLy8gU3BlY2lmaWNhbGx5IG5vdCBpZiB3ZSdyZSBpbiBhIHdlYiB3b3JrZXIsIG9yIHJlYWN0LW5hdGl2ZS5cbiAgICBpZiAodXRpbHMuaXNTdGFuZGFyZEJyb3dzZXJFbnYoKSkge1xuICAgICAgLy8gQWRkIHhzcmYgaGVhZGVyXG4gICAgICB2YXIgeHNyZlZhbHVlID0gKGNvbmZpZy53aXRoQ3JlZGVudGlhbHMgfHwgaXNVUkxTYW1lT3JpZ2luKGZ1bGxQYXRoKSkgJiYgY29uZmlnLnhzcmZDb29raWVOYW1lID9cbiAgICAgICAgY29va2llcy5yZWFkKGNvbmZpZy54c3JmQ29va2llTmFtZSkgOlxuICAgICAgICB1bmRlZmluZWQ7XG5cbiAgICAgIGlmICh4c3JmVmFsdWUpIHtcbiAgICAgICAgcmVxdWVzdEhlYWRlcnNbY29uZmlnLnhzcmZIZWFkZXJOYW1lXSA9IHhzcmZWYWx1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBBZGQgaGVhZGVycyB0byB0aGUgcmVxdWVzdFxuICAgIGlmICgnc2V0UmVxdWVzdEhlYWRlcicgaW4gcmVxdWVzdCkge1xuICAgICAgdXRpbHMuZm9yRWFjaChyZXF1ZXN0SGVhZGVycywgZnVuY3Rpb24gc2V0UmVxdWVzdEhlYWRlcih2YWwsIGtleSkge1xuICAgICAgICBpZiAodHlwZW9mIHJlcXVlc3REYXRhID09PSAndW5kZWZpbmVkJyAmJiBrZXkudG9Mb3dlckNhc2UoKSA9PT0gJ2NvbnRlbnQtdHlwZScpIHtcbiAgICAgICAgICAvLyBSZW1vdmUgQ29udGVudC1UeXBlIGlmIGRhdGEgaXMgdW5kZWZpbmVkXG4gICAgICAgICAgZGVsZXRlIHJlcXVlc3RIZWFkZXJzW2tleV07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gT3RoZXJ3aXNlIGFkZCBoZWFkZXIgdG8gdGhlIHJlcXVlc3RcbiAgICAgICAgICByZXF1ZXN0LnNldFJlcXVlc3RIZWFkZXIoa2V5LCB2YWwpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBBZGQgd2l0aENyZWRlbnRpYWxzIHRvIHJlcXVlc3QgaWYgbmVlZGVkXG4gICAgaWYgKCF1dGlscy5pc1VuZGVmaW5lZChjb25maWcud2l0aENyZWRlbnRpYWxzKSkge1xuICAgICAgcmVxdWVzdC53aXRoQ3JlZGVudGlhbHMgPSAhIWNvbmZpZy53aXRoQ3JlZGVudGlhbHM7XG4gICAgfVxuXG4gICAgLy8gQWRkIHJlc3BvbnNlVHlwZSB0byByZXF1ZXN0IGlmIG5lZWRlZFxuICAgIGlmIChyZXNwb25zZVR5cGUgJiYgcmVzcG9uc2VUeXBlICE9PSAnanNvbicpIHtcbiAgICAgIHJlcXVlc3QucmVzcG9uc2VUeXBlID0gY29uZmlnLnJlc3BvbnNlVHlwZTtcbiAgICB9XG5cbiAgICAvLyBIYW5kbGUgcHJvZ3Jlc3MgaWYgbmVlZGVkXG4gICAgaWYgKHR5cGVvZiBjb25maWcub25Eb3dubG9hZFByb2dyZXNzID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICByZXF1ZXN0LmFkZEV2ZW50TGlzdGVuZXIoJ3Byb2dyZXNzJywgY29uZmlnLm9uRG93bmxvYWRQcm9ncmVzcyk7XG4gICAgfVxuXG4gICAgLy8gTm90IGFsbCBicm93c2VycyBzdXBwb3J0IHVwbG9hZCBldmVudHNcbiAgICBpZiAodHlwZW9mIGNvbmZpZy5vblVwbG9hZFByb2dyZXNzID09PSAnZnVuY3Rpb24nICYmIHJlcXVlc3QudXBsb2FkKSB7XG4gICAgICByZXF1ZXN0LnVwbG9hZC5hZGRFdmVudExpc3RlbmVyKCdwcm9ncmVzcycsIGNvbmZpZy5vblVwbG9hZFByb2dyZXNzKTtcbiAgICB9XG5cbiAgICBpZiAoY29uZmlnLmNhbmNlbFRva2VuKSB7XG4gICAgICAvLyBIYW5kbGUgY2FuY2VsbGF0aW9uXG4gICAgICBjb25maWcuY2FuY2VsVG9rZW4ucHJvbWlzZS50aGVuKGZ1bmN0aW9uIG9uQ2FuY2VsZWQoY2FuY2VsKSB7XG4gICAgICAgIGlmICghcmVxdWVzdCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlcXVlc3QuYWJvcnQoKTtcbiAgICAgICAgcmVqZWN0KGNhbmNlbCk7XG4gICAgICAgIC8vIENsZWFuIHVwIHJlcXVlc3RcbiAgICAgICAgcmVxdWVzdCA9IG51bGw7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAoIXJlcXVlc3REYXRhKSB7XG4gICAgICByZXF1ZXN0RGF0YSA9IG51bGw7XG4gICAgfVxuXG4gICAgLy8gU2VuZCB0aGUgcmVxdWVzdFxuICAgIHJlcXVlc3Quc2VuZChyZXF1ZXN0RGF0YSk7XG4gIH0pO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi91dGlscycpO1xudmFyIGJpbmQgPSByZXF1aXJlKCcuL2hlbHBlcnMvYmluZCcpO1xudmFyIEF4aW9zID0gcmVxdWlyZSgnLi9jb3JlL0F4aW9zJyk7XG52YXIgbWVyZ2VDb25maWcgPSByZXF1aXJlKCcuL2NvcmUvbWVyZ2VDb25maWcnKTtcbnZhciBkZWZhdWx0cyA9IHJlcXVpcmUoJy4vZGVmYXVsdHMnKTtcblxuLyoqXG4gKiBDcmVhdGUgYW4gaW5zdGFuY2Ugb2YgQXhpb3NcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gZGVmYXVsdENvbmZpZyBUaGUgZGVmYXVsdCBjb25maWcgZm9yIHRoZSBpbnN0YW5jZVxuICogQHJldHVybiB7QXhpb3N9IEEgbmV3IGluc3RhbmNlIG9mIEF4aW9zXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZUluc3RhbmNlKGRlZmF1bHRDb25maWcpIHtcbiAgdmFyIGNvbnRleHQgPSBuZXcgQXhpb3MoZGVmYXVsdENvbmZpZyk7XG4gIHZhciBpbnN0YW5jZSA9IGJpbmQoQXhpb3MucHJvdG90eXBlLnJlcXVlc3QsIGNvbnRleHQpO1xuXG4gIC8vIENvcHkgYXhpb3MucHJvdG90eXBlIHRvIGluc3RhbmNlXG4gIHV0aWxzLmV4dGVuZChpbnN0YW5jZSwgQXhpb3MucHJvdG90eXBlLCBjb250ZXh0KTtcblxuICAvLyBDb3B5IGNvbnRleHQgdG8gaW5zdGFuY2VcbiAgdXRpbHMuZXh0ZW5kKGluc3RhbmNlLCBjb250ZXh0KTtcblxuICByZXR1cm4gaW5zdGFuY2U7XG59XG5cbi8vIENyZWF0ZSB0aGUgZGVmYXVsdCBpbnN0YW5jZSB0byBiZSBleHBvcnRlZFxudmFyIGF4aW9zID0gY3JlYXRlSW5zdGFuY2UoZGVmYXVsdHMpO1xuXG4vLyBFeHBvc2UgQXhpb3MgY2xhc3MgdG8gYWxsb3cgY2xhc3MgaW5oZXJpdGFuY2VcbmF4aW9zLkF4aW9zID0gQXhpb3M7XG5cbi8vIEZhY3RvcnkgZm9yIGNyZWF0aW5nIG5ldyBpbnN0YW5jZXNcbmF4aW9zLmNyZWF0ZSA9IGZ1bmN0aW9uIGNyZWF0ZShpbnN0YW5jZUNvbmZpZykge1xuICByZXR1cm4gY3JlYXRlSW5zdGFuY2UobWVyZ2VDb25maWcoYXhpb3MuZGVmYXVsdHMsIGluc3RhbmNlQ29uZmlnKSk7XG59O1xuXG4vLyBFeHBvc2UgQ2FuY2VsICYgQ2FuY2VsVG9rZW5cbmF4aW9zLkNhbmNlbCA9IHJlcXVpcmUoJy4vY2FuY2VsL0NhbmNlbCcpO1xuYXhpb3MuQ2FuY2VsVG9rZW4gPSByZXF1aXJlKCcuL2NhbmNlbC9DYW5jZWxUb2tlbicpO1xuYXhpb3MuaXNDYW5jZWwgPSByZXF1aXJlKCcuL2NhbmNlbC9pc0NhbmNlbCcpO1xuXG4vLyBFeHBvc2UgYWxsL3NwcmVhZFxuYXhpb3MuYWxsID0gZnVuY3Rpb24gYWxsKHByb21pc2VzKSB7XG4gIHJldHVybiBQcm9taXNlLmFsbChwcm9taXNlcyk7XG59O1xuYXhpb3Muc3ByZWFkID0gcmVxdWlyZSgnLi9oZWxwZXJzL3NwcmVhZCcpO1xuXG4vLyBFeHBvc2UgaXNBeGlvc0Vycm9yXG5heGlvcy5pc0F4aW9zRXJyb3IgPSByZXF1aXJlKCcuL2hlbHBlcnMvaXNBeGlvc0Vycm9yJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gYXhpb3M7XG5cbi8vIEFsbG93IHVzZSBvZiBkZWZhdWx0IGltcG9ydCBzeW50YXggaW4gVHlwZVNjcmlwdFxubW9kdWxlLmV4cG9ydHMuZGVmYXVsdCA9IGF4aW9zO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIEEgYENhbmNlbGAgaXMgYW4gb2JqZWN0IHRoYXQgaXMgdGhyb3duIHdoZW4gYW4gb3BlcmF0aW9uIGlzIGNhbmNlbGVkLlxuICpcbiAqIEBjbGFzc1xuICogQHBhcmFtIHtzdHJpbmc9fSBtZXNzYWdlIFRoZSBtZXNzYWdlLlxuICovXG5mdW5jdGlvbiBDYW5jZWwobWVzc2FnZSkge1xuICB0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlO1xufVxuXG5DYW5jZWwucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24gdG9TdHJpbmcoKSB7XG4gIHJldHVybiAnQ2FuY2VsJyArICh0aGlzLm1lc3NhZ2UgPyAnOiAnICsgdGhpcy5tZXNzYWdlIDogJycpO1xufTtcblxuQ2FuY2VsLnByb3RvdHlwZS5fX0NBTkNFTF9fID0gdHJ1ZTtcblxubW9kdWxlLmV4cG9ydHMgPSBDYW5jZWw7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBDYW5jZWwgPSByZXF1aXJlKCcuL0NhbmNlbCcpO1xuXG4vKipcbiAqIEEgYENhbmNlbFRva2VuYCBpcyBhbiBvYmplY3QgdGhhdCBjYW4gYmUgdXNlZCB0byByZXF1ZXN0IGNhbmNlbGxhdGlvbiBvZiBhbiBvcGVyYXRpb24uXG4gKlxuICogQGNsYXNzXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBleGVjdXRvciBUaGUgZXhlY3V0b3IgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIENhbmNlbFRva2VuKGV4ZWN1dG9yKSB7XG4gIGlmICh0eXBlb2YgZXhlY3V0b3IgIT09ICdmdW5jdGlvbicpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdleGVjdXRvciBtdXN0IGJlIGEgZnVuY3Rpb24uJyk7XG4gIH1cblxuICB2YXIgcmVzb2x2ZVByb21pc2U7XG4gIHRoaXMucHJvbWlzZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uIHByb21pc2VFeGVjdXRvcihyZXNvbHZlKSB7XG4gICAgcmVzb2x2ZVByb21pc2UgPSByZXNvbHZlO1xuICB9KTtcblxuICB2YXIgdG9rZW4gPSB0aGlzO1xuICBleGVjdXRvcihmdW5jdGlvbiBjYW5jZWwobWVzc2FnZSkge1xuICAgIGlmICh0b2tlbi5yZWFzb24pIHtcbiAgICAgIC8vIENhbmNlbGxhdGlvbiBoYXMgYWxyZWFkeSBiZWVuIHJlcXVlc3RlZFxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRva2VuLnJlYXNvbiA9IG5ldyBDYW5jZWwobWVzc2FnZSk7XG4gICAgcmVzb2x2ZVByb21pc2UodG9rZW4ucmVhc29uKTtcbiAgfSk7XG59XG5cbi8qKlxuICogVGhyb3dzIGEgYENhbmNlbGAgaWYgY2FuY2VsbGF0aW9uIGhhcyBiZWVuIHJlcXVlc3RlZC5cbiAqL1xuQ2FuY2VsVG9rZW4ucHJvdG90eXBlLnRocm93SWZSZXF1ZXN0ZWQgPSBmdW5jdGlvbiB0aHJvd0lmUmVxdWVzdGVkKCkge1xuICBpZiAodGhpcy5yZWFzb24pIHtcbiAgICB0aHJvdyB0aGlzLnJlYXNvbjtcbiAgfVxufTtcblxuLyoqXG4gKiBSZXR1cm5zIGFuIG9iamVjdCB0aGF0IGNvbnRhaW5zIGEgbmV3IGBDYW5jZWxUb2tlbmAgYW5kIGEgZnVuY3Rpb24gdGhhdCwgd2hlbiBjYWxsZWQsXG4gKiBjYW5jZWxzIHRoZSBgQ2FuY2VsVG9rZW5gLlxuICovXG5DYW5jZWxUb2tlbi5zb3VyY2UgPSBmdW5jdGlvbiBzb3VyY2UoKSB7XG4gIHZhciBjYW5jZWw7XG4gIHZhciB0b2tlbiA9IG5ldyBDYW5jZWxUb2tlbihmdW5jdGlvbiBleGVjdXRvcihjKSB7XG4gICAgY2FuY2VsID0gYztcbiAgfSk7XG4gIHJldHVybiB7XG4gICAgdG9rZW46IHRva2VuLFxuICAgIGNhbmNlbDogY2FuY2VsXG4gIH07XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IENhbmNlbFRva2VuO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGlzQ2FuY2VsKHZhbHVlKSB7XG4gIHJldHVybiAhISh2YWx1ZSAmJiB2YWx1ZS5fX0NBTkNFTF9fKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vLi4vdXRpbHMnKTtcbnZhciBidWlsZFVSTCA9IHJlcXVpcmUoJy4uL2hlbHBlcnMvYnVpbGRVUkwnKTtcbnZhciBJbnRlcmNlcHRvck1hbmFnZXIgPSByZXF1aXJlKCcuL0ludGVyY2VwdG9yTWFuYWdlcicpO1xudmFyIGRpc3BhdGNoUmVxdWVzdCA9IHJlcXVpcmUoJy4vZGlzcGF0Y2hSZXF1ZXN0Jyk7XG52YXIgbWVyZ2VDb25maWcgPSByZXF1aXJlKCcuL21lcmdlQ29uZmlnJyk7XG52YXIgdmFsaWRhdG9yID0gcmVxdWlyZSgnLi4vaGVscGVycy92YWxpZGF0b3InKTtcblxudmFyIHZhbGlkYXRvcnMgPSB2YWxpZGF0b3IudmFsaWRhdG9ycztcbi8qKlxuICogQ3JlYXRlIGEgbmV3IGluc3RhbmNlIG9mIEF4aW9zXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGluc3RhbmNlQ29uZmlnIFRoZSBkZWZhdWx0IGNvbmZpZyBmb3IgdGhlIGluc3RhbmNlXG4gKi9cbmZ1bmN0aW9uIEF4aW9zKGluc3RhbmNlQ29uZmlnKSB7XG4gIHRoaXMuZGVmYXVsdHMgPSBpbnN0YW5jZUNvbmZpZztcbiAgdGhpcy5pbnRlcmNlcHRvcnMgPSB7XG4gICAgcmVxdWVzdDogbmV3IEludGVyY2VwdG9yTWFuYWdlcigpLFxuICAgIHJlc3BvbnNlOiBuZXcgSW50ZXJjZXB0b3JNYW5hZ2VyKClcbiAgfTtcbn1cblxuLyoqXG4gKiBEaXNwYXRjaCBhIHJlcXVlc3RcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gY29uZmlnIFRoZSBjb25maWcgc3BlY2lmaWMgZm9yIHRoaXMgcmVxdWVzdCAobWVyZ2VkIHdpdGggdGhpcy5kZWZhdWx0cylcbiAqL1xuQXhpb3MucHJvdG90eXBlLnJlcXVlc3QgPSBmdW5jdGlvbiByZXF1ZXN0KGNvbmZpZykge1xuICAvKmVzbGludCBuby1wYXJhbS1yZWFzc2lnbjowKi9cbiAgLy8gQWxsb3cgZm9yIGF4aW9zKCdleGFtcGxlL3VybCdbLCBjb25maWddKSBhIGxhIGZldGNoIEFQSVxuICBpZiAodHlwZW9mIGNvbmZpZyA9PT0gJ3N0cmluZycpIHtcbiAgICBjb25maWcgPSBhcmd1bWVudHNbMV0gfHwge307XG4gICAgY29uZmlnLnVybCA9IGFyZ3VtZW50c1swXTtcbiAgfSBlbHNlIHtcbiAgICBjb25maWcgPSBjb25maWcgfHwge307XG4gIH1cblxuICBjb25maWcgPSBtZXJnZUNvbmZpZyh0aGlzLmRlZmF1bHRzLCBjb25maWcpO1xuXG4gIC8vIFNldCBjb25maWcubWV0aG9kXG4gIGlmIChjb25maWcubWV0aG9kKSB7XG4gICAgY29uZmlnLm1ldGhvZCA9IGNvbmZpZy5tZXRob2QudG9Mb3dlckNhc2UoKTtcbiAgfSBlbHNlIGlmICh0aGlzLmRlZmF1bHRzLm1ldGhvZCkge1xuICAgIGNvbmZpZy5tZXRob2QgPSB0aGlzLmRlZmF1bHRzLm1ldGhvZC50b0xvd2VyQ2FzZSgpO1xuICB9IGVsc2Uge1xuICAgIGNvbmZpZy5tZXRob2QgPSAnZ2V0JztcbiAgfVxuXG4gIHZhciB0cmFuc2l0aW9uYWwgPSBjb25maWcudHJhbnNpdGlvbmFsO1xuXG4gIGlmICh0cmFuc2l0aW9uYWwgIT09IHVuZGVmaW5lZCkge1xuICAgIHZhbGlkYXRvci5hc3NlcnRPcHRpb25zKHRyYW5zaXRpb25hbCwge1xuICAgICAgc2lsZW50SlNPTlBhcnNpbmc6IHZhbGlkYXRvcnMudHJhbnNpdGlvbmFsKHZhbGlkYXRvcnMuYm9vbGVhbiwgJzEuMC4wJyksXG4gICAgICBmb3JjZWRKU09OUGFyc2luZzogdmFsaWRhdG9ycy50cmFuc2l0aW9uYWwodmFsaWRhdG9ycy5ib29sZWFuLCAnMS4wLjAnKSxcbiAgICAgIGNsYXJpZnlUaW1lb3V0RXJyb3I6IHZhbGlkYXRvcnMudHJhbnNpdGlvbmFsKHZhbGlkYXRvcnMuYm9vbGVhbiwgJzEuMC4wJylcbiAgICB9LCBmYWxzZSk7XG4gIH1cblxuICAvLyBmaWx0ZXIgb3V0IHNraXBwZWQgaW50ZXJjZXB0b3JzXG4gIHZhciByZXF1ZXN0SW50ZXJjZXB0b3JDaGFpbiA9IFtdO1xuICB2YXIgc3luY2hyb25vdXNSZXF1ZXN0SW50ZXJjZXB0b3JzID0gdHJ1ZTtcbiAgdGhpcy5pbnRlcmNlcHRvcnMucmVxdWVzdC5mb3JFYWNoKGZ1bmN0aW9uIHVuc2hpZnRSZXF1ZXN0SW50ZXJjZXB0b3JzKGludGVyY2VwdG9yKSB7XG4gICAgaWYgKHR5cGVvZiBpbnRlcmNlcHRvci5ydW5XaGVuID09PSAnZnVuY3Rpb24nICYmIGludGVyY2VwdG9yLnJ1bldoZW4oY29uZmlnKSA9PT0gZmFsc2UpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBzeW5jaHJvbm91c1JlcXVlc3RJbnRlcmNlcHRvcnMgPSBzeW5jaHJvbm91c1JlcXVlc3RJbnRlcmNlcHRvcnMgJiYgaW50ZXJjZXB0b3Iuc3luY2hyb25vdXM7XG5cbiAgICByZXF1ZXN0SW50ZXJjZXB0b3JDaGFpbi51bnNoaWZ0KGludGVyY2VwdG9yLmZ1bGZpbGxlZCwgaW50ZXJjZXB0b3IucmVqZWN0ZWQpO1xuICB9KTtcblxuICB2YXIgcmVzcG9uc2VJbnRlcmNlcHRvckNoYWluID0gW107XG4gIHRoaXMuaW50ZXJjZXB0b3JzLnJlc3BvbnNlLmZvckVhY2goZnVuY3Rpb24gcHVzaFJlc3BvbnNlSW50ZXJjZXB0b3JzKGludGVyY2VwdG9yKSB7XG4gICAgcmVzcG9uc2VJbnRlcmNlcHRvckNoYWluLnB1c2goaW50ZXJjZXB0b3IuZnVsZmlsbGVkLCBpbnRlcmNlcHRvci5yZWplY3RlZCk7XG4gIH0pO1xuXG4gIHZhciBwcm9taXNlO1xuXG4gIGlmICghc3luY2hyb25vdXNSZXF1ZXN0SW50ZXJjZXB0b3JzKSB7XG4gICAgdmFyIGNoYWluID0gW2Rpc3BhdGNoUmVxdWVzdCwgdW5kZWZpbmVkXTtcblxuICAgIEFycmF5LnByb3RvdHlwZS51bnNoaWZ0LmFwcGx5KGNoYWluLCByZXF1ZXN0SW50ZXJjZXB0b3JDaGFpbik7XG4gICAgY2hhaW4gPSBjaGFpbi5jb25jYXQocmVzcG9uc2VJbnRlcmNlcHRvckNoYWluKTtcblxuICAgIHByb21pc2UgPSBQcm9taXNlLnJlc29sdmUoY29uZmlnKTtcbiAgICB3aGlsZSAoY2hhaW4ubGVuZ3RoKSB7XG4gICAgICBwcm9taXNlID0gcHJvbWlzZS50aGVuKGNoYWluLnNoaWZ0KCksIGNoYWluLnNoaWZ0KCkpO1xuICAgIH1cblxuICAgIHJldHVybiBwcm9taXNlO1xuICB9XG5cblxuICB2YXIgbmV3Q29uZmlnID0gY29uZmlnO1xuICB3aGlsZSAocmVxdWVzdEludGVyY2VwdG9yQ2hhaW4ubGVuZ3RoKSB7XG4gICAgdmFyIG9uRnVsZmlsbGVkID0gcmVxdWVzdEludGVyY2VwdG9yQ2hhaW4uc2hpZnQoKTtcbiAgICB2YXIgb25SZWplY3RlZCA9IHJlcXVlc3RJbnRlcmNlcHRvckNoYWluLnNoaWZ0KCk7XG4gICAgdHJ5IHtcbiAgICAgIG5ld0NvbmZpZyA9IG9uRnVsZmlsbGVkKG5ld0NvbmZpZyk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIG9uUmVqZWN0ZWQoZXJyb3IpO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgdHJ5IHtcbiAgICBwcm9taXNlID0gZGlzcGF0Y2hSZXF1ZXN0KG5ld0NvbmZpZyk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgcmV0dXJuIFByb21pc2UucmVqZWN0KGVycm9yKTtcbiAgfVxuXG4gIHdoaWxlIChyZXNwb25zZUludGVyY2VwdG9yQ2hhaW4ubGVuZ3RoKSB7XG4gICAgcHJvbWlzZSA9IHByb21pc2UudGhlbihyZXNwb25zZUludGVyY2VwdG9yQ2hhaW4uc2hpZnQoKSwgcmVzcG9uc2VJbnRlcmNlcHRvckNoYWluLnNoaWZ0KCkpO1xuICB9XG5cbiAgcmV0dXJuIHByb21pc2U7XG59O1xuXG5BeGlvcy5wcm90b3R5cGUuZ2V0VXJpID0gZnVuY3Rpb24gZ2V0VXJpKGNvbmZpZykge1xuICBjb25maWcgPSBtZXJnZUNvbmZpZyh0aGlzLmRlZmF1bHRzLCBjb25maWcpO1xuICByZXR1cm4gYnVpbGRVUkwoY29uZmlnLnVybCwgY29uZmlnLnBhcmFtcywgY29uZmlnLnBhcmFtc1NlcmlhbGl6ZXIpLnJlcGxhY2UoL15cXD8vLCAnJyk7XG59O1xuXG4vLyBQcm92aWRlIGFsaWFzZXMgZm9yIHN1cHBvcnRlZCByZXF1ZXN0IG1ldGhvZHNcbnV0aWxzLmZvckVhY2goWydkZWxldGUnLCAnZ2V0JywgJ2hlYWQnLCAnb3B0aW9ucyddLCBmdW5jdGlvbiBmb3JFYWNoTWV0aG9kTm9EYXRhKG1ldGhvZCkge1xuICAvKmVzbGludCBmdW5jLW5hbWVzOjAqL1xuICBBeGlvcy5wcm90b3R5cGVbbWV0aG9kXSA9IGZ1bmN0aW9uKHVybCwgY29uZmlnKSB7XG4gICAgcmV0dXJuIHRoaXMucmVxdWVzdChtZXJnZUNvbmZpZyhjb25maWcgfHwge30sIHtcbiAgICAgIG1ldGhvZDogbWV0aG9kLFxuICAgICAgdXJsOiB1cmwsXG4gICAgICBkYXRhOiAoY29uZmlnIHx8IHt9KS5kYXRhXG4gICAgfSkpO1xuICB9O1xufSk7XG5cbnV0aWxzLmZvckVhY2goWydwb3N0JywgJ3B1dCcsICdwYXRjaCddLCBmdW5jdGlvbiBmb3JFYWNoTWV0aG9kV2l0aERhdGEobWV0aG9kKSB7XG4gIC8qZXNsaW50IGZ1bmMtbmFtZXM6MCovXG4gIEF4aW9zLnByb3RvdHlwZVttZXRob2RdID0gZnVuY3Rpb24odXJsLCBkYXRhLCBjb25maWcpIHtcbiAgICByZXR1cm4gdGhpcy5yZXF1ZXN0KG1lcmdlQ29uZmlnKGNvbmZpZyB8fCB7fSwge1xuICAgICAgbWV0aG9kOiBtZXRob2QsXG4gICAgICB1cmw6IHVybCxcbiAgICAgIGRhdGE6IGRhdGFcbiAgICB9KSk7XG4gIH07XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBBeGlvcztcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi8uLi91dGlscycpO1xuXG5mdW5jdGlvbiBJbnRlcmNlcHRvck1hbmFnZXIoKSB7XG4gIHRoaXMuaGFuZGxlcnMgPSBbXTtcbn1cblxuLyoqXG4gKiBBZGQgYSBuZXcgaW50ZXJjZXB0b3IgdG8gdGhlIHN0YWNrXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVsZmlsbGVkIFRoZSBmdW5jdGlvbiB0byBoYW5kbGUgYHRoZW5gIGZvciBhIGBQcm9taXNlYFxuICogQHBhcmFtIHtGdW5jdGlvbn0gcmVqZWN0ZWQgVGhlIGZ1bmN0aW9uIHRvIGhhbmRsZSBgcmVqZWN0YCBmb3IgYSBgUHJvbWlzZWBcbiAqXG4gKiBAcmV0dXJuIHtOdW1iZXJ9IEFuIElEIHVzZWQgdG8gcmVtb3ZlIGludGVyY2VwdG9yIGxhdGVyXG4gKi9cbkludGVyY2VwdG9yTWFuYWdlci5wcm90b3R5cGUudXNlID0gZnVuY3Rpb24gdXNlKGZ1bGZpbGxlZCwgcmVqZWN0ZWQsIG9wdGlvbnMpIHtcbiAgdGhpcy5oYW5kbGVycy5wdXNoKHtcbiAgICBmdWxmaWxsZWQ6IGZ1bGZpbGxlZCxcbiAgICByZWplY3RlZDogcmVqZWN0ZWQsXG4gICAgc3luY2hyb25vdXM6IG9wdGlvbnMgPyBvcHRpb25zLnN5bmNocm9ub3VzIDogZmFsc2UsXG4gICAgcnVuV2hlbjogb3B0aW9ucyA/IG9wdGlvbnMucnVuV2hlbiA6IG51bGxcbiAgfSk7XG4gIHJldHVybiB0aGlzLmhhbmRsZXJzLmxlbmd0aCAtIDE7XG59O1xuXG4vKipcbiAqIFJlbW92ZSBhbiBpbnRlcmNlcHRvciBmcm9tIHRoZSBzdGFja1xuICpcbiAqIEBwYXJhbSB7TnVtYmVyfSBpZCBUaGUgSUQgdGhhdCB3YXMgcmV0dXJuZWQgYnkgYHVzZWBcbiAqL1xuSW50ZXJjZXB0b3JNYW5hZ2VyLnByb3RvdHlwZS5lamVjdCA9IGZ1bmN0aW9uIGVqZWN0KGlkKSB7XG4gIGlmICh0aGlzLmhhbmRsZXJzW2lkXSkge1xuICAgIHRoaXMuaGFuZGxlcnNbaWRdID0gbnVsbDtcbiAgfVxufTtcblxuLyoqXG4gKiBJdGVyYXRlIG92ZXIgYWxsIHRoZSByZWdpc3RlcmVkIGludGVyY2VwdG9yc1xuICpcbiAqIFRoaXMgbWV0aG9kIGlzIHBhcnRpY3VsYXJseSB1c2VmdWwgZm9yIHNraXBwaW5nIG92ZXIgYW55XG4gKiBpbnRlcmNlcHRvcnMgdGhhdCBtYXkgaGF2ZSBiZWNvbWUgYG51bGxgIGNhbGxpbmcgYGVqZWN0YC5cbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBUaGUgZnVuY3Rpb24gdG8gY2FsbCBmb3IgZWFjaCBpbnRlcmNlcHRvclxuICovXG5JbnRlcmNlcHRvck1hbmFnZXIucHJvdG90eXBlLmZvckVhY2ggPSBmdW5jdGlvbiBmb3JFYWNoKGZuKSB7XG4gIHV0aWxzLmZvckVhY2godGhpcy5oYW5kbGVycywgZnVuY3Rpb24gZm9yRWFjaEhhbmRsZXIoaCkge1xuICAgIGlmIChoICE9PSBudWxsKSB7XG4gICAgICBmbihoKTtcbiAgICB9XG4gIH0pO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBJbnRlcmNlcHRvck1hbmFnZXI7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBpc0Fic29sdXRlVVJMID0gcmVxdWlyZSgnLi4vaGVscGVycy9pc0Fic29sdXRlVVJMJyk7XG52YXIgY29tYmluZVVSTHMgPSByZXF1aXJlKCcuLi9oZWxwZXJzL2NvbWJpbmVVUkxzJyk7XG5cbi8qKlxuICogQ3JlYXRlcyBhIG5ldyBVUkwgYnkgY29tYmluaW5nIHRoZSBiYXNlVVJMIHdpdGggdGhlIHJlcXVlc3RlZFVSTCxcbiAqIG9ubHkgd2hlbiB0aGUgcmVxdWVzdGVkVVJMIGlzIG5vdCBhbHJlYWR5IGFuIGFic29sdXRlIFVSTC5cbiAqIElmIHRoZSByZXF1ZXN0VVJMIGlzIGFic29sdXRlLCB0aGlzIGZ1bmN0aW9uIHJldHVybnMgdGhlIHJlcXVlc3RlZFVSTCB1bnRvdWNoZWQuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGJhc2VVUkwgVGhlIGJhc2UgVVJMXG4gKiBAcGFyYW0ge3N0cmluZ30gcmVxdWVzdGVkVVJMIEFic29sdXRlIG9yIHJlbGF0aXZlIFVSTCB0byBjb21iaW5lXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgY29tYmluZWQgZnVsbCBwYXRoXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYnVpbGRGdWxsUGF0aChiYXNlVVJMLCByZXF1ZXN0ZWRVUkwpIHtcbiAgaWYgKGJhc2VVUkwgJiYgIWlzQWJzb2x1dGVVUkwocmVxdWVzdGVkVVJMKSkge1xuICAgIHJldHVybiBjb21iaW5lVVJMcyhiYXNlVVJMLCByZXF1ZXN0ZWRVUkwpO1xuICB9XG4gIHJldHVybiByZXF1ZXN0ZWRVUkw7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgZW5oYW5jZUVycm9yID0gcmVxdWlyZSgnLi9lbmhhbmNlRXJyb3InKTtcblxuLyoqXG4gKiBDcmVhdGUgYW4gRXJyb3Igd2l0aCB0aGUgc3BlY2lmaWVkIG1lc3NhZ2UsIGNvbmZpZywgZXJyb3IgY29kZSwgcmVxdWVzdCBhbmQgcmVzcG9uc2UuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IG1lc3NhZ2UgVGhlIGVycm9yIG1lc3NhZ2UuXG4gKiBAcGFyYW0ge09iamVjdH0gY29uZmlnIFRoZSBjb25maWcuXG4gKiBAcGFyYW0ge3N0cmluZ30gW2NvZGVdIFRoZSBlcnJvciBjb2RlIChmb3IgZXhhbXBsZSwgJ0VDT05OQUJPUlRFRCcpLlxuICogQHBhcmFtIHtPYmplY3R9IFtyZXF1ZXN0XSBUaGUgcmVxdWVzdC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbcmVzcG9uc2VdIFRoZSByZXNwb25zZS5cbiAqIEByZXR1cm5zIHtFcnJvcn0gVGhlIGNyZWF0ZWQgZXJyb3IuXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY3JlYXRlRXJyb3IobWVzc2FnZSwgY29uZmlnLCBjb2RlLCByZXF1ZXN0LCByZXNwb25zZSkge1xuICB2YXIgZXJyb3IgPSBuZXcgRXJyb3IobWVzc2FnZSk7XG4gIHJldHVybiBlbmhhbmNlRXJyb3IoZXJyb3IsIGNvbmZpZywgY29kZSwgcmVxdWVzdCwgcmVzcG9uc2UpO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi8uLi91dGlscycpO1xudmFyIHRyYW5zZm9ybURhdGEgPSByZXF1aXJlKCcuL3RyYW5zZm9ybURhdGEnKTtcbnZhciBpc0NhbmNlbCA9IHJlcXVpcmUoJy4uL2NhbmNlbC9pc0NhbmNlbCcpO1xudmFyIGRlZmF1bHRzID0gcmVxdWlyZSgnLi4vZGVmYXVsdHMnKTtcblxuLyoqXG4gKiBUaHJvd3MgYSBgQ2FuY2VsYCBpZiBjYW5jZWxsYXRpb24gaGFzIGJlZW4gcmVxdWVzdGVkLlxuICovXG5mdW5jdGlvbiB0aHJvd0lmQ2FuY2VsbGF0aW9uUmVxdWVzdGVkKGNvbmZpZykge1xuICBpZiAoY29uZmlnLmNhbmNlbFRva2VuKSB7XG4gICAgY29uZmlnLmNhbmNlbFRva2VuLnRocm93SWZSZXF1ZXN0ZWQoKTtcbiAgfVxufVxuXG4vKipcbiAqIERpc3BhdGNoIGEgcmVxdWVzdCB0byB0aGUgc2VydmVyIHVzaW5nIHRoZSBjb25maWd1cmVkIGFkYXB0ZXIuXG4gKlxuICogQHBhcmFtIHtvYmplY3R9IGNvbmZpZyBUaGUgY29uZmlnIHRoYXQgaXMgdG8gYmUgdXNlZCBmb3IgdGhlIHJlcXVlc3RcbiAqIEByZXR1cm5zIHtQcm9taXNlfSBUaGUgUHJvbWlzZSB0byBiZSBmdWxmaWxsZWRcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBkaXNwYXRjaFJlcXVlc3QoY29uZmlnKSB7XG4gIHRocm93SWZDYW5jZWxsYXRpb25SZXF1ZXN0ZWQoY29uZmlnKTtcblxuICAvLyBFbnN1cmUgaGVhZGVycyBleGlzdFxuICBjb25maWcuaGVhZGVycyA9IGNvbmZpZy5oZWFkZXJzIHx8IHt9O1xuXG4gIC8vIFRyYW5zZm9ybSByZXF1ZXN0IGRhdGFcbiAgY29uZmlnLmRhdGEgPSB0cmFuc2Zvcm1EYXRhLmNhbGwoXG4gICAgY29uZmlnLFxuICAgIGNvbmZpZy5kYXRhLFxuICAgIGNvbmZpZy5oZWFkZXJzLFxuICAgIGNvbmZpZy50cmFuc2Zvcm1SZXF1ZXN0XG4gICk7XG5cbiAgLy8gRmxhdHRlbiBoZWFkZXJzXG4gIGNvbmZpZy5oZWFkZXJzID0gdXRpbHMubWVyZ2UoXG4gICAgY29uZmlnLmhlYWRlcnMuY29tbW9uIHx8IHt9LFxuICAgIGNvbmZpZy5oZWFkZXJzW2NvbmZpZy5tZXRob2RdIHx8IHt9LFxuICAgIGNvbmZpZy5oZWFkZXJzXG4gICk7XG5cbiAgdXRpbHMuZm9yRWFjaChcbiAgICBbJ2RlbGV0ZScsICdnZXQnLCAnaGVhZCcsICdwb3N0JywgJ3B1dCcsICdwYXRjaCcsICdjb21tb24nXSxcbiAgICBmdW5jdGlvbiBjbGVhbkhlYWRlckNvbmZpZyhtZXRob2QpIHtcbiAgICAgIGRlbGV0ZSBjb25maWcuaGVhZGVyc1ttZXRob2RdO1xuICAgIH1cbiAgKTtcblxuICB2YXIgYWRhcHRlciA9IGNvbmZpZy5hZGFwdGVyIHx8IGRlZmF1bHRzLmFkYXB0ZXI7XG5cbiAgcmV0dXJuIGFkYXB0ZXIoY29uZmlnKS50aGVuKGZ1bmN0aW9uIG9uQWRhcHRlclJlc29sdXRpb24ocmVzcG9uc2UpIHtcbiAgICB0aHJvd0lmQ2FuY2VsbGF0aW9uUmVxdWVzdGVkKGNvbmZpZyk7XG5cbiAgICAvLyBUcmFuc2Zvcm0gcmVzcG9uc2UgZGF0YVxuICAgIHJlc3BvbnNlLmRhdGEgPSB0cmFuc2Zvcm1EYXRhLmNhbGwoXG4gICAgICBjb25maWcsXG4gICAgICByZXNwb25zZS5kYXRhLFxuICAgICAgcmVzcG9uc2UuaGVhZGVycyxcbiAgICAgIGNvbmZpZy50cmFuc2Zvcm1SZXNwb25zZVxuICAgICk7XG5cbiAgICByZXR1cm4gcmVzcG9uc2U7XG4gIH0sIGZ1bmN0aW9uIG9uQWRhcHRlclJlamVjdGlvbihyZWFzb24pIHtcbiAgICBpZiAoIWlzQ2FuY2VsKHJlYXNvbikpIHtcbiAgICAgIHRocm93SWZDYW5jZWxsYXRpb25SZXF1ZXN0ZWQoY29uZmlnKTtcblxuICAgICAgLy8gVHJhbnNmb3JtIHJlc3BvbnNlIGRhdGFcbiAgICAgIGlmIChyZWFzb24gJiYgcmVhc29uLnJlc3BvbnNlKSB7XG4gICAgICAgIHJlYXNvbi5yZXNwb25zZS5kYXRhID0gdHJhbnNmb3JtRGF0YS5jYWxsKFxuICAgICAgICAgIGNvbmZpZyxcbiAgICAgICAgICByZWFzb24ucmVzcG9uc2UuZGF0YSxcbiAgICAgICAgICByZWFzb24ucmVzcG9uc2UuaGVhZGVycyxcbiAgICAgICAgICBjb25maWcudHJhbnNmb3JtUmVzcG9uc2VcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QocmVhc29uKTtcbiAgfSk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIFVwZGF0ZSBhbiBFcnJvciB3aXRoIHRoZSBzcGVjaWZpZWQgY29uZmlnLCBlcnJvciBjb2RlLCBhbmQgcmVzcG9uc2UuXG4gKlxuICogQHBhcmFtIHtFcnJvcn0gZXJyb3IgVGhlIGVycm9yIHRvIHVwZGF0ZS5cbiAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWcgVGhlIGNvbmZpZy5cbiAqIEBwYXJhbSB7c3RyaW5nfSBbY29kZV0gVGhlIGVycm9yIGNvZGUgKGZvciBleGFtcGxlLCAnRUNPTk5BQk9SVEVEJykuXG4gKiBAcGFyYW0ge09iamVjdH0gW3JlcXVlc3RdIFRoZSByZXF1ZXN0LlxuICogQHBhcmFtIHtPYmplY3R9IFtyZXNwb25zZV0gVGhlIHJlc3BvbnNlLlxuICogQHJldHVybnMge0Vycm9yfSBUaGUgZXJyb3IuXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZW5oYW5jZUVycm9yKGVycm9yLCBjb25maWcsIGNvZGUsIHJlcXVlc3QsIHJlc3BvbnNlKSB7XG4gIGVycm9yLmNvbmZpZyA9IGNvbmZpZztcbiAgaWYgKGNvZGUpIHtcbiAgICBlcnJvci5jb2RlID0gY29kZTtcbiAgfVxuXG4gIGVycm9yLnJlcXVlc3QgPSByZXF1ZXN0O1xuICBlcnJvci5yZXNwb25zZSA9IHJlc3BvbnNlO1xuICBlcnJvci5pc0F4aW9zRXJyb3IgPSB0cnVlO1xuXG4gIGVycm9yLnRvSlNPTiA9IGZ1bmN0aW9uIHRvSlNPTigpIHtcbiAgICByZXR1cm4ge1xuICAgICAgLy8gU3RhbmRhcmRcbiAgICAgIG1lc3NhZ2U6IHRoaXMubWVzc2FnZSxcbiAgICAgIG5hbWU6IHRoaXMubmFtZSxcbiAgICAgIC8vIE1pY3Jvc29mdFxuICAgICAgZGVzY3JpcHRpb246IHRoaXMuZGVzY3JpcHRpb24sXG4gICAgICBudW1iZXI6IHRoaXMubnVtYmVyLFxuICAgICAgLy8gTW96aWxsYVxuICAgICAgZmlsZU5hbWU6IHRoaXMuZmlsZU5hbWUsXG4gICAgICBsaW5lTnVtYmVyOiB0aGlzLmxpbmVOdW1iZXIsXG4gICAgICBjb2x1bW5OdW1iZXI6IHRoaXMuY29sdW1uTnVtYmVyLFxuICAgICAgc3RhY2s6IHRoaXMuc3RhY2ssXG4gICAgICAvLyBBeGlvc1xuICAgICAgY29uZmlnOiB0aGlzLmNvbmZpZyxcbiAgICAgIGNvZGU6IHRoaXMuY29kZVxuICAgIH07XG4gIH07XG4gIHJldHVybiBlcnJvcjtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJy4uL3V0aWxzJyk7XG5cbi8qKlxuICogQ29uZmlnLXNwZWNpZmljIG1lcmdlLWZ1bmN0aW9uIHdoaWNoIGNyZWF0ZXMgYSBuZXcgY29uZmlnLW9iamVjdFxuICogYnkgbWVyZ2luZyB0d28gY29uZmlndXJhdGlvbiBvYmplY3RzIHRvZ2V0aGVyLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWcxXG4gKiBAcGFyYW0ge09iamVjdH0gY29uZmlnMlxuICogQHJldHVybnMge09iamVjdH0gTmV3IG9iamVjdCByZXN1bHRpbmcgZnJvbSBtZXJnaW5nIGNvbmZpZzIgdG8gY29uZmlnMVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIG1lcmdlQ29uZmlnKGNvbmZpZzEsIGNvbmZpZzIpIHtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXBhcmFtLXJlYXNzaWduXG4gIGNvbmZpZzIgPSBjb25maWcyIHx8IHt9O1xuICB2YXIgY29uZmlnID0ge307XG5cbiAgdmFyIHZhbHVlRnJvbUNvbmZpZzJLZXlzID0gWyd1cmwnLCAnbWV0aG9kJywgJ2RhdGEnXTtcbiAgdmFyIG1lcmdlRGVlcFByb3BlcnRpZXNLZXlzID0gWydoZWFkZXJzJywgJ2F1dGgnLCAncHJveHknLCAncGFyYW1zJ107XG4gIHZhciBkZWZhdWx0VG9Db25maWcyS2V5cyA9IFtcbiAgICAnYmFzZVVSTCcsICd0cmFuc2Zvcm1SZXF1ZXN0JywgJ3RyYW5zZm9ybVJlc3BvbnNlJywgJ3BhcmFtc1NlcmlhbGl6ZXInLFxuICAgICd0aW1lb3V0JywgJ3RpbWVvdXRNZXNzYWdlJywgJ3dpdGhDcmVkZW50aWFscycsICdhZGFwdGVyJywgJ3Jlc3BvbnNlVHlwZScsICd4c3JmQ29va2llTmFtZScsXG4gICAgJ3hzcmZIZWFkZXJOYW1lJywgJ29uVXBsb2FkUHJvZ3Jlc3MnLCAnb25Eb3dubG9hZFByb2dyZXNzJywgJ2RlY29tcHJlc3MnLFxuICAgICdtYXhDb250ZW50TGVuZ3RoJywgJ21heEJvZHlMZW5ndGgnLCAnbWF4UmVkaXJlY3RzJywgJ3RyYW5zcG9ydCcsICdodHRwQWdlbnQnLFxuICAgICdodHRwc0FnZW50JywgJ2NhbmNlbFRva2VuJywgJ3NvY2tldFBhdGgnLCAncmVzcG9uc2VFbmNvZGluZydcbiAgXTtcbiAgdmFyIGRpcmVjdE1lcmdlS2V5cyA9IFsndmFsaWRhdGVTdGF0dXMnXTtcblxuICBmdW5jdGlvbiBnZXRNZXJnZWRWYWx1ZSh0YXJnZXQsIHNvdXJjZSkge1xuICAgIGlmICh1dGlscy5pc1BsYWluT2JqZWN0KHRhcmdldCkgJiYgdXRpbHMuaXNQbGFpbk9iamVjdChzb3VyY2UpKSB7XG4gICAgICByZXR1cm4gdXRpbHMubWVyZ2UodGFyZ2V0LCBzb3VyY2UpO1xuICAgIH0gZWxzZSBpZiAodXRpbHMuaXNQbGFpbk9iamVjdChzb3VyY2UpKSB7XG4gICAgICByZXR1cm4gdXRpbHMubWVyZ2Uoe30sIHNvdXJjZSk7XG4gICAgfSBlbHNlIGlmICh1dGlscy5pc0FycmF5KHNvdXJjZSkpIHtcbiAgICAgIHJldHVybiBzb3VyY2Uuc2xpY2UoKTtcbiAgICB9XG4gICAgcmV0dXJuIHNvdXJjZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIG1lcmdlRGVlcFByb3BlcnRpZXMocHJvcCkge1xuICAgIGlmICghdXRpbHMuaXNVbmRlZmluZWQoY29uZmlnMltwcm9wXSkpIHtcbiAgICAgIGNvbmZpZ1twcm9wXSA9IGdldE1lcmdlZFZhbHVlKGNvbmZpZzFbcHJvcF0sIGNvbmZpZzJbcHJvcF0pO1xuICAgIH0gZWxzZSBpZiAoIXV0aWxzLmlzVW5kZWZpbmVkKGNvbmZpZzFbcHJvcF0pKSB7XG4gICAgICBjb25maWdbcHJvcF0gPSBnZXRNZXJnZWRWYWx1ZSh1bmRlZmluZWQsIGNvbmZpZzFbcHJvcF0pO1xuICAgIH1cbiAgfVxuXG4gIHV0aWxzLmZvckVhY2godmFsdWVGcm9tQ29uZmlnMktleXMsIGZ1bmN0aW9uIHZhbHVlRnJvbUNvbmZpZzIocHJvcCkge1xuICAgIGlmICghdXRpbHMuaXNVbmRlZmluZWQoY29uZmlnMltwcm9wXSkpIHtcbiAgICAgIGNvbmZpZ1twcm9wXSA9IGdldE1lcmdlZFZhbHVlKHVuZGVmaW5lZCwgY29uZmlnMltwcm9wXSk7XG4gICAgfVxuICB9KTtcblxuICB1dGlscy5mb3JFYWNoKG1lcmdlRGVlcFByb3BlcnRpZXNLZXlzLCBtZXJnZURlZXBQcm9wZXJ0aWVzKTtcblxuICB1dGlscy5mb3JFYWNoKGRlZmF1bHRUb0NvbmZpZzJLZXlzLCBmdW5jdGlvbiBkZWZhdWx0VG9Db25maWcyKHByb3ApIHtcbiAgICBpZiAoIXV0aWxzLmlzVW5kZWZpbmVkKGNvbmZpZzJbcHJvcF0pKSB7XG4gICAgICBjb25maWdbcHJvcF0gPSBnZXRNZXJnZWRWYWx1ZSh1bmRlZmluZWQsIGNvbmZpZzJbcHJvcF0pO1xuICAgIH0gZWxzZSBpZiAoIXV0aWxzLmlzVW5kZWZpbmVkKGNvbmZpZzFbcHJvcF0pKSB7XG4gICAgICBjb25maWdbcHJvcF0gPSBnZXRNZXJnZWRWYWx1ZSh1bmRlZmluZWQsIGNvbmZpZzFbcHJvcF0pO1xuICAgIH1cbiAgfSk7XG5cbiAgdXRpbHMuZm9yRWFjaChkaXJlY3RNZXJnZUtleXMsIGZ1bmN0aW9uIG1lcmdlKHByb3ApIHtcbiAgICBpZiAocHJvcCBpbiBjb25maWcyKSB7XG4gICAgICBjb25maWdbcHJvcF0gPSBnZXRNZXJnZWRWYWx1ZShjb25maWcxW3Byb3BdLCBjb25maWcyW3Byb3BdKTtcbiAgICB9IGVsc2UgaWYgKHByb3AgaW4gY29uZmlnMSkge1xuICAgICAgY29uZmlnW3Byb3BdID0gZ2V0TWVyZ2VkVmFsdWUodW5kZWZpbmVkLCBjb25maWcxW3Byb3BdKTtcbiAgICB9XG4gIH0pO1xuXG4gIHZhciBheGlvc0tleXMgPSB2YWx1ZUZyb21Db25maWcyS2V5c1xuICAgIC5jb25jYXQobWVyZ2VEZWVwUHJvcGVydGllc0tleXMpXG4gICAgLmNvbmNhdChkZWZhdWx0VG9Db25maWcyS2V5cylcbiAgICAuY29uY2F0KGRpcmVjdE1lcmdlS2V5cyk7XG5cbiAgdmFyIG90aGVyS2V5cyA9IE9iamVjdFxuICAgIC5rZXlzKGNvbmZpZzEpXG4gICAgLmNvbmNhdChPYmplY3Qua2V5cyhjb25maWcyKSlcbiAgICAuZmlsdGVyKGZ1bmN0aW9uIGZpbHRlckF4aW9zS2V5cyhrZXkpIHtcbiAgICAgIHJldHVybiBheGlvc0tleXMuaW5kZXhPZihrZXkpID09PSAtMTtcbiAgICB9KTtcblxuICB1dGlscy5mb3JFYWNoKG90aGVyS2V5cywgbWVyZ2VEZWVwUHJvcGVydGllcyk7XG5cbiAgcmV0dXJuIGNvbmZpZztcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBjcmVhdGVFcnJvciA9IHJlcXVpcmUoJy4vY3JlYXRlRXJyb3InKTtcblxuLyoqXG4gKiBSZXNvbHZlIG9yIHJlamVjdCBhIFByb21pc2UgYmFzZWQgb24gcmVzcG9uc2Ugc3RhdHVzLlxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IHJlc29sdmUgQSBmdW5jdGlvbiB0aGF0IHJlc29sdmVzIHRoZSBwcm9taXNlLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gcmVqZWN0IEEgZnVuY3Rpb24gdGhhdCByZWplY3RzIHRoZSBwcm9taXNlLlxuICogQHBhcmFtIHtvYmplY3R9IHJlc3BvbnNlIFRoZSByZXNwb25zZS5cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBzZXR0bGUocmVzb2x2ZSwgcmVqZWN0LCByZXNwb25zZSkge1xuICB2YXIgdmFsaWRhdGVTdGF0dXMgPSByZXNwb25zZS5jb25maWcudmFsaWRhdGVTdGF0dXM7XG4gIGlmICghcmVzcG9uc2Uuc3RhdHVzIHx8ICF2YWxpZGF0ZVN0YXR1cyB8fCB2YWxpZGF0ZVN0YXR1cyhyZXNwb25zZS5zdGF0dXMpKSB7XG4gICAgcmVzb2x2ZShyZXNwb25zZSk7XG4gIH0gZWxzZSB7XG4gICAgcmVqZWN0KGNyZWF0ZUVycm9yKFxuICAgICAgJ1JlcXVlc3QgZmFpbGVkIHdpdGggc3RhdHVzIGNvZGUgJyArIHJlc3BvbnNlLnN0YXR1cyxcbiAgICAgIHJlc3BvbnNlLmNvbmZpZyxcbiAgICAgIG51bGwsXG4gICAgICByZXNwb25zZS5yZXF1ZXN0LFxuICAgICAgcmVzcG9uc2VcbiAgICApKTtcbiAgfVxufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi8uLi91dGlscycpO1xudmFyIGRlZmF1bHRzID0gcmVxdWlyZSgnLi8uLi9kZWZhdWx0cycpO1xuXG4vKipcbiAqIFRyYW5zZm9ybSB0aGUgZGF0YSBmb3IgYSByZXF1ZXN0IG9yIGEgcmVzcG9uc2VcbiAqXG4gKiBAcGFyYW0ge09iamVjdHxTdHJpbmd9IGRhdGEgVGhlIGRhdGEgdG8gYmUgdHJhbnNmb3JtZWRcbiAqIEBwYXJhbSB7QXJyYXl9IGhlYWRlcnMgVGhlIGhlYWRlcnMgZm9yIHRoZSByZXF1ZXN0IG9yIHJlc3BvbnNlXG4gKiBAcGFyYW0ge0FycmF5fEZ1bmN0aW9ufSBmbnMgQSBzaW5nbGUgZnVuY3Rpb24gb3IgQXJyYXkgb2YgZnVuY3Rpb25zXG4gKiBAcmV0dXJucyB7Kn0gVGhlIHJlc3VsdGluZyB0cmFuc2Zvcm1lZCBkYXRhXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gdHJhbnNmb3JtRGF0YShkYXRhLCBoZWFkZXJzLCBmbnMpIHtcbiAgdmFyIGNvbnRleHQgPSB0aGlzIHx8IGRlZmF1bHRzO1xuICAvKmVzbGludCBuby1wYXJhbS1yZWFzc2lnbjowKi9cbiAgdXRpbHMuZm9yRWFjaChmbnMsIGZ1bmN0aW9uIHRyYW5zZm9ybShmbikge1xuICAgIGRhdGEgPSBmbi5jYWxsKGNvbnRleHQsIGRhdGEsIGhlYWRlcnMpO1xuICB9KTtcblxuICByZXR1cm4gZGF0YTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vdXRpbHMnKTtcbnZhciBub3JtYWxpemVIZWFkZXJOYW1lID0gcmVxdWlyZSgnLi9oZWxwZXJzL25vcm1hbGl6ZUhlYWRlck5hbWUnKTtcbnZhciBlbmhhbmNlRXJyb3IgPSByZXF1aXJlKCcuL2NvcmUvZW5oYW5jZUVycm9yJyk7XG5cbnZhciBERUZBVUxUX0NPTlRFTlRfVFlQRSA9IHtcbiAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnXG59O1xuXG5mdW5jdGlvbiBzZXRDb250ZW50VHlwZUlmVW5zZXQoaGVhZGVycywgdmFsdWUpIHtcbiAgaWYgKCF1dGlscy5pc1VuZGVmaW5lZChoZWFkZXJzKSAmJiB1dGlscy5pc1VuZGVmaW5lZChoZWFkZXJzWydDb250ZW50LVR5cGUnXSkpIHtcbiAgICBoZWFkZXJzWydDb250ZW50LVR5cGUnXSA9IHZhbHVlO1xuICB9XG59XG5cbmZ1bmN0aW9uIGdldERlZmF1bHRBZGFwdGVyKCkge1xuICB2YXIgYWRhcHRlcjtcbiAgaWYgKHR5cGVvZiBYTUxIdHRwUmVxdWVzdCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAvLyBGb3IgYnJvd3NlcnMgdXNlIFhIUiBhZGFwdGVyXG4gICAgYWRhcHRlciA9IHJlcXVpcmUoJy4vYWRhcHRlcnMveGhyJyk7XG4gIH0gZWxzZSBpZiAodHlwZW9mIHByb2Nlc3MgIT09ICd1bmRlZmluZWQnICYmIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChwcm9jZXNzKSA9PT0gJ1tvYmplY3QgcHJvY2Vzc10nKSB7XG4gICAgLy8gRm9yIG5vZGUgdXNlIEhUVFAgYWRhcHRlclxuICAgIGFkYXB0ZXIgPSByZXF1aXJlKCcuL2FkYXB0ZXJzL2h0dHAnKTtcbiAgfVxuICByZXR1cm4gYWRhcHRlcjtcbn1cblxuZnVuY3Rpb24gc3RyaW5naWZ5U2FmZWx5KHJhd1ZhbHVlLCBwYXJzZXIsIGVuY29kZXIpIHtcbiAgaWYgKHV0aWxzLmlzU3RyaW5nKHJhd1ZhbHVlKSkge1xuICAgIHRyeSB7XG4gICAgICAocGFyc2VyIHx8IEpTT04ucGFyc2UpKHJhd1ZhbHVlKTtcbiAgICAgIHJldHVybiB1dGlscy50cmltKHJhd1ZhbHVlKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBpZiAoZS5uYW1lICE9PSAnU3ludGF4RXJyb3InKSB7XG4gICAgICAgIHRocm93IGU7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIChlbmNvZGVyIHx8IEpTT04uc3RyaW5naWZ5KShyYXdWYWx1ZSk7XG59XG5cbnZhciBkZWZhdWx0cyA9IHtcblxuICB0cmFuc2l0aW9uYWw6IHtcbiAgICBzaWxlbnRKU09OUGFyc2luZzogdHJ1ZSxcbiAgICBmb3JjZWRKU09OUGFyc2luZzogdHJ1ZSxcbiAgICBjbGFyaWZ5VGltZW91dEVycm9yOiBmYWxzZVxuICB9LFxuXG4gIGFkYXB0ZXI6IGdldERlZmF1bHRBZGFwdGVyKCksXG5cbiAgdHJhbnNmb3JtUmVxdWVzdDogW2Z1bmN0aW9uIHRyYW5zZm9ybVJlcXVlc3QoZGF0YSwgaGVhZGVycykge1xuICAgIG5vcm1hbGl6ZUhlYWRlck5hbWUoaGVhZGVycywgJ0FjY2VwdCcpO1xuICAgIG5vcm1hbGl6ZUhlYWRlck5hbWUoaGVhZGVycywgJ0NvbnRlbnQtVHlwZScpO1xuXG4gICAgaWYgKHV0aWxzLmlzRm9ybURhdGEoZGF0YSkgfHxcbiAgICAgIHV0aWxzLmlzQXJyYXlCdWZmZXIoZGF0YSkgfHxcbiAgICAgIHV0aWxzLmlzQnVmZmVyKGRhdGEpIHx8XG4gICAgICB1dGlscy5pc1N0cmVhbShkYXRhKSB8fFxuICAgICAgdXRpbHMuaXNGaWxlKGRhdGEpIHx8XG4gICAgICB1dGlscy5pc0Jsb2IoZGF0YSlcbiAgICApIHtcbiAgICAgIHJldHVybiBkYXRhO1xuICAgIH1cbiAgICBpZiAodXRpbHMuaXNBcnJheUJ1ZmZlclZpZXcoZGF0YSkpIHtcbiAgICAgIHJldHVybiBkYXRhLmJ1ZmZlcjtcbiAgICB9XG4gICAgaWYgKHV0aWxzLmlzVVJMU2VhcmNoUGFyYW1zKGRhdGEpKSB7XG4gICAgICBzZXRDb250ZW50VHlwZUlmVW5zZXQoaGVhZGVycywgJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZDtjaGFyc2V0PXV0Zi04Jyk7XG4gICAgICByZXR1cm4gZGF0YS50b1N0cmluZygpO1xuICAgIH1cbiAgICBpZiAodXRpbHMuaXNPYmplY3QoZGF0YSkgfHwgKGhlYWRlcnMgJiYgaGVhZGVyc1snQ29udGVudC1UeXBlJ10gPT09ICdhcHBsaWNhdGlvbi9qc29uJykpIHtcbiAgICAgIHNldENvbnRlbnRUeXBlSWZVbnNldChoZWFkZXJzLCAnYXBwbGljYXRpb24vanNvbicpO1xuICAgICAgcmV0dXJuIHN0cmluZ2lmeVNhZmVseShkYXRhKTtcbiAgICB9XG4gICAgcmV0dXJuIGRhdGE7XG4gIH1dLFxuXG4gIHRyYW5zZm9ybVJlc3BvbnNlOiBbZnVuY3Rpb24gdHJhbnNmb3JtUmVzcG9uc2UoZGF0YSkge1xuICAgIHZhciB0cmFuc2l0aW9uYWwgPSB0aGlzLnRyYW5zaXRpb25hbDtcbiAgICB2YXIgc2lsZW50SlNPTlBhcnNpbmcgPSB0cmFuc2l0aW9uYWwgJiYgdHJhbnNpdGlvbmFsLnNpbGVudEpTT05QYXJzaW5nO1xuICAgIHZhciBmb3JjZWRKU09OUGFyc2luZyA9IHRyYW5zaXRpb25hbCAmJiB0cmFuc2l0aW9uYWwuZm9yY2VkSlNPTlBhcnNpbmc7XG4gICAgdmFyIHN0cmljdEpTT05QYXJzaW5nID0gIXNpbGVudEpTT05QYXJzaW5nICYmIHRoaXMucmVzcG9uc2VUeXBlID09PSAnanNvbic7XG5cbiAgICBpZiAoc3RyaWN0SlNPTlBhcnNpbmcgfHwgKGZvcmNlZEpTT05QYXJzaW5nICYmIHV0aWxzLmlzU3RyaW5nKGRhdGEpICYmIGRhdGEubGVuZ3RoKSkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuIEpTT04ucGFyc2UoZGF0YSk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGlmIChzdHJpY3RKU09OUGFyc2luZykge1xuICAgICAgICAgIGlmIChlLm5hbWUgPT09ICdTeW50YXhFcnJvcicpIHtcbiAgICAgICAgICAgIHRocm93IGVuaGFuY2VFcnJvcihlLCB0aGlzLCAnRV9KU09OX1BBUlNFJyk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHRocm93IGU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZGF0YTtcbiAgfV0sXG5cbiAgLyoqXG4gICAqIEEgdGltZW91dCBpbiBtaWxsaXNlY29uZHMgdG8gYWJvcnQgYSByZXF1ZXN0LiBJZiBzZXQgdG8gMCAoZGVmYXVsdCkgYVxuICAgKiB0aW1lb3V0IGlzIG5vdCBjcmVhdGVkLlxuICAgKi9cbiAgdGltZW91dDogMCxcblxuICB4c3JmQ29va2llTmFtZTogJ1hTUkYtVE9LRU4nLFxuICB4c3JmSGVhZGVyTmFtZTogJ1gtWFNSRi1UT0tFTicsXG5cbiAgbWF4Q29udGVudExlbmd0aDogLTEsXG4gIG1heEJvZHlMZW5ndGg6IC0xLFxuXG4gIHZhbGlkYXRlU3RhdHVzOiBmdW5jdGlvbiB2YWxpZGF0ZVN0YXR1cyhzdGF0dXMpIHtcbiAgICByZXR1cm4gc3RhdHVzID49IDIwMCAmJiBzdGF0dXMgPCAzMDA7XG4gIH1cbn07XG5cbmRlZmF1bHRzLmhlYWRlcnMgPSB7XG4gIGNvbW1vbjoge1xuICAgICdBY2NlcHQnOiAnYXBwbGljYXRpb24vanNvbiwgdGV4dC9wbGFpbiwgKi8qJ1xuICB9XG59O1xuXG51dGlscy5mb3JFYWNoKFsnZGVsZXRlJywgJ2dldCcsICdoZWFkJ10sIGZ1bmN0aW9uIGZvckVhY2hNZXRob2ROb0RhdGEobWV0aG9kKSB7XG4gIGRlZmF1bHRzLmhlYWRlcnNbbWV0aG9kXSA9IHt9O1xufSk7XG5cbnV0aWxzLmZvckVhY2goWydwb3N0JywgJ3B1dCcsICdwYXRjaCddLCBmdW5jdGlvbiBmb3JFYWNoTWV0aG9kV2l0aERhdGEobWV0aG9kKSB7XG4gIGRlZmF1bHRzLmhlYWRlcnNbbWV0aG9kXSA9IHV0aWxzLm1lcmdlKERFRkFVTFRfQ09OVEVOVF9UWVBFKTtcbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGRlZmF1bHRzO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGJpbmQoZm4sIHRoaXNBcmcpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIHdyYXAoKSB7XG4gICAgdmFyIGFyZ3MgPSBuZXcgQXJyYXkoYXJndW1lbnRzLmxlbmd0aCk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcmdzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBhcmdzW2ldID0gYXJndW1lbnRzW2ldO1xuICAgIH1cbiAgICByZXR1cm4gZm4uYXBwbHkodGhpc0FyZywgYXJncyk7XG4gIH07XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLy4uL3V0aWxzJyk7XG5cbmZ1bmN0aW9uIGVuY29kZSh2YWwpIHtcbiAgcmV0dXJuIGVuY29kZVVSSUNvbXBvbmVudCh2YWwpLlxuICAgIHJlcGxhY2UoLyUzQS9naSwgJzonKS5cbiAgICByZXBsYWNlKC8lMjQvZywgJyQnKS5cbiAgICByZXBsYWNlKC8lMkMvZ2ksICcsJykuXG4gICAgcmVwbGFjZSgvJTIwL2csICcrJykuXG4gICAgcmVwbGFjZSgvJTVCL2dpLCAnWycpLlxuICAgIHJlcGxhY2UoLyU1RC9naSwgJ10nKTtcbn1cblxuLyoqXG4gKiBCdWlsZCBhIFVSTCBieSBhcHBlbmRpbmcgcGFyYW1zIHRvIHRoZSBlbmRcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gdXJsIFRoZSBiYXNlIG9mIHRoZSB1cmwgKGUuZy4sIGh0dHA6Ly93d3cuZ29vZ2xlLmNvbSlcbiAqIEBwYXJhbSB7b2JqZWN0fSBbcGFyYW1zXSBUaGUgcGFyYW1zIHRvIGJlIGFwcGVuZGVkXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgZm9ybWF0dGVkIHVybFxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGJ1aWxkVVJMKHVybCwgcGFyYW1zLCBwYXJhbXNTZXJpYWxpemVyKSB7XG4gIC8qZXNsaW50IG5vLXBhcmFtLXJlYXNzaWduOjAqL1xuICBpZiAoIXBhcmFtcykge1xuICAgIHJldHVybiB1cmw7XG4gIH1cblxuICB2YXIgc2VyaWFsaXplZFBhcmFtcztcbiAgaWYgKHBhcmFtc1NlcmlhbGl6ZXIpIHtcbiAgICBzZXJpYWxpemVkUGFyYW1zID0gcGFyYW1zU2VyaWFsaXplcihwYXJhbXMpO1xuICB9IGVsc2UgaWYgKHV0aWxzLmlzVVJMU2VhcmNoUGFyYW1zKHBhcmFtcykpIHtcbiAgICBzZXJpYWxpemVkUGFyYW1zID0gcGFyYW1zLnRvU3RyaW5nKCk7XG4gIH0gZWxzZSB7XG4gICAgdmFyIHBhcnRzID0gW107XG5cbiAgICB1dGlscy5mb3JFYWNoKHBhcmFtcywgZnVuY3Rpb24gc2VyaWFsaXplKHZhbCwga2V5KSB7XG4gICAgICBpZiAodmFsID09PSBudWxsIHx8IHR5cGVvZiB2YWwgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKHV0aWxzLmlzQXJyYXkodmFsKSkge1xuICAgICAgICBrZXkgPSBrZXkgKyAnW10nO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFsID0gW3ZhbF07XG4gICAgICB9XG5cbiAgICAgIHV0aWxzLmZvckVhY2godmFsLCBmdW5jdGlvbiBwYXJzZVZhbHVlKHYpIHtcbiAgICAgICAgaWYgKHV0aWxzLmlzRGF0ZSh2KSkge1xuICAgICAgICAgIHYgPSB2LnRvSVNPU3RyaW5nKCk7XG4gICAgICAgIH0gZWxzZSBpZiAodXRpbHMuaXNPYmplY3QodikpIHtcbiAgICAgICAgICB2ID0gSlNPTi5zdHJpbmdpZnkodik7XG4gICAgICAgIH1cbiAgICAgICAgcGFydHMucHVzaChlbmNvZGUoa2V5KSArICc9JyArIGVuY29kZSh2KSk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHNlcmlhbGl6ZWRQYXJhbXMgPSBwYXJ0cy5qb2luKCcmJyk7XG4gIH1cblxuICBpZiAoc2VyaWFsaXplZFBhcmFtcykge1xuICAgIHZhciBoYXNobWFya0luZGV4ID0gdXJsLmluZGV4T2YoJyMnKTtcbiAgICBpZiAoaGFzaG1hcmtJbmRleCAhPT0gLTEpIHtcbiAgICAgIHVybCA9IHVybC5zbGljZSgwLCBoYXNobWFya0luZGV4KTtcbiAgICB9XG5cbiAgICB1cmwgKz0gKHVybC5pbmRleE9mKCc/JykgPT09IC0xID8gJz8nIDogJyYnKSArIHNlcmlhbGl6ZWRQYXJhbXM7XG4gIH1cblxuICByZXR1cm4gdXJsO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBDcmVhdGVzIGEgbmV3IFVSTCBieSBjb21iaW5pbmcgdGhlIHNwZWNpZmllZCBVUkxzXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGJhc2VVUkwgVGhlIGJhc2UgVVJMXG4gKiBAcGFyYW0ge3N0cmluZ30gcmVsYXRpdmVVUkwgVGhlIHJlbGF0aXZlIFVSTFxuICogQHJldHVybnMge3N0cmluZ30gVGhlIGNvbWJpbmVkIFVSTFxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNvbWJpbmVVUkxzKGJhc2VVUkwsIHJlbGF0aXZlVVJMKSB7XG4gIHJldHVybiByZWxhdGl2ZVVSTFxuICAgID8gYmFzZVVSTC5yZXBsYWNlKC9cXC8rJC8sICcnKSArICcvJyArIHJlbGF0aXZlVVJMLnJlcGxhY2UoL15cXC8rLywgJycpXG4gICAgOiBiYXNlVVJMO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxzID0gcmVxdWlyZSgnLi8uLi91dGlscycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IChcbiAgdXRpbHMuaXNTdGFuZGFyZEJyb3dzZXJFbnYoKSA/XG5cbiAgLy8gU3RhbmRhcmQgYnJvd3NlciBlbnZzIHN1cHBvcnQgZG9jdW1lbnQuY29va2llXG4gICAgKGZ1bmN0aW9uIHN0YW5kYXJkQnJvd3NlckVudigpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHdyaXRlOiBmdW5jdGlvbiB3cml0ZShuYW1lLCB2YWx1ZSwgZXhwaXJlcywgcGF0aCwgZG9tYWluLCBzZWN1cmUpIHtcbiAgICAgICAgICB2YXIgY29va2llID0gW107XG4gICAgICAgICAgY29va2llLnB1c2gobmFtZSArICc9JyArIGVuY29kZVVSSUNvbXBvbmVudCh2YWx1ZSkpO1xuXG4gICAgICAgICAgaWYgKHV0aWxzLmlzTnVtYmVyKGV4cGlyZXMpKSB7XG4gICAgICAgICAgICBjb29raWUucHVzaCgnZXhwaXJlcz0nICsgbmV3IERhdGUoZXhwaXJlcykudG9HTVRTdHJpbmcoKSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKHV0aWxzLmlzU3RyaW5nKHBhdGgpKSB7XG4gICAgICAgICAgICBjb29raWUucHVzaCgncGF0aD0nICsgcGF0aCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKHV0aWxzLmlzU3RyaW5nKGRvbWFpbikpIHtcbiAgICAgICAgICAgIGNvb2tpZS5wdXNoKCdkb21haW49JyArIGRvbWFpbik7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKHNlY3VyZSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgY29va2llLnB1c2goJ3NlY3VyZScpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGRvY3VtZW50LmNvb2tpZSA9IGNvb2tpZS5qb2luKCc7ICcpO1xuICAgICAgICB9LFxuXG4gICAgICAgIHJlYWQ6IGZ1bmN0aW9uIHJlYWQobmFtZSkge1xuICAgICAgICAgIHZhciBtYXRjaCA9IGRvY3VtZW50LmNvb2tpZS5tYXRjaChuZXcgUmVnRXhwKCcoXnw7XFxcXHMqKSgnICsgbmFtZSArICcpPShbXjtdKiknKSk7XG4gICAgICAgICAgcmV0dXJuIChtYXRjaCA/IGRlY29kZVVSSUNvbXBvbmVudChtYXRjaFszXSkgOiBudWxsKTtcbiAgICAgICAgfSxcblxuICAgICAgICByZW1vdmU6IGZ1bmN0aW9uIHJlbW92ZShuYW1lKSB7XG4gICAgICAgICAgdGhpcy53cml0ZShuYW1lLCAnJywgRGF0ZS5ub3coKSAtIDg2NDAwMDAwKTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9KSgpIDpcblxuICAvLyBOb24gc3RhbmRhcmQgYnJvd3NlciBlbnYgKHdlYiB3b3JrZXJzLCByZWFjdC1uYXRpdmUpIGxhY2sgbmVlZGVkIHN1cHBvcnQuXG4gICAgKGZ1bmN0aW9uIG5vblN0YW5kYXJkQnJvd3NlckVudigpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHdyaXRlOiBmdW5jdGlvbiB3cml0ZSgpIHt9LFxuICAgICAgICByZWFkOiBmdW5jdGlvbiByZWFkKCkgeyByZXR1cm4gbnVsbDsgfSxcbiAgICAgICAgcmVtb3ZlOiBmdW5jdGlvbiByZW1vdmUoKSB7fVxuICAgICAgfTtcbiAgICB9KSgpXG4pO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIERldGVybWluZXMgd2hldGhlciB0aGUgc3BlY2lmaWVkIFVSTCBpcyBhYnNvbHV0ZVxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSB1cmwgVGhlIFVSTCB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB0aGUgc3BlY2lmaWVkIFVSTCBpcyBhYnNvbHV0ZSwgb3RoZXJ3aXNlIGZhbHNlXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaXNBYnNvbHV0ZVVSTCh1cmwpIHtcbiAgLy8gQSBVUkwgaXMgY29uc2lkZXJlZCBhYnNvbHV0ZSBpZiBpdCBiZWdpbnMgd2l0aCBcIjxzY2hlbWU+Oi8vXCIgb3IgXCIvL1wiIChwcm90b2NvbC1yZWxhdGl2ZSBVUkwpLlxuICAvLyBSRkMgMzk4NiBkZWZpbmVzIHNjaGVtZSBuYW1lIGFzIGEgc2VxdWVuY2Ugb2YgY2hhcmFjdGVycyBiZWdpbm5pbmcgd2l0aCBhIGxldHRlciBhbmQgZm9sbG93ZWRcbiAgLy8gYnkgYW55IGNvbWJpbmF0aW9uIG9mIGxldHRlcnMsIGRpZ2l0cywgcGx1cywgcGVyaW9kLCBvciBoeXBoZW4uXG4gIHJldHVybiAvXihbYS16XVthLXpcXGRcXCtcXC1cXC5dKjopP1xcL1xcLy9pLnRlc3QodXJsKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbi8qKlxuICogRGV0ZXJtaW5lcyB3aGV0aGVyIHRoZSBwYXlsb2FkIGlzIGFuIGVycm9yIHRocm93biBieSBBeGlvc1xuICpcbiAqIEBwYXJhbSB7Kn0gcGF5bG9hZCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdGhlIHBheWxvYWQgaXMgYW4gZXJyb3IgdGhyb3duIGJ5IEF4aW9zLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpc0F4aW9zRXJyb3IocGF5bG9hZCkge1xuICByZXR1cm4gKHR5cGVvZiBwYXlsb2FkID09PSAnb2JqZWN0JykgJiYgKHBheWxvYWQuaXNBeGlvc0Vycm9yID09PSB0cnVlKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlscyA9IHJlcXVpcmUoJy4vLi4vdXRpbHMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSAoXG4gIHV0aWxzLmlzU3RhbmRhcmRCcm93c2VyRW52KCkgP1xuXG4gIC8vIFN0YW5kYXJkIGJyb3dzZXIgZW52cyBoYXZlIGZ1bGwgc3VwcG9ydCBvZiB0aGUgQVBJcyBuZWVkZWQgdG8gdGVzdFxuICAvLyB3aGV0aGVyIHRoZSByZXF1ZXN0IFVSTCBpcyBvZiB0aGUgc2FtZSBvcmlnaW4gYXMgY3VycmVudCBsb2NhdGlvbi5cbiAgICAoZnVuY3Rpb24gc3RhbmRhcmRCcm93c2VyRW52KCkge1xuICAgICAgdmFyIG1zaWUgPSAvKG1zaWV8dHJpZGVudCkvaS50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpO1xuICAgICAgdmFyIHVybFBhcnNpbmdOb2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xuICAgICAgdmFyIG9yaWdpblVSTDtcblxuICAgICAgLyoqXG4gICAgKiBQYXJzZSBhIFVSTCB0byBkaXNjb3ZlciBpdCdzIGNvbXBvbmVudHNcbiAgICAqXG4gICAgKiBAcGFyYW0ge1N0cmluZ30gdXJsIFRoZSBVUkwgdG8gYmUgcGFyc2VkXG4gICAgKiBAcmV0dXJucyB7T2JqZWN0fVxuICAgICovXG4gICAgICBmdW5jdGlvbiByZXNvbHZlVVJMKHVybCkge1xuICAgICAgICB2YXIgaHJlZiA9IHVybDtcblxuICAgICAgICBpZiAobXNpZSkge1xuICAgICAgICAvLyBJRSBuZWVkcyBhdHRyaWJ1dGUgc2V0IHR3aWNlIHRvIG5vcm1hbGl6ZSBwcm9wZXJ0aWVzXG4gICAgICAgICAgdXJsUGFyc2luZ05vZGUuc2V0QXR0cmlidXRlKCdocmVmJywgaHJlZik7XG4gICAgICAgICAgaHJlZiA9IHVybFBhcnNpbmdOb2RlLmhyZWY7XG4gICAgICAgIH1cblxuICAgICAgICB1cmxQYXJzaW5nTm9kZS5zZXRBdHRyaWJ1dGUoJ2hyZWYnLCBocmVmKTtcblxuICAgICAgICAvLyB1cmxQYXJzaW5nTm9kZSBwcm92aWRlcyB0aGUgVXJsVXRpbHMgaW50ZXJmYWNlIC0gaHR0cDovL3VybC5zcGVjLndoYXR3Zy5vcmcvI3VybHV0aWxzXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgaHJlZjogdXJsUGFyc2luZ05vZGUuaHJlZixcbiAgICAgICAgICBwcm90b2NvbDogdXJsUGFyc2luZ05vZGUucHJvdG9jb2wgPyB1cmxQYXJzaW5nTm9kZS5wcm90b2NvbC5yZXBsYWNlKC86JC8sICcnKSA6ICcnLFxuICAgICAgICAgIGhvc3Q6IHVybFBhcnNpbmdOb2RlLmhvc3QsXG4gICAgICAgICAgc2VhcmNoOiB1cmxQYXJzaW5nTm9kZS5zZWFyY2ggPyB1cmxQYXJzaW5nTm9kZS5zZWFyY2gucmVwbGFjZSgvXlxcPy8sICcnKSA6ICcnLFxuICAgICAgICAgIGhhc2g6IHVybFBhcnNpbmdOb2RlLmhhc2ggPyB1cmxQYXJzaW5nTm9kZS5oYXNoLnJlcGxhY2UoL14jLywgJycpIDogJycsXG4gICAgICAgICAgaG9zdG5hbWU6IHVybFBhcnNpbmdOb2RlLmhvc3RuYW1lLFxuICAgICAgICAgIHBvcnQ6IHVybFBhcnNpbmdOb2RlLnBvcnQsXG4gICAgICAgICAgcGF0aG5hbWU6ICh1cmxQYXJzaW5nTm9kZS5wYXRobmFtZS5jaGFyQXQoMCkgPT09ICcvJykgP1xuICAgICAgICAgICAgdXJsUGFyc2luZ05vZGUucGF0aG5hbWUgOlxuICAgICAgICAgICAgJy8nICsgdXJsUGFyc2luZ05vZGUucGF0aG5hbWVcbiAgICAgICAgfTtcbiAgICAgIH1cblxuICAgICAgb3JpZ2luVVJMID0gcmVzb2x2ZVVSTCh3aW5kb3cubG9jYXRpb24uaHJlZik7XG5cbiAgICAgIC8qKlxuICAgICogRGV0ZXJtaW5lIGlmIGEgVVJMIHNoYXJlcyB0aGUgc2FtZSBvcmlnaW4gYXMgdGhlIGN1cnJlbnQgbG9jYXRpb25cbiAgICAqXG4gICAgKiBAcGFyYW0ge1N0cmluZ30gcmVxdWVzdFVSTCBUaGUgVVJMIHRvIHRlc3RcbiAgICAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIFVSTCBzaGFyZXMgdGhlIHNhbWUgb3JpZ2luLCBvdGhlcndpc2UgZmFsc2VcbiAgICAqL1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uIGlzVVJMU2FtZU9yaWdpbihyZXF1ZXN0VVJMKSB7XG4gICAgICAgIHZhciBwYXJzZWQgPSAodXRpbHMuaXNTdHJpbmcocmVxdWVzdFVSTCkpID8gcmVzb2x2ZVVSTChyZXF1ZXN0VVJMKSA6IHJlcXVlc3RVUkw7XG4gICAgICAgIHJldHVybiAocGFyc2VkLnByb3RvY29sID09PSBvcmlnaW5VUkwucHJvdG9jb2wgJiZcbiAgICAgICAgICAgIHBhcnNlZC5ob3N0ID09PSBvcmlnaW5VUkwuaG9zdCk7XG4gICAgICB9O1xuICAgIH0pKCkgOlxuXG4gIC8vIE5vbiBzdGFuZGFyZCBicm93c2VyIGVudnMgKHdlYiB3b3JrZXJzLCByZWFjdC1uYXRpdmUpIGxhY2sgbmVlZGVkIHN1cHBvcnQuXG4gICAgKGZ1bmN0aW9uIG5vblN0YW5kYXJkQnJvd3NlckVudigpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbiBpc1VSTFNhbWVPcmlnaW4oKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfTtcbiAgICB9KSgpXG4pO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLi91dGlscycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIG5vcm1hbGl6ZUhlYWRlck5hbWUoaGVhZGVycywgbm9ybWFsaXplZE5hbWUpIHtcbiAgdXRpbHMuZm9yRWFjaChoZWFkZXJzLCBmdW5jdGlvbiBwcm9jZXNzSGVhZGVyKHZhbHVlLCBuYW1lKSB7XG4gICAgaWYgKG5hbWUgIT09IG5vcm1hbGl6ZWROYW1lICYmIG5hbWUudG9VcHBlckNhc2UoKSA9PT0gbm9ybWFsaXplZE5hbWUudG9VcHBlckNhc2UoKSkge1xuICAgICAgaGVhZGVyc1tub3JtYWxpemVkTmFtZV0gPSB2YWx1ZTtcbiAgICAgIGRlbGV0ZSBoZWFkZXJzW25hbWVdO1xuICAgIH1cbiAgfSk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbHMgPSByZXF1aXJlKCcuLy4uL3V0aWxzJyk7XG5cbi8vIEhlYWRlcnMgd2hvc2UgZHVwbGljYXRlcyBhcmUgaWdub3JlZCBieSBub2RlXG4vLyBjLmYuIGh0dHBzOi8vbm9kZWpzLm9yZy9hcGkvaHR0cC5odG1sI2h0dHBfbWVzc2FnZV9oZWFkZXJzXG52YXIgaWdub3JlRHVwbGljYXRlT2YgPSBbXG4gICdhZ2UnLCAnYXV0aG9yaXphdGlvbicsICdjb250ZW50LWxlbmd0aCcsICdjb250ZW50LXR5cGUnLCAnZXRhZycsXG4gICdleHBpcmVzJywgJ2Zyb20nLCAnaG9zdCcsICdpZi1tb2RpZmllZC1zaW5jZScsICdpZi11bm1vZGlmaWVkLXNpbmNlJyxcbiAgJ2xhc3QtbW9kaWZpZWQnLCAnbG9jYXRpb24nLCAnbWF4LWZvcndhcmRzJywgJ3Byb3h5LWF1dGhvcml6YXRpb24nLFxuICAncmVmZXJlcicsICdyZXRyeS1hZnRlcicsICd1c2VyLWFnZW50J1xuXTtcblxuLyoqXG4gKiBQYXJzZSBoZWFkZXJzIGludG8gYW4gb2JqZWN0XG4gKlxuICogYGBgXG4gKiBEYXRlOiBXZWQsIDI3IEF1ZyAyMDE0IDA4OjU4OjQ5IEdNVFxuICogQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uXG4gKiBDb25uZWN0aW9uOiBrZWVwLWFsaXZlXG4gKiBUcmFuc2Zlci1FbmNvZGluZzogY2h1bmtlZFxuICogYGBgXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGhlYWRlcnMgSGVhZGVycyBuZWVkaW5nIHRvIGJlIHBhcnNlZFxuICogQHJldHVybnMge09iamVjdH0gSGVhZGVycyBwYXJzZWQgaW50byBhbiBvYmplY3RcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBwYXJzZUhlYWRlcnMoaGVhZGVycykge1xuICB2YXIgcGFyc2VkID0ge307XG4gIHZhciBrZXk7XG4gIHZhciB2YWw7XG4gIHZhciBpO1xuXG4gIGlmICghaGVhZGVycykgeyByZXR1cm4gcGFyc2VkOyB9XG5cbiAgdXRpbHMuZm9yRWFjaChoZWFkZXJzLnNwbGl0KCdcXG4nKSwgZnVuY3Rpb24gcGFyc2VyKGxpbmUpIHtcbiAgICBpID0gbGluZS5pbmRleE9mKCc6Jyk7XG4gICAga2V5ID0gdXRpbHMudHJpbShsaW5lLnN1YnN0cigwLCBpKSkudG9Mb3dlckNhc2UoKTtcbiAgICB2YWwgPSB1dGlscy50cmltKGxpbmUuc3Vic3RyKGkgKyAxKSk7XG5cbiAgICBpZiAoa2V5KSB7XG4gICAgICBpZiAocGFyc2VkW2tleV0gJiYgaWdub3JlRHVwbGljYXRlT2YuaW5kZXhPZihrZXkpID49IDApIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKGtleSA9PT0gJ3NldC1jb29raWUnKSB7XG4gICAgICAgIHBhcnNlZFtrZXldID0gKHBhcnNlZFtrZXldID8gcGFyc2VkW2tleV0gOiBbXSkuY29uY2F0KFt2YWxdKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHBhcnNlZFtrZXldID0gcGFyc2VkW2tleV0gPyBwYXJzZWRba2V5XSArICcsICcgKyB2YWwgOiB2YWw7XG4gICAgICB9XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4gcGFyc2VkO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBTeW50YWN0aWMgc3VnYXIgZm9yIGludm9raW5nIGEgZnVuY3Rpb24gYW5kIGV4cGFuZGluZyBhbiBhcnJheSBmb3IgYXJndW1lbnRzLlxuICpcbiAqIENvbW1vbiB1c2UgY2FzZSB3b3VsZCBiZSB0byB1c2UgYEZ1bmN0aW9uLnByb3RvdHlwZS5hcHBseWAuXG4gKlxuICogIGBgYGpzXG4gKiAgZnVuY3Rpb24gZih4LCB5LCB6KSB7fVxuICogIHZhciBhcmdzID0gWzEsIDIsIDNdO1xuICogIGYuYXBwbHkobnVsbCwgYXJncyk7XG4gKiAgYGBgXG4gKlxuICogV2l0aCBgc3ByZWFkYCB0aGlzIGV4YW1wbGUgY2FuIGJlIHJlLXdyaXR0ZW4uXG4gKlxuICogIGBgYGpzXG4gKiAgc3ByZWFkKGZ1bmN0aW9uKHgsIHksIHopIHt9KShbMSwgMiwgM10pO1xuICogIGBgYFxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259XG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gc3ByZWFkKGNhbGxiYWNrKSB7XG4gIHJldHVybiBmdW5jdGlvbiB3cmFwKGFycikge1xuICAgIHJldHVybiBjYWxsYmFjay5hcHBseShudWxsLCBhcnIpO1xuICB9O1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHBrZyA9IHJlcXVpcmUoJy4vLi4vLi4vcGFja2FnZS5qc29uJyk7XG5cbnZhciB2YWxpZGF0b3JzID0ge307XG5cbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBmdW5jLW5hbWVzXG5bJ29iamVjdCcsICdib29sZWFuJywgJ251bWJlcicsICdmdW5jdGlvbicsICdzdHJpbmcnLCAnc3ltYm9sJ10uZm9yRWFjaChmdW5jdGlvbih0eXBlLCBpKSB7XG4gIHZhbGlkYXRvcnNbdHlwZV0gPSBmdW5jdGlvbiB2YWxpZGF0b3IodGhpbmcpIHtcbiAgICByZXR1cm4gdHlwZW9mIHRoaW5nID09PSB0eXBlIHx8ICdhJyArIChpIDwgMSA/ICduICcgOiAnICcpICsgdHlwZTtcbiAgfTtcbn0pO1xuXG52YXIgZGVwcmVjYXRlZFdhcm5pbmdzID0ge307XG52YXIgY3VycmVudFZlckFyciA9IHBrZy52ZXJzaW9uLnNwbGl0KCcuJyk7XG5cbi8qKlxuICogQ29tcGFyZSBwYWNrYWdlIHZlcnNpb25zXG4gKiBAcGFyYW0ge3N0cmluZ30gdmVyc2lvblxuICogQHBhcmFtIHtzdHJpbmc/fSB0aGFuVmVyc2lvblxuICogQHJldHVybnMge2Jvb2xlYW59XG4gKi9cbmZ1bmN0aW9uIGlzT2xkZXJWZXJzaW9uKHZlcnNpb24sIHRoYW5WZXJzaW9uKSB7XG4gIHZhciBwa2dWZXJzaW9uQXJyID0gdGhhblZlcnNpb24gPyB0aGFuVmVyc2lvbi5zcGxpdCgnLicpIDogY3VycmVudFZlckFycjtcbiAgdmFyIGRlc3RWZXIgPSB2ZXJzaW9uLnNwbGl0KCcuJyk7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgMzsgaSsrKSB7XG4gICAgaWYgKHBrZ1ZlcnNpb25BcnJbaV0gPiBkZXN0VmVyW2ldKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGVsc2UgaWYgKHBrZ1ZlcnNpb25BcnJbaV0gPCBkZXN0VmVyW2ldKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG4gIHJldHVybiBmYWxzZTtcbn1cblxuLyoqXG4gKiBUcmFuc2l0aW9uYWwgb3B0aW9uIHZhbGlkYXRvclxuICogQHBhcmFtIHtmdW5jdGlvbnxib29sZWFuP30gdmFsaWRhdG9yXG4gKiBAcGFyYW0ge3N0cmluZz99IHZlcnNpb25cbiAqIEBwYXJhbSB7c3RyaW5nfSBtZXNzYWdlXG4gKiBAcmV0dXJucyB7ZnVuY3Rpb259XG4gKi9cbnZhbGlkYXRvcnMudHJhbnNpdGlvbmFsID0gZnVuY3Rpb24gdHJhbnNpdGlvbmFsKHZhbGlkYXRvciwgdmVyc2lvbiwgbWVzc2FnZSkge1xuICB2YXIgaXNEZXByZWNhdGVkID0gdmVyc2lvbiAmJiBpc09sZGVyVmVyc2lvbih2ZXJzaW9uKTtcblxuICBmdW5jdGlvbiBmb3JtYXRNZXNzYWdlKG9wdCwgZGVzYykge1xuICAgIHJldHVybiAnW0F4aW9zIHYnICsgcGtnLnZlcnNpb24gKyAnXSBUcmFuc2l0aW9uYWwgb3B0aW9uIFxcJycgKyBvcHQgKyAnXFwnJyArIGRlc2MgKyAobWVzc2FnZSA/ICcuICcgKyBtZXNzYWdlIDogJycpO1xuICB9XG5cbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGZ1bmMtbmFtZXNcbiAgcmV0dXJuIGZ1bmN0aW9uKHZhbHVlLCBvcHQsIG9wdHMpIHtcbiAgICBpZiAodmFsaWRhdG9yID09PSBmYWxzZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGZvcm1hdE1lc3NhZ2Uob3B0LCAnIGhhcyBiZWVuIHJlbW92ZWQgaW4gJyArIHZlcnNpb24pKTtcbiAgICB9XG5cbiAgICBpZiAoaXNEZXByZWNhdGVkICYmICFkZXByZWNhdGVkV2FybmluZ3Nbb3B0XSkge1xuICAgICAgZGVwcmVjYXRlZFdhcm5pbmdzW29wdF0gPSB0cnVlO1xuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnNvbGVcbiAgICAgIGNvbnNvbGUud2FybihcbiAgICAgICAgZm9ybWF0TWVzc2FnZShcbiAgICAgICAgICBvcHQsXG4gICAgICAgICAgJyBoYXMgYmVlbiBkZXByZWNhdGVkIHNpbmNlIHYnICsgdmVyc2lvbiArICcgYW5kIHdpbGwgYmUgcmVtb3ZlZCBpbiB0aGUgbmVhciBmdXR1cmUnXG4gICAgICAgIClcbiAgICAgICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHZhbGlkYXRvciA/IHZhbGlkYXRvcih2YWx1ZSwgb3B0LCBvcHRzKSA6IHRydWU7XG4gIH07XG59O1xuXG4vKipcbiAqIEFzc2VydCBvYmplY3QncyBwcm9wZXJ0aWVzIHR5cGVcbiAqIEBwYXJhbSB7b2JqZWN0fSBvcHRpb25zXG4gKiBAcGFyYW0ge29iamVjdH0gc2NoZW1hXG4gKiBAcGFyYW0ge2Jvb2xlYW4/fSBhbGxvd1Vua25vd25cbiAqL1xuXG5mdW5jdGlvbiBhc3NlcnRPcHRpb25zKG9wdGlvbnMsIHNjaGVtYSwgYWxsb3dVbmtub3duKSB7XG4gIGlmICh0eXBlb2Ygb3B0aW9ucyAhPT0gJ29iamVjdCcpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdvcHRpb25zIG11c3QgYmUgYW4gb2JqZWN0Jyk7XG4gIH1cbiAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhvcHRpb25zKTtcbiAgdmFyIGkgPSBrZXlzLmxlbmd0aDtcbiAgd2hpbGUgKGktLSA+IDApIHtcbiAgICB2YXIgb3B0ID0ga2V5c1tpXTtcbiAgICB2YXIgdmFsaWRhdG9yID0gc2NoZW1hW29wdF07XG4gICAgaWYgKHZhbGlkYXRvcikge1xuICAgICAgdmFyIHZhbHVlID0gb3B0aW9uc1tvcHRdO1xuICAgICAgdmFyIHJlc3VsdCA9IHZhbHVlID09PSB1bmRlZmluZWQgfHwgdmFsaWRhdG9yKHZhbHVlLCBvcHQsIG9wdGlvbnMpO1xuICAgICAgaWYgKHJlc3VsdCAhPT0gdHJ1ZSkge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdvcHRpb24gJyArIG9wdCArICcgbXVzdCBiZSAnICsgcmVzdWx0KTtcbiAgICAgIH1cbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgICBpZiAoYWxsb3dVbmtub3duICE9PSB0cnVlKSB7XG4gICAgICB0aHJvdyBFcnJvcignVW5rbm93biBvcHRpb24gJyArIG9wdCk7XG4gICAgfVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBpc09sZGVyVmVyc2lvbjogaXNPbGRlclZlcnNpb24sXG4gIGFzc2VydE9wdGlvbnM6IGFzc2VydE9wdGlvbnMsXG4gIHZhbGlkYXRvcnM6IHZhbGlkYXRvcnNcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBiaW5kID0gcmVxdWlyZSgnLi9oZWxwZXJzL2JpbmQnKTtcblxuLy8gdXRpbHMgaXMgYSBsaWJyYXJ5IG9mIGdlbmVyaWMgaGVscGVyIGZ1bmN0aW9ucyBub24tc3BlY2lmaWMgdG8gYXhpb3NcblxudmFyIHRvU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztcblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhbiBBcnJheVxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGFuIEFycmF5LCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNBcnJheSh2YWwpIHtcbiAgcmV0dXJuIHRvU3RyaW5nLmNhbGwodmFsKSA9PT0gJ1tvYmplY3QgQXJyYXldJztcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyB1bmRlZmluZWRcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB0aGUgdmFsdWUgaXMgdW5kZWZpbmVkLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNVbmRlZmluZWQodmFsKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsID09PSAndW5kZWZpbmVkJztcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIEJ1ZmZlclxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgQnVmZmVyLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNCdWZmZXIodmFsKSB7XG4gIHJldHVybiB2YWwgIT09IG51bGwgJiYgIWlzVW5kZWZpbmVkKHZhbCkgJiYgdmFsLmNvbnN0cnVjdG9yICE9PSBudWxsICYmICFpc1VuZGVmaW5lZCh2YWwuY29uc3RydWN0b3IpXG4gICAgJiYgdHlwZW9mIHZhbC5jb25zdHJ1Y3Rvci5pc0J1ZmZlciA9PT0gJ2Z1bmN0aW9uJyAmJiB2YWwuY29uc3RydWN0b3IuaXNCdWZmZXIodmFsKTtcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhbiBBcnJheUJ1ZmZlclxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGFuIEFycmF5QnVmZmVyLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNBcnJheUJ1ZmZlcih2YWwpIHtcbiAgcmV0dXJuIHRvU3RyaW5nLmNhbGwodmFsKSA9PT0gJ1tvYmplY3QgQXJyYXlCdWZmZXJdJztcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIEZvcm1EYXRhXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYW4gRm9ybURhdGEsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0Zvcm1EYXRhKHZhbCkge1xuICByZXR1cm4gKHR5cGVvZiBGb3JtRGF0YSAhPT0gJ3VuZGVmaW5lZCcpICYmICh2YWwgaW5zdGFuY2VvZiBGb3JtRGF0YSk7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSB2aWV3IG9uIGFuIEFycmF5QnVmZmVyXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSB2aWV3IG9uIGFuIEFycmF5QnVmZmVyLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNBcnJheUJ1ZmZlclZpZXcodmFsKSB7XG4gIHZhciByZXN1bHQ7XG4gIGlmICgodHlwZW9mIEFycmF5QnVmZmVyICE9PSAndW5kZWZpbmVkJykgJiYgKEFycmF5QnVmZmVyLmlzVmlldykpIHtcbiAgICByZXN1bHQgPSBBcnJheUJ1ZmZlci5pc1ZpZXcodmFsKTtcbiAgfSBlbHNlIHtcbiAgICByZXN1bHQgPSAodmFsKSAmJiAodmFsLmJ1ZmZlcikgJiYgKHZhbC5idWZmZXIgaW5zdGFuY2VvZiBBcnJheUJ1ZmZlcik7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIFN0cmluZ1xuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgU3RyaW5nLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNTdHJpbmcodmFsKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsID09PSAnc3RyaW5nJztcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIE51bWJlclxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgTnVtYmVyLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNOdW1iZXIodmFsKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsID09PSAnbnVtYmVyJztcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhbiBPYmplY3RcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB2YWx1ZSBpcyBhbiBPYmplY3QsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc09iamVjdCh2YWwpIHtcbiAgcmV0dXJuIHZhbCAhPT0gbnVsbCAmJiB0eXBlb2YgdmFsID09PSAnb2JqZWN0Jztcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSB2YWx1ZSBpcyBhIHBsYWluIE9iamVjdFxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm4ge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBwbGFpbiBPYmplY3QsIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc1BsYWluT2JqZWN0KHZhbCkge1xuICBpZiAodG9TdHJpbmcuY2FsbCh2YWwpICE9PSAnW29iamVjdCBPYmplY3RdJykge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHZhciBwcm90b3R5cGUgPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YodmFsKTtcbiAgcmV0dXJuIHByb3RvdHlwZSA9PT0gbnVsbCB8fCBwcm90b3R5cGUgPT09IE9iamVjdC5wcm90b3R5cGU7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBEYXRlXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBEYXRlLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNEYXRlKHZhbCkge1xuICByZXR1cm4gdG9TdHJpbmcuY2FsbCh2YWwpID09PSAnW29iamVjdCBEYXRlXSc7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBGaWxlXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBGaWxlLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNGaWxlKHZhbCkge1xuICByZXR1cm4gdG9TdHJpbmcuY2FsbCh2YWwpID09PSAnW29iamVjdCBGaWxlXSc7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBCbG9iXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBCbG9iLCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNCbG9iKHZhbCkge1xuICByZXR1cm4gdG9TdHJpbmcuY2FsbCh2YWwpID09PSAnW29iamVjdCBCbG9iXSc7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBGdW5jdGlvblxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHZhbHVlIGlzIGEgRnVuY3Rpb24sIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0Z1bmN0aW9uKHZhbCkge1xuICByZXR1cm4gdG9TdHJpbmcuY2FsbCh2YWwpID09PSAnW29iamVjdCBGdW5jdGlvbl0nO1xufVxuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHZhbHVlIGlzIGEgU3RyZWFtXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBTdHJlYW0sIG90aGVyd2lzZSBmYWxzZVxuICovXG5mdW5jdGlvbiBpc1N0cmVhbSh2YWwpIHtcbiAgcmV0dXJuIGlzT2JqZWN0KHZhbCkgJiYgaXNGdW5jdGlvbih2YWwucGlwZSk7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgdmFsdWUgaXMgYSBVUkxTZWFyY2hQYXJhbXMgb2JqZWN0XG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdmFsdWUgaXMgYSBVUkxTZWFyY2hQYXJhbXMgb2JqZWN0LCBvdGhlcndpc2UgZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNVUkxTZWFyY2hQYXJhbXModmFsKSB7XG4gIHJldHVybiB0eXBlb2YgVVJMU2VhcmNoUGFyYW1zICE9PSAndW5kZWZpbmVkJyAmJiB2YWwgaW5zdGFuY2VvZiBVUkxTZWFyY2hQYXJhbXM7XG59XG5cbi8qKlxuICogVHJpbSBleGNlc3Mgd2hpdGVzcGFjZSBvZmYgdGhlIGJlZ2lubmluZyBhbmQgZW5kIG9mIGEgc3RyaW5nXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0ciBUaGUgU3RyaW5nIHRvIHRyaW1cbiAqIEByZXR1cm5zIHtTdHJpbmd9IFRoZSBTdHJpbmcgZnJlZWQgb2YgZXhjZXNzIHdoaXRlc3BhY2VcbiAqL1xuZnVuY3Rpb24gdHJpbShzdHIpIHtcbiAgcmV0dXJuIHN0ci50cmltID8gc3RyLnRyaW0oKSA6IHN0ci5yZXBsYWNlKC9eXFxzK3xcXHMrJC9nLCAnJyk7XG59XG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIHdlJ3JlIHJ1bm5pbmcgaW4gYSBzdGFuZGFyZCBicm93c2VyIGVudmlyb25tZW50XG4gKlxuICogVGhpcyBhbGxvd3MgYXhpb3MgdG8gcnVuIGluIGEgd2ViIHdvcmtlciwgYW5kIHJlYWN0LW5hdGl2ZS5cbiAqIEJvdGggZW52aXJvbm1lbnRzIHN1cHBvcnQgWE1MSHR0cFJlcXVlc3QsIGJ1dCBub3QgZnVsbHkgc3RhbmRhcmQgZ2xvYmFscy5cbiAqXG4gKiB3ZWIgd29ya2VyczpcbiAqICB0eXBlb2Ygd2luZG93IC0+IHVuZGVmaW5lZFxuICogIHR5cGVvZiBkb2N1bWVudCAtPiB1bmRlZmluZWRcbiAqXG4gKiByZWFjdC1uYXRpdmU6XG4gKiAgbmF2aWdhdG9yLnByb2R1Y3QgLT4gJ1JlYWN0TmF0aXZlJ1xuICogbmF0aXZlc2NyaXB0XG4gKiAgbmF2aWdhdG9yLnByb2R1Y3QgLT4gJ05hdGl2ZVNjcmlwdCcgb3IgJ05TJ1xuICovXG5mdW5jdGlvbiBpc1N0YW5kYXJkQnJvd3NlckVudigpIHtcbiAgaWYgKHR5cGVvZiBuYXZpZ2F0b3IgIT09ICd1bmRlZmluZWQnICYmIChuYXZpZ2F0b3IucHJvZHVjdCA9PT0gJ1JlYWN0TmF0aXZlJyB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hdmlnYXRvci5wcm9kdWN0ID09PSAnTmF0aXZlU2NyaXB0JyB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hdmlnYXRvci5wcm9kdWN0ID09PSAnTlMnKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICByZXR1cm4gKFxuICAgIHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmXG4gICAgdHlwZW9mIGRvY3VtZW50ICE9PSAndW5kZWZpbmVkJ1xuICApO1xufVxuXG4vKipcbiAqIEl0ZXJhdGUgb3ZlciBhbiBBcnJheSBvciBhbiBPYmplY3QgaW52b2tpbmcgYSBmdW5jdGlvbiBmb3IgZWFjaCBpdGVtLlxuICpcbiAqIElmIGBvYmpgIGlzIGFuIEFycmF5IGNhbGxiYWNrIHdpbGwgYmUgY2FsbGVkIHBhc3NpbmdcbiAqIHRoZSB2YWx1ZSwgaW5kZXgsIGFuZCBjb21wbGV0ZSBhcnJheSBmb3IgZWFjaCBpdGVtLlxuICpcbiAqIElmICdvYmonIGlzIGFuIE9iamVjdCBjYWxsYmFjayB3aWxsIGJlIGNhbGxlZCBwYXNzaW5nXG4gKiB0aGUgdmFsdWUsIGtleSwgYW5kIGNvbXBsZXRlIG9iamVjdCBmb3IgZWFjaCBwcm9wZXJ0eS5cbiAqXG4gKiBAcGFyYW0ge09iamVjdHxBcnJheX0gb2JqIFRoZSBvYmplY3QgdG8gaXRlcmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIGNhbGxiYWNrIHRvIGludm9rZSBmb3IgZWFjaCBpdGVtXG4gKi9cbmZ1bmN0aW9uIGZvckVhY2gob2JqLCBmbikge1xuICAvLyBEb24ndCBib3RoZXIgaWYgbm8gdmFsdWUgcHJvdmlkZWRcbiAgaWYgKG9iaiA9PT0gbnVsbCB8fCB0eXBlb2Ygb2JqID09PSAndW5kZWZpbmVkJykge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIC8vIEZvcmNlIGFuIGFycmF5IGlmIG5vdCBhbHJlYWR5IHNvbWV0aGluZyBpdGVyYWJsZVxuICBpZiAodHlwZW9mIG9iaiAhPT0gJ29iamVjdCcpIHtcbiAgICAvKmVzbGludCBuby1wYXJhbS1yZWFzc2lnbjowKi9cbiAgICBvYmogPSBbb2JqXTtcbiAgfVxuXG4gIGlmIChpc0FycmF5KG9iaikpIHtcbiAgICAvLyBJdGVyYXRlIG92ZXIgYXJyYXkgdmFsdWVzXG4gICAgZm9yICh2YXIgaSA9IDAsIGwgPSBvYmoubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICBmbi5jYWxsKG51bGwsIG9ialtpXSwgaSwgb2JqKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgLy8gSXRlcmF0ZSBvdmVyIG9iamVjdCBrZXlzXG4gICAgZm9yICh2YXIga2V5IGluIG9iaikge1xuICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGtleSkpIHtcbiAgICAgICAgZm4uY2FsbChudWxsLCBvYmpba2V5XSwga2V5LCBvYmopO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIEFjY2VwdHMgdmFyYXJncyBleHBlY3RpbmcgZWFjaCBhcmd1bWVudCB0byBiZSBhbiBvYmplY3QsIHRoZW5cbiAqIGltbXV0YWJseSBtZXJnZXMgdGhlIHByb3BlcnRpZXMgb2YgZWFjaCBvYmplY3QgYW5kIHJldHVybnMgcmVzdWx0LlxuICpcbiAqIFdoZW4gbXVsdGlwbGUgb2JqZWN0cyBjb250YWluIHRoZSBzYW1lIGtleSB0aGUgbGF0ZXIgb2JqZWN0IGluXG4gKiB0aGUgYXJndW1lbnRzIGxpc3Qgd2lsbCB0YWtlIHByZWNlZGVuY2UuXG4gKlxuICogRXhhbXBsZTpcbiAqXG4gKiBgYGBqc1xuICogdmFyIHJlc3VsdCA9IG1lcmdlKHtmb286IDEyM30sIHtmb286IDQ1Nn0pO1xuICogY29uc29sZS5sb2cocmVzdWx0LmZvbyk7IC8vIG91dHB1dHMgNDU2XG4gKiBgYGBcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqMSBPYmplY3QgdG8gbWVyZ2VcbiAqIEByZXR1cm5zIHtPYmplY3R9IFJlc3VsdCBvZiBhbGwgbWVyZ2UgcHJvcGVydGllc1xuICovXG5mdW5jdGlvbiBtZXJnZSgvKiBvYmoxLCBvYmoyLCBvYmozLCAuLi4gKi8pIHtcbiAgdmFyIHJlc3VsdCA9IHt9O1xuICBmdW5jdGlvbiBhc3NpZ25WYWx1ZSh2YWwsIGtleSkge1xuICAgIGlmIChpc1BsYWluT2JqZWN0KHJlc3VsdFtrZXldKSAmJiBpc1BsYWluT2JqZWN0KHZhbCkpIHtcbiAgICAgIHJlc3VsdFtrZXldID0gbWVyZ2UocmVzdWx0W2tleV0sIHZhbCk7XG4gICAgfSBlbHNlIGlmIChpc1BsYWluT2JqZWN0KHZhbCkpIHtcbiAgICAgIHJlc3VsdFtrZXldID0gbWVyZ2Uoe30sIHZhbCk7XG4gICAgfSBlbHNlIGlmIChpc0FycmF5KHZhbCkpIHtcbiAgICAgIHJlc3VsdFtrZXldID0gdmFsLnNsaWNlKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlc3VsdFtrZXldID0gdmFsO1xuICAgIH1cbiAgfVxuXG4gIGZvciAodmFyIGkgPSAwLCBsID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgIGZvckVhY2goYXJndW1lbnRzW2ldLCBhc3NpZ25WYWx1ZSk7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBFeHRlbmRzIG9iamVjdCBhIGJ5IG11dGFibHkgYWRkaW5nIHRvIGl0IHRoZSBwcm9wZXJ0aWVzIG9mIG9iamVjdCBiLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBhIFRoZSBvYmplY3QgdG8gYmUgZXh0ZW5kZWRcbiAqIEBwYXJhbSB7T2JqZWN0fSBiIFRoZSBvYmplY3QgdG8gY29weSBwcm9wZXJ0aWVzIGZyb21cbiAqIEBwYXJhbSB7T2JqZWN0fSB0aGlzQXJnIFRoZSBvYmplY3QgdG8gYmluZCBmdW5jdGlvbiB0b1xuICogQHJldHVybiB7T2JqZWN0fSBUaGUgcmVzdWx0aW5nIHZhbHVlIG9mIG9iamVjdCBhXG4gKi9cbmZ1bmN0aW9uIGV4dGVuZChhLCBiLCB0aGlzQXJnKSB7XG4gIGZvckVhY2goYiwgZnVuY3Rpb24gYXNzaWduVmFsdWUodmFsLCBrZXkpIHtcbiAgICBpZiAodGhpc0FyZyAmJiB0eXBlb2YgdmFsID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBhW2tleV0gPSBiaW5kKHZhbCwgdGhpc0FyZyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFba2V5XSA9IHZhbDtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gYTtcbn1cblxuLyoqXG4gKiBSZW1vdmUgYnl0ZSBvcmRlciBtYXJrZXIuIFRoaXMgY2F0Y2hlcyBFRiBCQiBCRiAodGhlIFVURi04IEJPTSlcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gY29udGVudCB3aXRoIEJPTVxuICogQHJldHVybiB7c3RyaW5nfSBjb250ZW50IHZhbHVlIHdpdGhvdXQgQk9NXG4gKi9cbmZ1bmN0aW9uIHN0cmlwQk9NKGNvbnRlbnQpIHtcbiAgaWYgKGNvbnRlbnQuY2hhckNvZGVBdCgwKSA9PT0gMHhGRUZGKSB7XG4gICAgY29udGVudCA9IGNvbnRlbnQuc2xpY2UoMSk7XG4gIH1cbiAgcmV0dXJuIGNvbnRlbnQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBpc0FycmF5OiBpc0FycmF5LFxuICBpc0FycmF5QnVmZmVyOiBpc0FycmF5QnVmZmVyLFxuICBpc0J1ZmZlcjogaXNCdWZmZXIsXG4gIGlzRm9ybURhdGE6IGlzRm9ybURhdGEsXG4gIGlzQXJyYXlCdWZmZXJWaWV3OiBpc0FycmF5QnVmZmVyVmlldyxcbiAgaXNTdHJpbmc6IGlzU3RyaW5nLFxuICBpc051bWJlcjogaXNOdW1iZXIsXG4gIGlzT2JqZWN0OiBpc09iamVjdCxcbiAgaXNQbGFpbk9iamVjdDogaXNQbGFpbk9iamVjdCxcbiAgaXNVbmRlZmluZWQ6IGlzVW5kZWZpbmVkLFxuICBpc0RhdGU6IGlzRGF0ZSxcbiAgaXNGaWxlOiBpc0ZpbGUsXG4gIGlzQmxvYjogaXNCbG9iLFxuICBpc0Z1bmN0aW9uOiBpc0Z1bmN0aW9uLFxuICBpc1N0cmVhbTogaXNTdHJlYW0sXG4gIGlzVVJMU2VhcmNoUGFyYW1zOiBpc1VSTFNlYXJjaFBhcmFtcyxcbiAgaXNTdGFuZGFyZEJyb3dzZXJFbnY6IGlzU3RhbmRhcmRCcm93c2VyRW52LFxuICBmb3JFYWNoOiBmb3JFYWNoLFxuICBtZXJnZTogbWVyZ2UsXG4gIGV4dGVuZDogZXh0ZW5kLFxuICB0cmltOiB0cmltLFxuICBzdHJpcEJPTTogc3RyaXBCT01cbn07XG4iLCIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW5cbmV4cG9ydCB7fTsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbl9fd2VicGFja19yZXF1aXJlX18ubiA9IChtb2R1bGUpID0+IHtcblx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG5cdFx0KCkgPT4gKG1vZHVsZVsnZGVmYXVsdCddKSA6XG5cdFx0KCkgPT4gKG1vZHVsZSk7XG5cdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsIHsgYTogZ2V0dGVyIH0pO1xuXHRyZXR1cm4gZ2V0dGVyO1xufTsiLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IGF4aW9zIGZyb20gJ2F4aW9zJztcbmltcG9ydCAnLi9zdHlsZXMuc2Nzcyc7XG5cbi8vIERPTSBFbGVtZW50c1xuY29uc3QgYWxsQ2VsbHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuY2VsbDpub3QoLnJvdy10b3ApJyk7XG5jb25zdCB0b3BDZWxscyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5jZWxsLnJvdy10b3AnKTtcbmNvbnN0IHJlc2V0QnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnJlc2V0Jyk7XG5jb25zdCBzdGF0dXNTcGFuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnN0YXR1cycpO1xuXG4vLyBjb2x1bW5zXG5jb25zdCBjb2x1bW4wID0gW1xuXHRhbGxDZWxsc1szNV0sXG5cdGFsbENlbGxzWzI4XSxcblx0YWxsQ2VsbHNbMjFdLFxuXHRhbGxDZWxsc1sxNF0sXG5cdGFsbENlbGxzWzddLFxuXHRhbGxDZWxsc1swXSxcblx0dG9wQ2VsbHNbMF0sXG5dO1xuY29uc3QgY29sdW1uMSA9IFtcblx0YWxsQ2VsbHNbMzZdLFxuXHRhbGxDZWxsc1syOV0sXG5cdGFsbENlbGxzWzIyXSxcblx0YWxsQ2VsbHNbMTVdLFxuXHRhbGxDZWxsc1s4XSxcblx0YWxsQ2VsbHNbMV0sXG5cdHRvcENlbGxzWzFdLFxuXTtcbmNvbnN0IGNvbHVtbjIgPSBbXG5cdGFsbENlbGxzWzM3XSxcblx0YWxsQ2VsbHNbMzBdLFxuXHRhbGxDZWxsc1syM10sXG5cdGFsbENlbGxzWzE2XSxcblx0YWxsQ2VsbHNbOV0sXG5cdGFsbENlbGxzWzJdLFxuXHR0b3BDZWxsc1syXSxcbl07XG5jb25zdCBjb2x1bW4zID0gW1xuXHRhbGxDZWxsc1szOF0sXG5cdGFsbENlbGxzWzMxXSxcblx0YWxsQ2VsbHNbMjRdLFxuXHRhbGxDZWxsc1sxN10sXG5cdGFsbENlbGxzWzEwXSxcblx0YWxsQ2VsbHNbM10sXG5cdHRvcENlbGxzWzNdLFxuXTtcbmNvbnN0IGNvbHVtbjQgPSBbXG5cdGFsbENlbGxzWzM5XSxcblx0YWxsQ2VsbHNbMzJdLFxuXHRhbGxDZWxsc1syNV0sXG5cdGFsbENlbGxzWzE4XSxcblx0YWxsQ2VsbHNbMTFdLFxuXHRhbGxDZWxsc1s0XSxcblx0dG9wQ2VsbHNbNF0sXG5dO1xuY29uc3QgY29sdW1uNSA9IFtcblx0YWxsQ2VsbHNbNDBdLFxuXHRhbGxDZWxsc1szM10sXG5cdGFsbENlbGxzWzI2XSxcblx0YWxsQ2VsbHNbMTldLFxuXHRhbGxDZWxsc1sxMl0sXG5cdGFsbENlbGxzWzVdLFxuXHR0b3BDZWxsc1s1XSxcbl07XG5jb25zdCBjb2x1bW42ID0gW1xuXHRhbGxDZWxsc1s0MV0sXG5cdGFsbENlbGxzWzM0XSxcblx0YWxsQ2VsbHNbMjddLFxuXHRhbGxDZWxsc1syMF0sXG5cdGFsbENlbGxzWzEzXSxcblx0YWxsQ2VsbHNbNl0sXG5cdHRvcENlbGxzWzZdLFxuXTtcbmNvbnN0IGNvbHVtbnMgPSBbY29sdW1uMCwgY29sdW1uMSwgY29sdW1uMiwgY29sdW1uMywgY29sdW1uNCwgY29sdW1uNSwgY29sdW1uNl07XG5cbi8vIHJvd3NcbmNvbnN0IHRvcFJvdyA9IFtcblx0dG9wQ2VsbHNbMF0sXG5cdHRvcENlbGxzWzFdLFxuXHR0b3BDZWxsc1syXSxcblx0dG9wQ2VsbHNbM10sXG5cdHRvcENlbGxzWzRdLFxuXHR0b3BDZWxsc1s1XSxcblx0dG9wQ2VsbHNbNl0sXG5dO1xuY29uc3Qgcm93MCA9IFtcblx0YWxsQ2VsbHNbMF0sXG5cdGFsbENlbGxzWzFdLFxuXHRhbGxDZWxsc1syXSxcblx0YWxsQ2VsbHNbM10sXG5cdGFsbENlbGxzWzRdLFxuXHRhbGxDZWxsc1s1XSxcblx0YWxsQ2VsbHNbNl0sXG5dO1xuY29uc3Qgcm93MSA9IFtcblx0YWxsQ2VsbHNbN10sXG5cdGFsbENlbGxzWzhdLFxuXHRhbGxDZWxsc1s5XSxcblx0YWxsQ2VsbHNbMTBdLFxuXHRhbGxDZWxsc1sxMV0sXG5cdGFsbENlbGxzWzEyXSxcblx0YWxsQ2VsbHNbMTNdLFxuXTtcbmNvbnN0IHJvdzIgPSBbXG5cdGFsbENlbGxzWzE0XSxcblx0YWxsQ2VsbHNbMTVdLFxuXHRhbGxDZWxsc1sxNl0sXG5cdGFsbENlbGxzWzE3XSxcblx0YWxsQ2VsbHNbMThdLFxuXHRhbGxDZWxsc1sxOV0sXG5cdGFsbENlbGxzWzIwXSxcbl07XG5jb25zdCByb3czID0gW1xuXHRhbGxDZWxsc1syMV0sXG5cdGFsbENlbGxzWzIyXSxcblx0YWxsQ2VsbHNbMjNdLFxuXHRhbGxDZWxsc1syNF0sXG5cdGFsbENlbGxzWzI1XSxcblx0YWxsQ2VsbHNbMjZdLFxuXHRhbGxDZWxsc1syN10sXG5dO1xuY29uc3Qgcm93NCA9IFtcblx0YWxsQ2VsbHNbMjhdLFxuXHRhbGxDZWxsc1syOV0sXG5cdGFsbENlbGxzWzMwXSxcblx0YWxsQ2VsbHNbMzFdLFxuXHRhbGxDZWxsc1szMl0sXG5cdGFsbENlbGxzWzMzXSxcblx0YWxsQ2VsbHNbMzRdLFxuXTtcbmNvbnN0IHJvdzUgPSBbXG5cdGFsbENlbGxzWzM1XSxcblx0YWxsQ2VsbHNbMzZdLFxuXHRhbGxDZWxsc1szN10sXG5cdGFsbENlbGxzWzM4XSxcblx0YWxsQ2VsbHNbMzldLFxuXHRhbGxDZWxsc1s0MF0sXG5cdGFsbENlbGxzWzQxXSxcbl07XG5jb25zdCByb3dzID0gW3JvdzAsIHJvdzEsIHJvdzIsIHJvdzMsIHJvdzQsIHJvdzUsIHRvcFJvd107XG5cbi8vIHZhcmlhYmxlc1xubGV0IGdhbWVJc0xpdmUgPSB0cnVlO1xubGV0IHllbGxvd0lzTmV4dCA9IHRydWU7XG5cbi8vIEZ1bmN0aW9uc1xuY29uc3QgZ2V0Q2xhc3NMaXN0QXJyYXkgPSAoY2VsbCkgPT4ge1xuXHRjb25zdCBjbGFzc0xpc3QgPSBjZWxsLmNsYXNzTGlzdDtcblx0cmV0dXJuIFsuLi5jbGFzc0xpc3RdO1xufTtcblxuY29uc3QgZ2V0Q2VsbExvY2F0aW9uID0gKGNlbGwpID0+IHtcblx0Y29uc3QgY2xhc3NMaXN0ID0gZ2V0Q2xhc3NMaXN0QXJyYXkoY2VsbCk7XG5cblx0Y29uc3Qgcm93Q2xhc3MgPSBjbGFzc0xpc3QuZmluZCgoY2xhc3NOYW1lKSA9PiBjbGFzc05hbWUuaW5jbHVkZXMoJ3JvdycpKTtcblx0Y29uc3QgY29sQ2xhc3MgPSBjbGFzc0xpc3QuZmluZCgoY2xhc3NOYW1lKSA9PiBjbGFzc05hbWUuaW5jbHVkZXMoJ2NvbCcpKTtcblx0Y29uc3Qgcm93SW5kZXggPSByb3dDbGFzc1s0XTtcblx0Y29uc3QgY29sSW5kZXggPSBjb2xDbGFzc1s0XTtcblx0Y29uc3Qgcm93TnVtYmVyID0gcGFyc2VJbnQocm93SW5kZXgsIDEwKTtcblx0Y29uc3QgY29sTnVtYmVyID0gcGFyc2VJbnQoY29sSW5kZXgsIDEwKTtcblx0cmV0dXJuIFtyb3dOdW1iZXIsIGNvbE51bWJlcl07XG59O1xuXG5jb25zdCBnZXRGaXJzdE9wZW5DZWxsRm9yQ29sdW1uID0gKGNvbEluZGV4KSA9PiB7XG5cdGNvbnN0IGNvbHVtbiA9IGNvbHVtbnNbY29sSW5kZXhdO1xuXHRjb25zdCBjb2x1bW5XaXRob3V0VG9wID0gY29sdW1uLnNsaWNlKDAsIDYpO1xuXG5cdGZvciAoY29uc3QgY2VsbCBvZiBjb2x1bW5XaXRob3V0VG9wKSB7XG5cdFx0Y29uc3QgY2xhc3NMaXN0ID0gZ2V0Q2xhc3NMaXN0QXJyYXkoY2VsbCk7XG5cdFx0aWYgKCFjbGFzc0xpc3QuaW5jbHVkZXMoJ3llbGxvdycpICYmICFjbGFzc0xpc3QuaW5jbHVkZXMoJ3JlZCcpKSB7XG5cdFx0XHRyZXR1cm4gY2VsbDtcblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gbnVsbDtcbn07XG5cbmNvbnN0IGNsZWFyQ29sb3JGcm9tVG9wID0gKGNvbEluZGV4KSA9PiB7XG5cdGNvbnN0IHRvcENlbGwgPSB0b3BDZWxsc1tjb2xJbmRleF07XG5cdHRvcENlbGwuY2xhc3NMaXN0LnJlbW92ZSgneWVsbG93Jyk7XG5cdHRvcENlbGwuY2xhc3NMaXN0LnJlbW92ZSgncmVkJyk7XG59O1xuXG5jb25zdCBnZXRDb2xvck9mQ2VsbCA9IChjZWxsKSA9PiB7XG5cdGNvbnN0IGNsYXNzTGlzdCA9IGdldENsYXNzTGlzdEFycmF5KGNlbGwpO1xuXHRpZiAoY2xhc3NMaXN0LmluY2x1ZGVzKCd5ZWxsb3cnKSkgcmV0dXJuICd5ZWxsb3cnO1xuXHRpZiAoY2xhc3NMaXN0LmluY2x1ZGVzKCdyZWQnKSkgcmV0dXJuICdyZWQnO1xuXHRyZXR1cm4gbnVsbDtcbn07XG5cbmNvbnN0IGNoZWNrV2lubmluZ0NlbGxzID0gKGNlbGxzKSA9PiB7XG5cdGlmIChjZWxscy5sZW5ndGggPCA0KSByZXR1cm4gZmFsc2U7XG5cblx0Z2FtZUlzTGl2ZSA9IGZhbHNlO1xuXHRmb3IgKGNvbnN0IGNlbGwgb2YgY2VsbHMpIHtcblx0XHRjZWxsLmNsYXNzTGlzdC5hZGQoJ3dpbicpO1xuXHR9XG5cdHN0YXR1c1NwYW4udGV4dENvbnRlbnQgPSBgJHt5ZWxsb3dJc05leHQgPyAnWWVsbG93JyA6ICdSZWQnfSBoYXMgd29uIWA7XG5cdHJldHVybiB0cnVlO1xufTtcblxuY29uc3QgY2hlY2tTdGF0dXNPZkdhbWUgPSAoY2VsbCkgPT4ge1xuXHRjb25zdCBjb2xvciA9IGdldENvbG9yT2ZDZWxsKGNlbGwpO1xuXHRpZiAoIWNvbG9yKSByZXR1cm47XG5cdGNvbnN0IFtyb3dJbmRleCwgY29sSW5kZXhdID0gZ2V0Q2VsbExvY2F0aW9uKGNlbGwpO1xuXG5cdC8vIENoZWNrIGhvcml6b250YWxseVxuXHRsZXQgd2lubmluZ0NlbGxzID0gW2NlbGxdO1xuXHRsZXQgcm93VG9DaGVjayA9IHJvd0luZGV4O1xuXHRsZXQgY29sVG9DaGVjayA9IGNvbEluZGV4IC0gMTtcblx0d2hpbGUgKGNvbFRvQ2hlY2sgPj0gMCkge1xuXHRcdGNvbnN0IGNlbGxUb0NoZWNrID0gcm93c1tyb3dUb0NoZWNrXVtjb2xUb0NoZWNrXTtcblx0XHRpZiAoZ2V0Q29sb3JPZkNlbGwoY2VsbFRvQ2hlY2spID09PSBjb2xvcikge1xuXHRcdFx0d2lubmluZ0NlbGxzLnB1c2goY2VsbFRvQ2hlY2spO1xuXHRcdFx0Y29sVG9DaGVjay0tO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRicmVhaztcblx0XHR9XG5cdH1cblx0Y29sVG9DaGVjayA9IGNvbEluZGV4ICsgMTtcblx0d2hpbGUgKGNvbFRvQ2hlY2sgPD0gNikge1xuXHRcdGNvbnN0IGNlbGxUb0NoZWNrID0gcm93c1tyb3dUb0NoZWNrXVtjb2xUb0NoZWNrXTtcblx0XHRpZiAoZ2V0Q29sb3JPZkNlbGwoY2VsbFRvQ2hlY2spID09PSBjb2xvcikge1xuXHRcdFx0d2lubmluZ0NlbGxzLnB1c2goY2VsbFRvQ2hlY2spO1xuXHRcdFx0Y29sVG9DaGVjaysrO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRicmVhaztcblx0XHR9XG5cdH1cblx0bGV0IGlzV2lubmluZ0NvbWJvID0gY2hlY2tXaW5uaW5nQ2VsbHMod2lubmluZ0NlbGxzKTtcblx0aWYgKGlzV2lubmluZ0NvbWJvKSByZXR1cm47XG5cblx0Ly8gQ2hlY2sgdmVydGljYWxseVxuXHR3aW5uaW5nQ2VsbHMgPSBbY2VsbF07XG5cdHJvd1RvQ2hlY2sgPSByb3dJbmRleCAtIDE7XG5cdGNvbFRvQ2hlY2sgPSBjb2xJbmRleDtcblx0d2hpbGUgKHJvd1RvQ2hlY2sgPj0gMCkge1xuXHRcdGNvbnN0IGNlbGxUb0NoZWNrID0gcm93c1tyb3dUb0NoZWNrXVtjb2xUb0NoZWNrXTtcblx0XHRpZiAoZ2V0Q29sb3JPZkNlbGwoY2VsbFRvQ2hlY2spID09PSBjb2xvcikge1xuXHRcdFx0d2lubmluZ0NlbGxzLnB1c2goY2VsbFRvQ2hlY2spO1xuXHRcdFx0cm93VG9DaGVjay0tO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRicmVhaztcblx0XHR9XG5cdH1cblx0cm93VG9DaGVjayA9IHJvd0luZGV4ICsgMTtcblx0d2hpbGUgKHJvd1RvQ2hlY2sgPD0gNSkge1xuXHRcdGNvbnN0IGNlbGxUb0NoZWNrID0gcm93c1tyb3dUb0NoZWNrXVtjb2xUb0NoZWNrXTtcblx0XHRpZiAoZ2V0Q29sb3JPZkNlbGwoY2VsbFRvQ2hlY2spID09PSBjb2xvcikge1xuXHRcdFx0d2lubmluZ0NlbGxzLnB1c2goY2VsbFRvQ2hlY2spO1xuXHRcdFx0cm93VG9DaGVjaysrO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRicmVhaztcblx0XHR9XG5cdH1cblx0aXNXaW5uaW5nQ29tYm8gPSBjaGVja1dpbm5pbmdDZWxscyh3aW5uaW5nQ2VsbHMpO1xuXHRpZiAoaXNXaW5uaW5nQ29tYm8pIHJldHVybjtcblxuXHQvLyBDaGVjayBkaWFnb25hbGx5IC9cblx0d2lubmluZ0NlbGxzID0gW2NlbGxdO1xuXHRyb3dUb0NoZWNrID0gcm93SW5kZXggKyAxO1xuXHRjb2xUb0NoZWNrID0gY29sSW5kZXggLSAxO1xuXHR3aGlsZSAoY29sVG9DaGVjayA+PSAwICYmIHJvd1RvQ2hlY2sgPD0gNSkge1xuXHRcdGNvbnN0IGNlbGxUb0NoZWNrID0gcm93c1tyb3dUb0NoZWNrXVtjb2xUb0NoZWNrXTtcblx0XHRpZiAoZ2V0Q29sb3JPZkNlbGwoY2VsbFRvQ2hlY2spID09PSBjb2xvcikge1xuXHRcdFx0d2lubmluZ0NlbGxzLnB1c2goY2VsbFRvQ2hlY2spO1xuXHRcdFx0cm93VG9DaGVjaysrO1xuXHRcdFx0Y29sVG9DaGVjay0tO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRicmVhaztcblx0XHR9XG5cdH1cblx0cm93VG9DaGVjayA9IHJvd0luZGV4IC0gMTtcblx0Y29sVG9DaGVjayA9IGNvbEluZGV4ICsgMTtcblx0d2hpbGUgKGNvbFRvQ2hlY2sgPD0gNiAmJiByb3dUb0NoZWNrID49IDApIHtcblx0XHRjb25zdCBjZWxsVG9DaGVjayA9IHJvd3Nbcm93VG9DaGVja11bY29sVG9DaGVja107XG5cdFx0aWYgKGdldENvbG9yT2ZDZWxsKGNlbGxUb0NoZWNrKSA9PT0gY29sb3IpIHtcblx0XHRcdHdpbm5pbmdDZWxscy5wdXNoKGNlbGxUb0NoZWNrKTtcblx0XHRcdHJvd1RvQ2hlY2stLTtcblx0XHRcdGNvbFRvQ2hlY2srKztcblx0XHR9IGVsc2Uge1xuXHRcdFx0YnJlYWs7XG5cdFx0fVxuXHR9XG5cdGlzV2lubmluZ0NvbWJvID0gY2hlY2tXaW5uaW5nQ2VsbHMod2lubmluZ0NlbGxzKTtcblx0aWYgKGlzV2lubmluZ0NvbWJvKSByZXR1cm47XG5cblx0Ly8gQ2hlY2sgZGlhZ29uYWxseSBcXFxuXHR3aW5uaW5nQ2VsbHMgPSBbY2VsbF07XG5cdHJvd1RvQ2hlY2sgPSByb3dJbmRleCAtIDE7XG5cdGNvbFRvQ2hlY2sgPSBjb2xJbmRleCAtIDE7XG5cdHdoaWxlIChjb2xUb0NoZWNrID49IDAgJiYgcm93VG9DaGVjayA+PSAwKSB7XG5cdFx0Y29uc3QgY2VsbFRvQ2hlY2sgPSByb3dzW3Jvd1RvQ2hlY2tdW2NvbFRvQ2hlY2tdO1xuXHRcdGlmIChnZXRDb2xvck9mQ2VsbChjZWxsVG9DaGVjaykgPT09IGNvbG9yKSB7XG5cdFx0XHR3aW5uaW5nQ2VsbHMucHVzaChjZWxsVG9DaGVjayk7XG5cdFx0XHRyb3dUb0NoZWNrLS07XG5cdFx0XHRjb2xUb0NoZWNrLS07XG5cdFx0fSBlbHNlIHtcblx0XHRcdGJyZWFrO1xuXHRcdH1cblx0fVxuXHRyb3dUb0NoZWNrID0gcm93SW5kZXggKyAxO1xuXHRjb2xUb0NoZWNrID0gY29sSW5kZXggKyAxO1xuXHR3aGlsZSAoY29sVG9DaGVjayA8PSA2ICYmIHJvd1RvQ2hlY2sgPD0gNSkge1xuXHRcdGNvbnN0IGNlbGxUb0NoZWNrID0gcm93c1tyb3dUb0NoZWNrXVtjb2xUb0NoZWNrXTtcblx0XHRpZiAoZ2V0Q29sb3JPZkNlbGwoY2VsbFRvQ2hlY2spID09PSBjb2xvcikge1xuXHRcdFx0d2lubmluZ0NlbGxzLnB1c2goY2VsbFRvQ2hlY2spO1xuXHRcdFx0cm93VG9DaGVjaysrO1xuXHRcdFx0Y29sVG9DaGVjaysrO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRicmVhaztcblx0XHR9XG5cdH1cblx0aXNXaW5uaW5nQ29tYm8gPSBjaGVja1dpbm5pbmdDZWxscyh3aW5uaW5nQ2VsbHMpO1xuXHRpZiAoaXNXaW5uaW5nQ29tYm8pIHJldHVybjtcblxuXHQvLyBDaGVjayB0byBzZWUgaWYgd2UgaGF2ZSBhIHRpZVxuXHRjb25zdCByb3dzV2l0aG91dFRvcCA9IHJvd3Muc2xpY2UoMCwgNik7XG5cdGZvciAoY29uc3Qgcm93IG9mIHJvd3NXaXRob3V0VG9wKSB7XG5cdFx0Zm9yIChjb25zdCBjZWxsIG9mIHJvdykge1xuXHRcdFx0Y29uc3QgY2xhc3NMaXN0ID0gZ2V0Q2xhc3NMaXN0QXJyYXkoY2VsbCk7XG5cdFx0XHRpZiAoIWNsYXNzTGlzdC5pbmNsdWRlcygneWVsbG93JykgJiYgIWNsYXNzTGlzdC5pbmNsdWRlcygncmVkJykpIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdGdhbWVJc0xpdmUgPSBmYWxzZTtcblx0c3RhdHVzU3Bhbi50ZXh0Q29udGVudCA9ICdHYW1lIGlzIGEgdGllISc7XG59O1xuXG4vLyBFdmVudCBIYW5kbGVyc1xuY29uc3QgaGFuZGxlQ2VsbE1vdXNlT3ZlciA9IChlKSA9PiB7XG5cdGlmICghZ2FtZUlzTGl2ZSkgcmV0dXJuO1xuXHRjb25zdCBjZWxsID0gZS50YXJnZXQ7XG5cdGNvbnN0IFtyb3dJbmRleCwgY29sSW5kZXhdID0gZ2V0Q2VsbExvY2F0aW9uKGNlbGwpO1xuXHRjb25zdCB0b3BDZWxsID0gdG9wQ2VsbHNbY29sSW5kZXhdO1xuXHR0b3BDZWxsLmNsYXNzTGlzdC5hZGQoeWVsbG93SXNOZXh0ID8gJ3llbGxvdycgOiAncmVkJyk7XG59O1xuXG5jb25zdCBoYW5kbGVDZWxsTW91c2VPdXQgPSAoZSkgPT4ge1xuXHRjb25zdCBjZWxsID0gZS50YXJnZXQ7XG5cdGNvbnN0IFtyb3dJbmRleCwgY29sSW5kZXhdID0gZ2V0Q2VsbExvY2F0aW9uKGNlbGwpO1xuXHRjbGVhckNvbG9yRnJvbVRvcChjb2xJbmRleCk7XG59O1xuXG5jb25zdCBoYW5kbGVDZWxsQ2xpY2sgPSAoZSkgPT4ge1xuXHRpZiAoIWdhbWVJc0xpdmUpIHJldHVybjtcblx0c2F2ZUpTT04oKTtcblx0Y29uc3QgY2VsbCA9IGUudGFyZ2V0O1xuXHRjb25zdCBbcm93SW5kZXgsIGNvbEluZGV4XSA9IGdldENlbGxMb2NhdGlvbihjZWxsKTtcblxuXHRjb25zdCBvcGVuQ2VsbCA9IGdldEZpcnN0T3BlbkNlbGxGb3JDb2x1bW4oY29sSW5kZXgpO1xuXG5cdGlmICghb3BlbkNlbGwpIHJldHVybjtcblxuXHRvcGVuQ2VsbC5jbGFzc0xpc3QuYWRkKHllbGxvd0lzTmV4dCA/ICd5ZWxsb3cnIDogJ3JlZCcpO1xuXHRjaGVja1N0YXR1c09mR2FtZShvcGVuQ2VsbCk7XG5cblx0eWVsbG93SXNOZXh0ID0gIXllbGxvd0lzTmV4dDtcblx0Y2xlYXJDb2xvckZyb21Ub3AoY29sSW5kZXgpO1xuXHRpZiAoZ2FtZUlzTGl2ZSkge1xuXHRcdGNvbnN0IHRvcENlbGwgPSB0b3BDZWxsc1tjb2xJbmRleF07XG5cdFx0dG9wQ2VsbC5jbGFzc0xpc3QuYWRkKHllbGxvd0lzTmV4dCA/ICd5ZWxsb3cnIDogJ3JlZCcpO1xuXHR9XG59O1xuXG5jb25zdCBzYXZlSlNPTiA9ICgpID0+IHtcblx0dmFyIGRhdGEgPSB7XG5cdFx0Ym9hcmQ6IFtdLFxuXHR9O1xuXG5cdGZvciAobGV0IGkgPSAwOyBpIDwgYWxsQ2VsbHMubGVuZ3RoOyBpKyspIHtcblx0XHRjb25zdCBbcm93SW5kZXgsIGNvbEluZGV4XSA9IGdldENlbGxMb2NhdGlvbihhbGxDZWxsc1tpXSk7XG5cdFx0Y29uc3QgY29sb3VyID0gZ2V0Q29sb3JPZkNlbGwoYWxsQ2VsbHNbaV0pO1xuXG5cdFx0dmFyIGNlbGxFbnRyeSA9IHtcblx0XHRcdHJvdzogcm93SW5kZXgsXG5cdFx0XHRjb2w6IGNvbEluZGV4LFxuXHRcdFx0dHlwZTogJ2FsbCcsXG5cdFx0XHRjb2xvdXI6IGNvbG91cixcblx0XHR9O1xuXG5cdFx0ZGF0YS5ib2FyZC5wdXNoKGNlbGxFbnRyeSk7XG5cdH1cblxuXHRmb3IgKGxldCBpID0gMDsgaSA8IHRvcENlbGxzLmxlbmd0aDsgaSsrKSB7XG5cdFx0Y29uc3QgW3Jvd0luZGV4LCBjb2xJbmRleF0gPSBnZXRDZWxsTG9jYXRpb24odG9wQ2VsbHNbaV0pO1xuXHRcdGNvbnN0IGNvbG91ciA9IGdldENvbG9yT2ZDZWxsKHRvcENlbGxzW2ldKTtcblxuXHRcdHZhciBjZWxsRW50cnkgPSB7XG5cdFx0XHRyb3c6IHJvd0luZGV4LFxuXHRcdFx0Y29sOiBjb2xJbmRleCxcblx0XHRcdHR5cGU6ICd0b3AnLFxuXHRcdFx0Y29sb3VyOiBjb2xvdXIsXG5cdFx0fTtcblxuXHRcdGRhdGEuYm9hcmQucHVzaChjZWxsRW50cnkpO1xuXHR9XG5cblx0dmFyIGRhdGFKU09OID0gSlNPTi5zdHJpbmdpZnkoZGF0YSk7XG5cdGNvbnNvbGUubG9nKGRhdGFKU09OKTtcbn07XG5cbi8vIEFkZGluZyBFdmVudCBMaXN0ZW5lcnNcbmZvciAoY29uc3Qgcm93IG9mIHJvd3MpIHtcblx0Zm9yIChjb25zdCBjZWxsIG9mIHJvdykge1xuXHRcdGNlbGwuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VvdmVyJywgaGFuZGxlQ2VsbE1vdXNlT3Zlcik7XG5cdFx0Y2VsbC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW91dCcsIGhhbmRsZUNlbGxNb3VzZU91dCk7XG5cdFx0Y2VsbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGhhbmRsZUNlbGxDbGljayk7XG5cdH1cbn1cblxucmVzZXRCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG5cdGZvciAoY29uc3Qgcm93IG9mIHJvd3MpIHtcblx0XHRmb3IgKGNvbnN0IGNlbGwgb2Ygcm93KSB7XG5cdFx0XHRjZWxsLmNsYXNzTGlzdC5yZW1vdmUoJ3JlZCcpO1xuXHRcdFx0Y2VsbC5jbGFzc0xpc3QucmVtb3ZlKCd5ZWxsb3cnKTtcblx0XHRcdGNlbGwuY2xhc3NMaXN0LnJlbW92ZSgnd2luJyk7XG5cdFx0fVxuXHR9XG5cdGdhbWVJc0xpdmUgPSB0cnVlO1xuXHR5ZWxsb3dJc05leHQgPSB0cnVlO1xuXHRzdGF0dXNTcGFuLnRleHRDb250ZW50ID0gJyc7XG59KTtcblxuY29uc3QgdG9wQ29udGFpbmVyRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG50b3BDb250YWluZXJEaXYuY2xhc3NMaXN0LmFkZCgndG9wLWNvbnRhaW5lcicpO1xuZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0b3BDb250YWluZXJEaXYpO1xuXG5jb25zdCBsb2dpbkJ0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuXG4vLyBjb250ZW50cyBvZiBsb2dpbiBkaXZcbmNvbnN0IGxvZ2luRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5sb2dpbkRpdi5jbGFzc0xpc3QuYWRkKCdsb2dpbi1kaXYnKTtcbmxvZ2luTW9kYWwuYXBwZW5kQ2hpbGQobG9naW5EaXYpO1xuXG4vLyB1c2VyIGVtYWlsIGlucHV0XG5jb25zdCBlbWFpbERpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuZW1haWxEaXYuY2xhc3NMaXN0LmFkZCgnZW1haWwnKTtcbmxvZ2luRGl2LmFwcGVuZENoaWxkKGVtYWlsRGl2KTtcbmNvbnN0IGVtYWlsTGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsYWJlbCcpO1xuZW1haWxMYWJlbC5zZXRBdHRyaWJ1dGUoJ2ZvcicsICdlbWFpbCcpO1xuZW1haWxMYWJlbC50ZXh0Q29udGVudCA9ICdlbWFpbDogJztcbmVtYWlsRGl2LmFwcGVuZENoaWxkKGVtYWlsTGFiZWwpO1xuY29uc3QgZW1haWxJbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG5lbWFpbElucHV0LnNldEF0dHJpYnV0ZSgnaWQnLCAnZW1haWwnKTtcbmVtYWlsRGl2LmFwcGVuZENoaWxkKGVtYWlsSW5wdXQpO1xuXG4vLyB1c2VyIHBhc3N3b3JkIGlucHV0XG5jb25zdCBwYXNzd29yZERpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xucGFzc3dvcmREaXYuY2xhc3NMaXN0LmFkZCgncGFzc3dvcmQnKTtcbmxvZ2luRGl2LmFwcGVuZENoaWxkKHBhc3N3b3JkRGl2KTtcbmNvbnN0IHBhc3N3b3JkTGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsYWJlbCcpO1xucGFzc3dvcmRMYWJlbC5zZXRBdHRyaWJ1dGUoJ2ZvcicsICdwYXNzd29yZCcpO1xucGFzc3dvcmRMYWJlbC50ZXh0Q29udGVudCA9ICdwYXNzd29yZDogJztcbnBhc3N3b3JkRGl2LmFwcGVuZENoaWxkKHBhc3N3b3JkTGFiZWwpO1xuY29uc3QgcGFzc3dvcmRJbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG5wYXNzd29yZElucHV0LnNldEF0dHJpYnV0ZSgnaWQnLCAncGFzc3dvcmQnKTtcbnBhc3N3b3JkSW5wdXQuc2V0QXR0cmlidXRlKCd0eXBlJywgJ3Bhc3N3b3JkJyk7XG5wYXNzd29yZERpdi5hcHBlbmRDaGlsZChwYXNzd29yZElucHV0KTtcblxuLy8gc3VibWl0IGxvZ2luIGJ1dHRvblxuY29uc3QgbG9naW5CdG5EaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbmxvZ2luQnRuRGl2LmNsYXNzTGlzdC5hZGQoJ2xvZ2luLWJ0bicpO1xubG9naW5EaXYuYXBwZW5kQ2hpbGQobG9naW5CdG5EaXYpO1xubG9naW5CdG4uc2V0QXR0cmlidXRlKCd0eXBlJywgJ3N1Ym1pdCcpO1xubG9naW5CdG4udGV4dENvbnRlbnQgPSAnbG9nIGluJztcbmxvZ2luQnRuRGl2LmFwcGVuZENoaWxkKGxvZ2luQnRuKTtcblxuLy8gc3RhcnQgZ2FtZSBidXR0b25cbmNvbnN0IHN0YXJ0R2FtZUJ0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuc3RhcnRHYW1lQnRuLnNldEF0dHJpYnV0ZSgndHlwZScsICdzdWJtaXQnKTtcbnN0YXJ0R2FtZUJ0bi5jbGFzc0xpc3QuYWRkKCdzdGFydC1idG4nKTtcbnN0YXJ0R2FtZUJ0bi50ZXh0Q29udGVudCA9ICdTVEFSVC8gSk9JTiBHQU1FJztcblxuLy8gZGFzaGJvYXJkIGRpdiB3aGljaCBjb250YWlucyB0aGUgYnV0dG9ucyBkaXYgYW5kIHVzZXIgZGV0YWlscyBkaXZcbmNvbnN0IGRhc2hib2FyZERpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuZGFzaGJvYXJkRGl2LmNsYXNzTGlzdC5hZGQoJ2Rhc2hib2FyZCcpO1xuXG4vLyBjb250YWlucyBzdGFydCBidXR0b24sIHRvIGJlIHJlcGxhY2VkIGJ5IGdhbWUgYnV0dG9ucyB3aGVuIHN0YXJ0IGJ1dHRvbiBpcyBjbGlja2VkXG5jb25zdCBzdGFydEdhbWVCdXR0b25EaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbnN0YXJ0R2FtZUJ1dHRvbkRpdi5jbGFzc0xpc3QuYWRkKCdzdGFydC1idG4tZGl2Jyk7XG5cbi8vIGNvbnRhaW5lciB3aGljaCBob2xkcyBwbGF5ZXIgY2FyZHNcbmNvbnN0IGdhbWVwbGF5Q29udGFpbmVyRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5nYW1lcGxheUNvbnRhaW5lckRpdi5jbGFzc0xpc3QuYWRkKCdtYWluLWdhbWVwbGF5Jyk7XG5cbi8vIGNvbnRhaW5zIGxvZ291dCBidXR0b24gYW5kIHVzZXIgZGV0YWlsc1xuY29uc3QgdXNlckRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXG4vLyBsb2dvdXQgYnV0dG9uXG5jb25zdCBsb2dvdXRCdG5EaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbmxvZ291dEJ0bkRpdi5jbGFzc0xpc3QuYWRkKCdsb2dvdXQtY29udGFpbmVyJyk7XG51c2VyRGl2LmFwcGVuZENoaWxkKGxvZ291dEJ0bkRpdik7XG5cbmNvbnN0IGxvZ291dEJ0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xubG9nb3V0QnRuLmNsYXNzTGlzdC5hZGQoJ2xvZ291dC1idG4nKTtcbmxvZ291dEJ0bi50ZXh0Q29udGVudCA9ICdMb2cgb3V0JztcbmxvZ291dEJ0bkRpdi5hcHBlbmRDaGlsZChsb2dvdXRCdG4pO1xuXG4vLyB3aGVuIHRoZSBsb2dpbiBidXR0b24gaXMgY2xpY2tlZFxubG9naW5CdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG5cdGF4aW9zXG5cdFx0LnBvc3QoJy9sb2dpbicsIHtcblx0XHRcdGVtYWlsOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjZW1haWwnKS52YWx1ZSxcblx0XHRcdHBhc3N3b3JkOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjcGFzc3dvcmQnKS52YWx1ZSxcblx0XHR9KVxuXHRcdC50aGVuKChyZXNwb25zZSkgPT4ge1xuXHRcdFx0Y29uc29sZS5sb2cocmVzcG9uc2UuZGF0YSk7XG5cblx0XHRcdC8vIGNsZWFyIGxvZ2luIGVsZW1lbnRzXG5cdFx0XHRsb2dpbkRpdi5yZW1vdmUoKTtcblxuXHRcdFx0Ly8gcmVwbGFjZSB0aGVtIHdpdGggZGFzaGJvYXJkIGVsZW1lbnRzXG5cdFx0XHR0b3BDb250YWluZXJEaXYuYXBwZW5kQ2hpbGQoZGFzaGJvYXJkRGl2KTtcblxuXHRcdFx0Ly8gY29udGFpbnMgbG9nZ2VkIGluIHVzZXIncyBkZXRhaWxzXG5cblx0XHRcdGRhc2hib2FyZERpdi5hcHBlbmRDaGlsZCh1c2VyRGl2KTtcblx0XHRcdHVzZXJEaXYuY2xhc3NMaXN0LmFkZCgndXNlci1kZXRhaWxzJyk7XG5cdFx0XHRjb25zdCBlbWFpbERpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXHRcdFx0dXNlckRpdi5hcHBlbmRDaGlsZChlbWFpbERpdik7XG5cdFx0XHRlbWFpbERpdi50ZXh0Q29udGVudCA9IGB1c2VyIGVtYWlsOiAke3Jlc3BvbnNlLmRhdGEudXNlci5lbWFpbH1gO1xuXG5cdFx0XHQvLyBhcHBlbmQgc3RhcnQgZ2FtZSBidXR0b24gY29udGFpbmVyIHRvIGRhc2hib2FyZCBkaXZcblx0XHRcdGRhc2hib2FyZERpdi5hcHBlbmRDaGlsZChzdGFydEdhbWVCdXR0b25EaXYpO1xuXG5cdFx0XHQvLyBhcHBlbmQgc3RhcnQgZ2FtZSBidXR0b24gdHAgY29udGFpbmVyIGluIGRhc2hib2FyZFxuXHRcdFx0c3RhcnRHYW1lQnV0dG9uRGl2LmFwcGVuZENoaWxkKHN0YXJ0R2FtZUJ0bik7XG5cdFx0fSlcblx0XHQuY2F0Y2goKGVycm9yKSA9PiBjb25zb2xlLmxvZyhlcnJvcikpO1xufSk7XG5cbmxvZ291dEJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcblx0YXhpb3Ncblx0XHQucHV0KGAvbG9nb3V0LyR7Y3VycmVudEdhbWUuaWR9YClcblx0XHQudGhlbigocmVzcG9uc2UpID0+IHtcblx0XHRcdGNvbnNvbGUubG9nKHJlc3BvbnNlLmRhdGEpO1xuXHRcdH0pXG5cdFx0LmNhdGNoKChlcnJvcikgPT4gY29uc29sZS5sb2coZXJyb3IpKTtcbn0pO1xuLy8gY3JlYXRlIGRlYWwgYW5kIHJlZnJlc2ggYnV0dG9uc1xuY29uc3QgZGVhbEJ0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuZGVhbEJ0bi5pbm5lclRleHQgPSAnREVBTCc7XG5cbmNvbnN0IHJlZnJlc2hCdG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbnJlZnJlc2hCdG4udGV4dENvbnRlbnQgPSAnUkVGUkVTSCc7XG5cbi8vIHNldCBjdXJyZW50IGdhbWUgdmFyaWFibGVcbmxldCBjdXJyZW50R2FtZTtcblxuLy8gcGxheWVyIGNhcmRzXG5jb25zdCBjYXJkMSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuY2FyZDEuY2xhc3NMaXN0LmFkZCgnY2FyZCcpO1xuXG5jb25zdCBjYXJkMiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuY2FyZDIuY2xhc3NMaXN0LmFkZCgnY2FyZCcpO1xuXG4vLyB3aGVyZSByZXN1bHRzIGFyZSBkaXNwbGF5ZWRcbmNvbnN0IHJlc3VsdERpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXG4vLyB3aGVuIHN0YXJ0IGJ1dHRvbiBpcyBjbGlja2VkXG5zdGFydEdhbWVCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG5cdHN0YXJ0R2FtZUJ0bi5yZW1vdmUoKTtcblxuXHQvLyBhcHBlbmQgZGVhbCBhbmQgcmVmcmVzaCBidXR0b25zIHRvIGRhc2hib2FyZFxuXHRzdGFydEdhbWVCdXR0b25EaXYuYXBwZW5kQ2hpbGQoZGVhbEJ0bik7XG5cdHN0YXJ0R2FtZUJ1dHRvbkRpdi5hcHBlbmRDaGlsZChyZWZyZXNoQnRuKTtcblxuXHQvLyBkaXNwbGF5IGdhbWVwbGF5IGNvbnRhaW5lclxuXHRkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGdhbWVwbGF5Q29udGFpbmVyRGl2KTtcblxuXHQvLyBpZiB0aGVyZSBhbHJlYWR5IGlzIGEgZ2FtZSBpbiBwcm9ncmVzc1xuXG5cdGF4aW9zXG5cdFx0LmdldCgnL3N0YXJ0Jylcblx0XHQudGhlbigocmVzcG9uc2UpID0+IHtcblx0XHRcdGNvbnNvbGUubG9nKHJlc3BvbnNlKTtcblxuXHRcdFx0Y3VycmVudEdhbWUgPSByZXNwb25zZS5kYXRhO1xuXHRcdFx0Y29uc29sZS5sb2coJ2N1cnJlbnQgZ2FtZScsIGN1cnJlbnRHYW1lKTtcblxuXHRcdFx0ZGVhbEJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcblx0XHRcdFx0Y2FyZDEuaW5uZXJIVE1MID0gJyc7XG5cdFx0XHRcdGNhcmQyLmlubmVySFRNTCA9ICcnO1xuXHRcdFx0XHRyZXN1bHREaXYuaW5uZXJIVE1MID0gJyc7XG5cblx0XHRcdFx0YXhpb3Ncblx0XHRcdFx0XHQucHV0KGAuL2RlYWwvJHtjdXJyZW50R2FtZS5pZH1gKVxuXHRcdFx0XHRcdC50aGVuKChyZXNwb25zZTEpID0+IHtcblx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKHJlc3BvbnNlMSk7XG5cdFx0XHRcdFx0XHRjdXJyZW50R2FtZSA9IHJlc3BvbnNlMS5kYXRhO1xuXHRcdFx0XHRcdFx0Ly8gY2hhbmdlIGNvbnRlbnQgb2Ygc2NvcmVjYXJkXG5cdFx0XHRcdFx0XHRyZXN1bHREaXYuaW5uZXJIVE1MID0gYCR7cmVzcG9uc2UxLmRhdGEucmVzdWx0fTxicj5wbGF5ZXIgMTogJHtyZXNwb25zZTEuZGF0YS5zY29yZS5wbGF5ZXIxfTxicj5wbGF5ZXIgMjogJHtyZXNwb25zZTEuZGF0YS5zY29yZS5wbGF5ZXIyfWA7XG5cblx0XHRcdFx0XHRcdC8vIGNoYW5nZSBjb250ZW50IG9mIGNhcmRzXG5cdFx0XHRcdFx0XHRjYXJkMS5pbm5lckhUTUwgPSBgJHtyZXNwb25zZTEuZGF0YS5wbGF5ZXIxQ2FyZC5uYW1lfSBvZiAke3Jlc3BvbnNlMS5kYXRhLnBsYXllcjFDYXJkLnN1aXR9YDtcblx0XHRcdFx0XHRcdGNhcmQyLmlubmVySFRNTCA9IGAke3Jlc3BvbnNlMS5kYXRhLnBsYXllcjJDYXJkLm5hbWV9IG9mICR7cmVzcG9uc2UxLmRhdGEucGxheWVyMkNhcmQuc3VpdH1gO1xuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0LmNhdGNoKChlcnJvcikgPT4gY29uc29sZS5sb2coZXJyb3IpKTtcblx0XHRcdH0pO1xuXG5cdFx0XHQvLyBkaXYgdGhhdCBob2xkcyBwbGF5ZXIncyBzY29yZXNcblx0XHRcdGNvbnN0IHNjb3JlQ2FyZERpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXHRcdFx0c2NvcmVDYXJkRGl2LmNsYXNzTGlzdC5hZGQoJ3Njb3JlY2FyZCcpO1xuXHRcdFx0Z2FtZXBsYXlDb250YWluZXJEaXYuYXBwZW5kQ2hpbGQoc2NvcmVDYXJkRGl2KTtcblxuXHRcdFx0Ly8gZGlzcGxheXMgcmVzdWx0IG9mIGN1cnJlbnQgZ2FtZVxuXG5cdFx0XHRyZXN1bHREaXYuaW5uZXJIVE1MID0gYCR7cmVzcG9uc2UuZGF0YS5yZXN1bHR9PGJyPnBsYXllciAxOiAke3Jlc3BvbnNlLmRhdGEuc2NvcmUucGxheWVyMX08YnI+cGxheWVyIDI6ICR7cmVzcG9uc2UuZGF0YS5zY29yZS5wbGF5ZXIyfWA7XG5cdFx0XHRzY29yZUNhcmREaXYuYXBwZW5kQ2hpbGQocmVzdWx0RGl2KTtcblxuXHRcdFx0Ly8gY29udGFpbmVyIHRoYXQgaG9sZHMgYm90aCBwbGF5ZXJzJyBjYXJkc1xuXHRcdFx0Y29uc3QgcGxheWVyQ2FyZHNEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblx0XHRcdHBsYXllckNhcmRzRGl2LmNsYXNzTGlzdC5hZGQoJ2NhcmRzLWNvbnRhaW5lcicpO1xuXHRcdFx0Z2FtZXBsYXlDb250YWluZXJEaXYuYXBwZW5kQ2hpbGQocGxheWVyQ2FyZHNEaXYpO1xuXG5cdFx0XHQvLyBwbGF5ZXIgY2FyZHNcblx0XHRcdGNhcmQxLnRleHRDb250ZW50ID0gYCR7cmVzcG9uc2UuZGF0YS5wbGF5ZXIxQ2FyZC5uYW1lfSBvZiAke3Jlc3BvbnNlLmRhdGEucGxheWVyMUNhcmQuc3VpdH1gO1xuXHRcdFx0cGxheWVyQ2FyZHNEaXYuYXBwZW5kQ2hpbGQoY2FyZDEpO1xuXG5cdFx0XHRjYXJkMi50ZXh0Q29udGVudCA9IGAke3Jlc3BvbnNlLmRhdGEucGxheWVyMkNhcmQubmFtZX0gb2YgJHtyZXNwb25zZS5kYXRhLnBsYXllcjJDYXJkLnN1aXR9YDtcblx0XHRcdHBsYXllckNhcmRzRGl2LmFwcGVuZENoaWxkKGNhcmQyKTtcblx0XHR9KVxuXHRcdC5jYXRjaCgoZXJyb3IpID0+IGNvbnNvbGUubG9nKGVycm9yKSk7XG59KTtcblxuLy8gZGlzcGxheXMgdGhlIGxhdGVzdCBnYW1lIHRvIHRoZSB1c2VyXG5yZWZyZXNoQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuXHRheGlvc1xuXHRcdC5wb3N0KCcvcmVmcmVzaCcsIHtcblx0XHRcdGlkOiBjdXJyZW50R2FtZS5pZCxcblx0XHR9KVxuXHRcdC50aGVuKChyZXNwb25zZSkgPT4ge1xuXHRcdFx0Y29uc29sZS5sb2cocmVzcG9uc2UpO1xuXG5cdFx0XHQvLyBjbGVhciBjb250ZW50cyBvZiBjYXJkc1xuXHRcdFx0Y2FyZDEuaW5uZXJIVE1MID0gJyc7XG5cdFx0XHRjYXJkMi5pbm5lckhUTUwgPSAnJztcblx0XHRcdHJlc3VsdERpdi5pbm5lckhUTUwgPSAnJztcblxuXHRcdFx0Ly8gY2hhbmdlIGNvbnRlbnQgb2Ygc2NvcmVjYXJkXG5cdFx0XHRyZXN1bHREaXYuaW5uZXJIVE1MID0gYCR7cmVzcG9uc2UuZGF0YS5yZXN1bHR9PGJyPnBsYXllciAxOiAke3Jlc3BvbnNlLmRhdGEuc2NvcmUucGxheWVyMX08YnI+cGxheWVyIDI6ICR7cmVzcG9uc2UuZGF0YS5zY29yZS5wbGF5ZXIyfWA7XG5cdFx0XHQvLyBjaGFuZ2UgY29udGVudCBvZiBjYXJkc1xuXHRcdFx0Y2FyZDEuaW5uZXJIVE1MID0gYCR7cmVzcG9uc2UuZGF0YS5wbGF5ZXIxQ2FyZC5uYW1lfSBvZiAke3Jlc3BvbnNlLmRhdGEucGxheWVyMUNhcmQuc3VpdH1gO1xuXHRcdFx0Y2FyZDIuaW5uZXJIVE1MID0gYCR7cmVzcG9uc2UuZGF0YS5wbGF5ZXIyQ2FyZC5uYW1lfSBvZiAke3Jlc3BvbnNlLmRhdGEucGxheWVyMkNhcmQuc3VpdH1gO1xuXHRcdH0pXG5cdFx0LmNhdGNoKChlcnJvcikgPT4gY29uc29sZS5sb2coZXJyb3IpKTtcbn0pO1xuXG5jb25zdCBtb2RhbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNsb2dpbk1vZGFsJyk7XG5jb25zdCBvcGVuTW9kYWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcub3Blbi1idXR0b24nKTtcbmNvbnN0IGNsb3NlTW9kYWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY2xvc2UtYnV0dG9uJyk7XG5cbm9wZW5Nb2RhbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcblx0bW9kYWwuc2hvd01vZGFsKCk7XG59KTtcbmNsb3NlTW9kYWwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG5cdG1vZGFsLmNsb3NlKCk7XG59KTtcbiJdLCJuYW1lcyI6WyJheGlvcyIsImFsbENlbGxzIiwiZG9jdW1lbnQiLCJxdWVyeVNlbGVjdG9yQWxsIiwidG9wQ2VsbHMiLCJyZXNldEJ1dHRvbiIsInF1ZXJ5U2VsZWN0b3IiLCJzdGF0dXNTcGFuIiwiY29sdW1uMCIsImNvbHVtbjEiLCJjb2x1bW4yIiwiY29sdW1uMyIsImNvbHVtbjQiLCJjb2x1bW41IiwiY29sdW1uNiIsImNvbHVtbnMiLCJ0b3BSb3ciLCJyb3cwIiwicm93MSIsInJvdzIiLCJyb3czIiwicm93NCIsInJvdzUiLCJyb3dzIiwiZ2FtZUlzTGl2ZSIsInllbGxvd0lzTmV4dCIsImdldENsYXNzTGlzdEFycmF5IiwiY2VsbCIsImNsYXNzTGlzdCIsImdldENlbGxMb2NhdGlvbiIsInJvd0NsYXNzIiwiZmluZCIsImNsYXNzTmFtZSIsImluY2x1ZGVzIiwiY29sQ2xhc3MiLCJyb3dJbmRleCIsImNvbEluZGV4Iiwicm93TnVtYmVyIiwicGFyc2VJbnQiLCJjb2xOdW1iZXIiLCJnZXRGaXJzdE9wZW5DZWxsRm9yQ29sdW1uIiwiY29sdW1uIiwiY29sdW1uV2l0aG91dFRvcCIsInNsaWNlIiwiY2xlYXJDb2xvckZyb21Ub3AiLCJ0b3BDZWxsIiwicmVtb3ZlIiwiZ2V0Q29sb3JPZkNlbGwiLCJjaGVja1dpbm5pbmdDZWxscyIsImNlbGxzIiwibGVuZ3RoIiwiYWRkIiwidGV4dENvbnRlbnQiLCJjaGVja1N0YXR1c09mR2FtZSIsImNvbG9yIiwid2lubmluZ0NlbGxzIiwicm93VG9DaGVjayIsImNvbFRvQ2hlY2siLCJjZWxsVG9DaGVjayIsInB1c2giLCJpc1dpbm5pbmdDb21ibyIsInJvd3NXaXRob3V0VG9wIiwicm93IiwiaGFuZGxlQ2VsbE1vdXNlT3ZlciIsImUiLCJ0YXJnZXQiLCJoYW5kbGVDZWxsTW91c2VPdXQiLCJoYW5kbGVDZWxsQ2xpY2siLCJzYXZlSlNPTiIsIm9wZW5DZWxsIiwiZGF0YSIsImJvYXJkIiwiaSIsImNvbG91ciIsImNlbGxFbnRyeSIsImNvbCIsInR5cGUiLCJkYXRhSlNPTiIsIkpTT04iLCJzdHJpbmdpZnkiLCJjb25zb2xlIiwibG9nIiwiYWRkRXZlbnRMaXN0ZW5lciIsInRvcENvbnRhaW5lckRpdiIsImNyZWF0ZUVsZW1lbnQiLCJib2R5IiwiYXBwZW5kQ2hpbGQiLCJsb2dpbkJ0biIsImxvZ2luRGl2IiwibG9naW5Nb2RhbCIsImVtYWlsRGl2IiwiZW1haWxMYWJlbCIsInNldEF0dHJpYnV0ZSIsImVtYWlsSW5wdXQiLCJwYXNzd29yZERpdiIsInBhc3N3b3JkTGFiZWwiLCJwYXNzd29yZElucHV0IiwibG9naW5CdG5EaXYiLCJzdGFydEdhbWVCdG4iLCJkYXNoYm9hcmREaXYiLCJzdGFydEdhbWVCdXR0b25EaXYiLCJnYW1lcGxheUNvbnRhaW5lckRpdiIsInVzZXJEaXYiLCJsb2dvdXRCdG5EaXYiLCJsb2dvdXRCdG4iLCJwb3N0IiwiZW1haWwiLCJ2YWx1ZSIsInBhc3N3b3JkIiwidGhlbiIsInJlc3BvbnNlIiwidXNlciIsImVycm9yIiwicHV0IiwiY3VycmVudEdhbWUiLCJpZCIsImRlYWxCdG4iLCJpbm5lclRleHQiLCJyZWZyZXNoQnRuIiwiY2FyZDEiLCJjYXJkMiIsInJlc3VsdERpdiIsImdldCIsImlubmVySFRNTCIsInJlc3BvbnNlMSIsInJlc3VsdCIsInNjb3JlIiwicGxheWVyMSIsInBsYXllcjIiLCJwbGF5ZXIxQ2FyZCIsIm5hbWUiLCJzdWl0IiwicGxheWVyMkNhcmQiLCJzY29yZUNhcmREaXYiLCJwbGF5ZXJDYXJkc0RpdiIsIm1vZGFsIiwib3Blbk1vZGFsIiwiY2xvc2VNb2RhbCIsInNob3dNb2RhbCIsImNsb3NlIl0sInNvdXJjZVJvb3QiOiIifQ==