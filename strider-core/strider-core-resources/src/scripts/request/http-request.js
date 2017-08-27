import RequestMethodConstants from 'constants/request-method-constants';
import NativeRequestFactory from './native-request';
import {NativeRequest} from './native-request';
import ResponseSupplierFactory from './response-supplier';
import {ResponseSupplier} from './response-supplier';
const {Types} = Strider.Module.import('strider-utils');

HttpRequestFactory.beanName = 'httpRequestFactory';
HttpRequestFactory.inject = ['nativeRequestFactory', 'responseSupplierFactory'];

export default function HttpRequestFactory(nativeRequestFactory, responseSupplierFactory) {
    Types.check(arguments, NativeRequestFactory, ResponseSupplierFactory);

    return Object.assign(this, {
        get: createGet,
        post: createPost,
        put: createPut,
        delete: createDelete
    });

    function createGet(url, isAsync) {
        return create(url, RequestMethodConstants.GET, isAsync)
    }

    function createPost(url, isAsync) {
        return create(url, RequestMethodConstants.POST, isAsync)
    }

    function createPut(url, isAsync) {
        return create(url, RequestMethodConstants.PUT, isAsync)
    }

    function createDelete(url, isAsync) {
        return create(url, RequestMethodConstants.DELETE, isAsync)
    }

    function create(url, method, isAsync = true) {
        const nativeRequest = nativeRequestFactory.create(isAsync)
            .url(url)
            .method(method);
        const responseSupplier = responseSupplierFactory.create(isAsync);
        return new HttpRequest(nativeRequest, responseSupplier);
    }
}

export function HttpRequest(nativeRequest, responseSupplier) {
    Types.check(arguments, NativeRequest, ResponseSupplier);

    const _this = this;

    return Object.assign(this, {
        withBody,
        withBodyReader,
        execute
    });

    function withBody(requestBody) {
        nativeRequest.body(requestBody);
        return _this;
    }

    function withBodyReader(responseBodyReader) {
        responseSupplier.setBodyReader(responseBodyReader);
        return _this;
    }

    function execute() {
        nativeRequest
            .onSuccess(responseSupplier.onSuccess)
            .onError(responseSupplier.onError)
            .onProgress(responseSupplier.onProgress)
            .execute();
        return responseSupplier.getData();
    }
}