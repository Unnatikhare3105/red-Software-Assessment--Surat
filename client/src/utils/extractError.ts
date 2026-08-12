import { AxiosError } from 'axios';

export function extractError(err: unknown): string {
  if (err instanceof AxiosError) {
    return err.response?.data?.message || 'Something went wrong';
  }
  return 'Something went wrong';
}