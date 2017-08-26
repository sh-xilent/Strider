import URL from 'url/url';

const PARAMETRIZATION_PATTERN = /{([a-zA-Z0-9]+)}/g;

export default function UrlUtil() {

    return Object.assign(this, {
        prepare,
        parse
    });

    function prepare(literals, ...values) {
        const plainUrl = literals
            .filter((literal, index) => index !== literals.length - 1 && literal !== '')
            .map((literal, index) => `${literal}{${index}}`)
            .join('');

        const url = parse(plainUrl);
        values.forEach((value, index) => url.parameter(index, value));

        return url;
    }

    function parse(urlString) {
        let [pathTemp, queryParams] = urlString.split('?');
        let [path, hash] = pathTemp.split('#');

        let template = '{path}{hash}{queryParams}';

        if (queryParams) {
            let [params, queryHash] = queryParams.split('#');
            hash = hash || queryHash;
            queryParams = params;
            template = queryHash ? '{path}{queryParams}{hash}' : template;
        }

        queryParams = queryParams ? parseQueryParams(queryParams) : {};

        const paramsOrder = Array.from(new Set(
            (urlString.match(PARAMETRIZATION_PATTERN) || [])
                .map(clearParametrizedValue)
        ));

        const params = {};
        paramsOrder.forEach((key) => params[key] = {key});

        return new URL({
            path,
            hash,
            queryParams,
            paramsOrder,
            params,
            template
        });
    }

    function parseQueryParams(paramsString ) {
        const splitedParams = paramsString.split('&');
        const queryParams = {};
        splitedParams
            .map((paramStr) => paramStr.split('='))
            .map(([key, value]) => {
                const parameterization = extractParametrization(value);
                return {
                    key: parameterization,
                    name: key,
                    parametrized: !!parameterization,
                    value
                };
            }).forEach((queryParam) => {
                queryParams[queryParam.name] = queryParam;
            });
        return queryParams;
    }

    function extractParametrization(value = '') {
        return value && value.match(PARAMETRIZATION_PATTERN) && clearParametrizedValue(value);
    }

    function clearParametrizedValue(value) {
        return value.replace('{', '').replace('}', '');
    }
};