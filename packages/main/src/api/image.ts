import { cpus } from 'node:os'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import { ImagePool } from '@squoosh/lib'

const imagePool = new ImagePool(cpus().length)

export async function compressImage(file: Buffer): Promise<any> {
  const image = imagePool.ingestImage(file)
  const preprocessOptions = {
    // When both width and height are specified, the image resized to specified size.
    resize: {
      width: 512,
    },
  }
  await image.preprocess(preprocessOptions)

  const encodeOptions = {
    mozjpeg: 'auto',
    webp: 'auto',
  }

  await image.encode(encodeOptions)
  return image.encodedWith.webp
}
