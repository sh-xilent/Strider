import ObjectUtil from 'objects/object-util';

const OBJECT_UTIL = new ObjectUtil();

Model.create = function(template) {

    function ModelInstance(object, immutable = false) {
        const preparedObject = OBJECT_UTIL.template(template, object || {});
        let modelInstance = Object.assign(this, preparedObject);
        if (immutable) {
            modelInstance = OBJECT_UTIL.deepFreeze(modelInstance);
        }
        return modelInstance;
    }
    ModelInstance.prototype = new Model();

    ModelInstance.immutable = (object) => new ModelInstance(object, true);

    return ModelInstance;
};

export default function Model() {}