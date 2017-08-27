import BeanScope from 'constants/bean-scope';
import ProcessorScope from 'constants/processor-scope';
import {BeanConfig, BeanDescriptor} from 'config/bean-config';
const {Types} = Strider.Module.import('strider-utils');

export default function BeanInjectionService(...beanConfigs) {
    Types.check(arguments, BeanConfig);

    const globalProcessors = [];

    const customBeans = buildCustomBeans();
    const rootBeans = [customBeans, ...buildRoots()];

    return Object.assign(this, {
        getBean,
        registerInstance,
        registerBean
    });

    function getBean(name) {
        return rootBeans
            .map((root) => root.getBean(name))
            .find(Boolean);
    }

    function registerInstance(name, instance) {
        customBeans.registerInstance(name, instance);
    }

    function registerBean(beanDescriptor) {
        customBeans.registerBean(beanDescriptor);
    }

    function buildCustomBeans() {
        return buildNode(new BeanConfig({}), {}, globalProcessors, []);
    }

    function buildRoots() {
        const processedNodes = {};

        const beans = [];
        for (let i = 0; i < beanConfigs.length; i++) {
            beans.push(buildNode(beanConfigs[i], processedNodes, globalProcessors, [...beans]));
        }
        return beans;
    }

    function buildNode(config, processedNodes, globalProcessors, parentBeans) {
        if (processedNodes[config.id]) {
            return processedNodes[config.id];
        }
        const childNodes = config.childConfigs
            .map((child) => buildNode(child, processedNodes, globalProcessors, parentBeans));

        const node = new Beans(config, childNodes, globalProcessors, parentBeans);
        processedNodes[config.id] = node;

        return node;
    }
}

function Beans(beanConfig, childBeans, globalProcessors, parentBeans) {

    const instances = {};

    const customDescriptors = {};

    const pendingInit = {};

    const processors = initProcessors(ProcessorScope.LOCAL);
    applyGlobalProcessors(initProcessors(ProcessorScope.GLOBAL));

    return Object.assign(this, {
        getBean,
        registerInstance,
        registerBean
    });

    function getBean(name) {
        if (instances[name]) {
            return instances[name];
        }
        if (beanConfig.instances[name]) {
            return beanConfig.instances[name];
        }
        const beanDescriptor = beanConfig.beans[name] || customDescriptors[name];
        if (beanDescriptor) {
            return initBean(beanDescriptor);
        }
        const childBean = childBeans
            .map((child) => child.getBean(name))
            .find((bean) => bean);

        return childBean || parentBeans
            .map((beans) => beans.getBean(name))
            .find(Boolean);
    }

    function registerInstance(name, instance) {
        instances[name] = instance;
    }

    function registerBean(beanDescriptor) {
        Types.checkType(beanDescriptor, BeanDescriptor);
        customDescriptors[beanDescriptor.name] = beanDescriptor;
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