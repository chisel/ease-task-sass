const glob = require('glob');
const sass = require('node-sass');
const path = require('path');
const fs = require('fs-extra');
const _ = require('lodash');

module.exports = (logger, dirname, config) => {

  return () => {

    return new Promise((resolve, reject) => {

      // Validate config
      if ( ! config.dir || ! config.outDir ) return reject(new Error('SASS plugin misconfiguration! dir and outDir must be present.'));

      // Empty outDir if necessary
      if ( config.cleanOutDir ) {

        fs.emptyDirSync(path.join(dirname, config.outDir));

      }

      // Search `config.dir` for `.scss` files
      glob('**/*.scss', { cwd: path.join(dirname, config.dir) }, (error, files) => {

        if ( error ) return reject(error);

        const promises = [];

        for ( const file of files ) {

          // Skip partial files
          if ( path.basename(file).substr(0, 1) === '_' ) continue;

          promises.push(new Promise((resolve, reject) => {

            // Compile the SASS file into CSS
            const finalOptions = _.cloneDeep(config);

            delete finalOptions.file;
            delete finalOptions.outFile;
            delete finalOptions.data;
            delete finalOptions.dir;
            delete finalOptions.outDir;
            delete finalOptions.cleanOutDir;

            finalOptions.file = path.join(dirname, config.dir, file);
            finalOptions.outFile = path.join(dirname, config.outDir, file.replace('.scss', '.css'));

            sass.render(finalOptions, (error, result) => {

              if ( error ) return reject(error);

              // Write the CSS file to `config.outdir`
              fs.outputFile(path.join(dirname, config.outDir, file.replace('.scss', '.css')), result.css, error => {

                if ( error ) return reject(error);

                // Write the map if needed
                if ( result.map && config.sourceMap ) {

                  fs.outputFile(path.join(dirname, config.outDir, file.replace('.scss', '.css.map')), result.map, error => {

                    if ( error ) return reject(error);

                    resolve();

                  });

                }
                else resolve();

              });

            });

          }));

        }

        logger(`Processing ${promises.length} files...`);

        Promise.all(promises)
        .then(() => {

          logger(`All ${promises.length} files were processed.`);
          resolve();

        })
        .catch(reject);

      });

    });

  };

};
