Strider.Module.register(new Strider.Module('test-strider-app', ['strider-app', 'strider-http'], () => {

    const {Application, AppConfigBuilder, ModuleConfig} = Strider.Module.import('strider-app');
    const {HttpModuleExtension, HttpService, REQUEST_METHOD_CONSTANTS} = Strider.Module.import('strider-http');

    class TestHttpService extends HttpService {
        getRequest(urlPath) {
            return {
                url: `${urlPath}/resource.json`,
                method: REQUEST_METHOD_CONSTANTS.GET
            };
        }
    }

    const testAppModule = new ModuleConfig('testAppModule')
        .service(TestHttpService)
        .extension(new HttpModuleExtension())
        .toModel();

    const testAppConfig = new AppConfigBuilder()
        .module(testAppModule)
        .build();

    new Application(testAppConfig)
        .start()
        .then((app) => initTestApp(app.getBeanInjectionService()));

    function initTestApp(beanInjectionService) {
        const testHttpService = beanInjectionService.getBean('testHttpService');

        const form = document.createElement('form');

        const input = document.createElement('input');
        input.type = 'TEXT';
        form.appendChild(input);

        const div = document.createElement('div');
        form.appendChild(div);

        const button = document.createElement('button');
        form.appendChild(button);
        button.innerText = 'Retrieve';
        button.onclick = (event) => {
            event.stopPropagation();
            testHttpService.getRequest(input.value)
                .then((data) => div.innerText = JSON.stringify(data));
            return false;
        };

        document.body.appendChild(form);
    }
}));