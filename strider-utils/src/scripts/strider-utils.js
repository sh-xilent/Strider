Strider.Module.register(new Strider.Module('strider-utils', [], (exports) => {
    Object.assign(exports, {
        FunctionUtil: require('functions/function-util').default,
        Model: require('models/model').default,
        ObjectUtil: require('objects/object-util').default,
        Deferred: require('promise/deferred').default,
        Types: require('types/types').default,
        URL: require('url/url').default,
        UrlUtil: require('url/url-util').default
    });
}));
