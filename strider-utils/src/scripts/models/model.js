import ObjectUtil from 'objects/object-util';

const OBJECT_UTIL = new ObjectUtil();

Model.create = function(template) {

    function ModelInstance(object) {
        const preparedObject = OBJECT_UTIL.template(template, object || {});
        return Object.assign(this, preparedObject);
    }
    ModelInstance.prototype = new Model();

    return ModelInstance;
};

export default function Model() {}