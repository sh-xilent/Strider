'use strict';

import gulp from 'gulp';
import babel from 'gulp-babel';
import rename from 'gulp-rename';
import fileCopy from 'gulp-file-copy';
import source from 'vinyl-source-stream';
import browserify from 'browserify';

const DIST_PATH = 'dist/';
const TEMP_PATH = 'temp/';

const DEFAULT_DIST_SCRIPTS_PATH = 'scripts/';
const DEFAULT_DIST_RESOURCES_PATH = 'resources/';

const modules = {
    'test-strider-app': {
        sources: 'test-strider-app/src/scripts/',
        entry: 'test-strider-app.js',
        resources: 'test-strider-app/src/resources/',
        dependencies: [
            'strider-app',
            'strider-http'
        ]
    },

    'strider-app': {
        sources: 'strider-app/src/scripts/',
        entry: 'strider-app.js',
        dependencies: [
            'strider-utils',
            'strider-core-event'
        ]
    },
    'strider-utils': {
        sources: 'strider-utils/src/scripts/',
        entry: 'strider-utils.js'
    },
    'strider-http': {
        sources: 'strider-http/src/scripts/',
        entry: 'strider-http.js',
        dependencies: ['strider-utils']
    },
    // Core
    'strider-core-modules': {
        sources: 'strider-core/strider-core-modules/src/scripts/',
        entry: 'strider-core-modules.js',
        dest: 'strider-core/'
    },
    'strider-core-event': {
        sources: 'strider-core/strider-core-event/src/scripts/',
        entry: 'strider-core-event.js',
        dest: 'strider-core/',
        dependencies: ['strider-utils']
    },
    'strider-core-injection': {
        sources: 'strider-core/strider-core-injection/src/scripts/',
        entry: 'strider-core-injection.js',
        dest: 'strider-core/',
        dependencies: ['strider-utils']
    }
};

gulp.task.apply(gulp, ['js:test-strider-app', ...buildModule('test-strider-app')]);

gulp.task('js:strider-root', [
    'js:strider-utils',
    'js:strider-http',
    'js:strider-core',
    'js:strider-app'
]);

gulp.task.apply(gulp, ['js:strider-app', ...buildModule('strider-app')]);
gulp.task.apply(gulp, ['js:strider-utils', ...buildModule('strider-utils')]);
gulp.task.apply(gulp, ['js:strider-http', ...buildModule('strider-http')]);

gulp.task('js:strider-core', [
    'js:strider-core-modules',
    'js:strider-core-event',
    'js:strider-core-injection'
]);
gulp.task.apply(gulp, ['js:strider-core-modules', ...buildModule('strider-core-modules')]);
gulp.task.apply(gulp, ['js:strider-core-event', ...buildModule('strider-core-event')]);
gulp.task.apply(gulp, ['js:strider-core-injection', ...buildModule('strider-core-injection')]);

function buildModule(name) {
    const module = modules[name];
    return [getDependencies(module), () => {

        if (module.resources) {
            gulp.src(module.resources + '*')
                .pipe(fileCopy(buildDistResourcesPath(module), {
                    start: module.resources
                }));
        }
        gulp.src(buildSourcesPath(module))
            .pipe(babel({
                presets: ['es2015']
            }))
            .pipe(gulp.dest(buildTempScriptsPath(module)));

        return browserify({
            expose: name,
            entries: [buildEntryPath(module)],
            paths: [buildTempScriptsPath(module)]
        }).bundle()
            .pipe(source(module.entry))
            .pipe(rename(module.entry))
            .pipe(gulp.dest(buildDistScriptsPath(module)));
    }];
}

function getDependencies(module) {
    return module.dependencies ? module.dependencies.map((dependency) => `js:${dependency}`) : [];
}

function buildEntryPath(module) {
    return `${DIST_PATH}${TEMP_PATH}${module.sources}${module.entry}`;
}

function buildTempScriptsPath(module) {
    return `${DIST_PATH}${TEMP_PATH}${module.sources}`;
}

function buildSourcesPath(module) {
    return `${module.sources}**/*.js`;
}

function buildDistScriptsPath(module) {
    return `${DIST_PATH}${DEFAULT_DIST_SCRIPTS_PATH}${module.dest || ''}`;
}

function buildDistResourcesPath(module) {
    return `${DIST_PATH}${DEFAULT_DIST_RESOURCES_PATH}${module.dest || ''}`;
}