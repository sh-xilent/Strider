import Deferred from 'promise/deferred';

export default class ResponseSupplierFactory {
    create(isAsync = true) {
        return isAsync ? new ResponseAsyncSupplier() : new ResponseSupplier();
    }
}

export function ResponseSupplier() {

    let responseData;
    let bodyReader;

    return Object.assign(this, {
        setBodyReader,
        onSuccess,
        onError,
        getData
    });

    function setBodyReader(reader) {
        bodyReader = reader;
    }

    function onSuccess(body) {
        responseData = bodyReader ? bodyReader(body) : JSON.parse(body);
    }

    function onError(status) {
        throw new Error(`Request failed with status ${status}`);
    }

    function getData() {
        return responseData;
    }
}

ResponseAsyncSupplier.prototype = new ResponseSupplier();

export function ResponseAsyncSupplier() {

    const deferred = new Deferred();

    let bodyReader;

    return Object.assign(this, {
        setBodyReader,
        onSuccess,
        onError,
        onProgress,
        getData
    });

    function setBodyReader(reader) {
        bodyReader = reader;
    }

    function onSuccess(body) {
        const responseData = bodyReader ? bodyReader(body) : JSON.parse(body);
        deferred.resolve(responseData);
    }

    function onError(status, body) {
        deferred.reject({status, body});
    }

    function onProgress(event) {
        deferred.update(event);
    }

    function getData() {
        return deferred.promise;
    }
}