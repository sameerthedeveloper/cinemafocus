// Minimal ZIP reader for the browser (and Node 18+): no dependencies.
// Supports stored and deflate entries, which covers zips from macOS, Windows and `zip`.
// Not supported: encryption and ZIP64 (archives over 4 GB or 65k files).

const utf8 = new TextDecoder();

async function inflateRaw(bytes) {
  const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('deflate-raw'));
  return new Uint8Array(await new Response(stream).arrayBuffer());
}

/**
 * @param {ArrayBuffer} buffer
 * @returns {Promise<Array<{ name: string, size: number, read: () => Promise<Uint8Array> }>>}
 */
export async function readZip(buffer) {
  const bytes = new Uint8Array(buffer);
  const view = new DataView(buffer);

  // End-of-central-directory record: scan backwards (the archive comment can be up to 64 KB)
  let eocd = -1;
  for (let i = bytes.length - 22; i >= Math.max(0, bytes.length - 22 - 65535); i--) {
    if (view.getUint32(i, true) === 0x06054b50) {
      eocd = i;
      break;
    }
  }
  if (eocd < 0) throw new Error('This does not look like a valid ZIP file.');

  const count = view.getUint16(eocd + 10, true);
  let offset = view.getUint32(eocd + 16, true);
  if (count === 0xffff || offset === 0xffffffff) throw new Error('ZIP64 archives are not supported.');

  const entries = [];
  for (let n = 0; n < count; n++) {
    if (view.getUint32(offset, true) !== 0x02014b50) throw new Error('The ZIP file is damaged.');
    const flags = view.getUint16(offset + 8, true);
    const method = view.getUint16(offset + 10, true);
    const compressedSize = view.getUint32(offset + 20, true);
    const size = view.getUint32(offset + 24, true);
    const nameLength = view.getUint16(offset + 28, true);
    const extraLength = view.getUint16(offset + 30, true);
    const commentLength = view.getUint16(offset + 32, true);
    const localOffset = view.getUint32(offset + 42, true);
    const name = utf8.decode(bytes.subarray(offset + 46, offset + 46 + nameLength));
    offset += 46 + nameLength + extraLength + commentLength;

    const isFolder = name.endsWith('/');
    const isJunk = name.startsWith('__MACOSX/') || name.split('/').pop() === '.DS_Store';
    if (isFolder || isJunk) continue;
    if (flags & 1) throw new Error(`"${name}" is password protected. Remove the password and try again.`);
    if (compressedSize === 0xffffffff || size === 0xffffffff) throw new Error('ZIP64 archives are not supported.');

    entries.push({
      name,
      size,
      read: async () => {
        const nameLen = view.getUint16(localOffset + 26, true);
        const extraLen = view.getUint16(localOffset + 28, true);
        const start = localOffset + 30 + nameLen + extraLen;
        const data = bytes.subarray(start, start + compressedSize);
        if (method === 0) return data;
        if (method === 8) return inflateRaw(data);
        throw new Error(`"${name}" uses an unsupported compression method (${method}).`);
      },
    });
  }
  return entries;
}
