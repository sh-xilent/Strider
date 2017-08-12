import ObjectUtil from 'objects/object-util';

const OBJECT_UTIL = new ObjectUtil();

export default function URL(urlDescriptor) {

    const that = this;

    return Object.assign(this, {
        descriptor: OBJECT_UTIL.deepClone(urlDescriptor),

        parameter,
        build
    });

    function parameter(key, value) {
        urlDescriptor.params[key].value = value;
        return that;
    }

    function build() {
        return urlDescriptor.template
            .replace('{path}', getPreparedPath())
            .replace('{hash}', urlDescriptor.hash ? `#${urlDescriptor.hash}` : '')
            .replace('{queryParams}', getPreparedQueryParams());
    }

    function getPreparedPath() {
        let path = urlDescriptor.path;

        Object.keys(urlDescriptor.params)
            .filter((key) => urlDescriptor.params[key].value)
            .forEach((key) => path = path.replace(`{${key}}`, urlDescriptor.params[key].value));

        return path;
    }

    function getPreparedQueryParams() {
        const parametrizedParams = Object.keys(urlDescriptor.queryParams)
            .filter(filterParametrized)
            .map(prepareQueryParam);

        const plainParams = Object.keys(urlDescriptor.queryParams)
            .filter((key) => !urlDescriptor.queryParams[key].parametrized)
            .map((key) => `${key}=${urlDescriptor.queryParams[key].value}`);

        const serializedParams = [...parametrizedParams, ...plainParams].join('&');
        return serializedParams ? `?${serializedParams}` : '';
    }

    function filterParametrized(key) {
        return urlDescriptor.queryParams[key].parametrized && urlDescriptor.params[urlDescriptor.queryParams[key].key].value;
    }

    function prepareQueryParam(key) {
        const value = urlDescriptor.params[urlDescriptor.queryParams[key].key].value;
        return `${key}=${value}`;
    }
}