import {ModuleConfigModel} from "./module-config";
const {Model, Types} = Strider.Module.import('strider-utils');
const {BeanConfigBuilder} = Strider.Module.import('strider-core/strider-core-injection');

export const AppConfig = Model.create({
    beanConfig: null,
    modules: {}
});

export default function AppConfigBuilder() {

    const _this = this;

    const modules = {};

    let beanConfig = new BeanConfigBuilder();

    Object.assign(this, {
        module,
        build
    });

    function module(moduleConfig) {
        Types.checkType(moduleConfig, ModuleConfigModel);
        const name = moduleConfig.name;
        if (modules[name]) {
            throw new Error(`Module with name '${name}' already exist`);
        }
        modules[name] = moduleConfig;
        beanConfig = beanConfig.childConfig(moduleConfig.beanConfig);
        return _this;
    }

    function build() {
        return AppConfig.immutable({
            beanConfig: beanConfig.build(),
            modules
        });
    }

}