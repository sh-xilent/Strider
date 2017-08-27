const {Model, Types, ObjectTransformer} = Strider.Module.import('strider-utils');
const {BeanConfigBuilder} = Strider.Module.import('strider-core/strider-core-injection');

export const ModuleConfigModel = Model.create({
    name: null,
    beanConfig: null,
    childModules: []
});

export default function ModuleConfig(name) {

    const _this = this;

    const childModules = {};
    const extensions = [];

    let beanConfig = new BeanConfigBuilder();

    Object.assign(this, {
        getName,
        factory,
        service,
        bean,
        instance,
        processor,
        dependenciesAreOptional,
        extension,
        childModule,
        toModel
    });

    function getName() {
        return name;
    }

    function factory(factoryClass, name, scope) {
        beanConfig = beanConfig.factory(factoryClass, name, scope);
        return _this;
    }

    function service(serviceClass, name, depsOverride) {
        beanConfig = beanConfig.service(serviceClass, name, depsOverride);
        return _this;
    }

    function bean(beanClass, scope, name, depsOverride) {
        beanConfig = beanConfig.bean(beanClass, scope, name, depsOverride);
        return _this;
    }

    function instance(beanInstance, name) {
        beanConfig = beanConfig.instance(beanInstance, name);
        return _this;
    }

    function processor(processorClass, scope, depsOverride) {
        beanConfig = beanConfig.processor(processorClass, scope, depsOverride);
        return _this;
    }

    function dependenciesAreOptional(isOptional) {
        beanConfig = beanConfig.setOptionalDependencies(isOptional);
        return _this;
    }

    function extension(extensionTransformer) {
        Types.checkType(extensionTransformer, ObjectTransformer);
        extensions.push(extensionTransformer);
        return _this;
    }

    function childModule(module) {
        Types.checkType(module, ModuleConfigModel);
        const name = module.getName();
        if (childModules[name]) {
            throw new Error(`Could not specify module '${name}' twice`);
        }
        childModules[name] = module;
        return _this;
    }

    function toModel() {
        const modules = Object.keys(childModules)
            .map((key) => {
                beanConfig = beanConfig.childConfig(childModules[key].beanConfig);
                return childModules[key];
            });

        extensions
            .forEach((extension) => extension.transform(_this));

        return ModuleConfigModel.immutable({
            name,
            beanConfig: beanConfig.build(),
            childModules: modules
        });
    }
}