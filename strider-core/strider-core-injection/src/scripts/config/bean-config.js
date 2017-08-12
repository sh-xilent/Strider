import ObjectUtil from 'objects/object-util';
import BeanType from 'constants/bean-type';

const OBJECT_UTIL = new ObjectUtil();

const STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
const ARGUMENT_NAMES = /([^\s,]+)/g;

export default function BeanConfig(moduleName, parentConfig) {

    const _this = this;

    const config = {};
    const modules = [];
    const processors = [];

    let optionalDependencies = parentConfig ? parentConfig.isOptionalDependencies() : false;

    return Object.assign(this, {
        getModuleName,
        getModules,
        getBeanDescriptor,
        getProcessors,
        withOptionalDependencies,
        isOptionalDependencies,
        factory,
        service,
        bean,
        beanInstance,
        processor,
        module,
        dependency,
        parent,
        registerInstance
    });

    function getModuleName() {
        return moduleName;
    }

    function getModules() {
        return OBJECT_UTIL.clone(modules);
    }

    function getBeanDescriptor(name) {
        let beanConfig = config[name];
        if (beanConfig) {
            return OBJECT_UTIL.deepClone(beanConfig);
        }
        const factoryName = Object.keys(config)
            .find((key) => config[key].targetBean === name);
        if (factoryName) {
            beanConfig = config[name] = {
                name,
                factoryClass: config[factoryName].class,
                dependencies: OBJECT_UTIL.clone(config[factoryName].dependencies),
                type: BeanType.FACTORY_BEAN,
                instances: []
            };
        }
        return beanConfig && OBJECT_UTIL.deepClone(beanConfig);
    }

    function getProcessors() {
        return OBJECT_UTIL.clone(processors);
    }

    function withOptionalDependencies(isOptional) {
        optionalDependencies = isOptional;
        return _this;
    }

    function isOptionalDependencies() {
        return optionalDependencies;
    }

    function factory(targetBean, factoryClass, name, dependencies) {
        const beanConfig = registerBean(factoryClass, name, dependencies, BeanType.FACTORY_BEAN);
        beanConfig.targetBean = targetBean;
        return _this;
    }

    function service(serviceClass, name, dependencies) {
        registerBean(serviceClass, name, dependencies, BeanType.SERVICE_BEAN);
        return _this;
    }

    function bean(beanClass, name, dependencies) {
        registerBean(beanClass, name, dependencies, BeanType.PLAIN_BEAN);
        return _this;
    }

    function beanInstance(instance, name) {
        config[name] = {
            class: instance.constructor,
            name,
            type: BeanType.PLAIN_BEAN,
            dependencies: [],
            instances: [instance]
        };
        return _this;
    }

    function processor(processor) {
        const dependencies = getParamNames(processor);
        processors.push({
            class: processor,
            dependencies
        });
        return _this;
    }

    function module(moduleName) {
        const moduleConfig = new BeanConfig(moduleName, this);
        modules.push(moduleConfig);
        return moduleConfig;
    }

    function dependency(module) {
        modules.push(module);
        return _this;
    }

    function parent() {
        return parentConfig;
    }

    function registerInstance(beanName, instance) {
        if (config[beanName]) {
            config[beanName].instances.push(instance);
        }
    }

    function registerBean(beanClass, name, dependencies, type) {
        const beanName = name || generateBeanName(beanClass);
        const nativeDependencies = getParamNames(beanClass);
        config[beanName] = {
            class: beanClass,
            name: beanName,
            type,
            dependencies: dependencies || nativeDependencies,
            instances: []
        };
        return config[beanName];
    }

    function generateBeanName(beanClass) {
        const className = beanClass.name;
        return className.charAt(0).toLowerCase() + className.slice(1)
    }

    function getParamNames(func) {
        const fnStr = func.toString().replace(STRIP_COMMENTS, '');
        const args = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')'))
            .match(ARGUMENT_NAMES);
        if(args === null) {
            return [];
        }
        return args;
    }
}