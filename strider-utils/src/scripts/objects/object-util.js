export default function ObjectUtil() {

    const _this = this;

    return Object.assign(this, {
        clone,
        deepClone,
        template
    });

    function clone(object) {
        if (object instanceof Array) {
            return [...object];
        }
        return Object.assign({}, object);
    }

    function deepClone(object) {
        return Object.assign({}, object); // TODO implement
    }

    function template(template, object) {
        return Object.assign(
            deepClone(template),
            deepClone(object)
        );
    }
}