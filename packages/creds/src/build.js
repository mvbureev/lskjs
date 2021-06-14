/* eslint-disable no-console */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable no-template-curly-in-string */
import { jsonToFile, toHumanDate } from '@lskjs/getspreadsheet/utils';
import mapValuesDeep from '@lskjs/utils/mapValuesDeep';
import Bluebird from 'bluebird';
import fs from 'fs/promises';
// import isEqual from 'lodash/isEqual';
import isFunction from 'lodash/isFunction';
import path from 'path';

import { getFiles } from './utils/getFiles';

const DEBUG = false;

export const getComment = ({ server = '', project = '', id = '', name = '', date = new Date() } = {}) =>
  `
Date          : ${toHumanDate(date)}
Filename      : ${name}
Project path  : ${project}
Project ID    : ${id}
CI/CD Setting : https://${server}/${project}/-/settings/ci_cd

Auto generated by https://${server}/devops/creds
If you want to change something, please contact admin repo.
`.trim();

export async function build(dirname, options = {}) {
  const serviceDir = path.resolve(`${dirname}/services`);
  const buildDir = path.resolve(`${dirname}/build`);

  const files = await getFiles(serviceDir);
  await Bluebird.map(files, async ({ name, filename, dir }) => {
    try {
      const relativeDir = path.relative(serviceDir, dir);
      const buildDirDir = `${buildDir}/${relativeDir}`;

      if (name === '__config.js') {
        await fs.mkdir(buildDirDir, { recursive: true });
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        await fs.unlink(`${buildDirDir}/${name}`).catch(() => {});
        await fs.copyFile(filename, `${buildDirDir}/${name}`);
        // console.log(filename, `${buildDirDir}/${name}`);
        return;
      }
      if (filename.indexOf('/__') !== -1) return;

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [ext, stage, ...other] = name.split('.').reverse();

      // if (DEBUG) {
      //   console.log({
      //     dirname,
      //     name,
      //     filename,
      //     dir,
      //     buildDir,
      //     relativeDir,
      //     buildDirDir,
      //     envFile,
      //     envJs,
      //   });
      // }

      const raw = require(filename);
      const rawJson = isFunction(raw) ? raw({ name, filename, stage }) : raw;

      const { __env: ENV, __config, ...json } = mapValuesDeep(
        rawJson,
        (val) => (typeof val === 'string' ? val.replace('${STAGE}', stage) : val), // TODO: more flexible
      );

      const server = options.server || __config.server;
      const project = options.project || __config.project;
      const id = options.id || __config.id;
      const type = options.type || __config.type || 'js';
      const envFile = [...other.reverse(), `${stage}_env_file`, 'env'].filter(Boolean).join('.');
      const envJs = [...other.reverse(), `${stage}_env_${type}`, type].filter(Boolean).join('.');
      // console.log({type})

      let compare = true;
      if (process.env.FORCE) compare = 0;

      await jsonToFile(`${buildDirDir}/${envJs}`, json, {
        type,
        compare,
        comment: getComment({
          name: envJs,
          server,
          project,
          id,
        }),
      });
      if (ENV) {
        await jsonToFile(`${buildDirDir}/${envFile}`, ENV, {
          type: 'env',
          compare,
          comment: getComment({
            name: envFile,
            server,
            project,
            id,
          }),
        });
      }
    } catch (err) {
      console.error(`Build error ${filename}: `, err);
    }
  });
  // console.log(files);
}

export default build;