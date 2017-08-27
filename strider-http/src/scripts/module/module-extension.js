import HttpServiceConstructor from 'services/http-service-constructor';
import HttpServiceProcessor from 'processor/http-service-processor';
const {ProcessorScope} = Strider.Module.import('strider-core/strider-core-injection');
const {ResourcesModuleExtension} = Strider.Module.import('strider-core/strider-core-resources');

export default class HttpModuleExtension extends ResourcesModuleExtension {
    transform(moduleConfig) {
        return super.transform(moduleConfig)
            .service(HttpServiceConstructor)
            .processor(HttpServiceProcessor, ProcessorScope.GLOBAL);
    }
}