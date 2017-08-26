import Module from 'modules/module';
import DependencyResolver from 'resolver/dependency-resolver';

const dependencyResolver = new DependencyResolver();

window.Strider = window.Strider || {};

window.Strider.Module = Module;
Module.import = dependencyResolver.import;
Module.register = dependencyResolver.register;