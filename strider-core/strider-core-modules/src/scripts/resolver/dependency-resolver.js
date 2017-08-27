export default function DependencyResolver() {

    const modules = {};

    const listeners = {};

    Object.assign(this, {
        import: importModule,
        register
    });

    function importModule(name) {
        const moduleWrapper = modules[name];
        if (!moduleWrapper || !moduleWrapper.module.isInitialized()) {
            throw new Error(`Module '${name}' not found`);
        }
        return moduleWrapper.exports;
    }

    function register(module) {
        const name = module.getName();
        modules[name] = {module};

        const unresolvedDependencies = module.getDependencies()
            .filter((dependency) => !modules[dependency] || !modules[dependency].module.isInitialized());

        if (!unresolvedDependencies.length) {
            initModule(modules[name]);
        }

        unresolvedDependencies
            .forEach((dependency) => {
                const dependencyListeners = listeners[dependency] || [];
                listeners[dependency] = dependencyListeners;
                dependencyListeners.push(() => {
                    const index = unresolvedDependencies.indexOf(dependency);
                    unresolvedDependencies.splice(index, 1);
                    if (!unresolvedDependencies.length) {
                        initModule(modules[name]);
                    }
                });
            });
    }

    function initModule(moduleWrapper) {
        const exports = moduleWrapper.exports = {};
        moduleWrapper.module.init(exports);

        const dependencyListeners = listeners[moduleWrapper.module.getName()];
        if (!dependencyListeners) {
            return;
        }
        listeners[moduleWrapper.module.getName()] = [];

        dependencyListeners.forEach((listener) => listener());
    }
}