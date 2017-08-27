Strider.Module.register(new Strider.Module('strider-core/strider-core-injection', ['strider-utils'], (exports) => {
    Object.assign(exports, {
        BeanConfigBuilder: require('config/bean-config').default,
        BeanConfig: require('config/bean-config').BeanConfig,
        BeanScope: require('constants/bean-scope').default,
        BeanProcessor: require('processor/bean-processor').default,
        BeanInjectionService: require('services/bean-injection-service').default,
    });
}));