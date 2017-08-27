import BeanScope from 'constants/bean-scope';
import ProcessorScope from 'constants/processor-scope';
const {Types, Model, FunctionUtil, ObjectTransformer} = Strider.Module.import('strider-utils');

const FUNCTION_UTIL = new FunctionUtil();

export const BeanConfig = Model.create({
    /**
     * Unique identifier of bean configuration
     */
    id: null,

    /**
     * Configured bean descriptors
     */
    beans: {},

    /**
     * Simple bean instances
     */
    instances: {},

    /**
     * Bean processors, executes after bean creation
     */
    processors: [],

    /**
     * Determines that application should fail if there are unresolved dependencies
     * true - dependencies are required. false - dependencies are optional
     */
    optionalDependencies: false,

    /**
     * Child configurations. Could contain their own beans and other stuff
     */
    childConfigs: []
});

export const BeanDescriptor = Model.create({
    class: null,
    name: null,
    factory: false,
    scope: BeanScope.SINGLETON,
    dependencies: []
});

export const ProcessorDescriptor = Model.create({
    class: null,
    scope: ProcessorScope.LOCAL,
    dependencies: []
});

let IDS_COUNTER = 0;

export default function BeanConfigBuilder() {

    const _this = this;

    const id = IDS_COUNTER++;

    const beanDescriptors = {};
    const instances = {};
    const processorDescriptors = [];
    const childConfigs = [];

    let optionalDependencies = false;

    return Object.assign(this, {
        factory,
        service,
        bean,
        instance,
        processor,
        setOptionalDependencies,
        childConfig,
        build
    });

    function factory(factoryClass, name, scope) {
        const descriptor = buildDescriptor(factoryClass, scope, name, null, true);
        beanDescriptors[descriptor.name] = descriptor;
        return _this;
    }

    function service(serviceClass, name, depsOverride) {
        const descriptor = buildDescriptor(serviceClass, BeanScope.SINGLETON, name, depsOverride);
        beanDescriptors[descriptor.name] = descriptor;
        return _this;
    }

    function bean(beanClass, scope, name, depsOverride) {
        const descriptor = buildDescriptor(beanClass, scope, name, depsOverride);
        beanDescriptors[descriptor.name] = descriptor;
        return _this;
    }

    function instance(beanInstance, name) {
        instances[name] = beanInstance;
        return _this;
    }

    function processor(processorClass, scope = ProcessorScope.LOCAL, depsOverride) {
        Types.checkType(processorClass.prototype, ObjectTransformer);
        const dependencies = depsOverride || processorClass.inject || FUNCTION_UTIL.getParamNames(processorClass);
        processorDescriptors.push({
            class: processorClass,
            scope,
            dependencies
        });
        return _this;
    }

    function setOptionalDependencies(isOptional) {
        optionalDependencies = isOptional;
        return _this;
    }

    function childConfig(config) {
        Types.checkType(config, BeanConfig);
        childConfigs.push(config);
        return _this;
    }

    function build() {
        const beans = prepareModels(beanDescriptors, BeanDescriptor);
        const processors = prepareModels(processorDescriptors, ProcessorDescriptor);
        return BeanConfig.immutable({id, beans, instances, processors, optionalDependencies, childConfigs});
    }

    function prepareModels(source, modelClass) {
        let iterator = source;
        if (!(source instanceof Array)) {
            iterator = Object.keys(source);
        }
        iterator.forEach((key) => source[key] = new modelClass(source[key]));
        return source;
    }

    function buildDescriptor(beanClass, scope = BeanScope.SINGLETON, name, depsOverride, factory = false) {
        const beanName = name || beanClass.beanName || FUNCTION_UTIL.generateBeanName(beanClass);
        const dependencies = depsOverride || beanClass.inject || FUNCTION_UTIL.getParamNames(beanClass);
        return {
            class: beanClass,
            name: beanName,
            factory,
            scope,
            dependencies
        };
    }
}