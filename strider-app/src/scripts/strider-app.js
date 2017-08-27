Strider.Module.register(new Strider.Module('strider-app',
    ['strider-utils', 'strider-core/strider-core-event', 'strider-core/strider-core-injection'],
    (exports) => {
        Object.assign(exports, {
            Application: require('app/application').default,
            AppConfigBuilder: require('config/app-config').default,
            AppConfig: require('config/app-config').AppConfig,
            ModuleConfig: require('config/module-config').default,
            ModuleConfigModel: require('config/module-config').ModuleConfigModel
        });

        // Define global variable for framework
        window.Strider = window.Strider || {};

        window.Strider.Application = exports.Application;
    }
));