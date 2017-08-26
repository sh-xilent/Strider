export default class NativeRequestFactory {
    create(isAsync) {
        return new NativeRequest(isAsync);
    }
}

export function NativeRequest(isAsync) {

    const _this = this;

    const request = createXmlHttpRequest();
    
    let requestUrl;
    let requestMethod;
    let requestBody;

    let successCallback;
    let errorCallback;
    let progressCallback;

    construct();

    return Object.assign(this, {
        url,
        method,
        body,
        onSuccess,
        onError,
        onProgress,
        execute
    });

    function construct() {
        request.onreadystatechange = () =>
            onRequestStateChange(successCallback, errorCallback);
        if (request.upload) {
            request.upload.onprogress = (event) => onProgress && onProgress(event);
        }
    }
    
    function url(url) {
        requestUrl = url;
        return _this;
    }
    
    function method(method) {
        requestMethod = method;
        return _this;
    }

    function body(body) {
        requestBody = body;
        return _this;
    }

    function onSuccess(callback) {
        successCallback = callback;
        return _this;
    }

    function onError(callback) {
        errorCallback = callback;
        return _this;
    }

    function onProgress(callback) {
        progressCallback = callback;
        return _this;
    }

    function execute() {
        request.open(requestMethod, requestUrl, isAsync);
        request.send(serializeBody(requestBody));
    }

    function serializeBody(body) {
        if (!body || typeof body !== 'object') {
            return body;
        }
        return JSON.stringify(body);
    }

    function onRequestStateChange(onSuccess = () => {}, onError = () => {}) {
        if (request.readyState !== 4) {
            return;
        }
        if (request.status === 200) {
            onSuccess(request.responseText);
        } else {
            onError(request.status, request.responseText);
        }
    }

    function createXmlHttpRequest() {
        const httpRequest = XMLHttpRequest || window.ActiveXObject && function () {
            return new ActiveXObject('Msxml2.XMLHTTP');
        };
        return new httpRequest();
    }
}