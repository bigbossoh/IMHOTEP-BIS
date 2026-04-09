/* tslint:disable */
import { InputStream } from './input-stream';
export interface InputStreamResource {
  inputStream?: InputStream;
  description?: string;
  open?: boolean;
  file?: Blob;
  readable?: boolean;
  url?: string;
  uri?: string;
  filename?: string;
}
