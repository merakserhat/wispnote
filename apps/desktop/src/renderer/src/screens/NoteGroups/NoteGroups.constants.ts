import * as yup from 'yup';

import { TNoteGroupFormValues } from './NoteGroups.types';

export const NOTE_GROUPS_PAGE_DESCRIPTION =
  'Named collections of notes. A note can sit in as many groups as you like.';

export const NOTE_GROUPS_SEARCH_WIDTH = 260;
export const NOTE_GROUP_CARD_MIN_HEIGHT = 120;
export const NOTE_GROUP_CARD_ICON_SIZE = 16;

export const NOTE_GROUP_TITLE_MAX_LENGTH = 120;
export const NOTE_GROUP_DESCRIPTION_MAX_LENGTH = 500;

export const NOTE_GROUP_TITLE_REQUIRED_MESSAGE = 'Note group title is required.';
export const NOTE_GROUP_CREATE_GENERIC_ERROR_MESSAGE =
  'The group could not be created. A group with this title may already exist.';

export const groupSchema = yup.object({
  title: yup
    .string()
    .trim()
    .required(NOTE_GROUP_TITLE_REQUIRED_MESSAGE)
    .max(
      NOTE_GROUP_TITLE_MAX_LENGTH,
      `Keep the title under ${NOTE_GROUP_TITLE_MAX_LENGTH} characters`
    ),
  description: yup
    .string()
    .trim()
    .max(
      NOTE_GROUP_DESCRIPTION_MAX_LENGTH,
      `Keep the description under ${NOTE_GROUP_DESCRIPTION_MAX_LENGTH} characters`
    ),
});

export const NOTE_GROUP_DEFAULT_VALUES: TNoteGroupFormValues = {
  title: '',
  description: '',
};
