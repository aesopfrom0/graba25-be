import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { join } from 'path';

console.log(process.env.NODE_ENV);
const YAML_CONFIG_FILENAME = `${process.env.NODE_ENV}-config.yaml`;

console.log(join(__dirname));
export default () => {
  return yaml.load(readFileSync(join(__dirname, YAML_CONFIG_FILENAME), 'utf8')) as Record<
    string,
    any
  >;
};
