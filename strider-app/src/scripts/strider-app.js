Strider.Module.register(new Strider.Module('strider-app', ['strider-utils', 'strider-core/strider-core-event'], (exports) => {
    Object.assign(exports, {
        Application: require('app/application').default
    });

    // Define global variable for framework
    window.Strider = window.Strider || {};

    window.Strider.Application = exports.Application;
}));