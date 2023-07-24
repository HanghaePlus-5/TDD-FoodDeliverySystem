import * as fs from 'node:fs';

const fileName = `${new Date().toISOString().slice(0, 10)}.txt`;

export const localLogger = (msg: string) => {
  fs.appendFile(`./${fileName}`, `${msg}\n`, (err) => {
    if (err) throw err;
  });
};
