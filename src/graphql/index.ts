import { readFile } from 'node:fs/promises';
import path from 'path';

export const loadTypeDefs = async (): Promise<string> => {
  const typeDefsArray = await Promise.all([
    readFile(path.join(__dirname, 'types.graphql'), 'utf8'),
    readFile(path.join(__dirname, 'queries.graphql'), 'utf8'),
    readFile(path.join(__dirname, 'mutations.graphql'), 'utf8'),
  ]);
  return typeDefsArray.join('\n');
};
