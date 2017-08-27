Strider.Module.register(new Strider.Module('strider-http', ['strider-utils'], (exports) => {
    Object.assign(exports, {
        REQUEST_METHOD_CONSTANTS: require('constants/request-method-constants').default,
        ConfigModel: require('model/config-model').default,
        ResourceModel: require('model/resource-model').default,
        HttpModuleExtension: require('module/module-extension').default,
        HttpServiceProcessor: require('processor/http-service-processor').default,
        HttpRequestFactory: require('request/http-request').default,
        HttpRequest: require('request/http-request').HttpRequest,
        NativeRequestFactory: require('request/native-request').default,
        NativeRequest: require('request/native-request').NativeRequest,
        ResponseSupplierFactory: require('request/response-supplier').default,
        ResponseSupplier: require('request/response-supplier').ResponseSupplier,
        ResponseAsyncSupplier: require('request/response-supplier').ResponseAsyncSupplier,
        HttpService: require('services/http-service').default,
        HttpServiceConstructor: require('services/http-service-constructor').default
    });
}));