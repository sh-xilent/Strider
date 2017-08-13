export default function ObjectUtil() {

    const _this = this;

    return Object.assign(this, {
        clone,
        deepClone,
        deepFreeze,
        template
    });

    function clone(object) {
        if (object instanceof Array) {
            return [...object];
        }
        return Object.assign({}, object);
    }

    function deepClone(object) {
        if (!object) {
            return object;
        }
        if (object instanceof Array) {
            return cloneArray(object);
        }
        if (typeof object === 'object') {
            return cloneObject(object);
        }
        return object;
    }

    function deepFreeze(object) {
        if (object instanceof Array) {
            Object.freeze(object);
            object.forEach(Object.freeze);
        }
        if (typeof object === 'object') {
            Object.freeze(object);
            Object.keys(object)
                .forEach((key) => deepFreeze(object[key]));
        }
        return object;
    }

    function template(template, object) {
        return Object.assign(
            deepClone(template),
            deepClone(object)
        );
    }

    function cloneObject(object) {
        function Clone() {}
        Clone.prototype = object;

        const propsClones = {};
        Object.keys(object)
            .forEach((key) => propsClones[key] = deepClone(object[key]));

        return Object.assign(new Clone(), propsClones);
    }

    function cloneArray(array) {
        return array.map(deepClone);
    }
}