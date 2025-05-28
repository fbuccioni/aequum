import { task, src, series } from 'gulp';
import { default as deleteEmpty } from 'delete-empty';
import * as del from 'del';

import { source } from '../config';


/**
 * Cleans the build output assets from the packages folders
 */
function cleanOutput(done: () => void) {
    del.deleteSync(
        [
            `${source}/**/*.js`,
            `${source}/**/*.d.ts`,
            `${source}/**/*.js.map`,
            `${source}/**/*.d.ts.map`,
        ]
    );
    done();
}

/**
 * Cleans empty dirs
 */
function cleanDirs(done: () => void) {
    deleteEmpty.sync(`${source}/`);
    done();
}

/**
 * Clean misc files
 */
/**
 * Cleans the build output assets from the packages folders
 */
function cleanMisc(done: () => void) {
    del.deleteSync(
        [
            `${source}/*/README.md`,
            `${source}/*/LICENSE`,
            `${source}/*/.npmignore`,
        ]
    );
    done();
}

task('clean:output', cleanOutput);
task('clean:dirs', cleanDirs);
task('clean:misc', cleanMisc);
task('clean:bundle', series('clean:output', 'clean:dirs', 'clean:misc'));
