import { type SchemaTypeDefinition } from 'sanity';
import { category } from './category';
import { destination } from './destination';
import { photoJournal } from './photoJournal';
import { essay } from './essay';
import { video } from './video';
import { siteSettings } from './siteSettings';

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [category, destination, photoJournal, essay, video, siteSettings],
};
