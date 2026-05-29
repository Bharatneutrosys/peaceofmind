import { type SchemaTypeDefinition } from 'sanity';
import { destination } from './destination';
import { photoJournal } from './photoJournal';
import { essay } from './essay';

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [destination, photoJournal, essay],
};
