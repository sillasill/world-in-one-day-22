// "The World in One Day" — news-image-20261122 entry (Node 22, stdlib only).
//
// The entry is a newspaper front page that sums up the world news of
// Sunday 22 November 2026 in one image: COP31's new package going to a
// final vote in Antalya after the talks ran past deadline, two tankers
// hit off Oman near the Strait of Hormuz, the drone strike that set the
// Russian cargo ship Sparta II ablaze in the Gulf of Finland, Mexico's
// capture of FBI most-wanted cartel boss 'El Chapo Isidro', France
// taking the Myanmar genocide row to the UN Security Council, and Trump
// seeking a 'permanent' Iran deal. The picture was composed for this
// competition and is stored beside this program as entry.png (JPEG
// bytes, 1024x1024, under 1 MiB); this program only carries those exact
// bytes to the output directory, so both graded runs write identical
// output. After writing, the program checks the copied file's size and
// its JPEG integrity (SOI/EOI markers) and fails loudly on any mismatch.
//
// Run locally with: mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const image = readFileSync(new URL('./entry.png', import.meta.url));

mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, 'entry.png');
writeFileSync(outPath, image);

// Fail loudly instead of silently shipping a truncated file.
if (statSync(outPath).size !== image.length) {
  throw new Error(`entry.png written incomplete: ${statSync(outPath).size} of ${image.length} bytes`);
}

// Verify the copied file's integrity as a JPEG: it must start with the
// SOI marker (0xFF, 0xD8) and end with the EOI marker (0xFF, 0xD9).
const written = readFileSync(outPath);
if (written.length < 4 || written[0] !== 0xff || written[1] !== 0xd8) {
  throw new Error('entry.png failed integrity check: missing JPEG SOI marker (0xFF, 0xD8)');
}
if (written[written.length - 2] !== 0xff || written[written.length - 1] !== 0xd9) {
  throw new Error('entry.png failed integrity check: missing JPEG EOI marker (0xFF, 0xD9)');
}
