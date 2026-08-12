import { v4 as uuidv4 } from 'uuid';

/**
 * Generates the public-facing ID stored on every schema's `uuid` field.
 * Used in route params and as the cross-schema reference value
 * (e.g. Product.userId stores a User's uuid, not their Mongo _id).
 */
export function generateUuid(): string {
  return uuidv4();
}

