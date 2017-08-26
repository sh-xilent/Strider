export default function Module(name, dependencies, initializer = () => {}) {

    let initialized = false;

    Object.assign(this, {
        getName,
        getDependencies,
        init,
        isInitialized
    });

    function getName() {
        return name;
    }

    function getDependencies() {
        return [...dependencies];
    }

    function init(exports) {
        initializer(exports);
        initialized = true;
    }

    function isInitialized() {
        return initialized;
    }
}