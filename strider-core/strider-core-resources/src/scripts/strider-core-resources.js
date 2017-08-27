Strider.Module.register(new Strider.Module('strider-core/strider-core-resources', ['strider-utils'], (exports) => {
    Object.assign(exports, {
        REQUEST_METHOD_CONSTANTS: require('constants/request-method-constants').default,
        HttpRequestFactory: require('request/http-request').default,
        HttpRequest: require('request/http-request').HttpRequest,
        NativeRequestFactory: require('request/native-request').default,
        NativeRequest: require('request/native-request').NativeRequest,
        ResponseSupplierFactory: require('request/response-supplier').default,
        ResponseSupplier: require('request/response-supplier').ResponseSupplier,
        ResponseAsyncSupplier: require('request/response-supplier').ResponseAsyncSupplier,
    });
}));