export default {
    check(args, ...types) {
        types.forEach((type, index) => {
            if (!(args[index] instanceof type)) {
                throw new Error(`Type of ${index} should be ${type.name}`);
            }
        })
    },

    checkType(object, type) {
        if (!(object instanceof type)) {
            throw new Error(`Type should be ${type.name}`);
        }
    }
};