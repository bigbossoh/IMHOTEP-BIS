/* tslint:disable */
import { InputStream } from './input-stream';
export interface MultipartFile {
  name?: string;
  bytes?: Array<string>;
  empty?: boolean;
  size?: number;
  inputStream?: InputStream;
  originalFilename?: string;
  contentType?: string;
}
