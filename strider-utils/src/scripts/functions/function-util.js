const STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
const ARGUMENT_NAMES = /([^\s,]+)/g;

export default function FunctionUtil() {

    return Object.assign(this, {
        generateBeanName,
        getParamNames
    });

    function generateBeanName(beanClass) {
        const className = beanClass.name;
        return className.charAt(0).toLowerCase() + className.slice(1)
    }

    function getParamNames(func) {
        const fnStr = func.toString().replace(STRIP_COMMENTS, '');
        const args = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')'))
            .match(ARGUMENT_NAMES);
        if(args === null) {
            return [];
        }
        return args;
    }
}