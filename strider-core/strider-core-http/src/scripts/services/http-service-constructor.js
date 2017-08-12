import Types from 'types/types';
import HttpRequestFactory from 'request/http-request';
import URL from "url/url";
import Model from 'models/model';
import ConfigModel from 'model/config-model';
import ResourceModel from 'model/resource-model';

export default function HttpServiceConstructor(httpRequestFactory) {
    Types.check(arguments, HttpRequestFactory);

    return Object.assign(this, {
        construct,
        constructFromInstance
    });

    function construct(serviceClass) {
        const serviceInstance = new serviceClass();
        return constructFromInstance(serviceInstance);
    }

    function constructFromInstance(serviceInstance) {
        const serviceConfig = serviceInstance.constructor.config || new ConfigModel();
        Types.checkType(serviceConfig, ConfigModel);

        Object.getOwnPropertyNames(serviceInstance.constructor.prototype)
            .filter((key) => !isConstructorFunction(key))
            .forEach((key) => {
                serviceInstance[key] = generateResourceFunction(serviceInstance[key], serviceInstance, serviceConfig);
            });

        return serviceInstance;
    }

    function generateResourceFunction(resource, serviceInstance, {async, targetHost}) {
        return function(...params) {
            const resourceModel = new ResourceModel(resource.apply(serviceInstance, params));

            const targetUri = extractUri(resourceModel);
            const targetUrl = buildUrl(targetHost, targetUri);

            const request = httpRequestFactory[resourceModel.method.toLowerCase()](targetUrl, async);

            if (resourceModel.body) {
                request.withBody(resourceModel.body);
            }
            if (resourceModel.bodyReader) {
                request.withBodyReader(resourceModel.bodyReader);

            } else if (resourceModel.response) {
                Types.checkType(resourceModel.response.prototype, Model);
                request.withBodyReader((body) => prepareResponseBody(body, resourceModel.response));
            }

            return request.execute();
        };
    }

    function buildUrl(targetHost, targetUri) {
        return targetHost
            ? `${targetHost}/${targetUri}`
            : targetUri;
    }

    function extractUri(resourceModel) {
        const url = resourceModel.url;
        if (url instanceof URL) {
            return url.build();
        }
        return url;
    }

    function prepareResponseBody(body, responseModel) {
        const data = JSON.parse(body);
        return new responseModel(data);
    }

    function isConstructorFunction(key) {
        return key === 'constructor';
    }
}