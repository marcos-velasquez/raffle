import { IdFactory } from '@shared/domain';
import { BlobConverter } from '../blob/blob';

class URL {
  public static async toFile(url: string): Promise<File> {
    const res: Response = await fetch(url);
    const blob: Blob = await res.blob();
    return new File([blob], IdFactory.create(), { type: blob.type });
  }

  public static async toBase64(url: string): Promise<string> {
    const data = await fetch(url);
    const blob = await data.blob();
    return BlobConverter.toBase64(blob);
  }

  public static fromFile(file: File): Promise<string> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function () {
        resolve(reader.result as string);
      };
    });
  }
}

export const _URL = {
  toFile: URL.toFile,
  toBase64: URL.toBase64,
  fromFile: URL.fromFile,
};
