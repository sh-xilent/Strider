Strider.Module.register(new Strider.Module('strider-http', ['strider-utils', 'strider-core/strider-core-resources'], (exports) => {
    Object.assign(exports, {
        ConfigModel: require('model/config-model').default,
        ResourceModel: require('model/resource-model').default,
        HttpModuleExtension: require('module/module-extension').default,
        HttpServiceProcessor: require('processor/http-service-processor').default,
        HttpService: require('services/http-service').default,
        HttpServiceConstructor: require('services/http-service-constructor').default
    });
}));