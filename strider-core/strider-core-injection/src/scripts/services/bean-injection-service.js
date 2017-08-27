import BeanScope from 'constants/bean-scope';
import ProcessorScope from 'constants/processor-scope';
import {BeanConfig} from 'config/bean-config';
const {Types} = Strider.Module.import('strider-utils');

export default function BeanInjectionService(beanConfig) {
    Types.check(arguments, BeanConfig);

    const root = buildRoot();

    return Object.assign(this, {
        getBean
    });

    function getBean(name) {
        return root.getBean(name);
    }

    function buildRoot() {
        const processedNodes = {};
        const globalProcessors = [];
        return buildNode(beanConfig, processedNodes, globalProcessors);
    }

    function buildNode(config, processedNodes, globalProcessors) {
        if (processedNodes[config.id]) {
            return processedNodes[config.id];
        }
        const childNodes = config.childConfigs
            .map((child) => buildNode(child, processedNodes, globalProcessors));

        const node = new Beans(config, childNodes, globalProcessors);
        processedNodes[config.id] = node;

        return node;
    }
}

function Beans(beanConfig, childBeans, globalProcessors) {

    const instances = {};

    const pendingInit = {};

    const processors = initProcessors(ProcessorScope.LOCAL);
    applyGlobalProcessors(initProcessors(ProcessorScope.GLOBAL));

    return Object.assign(this, {
        getBean
    });

    function getBean(name) {
        if (instances[name]) {
            return instances[name];
        }
        if (beanConfig.beans[name]) {
            return initBean(beanConfig.beans[name]);
        }
        return childBeans
            .map((child) => child.getBean(name))
            .find((bean) => bean);
    }

    function applyGlobalProcessors(processors) {
        processors.forEach((processor) => globalProcessors.push(processor));
    }

    function initProcessors(scope) {
        return beanConfig.processors
            .filter((descriptor) => descriptor.scope === scope)
            .map(initProcessor)
    }

    function initProcessor(processorDescriptor) {
        const dependencies = resolveDependencies(processorDescriptor);
        return createInstance(processorDescriptor, dependencies);
    }

    function initBean(beanDescriptor) {
        assertCyclicDependency(beanDescriptor);
        pendingInit[beanDescriptor.name] = true;

        try {
            const dependencies = resolveDependencies(beanDescriptor);

            let instance = createInstance(beanDescriptor, dependencies);
            instance = postProcessInstance(instance);

            if (beanDescriptor.scope !== BeanScope.PROTOTYPE) {
                instances[beanDescriptor.name] = instance;
            }
            return instance;

        } finally {
            delete pendingInit[beanDescriptor.name];
        }
    }

    function postProcessInstance(instance) {
        if (processors) {
            processors.forEach((processor) => instance = processor.transform(instance));
        }
        if (globalProcessors) {
            globalProcessors.forEach((processor) => instance = processor.transform(instance));
        }
        return instance;
    }

    function createInstance(beanDescriptor, dependencies) {
        const instance = new (Function.prototype.bind.apply(
            beanDescriptor.class,
            [null].concat(dependencies)
        ));
        return beanDescriptor.factory ? instance.create() : instance;
    }

    function resolveDependencies({dependencies}) {
        return dependencies
            .map((dependencyName) => {
                const dependencyBean = getBean(dependencyName);
                assertUnresolvedDependency(dependencyBean, dependencyName);
                return dependencyBean;
            });
    }

    function assertUnresolvedDependency(instance, dependencyName) {
        if (!instance && !beanConfig.optionalDependencies) {
            throw new Error(`Dependency '${dependencyName}' could not be resolved`);
        }
    }

    function assertCyclicDependency({name}) {
        if (pendingInit[name]) {
            throw new Error(`Cyclic dependencies detected'${name}'`);
        }
    }
}