// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import {ImagePool} from '@squoosh/lib';
import {cpus} from 'os';

const imagePool = new ImagePool(cpus().length);

export async function compressImage(file: Buffer): Promise<any> {
  const image = imagePool.ingestImage(file);
  const preprocessOptions = {
    //When both width and height are specified, the image resized to specified size.
    resize: {
      width: 512,
    },
  };
  await image.preprocess(preprocessOptions);

  const encodeOptions = {
    mozjpeg: 'auto',
  };

  await image.encode(encodeOptions);
  return await image.encodedWith.mozjpeg;
}
