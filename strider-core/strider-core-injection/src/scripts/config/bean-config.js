import Types from 'types/types';
import Model from 'models/model';
import BeanScope from 'constants/bean-scope';
import ProcessorScope from 'constants/processor-scope';

const STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
const ARGUMENT_NAMES = /([^\s,]+)/g;

export const BeanConfig = Model.create({
    /**
     *
     */
    id: null,

    /**
     *
     */
    beans: {},

    /**
     *
     */
    instances: {},

    /**
     *
     */
    processors: [],

    /**
     *
     */
    optionalDependencies: false,

    /**
     *
     */
    childConfigs: []
});

const BeanDescriptor = Model.create({
    /**
     *
     */
    class: null,

    /**
     *
     */
    name: null,

    /**
     *
     */
    factory: false,

    /**
     *
     */
    scope: BeanScope.SINGLETON,

    /**
     *
     */
    dependencies: []
});

const ProcessorDescriptor = Model.create({
    /**
     *
     */
    class: null,

    /**
     *
     */
    scope: ProcessorScope.LOCAL,

    /**
     *
     */
    dependencies: []
});

let IDS_COUNTER = 0;

export default function BeanConfigBuilder() {

    const _this = this;

    const id = IDS_COUNTER++;

    const beanDescriptors = {};
    const instances = {};
    const processorDescriptors = [];
    const childConfigBuilders = [];

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
        const dependencies = depsOverride || getParamNames(processorClass);
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
        Types.checkType(config, BeanConfigBuilder);
        childConfigBuilders.push(config);
        return _this;
    }

    function build() {
        const beans = prepareModels(beanDescriptors, BeanDescriptor);
        const processors = prepareModels(processorDescriptors, ProcessorDescriptor);
        const childConfigs = childConfigBuilders.map((config) => config.build());
        return new BeanConfig({id, beans, instances, processors, optionalDependencies, childConfigs});
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
        const beanName = name || generateBeanName(beanClass);
        const dependencies = depsOverride || getParamNames(beanClass);
        return {
            class: beanClass,
            name: beanName,
            factory,
            scope,
            dependencies
        };
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