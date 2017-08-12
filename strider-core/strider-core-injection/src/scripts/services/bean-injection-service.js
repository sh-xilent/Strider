import Types from 'types/types';
import BeanType from 'constants/bean-type';
import BeanConfig from 'config/bean-config';

export default function BeanInjectionService(beanConfig) {
    Types.check(arguments, BeanConfig);

    const moduleServices = beanConfig.getModules()
        .map((moduleConfig) => new BeanInjectionService(moduleConfig));

    let processors = [];
    let initQueue = [];

    initProcessors();

    return Object.assign(this, {
        getBean
    });

    function getBean(name) {
        const beanDescriptor = beanConfig.getBeanDescriptor(name);
        if (!beanDescriptor) {
            return moduleServices
                .map((moduleService) => moduleService.getBean(name))
                .find((bean) => bean);
        }
        if (beanDescriptor.instances.length) {
            return beanDescriptor.instances[beanDescriptor.instances.length - 1];
        }
        return initBean(beanDescriptor);
    }

    function initProcessors() {
        processors = processors.concat(beanConfig.getProcessors()
            .map(initProcessor));
    }

    function initProcessor(processor) {
        const dependencies = resolveDependencies(processor);
        return new (Function.prototype.bind.apply(processor.class, [null].concat(dependencies)));
    }

    function initBean(beanDescriptor) {
        assertCyclicDependencies(beanDescriptor);
        initQueue.push(beanDescriptor.name);

        let beanInstance;
        try {
            const dependencies = resolveDependencies(beanDescriptor);

            beanInstance = new (Function.prototype.bind.apply(
                beanDescriptor.class || beanDescriptor.factoryClass,
                [null].concat(dependencies)
            ));
            if (beanDescriptor.type === BeanType.FACTORY_BEAN) {
                beanInstance = beanInstance.create();
            }
            processors.forEach((processor) => beanInstance = processor.process(beanInstance));

            beanConfig.registerInstance(beanDescriptor.name, beanInstance);
        } finally {
            initQueue = initQueue.filter((name) => name === beanDescriptor.name);
        }

        return beanInstance;
    }

    function resolveDependencies({dependencies}) {
        return dependencies
            .map((dependency) => {
                const dependencyBean = getBean(dependency);
                assertUnresolvedDependency(dependencyBean, dependency);
                return dependencyBean;
            });
    }

    function assertCyclicDependencies(beanDescriptor) {
        if (initQueue.some((bean) => bean === beanDescriptor.name)) {
            throw new Error(`Cyclic dependencies detected ${beanDescriptor.name}`);
        }
    }

    function assertUnresolvedDependency(dependencyBean, dependency) {
        if (!dependencyBean && !beanConfig.isOptionalDependencies()) {
            throw new Error(`Dependency ${dependency} could not be resolved`);
        }
    }
}