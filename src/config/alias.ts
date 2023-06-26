import * as moduleAlias from 'module-alias';
import * as path from 'path';

const rootPath = path.resolve(__dirname, '..', '..', 'dist');
moduleAlias.addAliases({
  'src': rootPath,
});