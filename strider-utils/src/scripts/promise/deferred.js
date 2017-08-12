export default function Deferred() {

    let resolver;
    let rejector;

    let promise;

    function DeferredInstance() {
        return Object.assign(this, {
            promise,

            resolve,
            reject
        });
    }
    promise = DeferredInstance.prototype = new Promise((resolve, reject) => {
        resolver = resolve;
        rejector = reject;
    });

    return new DeferredInstance();

    function resolve(data) {
        resolver(data);
    }

    function reject(error) {
        rejector(error);
    }
}