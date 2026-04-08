// Nevada Universal Cannabis Symbol → ZPL GRF bitmap generator
// Output: ^GFA command ready for Zebra ZD420 @ 203 DPI
// Size: 80x80 dots ≈ 10mm x 10mm at 203 DPI
// Symbol: rounded-corner triangle with ! and THC inside

const W = 80, H = 80;
const pix = Array.from({length: H}, () => new Uint8Array(W));

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, Math.round(v)));
const set   = (x, y, v=1) => { x=clamp(x,0,W-1); y=clamp(y,0,H-1); pix[y][x]=v; };
const rect  = (x1,y1,x2,y2) => {
  for (let y=Math.round(y1); y<=Math.round(y2); y++)
    for (let x=Math.round(x1); x<=Math.round(x2); x++) set(x,y);
};

// Signed distance from (px,py) to directed line (x1,y1)→(x2,y2)
const sdLine = (px,py,x1,y1,x2,y2) => {
  const dx=x2-x1, dy=y2-y1, len=Math.sqrt(dx*dx+dy*dy);
  return ((py-y1)*dx-(px-x1)*dy)/len;
};

// Triangle vertices (clockwise in screen coords = y increases down)
const Ax=40, Ay=5;    // apex (top-center)
const Bx=3,  By=75;  // bottom-left
const Cx=77, Cy=75;  // bottom-right
const BORDER = 6;     // outline thickness (dots)
const CR = 5;         // corner rounding radius

// Is point inside the triangle?
const inside = (px,py) => {
  const d1=sdLine(px,py,Ax,Ay,Bx,By);
  const d2=sdLine(px,py,Bx,By,Cx,Cy);
  const d3=sdLine(px,py,Cx,Cy,Ax,Ay);
  return (d1<=0&&d2<=0&&d3<=0)||(d1>=0&&d2>=0&&d3>=0);
};

// Perpendicular distance from point to line segment (unsigned)
const distToSeg = (px,py,x1,y1,x2,y2) => {
  return Math.abs(sdLine(px,py,x1,y1,x2,y2));
};

// ── Draw triangle border using SDF (signed distance field) ───────────────────
// Strategy: for each pixel, draw it black if:
//   (a) it's inside the triangle AND within BORDER dots of an edge, OR
//   (b) it's near a corner and within the rounding band
//
// The rounding at each corner is a circle of radius CR drawn at the
// "inner corner" point — the point that is CR dots inside the triangle
// along the bisector of the corner angle.

// Compute inset corner centers (move CR dots inward from each vertex)
// along the angle bisector of the triangle at that vertex
function insetCorner(vx,vy, e1x,e1y, e2x,e2y, dist) {
  // e1, e2 are the two edges' OTHER endpoints from the vertex (vx,vy)
  const d1 = Math.sqrt((e1x-vx)**2+(e1y-vy)**2);
  const d2 = Math.sqrt((e2x-vx)**2+(e2y-vy)**2);
  const u1x=(e1x-vx)/d1, u1y=(e1y-vy)/d1;
  const u2x=(e2x-vx)/d2, u2y=(e2y-vy)/d2;
  const bx=u1x+u2x, by=u1y+u2y;
  const bl=Math.sqrt(bx*bx+by*by);
  return [vx+bx/bl*dist, vy+by/bl*dist];
}

const icA = insetCorner(Ax,Ay, Bx,By, Cx,Cy, CR); // inset apex
const icB = insetCorner(Bx,By, Ax,Ay, Cx,Cy, CR); // inset bottom-left
const icC = insetCorner(Cx,Cy, Ax,Ay, Bx,By, CR); // inset bottom-right

for (let y=0; y<H; y++) {
  for (let x=0; x<W; x++) {
    // Distance from each edge (unsigned, positive inside triangle)
    const dAB = distToSeg(x,y,Ax,Ay,Bx,By);
    const dBC = distToSeg(x,y,Bx,By,Cx,Cy);
    const dCA = distToSeg(x,y,Cx,Cy,Ax,Ay);

    const isInside = inside(x,y);
    if (!isInside) continue; // outside triangle = white

    const minEdgeDist = Math.min(dAB, dBC, dCA);

    // Near which corner?
    const dFromA = Math.sqrt((x-Ax)**2+(y-Ay)**2);
    const dFromB = Math.sqrt((x-Bx)**2+(y-By)**2);
    const dFromC = Math.sqrt((x-Cx)**2+(y-Cy)**2);
    const minCorner = Math.min(dFromA, dFromB, dFromC);

    if (minCorner <= CR + BORDER + 2) {
      // Near a corner: use circular arc instead of straight border
      // Find which corner
      let icx, icy;
      if (dFromA <= dFromB && dFromA <= dFromC) { [icx,icy]=icA; }
      else if (dFromB <= dFromC)                { [icx,icy]=icB; }
      else                                       { [icx,icy]=icC; }
      const r = Math.sqrt((x-icx)**2+(y-icy)**2);
      if (r >= CR && r <= CR+BORDER) pix[y][x]=1;
    } else {
      // Away from corners: straight border
      if (minEdgeDist <= BORDER) pix[y][x]=1;
    }
  }
}

// ── Exclamation mark ──────────────────────────────────────────────────────────
// Bar: 6 wide, centered at x=40, y=26..47
rect(37, 26, 42, 47);
// Dot: 6 wide, y=52..57
rect(37, 52, 42, 57);

// ── "THC" text (bold pixel-art, lower portion of triangle) ───────────────────
// At y=62 interior spans roughly x=16..64 (after borders)
// T at x=17..28  H at x=32..45  C at x=49..62

// T
rect(17, 62, 28, 65);  // top bar
rect(21, 62, 24, 74);  // center stem

// H
rect(32, 62, 36, 74);  // left vertical
rect(41, 62, 45, 74);  // right vertical
rect(32, 67, 45, 70);  // crossbar

// C
rect(49, 62, 62, 65);  // top bar
rect(49, 71, 62, 74);  // bottom bar
rect(49, 62, 52, 74);  // left vertical

// ── Convert bitmap → ZPL ^GFA hex ────────────────────────────────────────────
const bytesPerRow = Math.ceil(W / 8);  // = 10
const totalBytes  = bytesPerRow * H;   // = 800

let hex = '';
for (let y = 0; y < H; y++) {
  for (let b = 0; b < bytesPerRow; b++) {
    let byte = 0;
    for (let bit = 0; bit < 8; bit++) {
      const px = b * 8 + bit;
      if (px < W && pix[y][px]) byte |= (0x80 >> bit);
    }
    hex += byte.toString(16).padStart(2, '0').toUpperCase();
  }
}

process.stdout.write(`^GFA,${totalBytes},${totalBytes},${bytesPerRow},\n`);
for (let y = 0; y < H; y++) {
  process.stdout.write(hex.substring(y * bytesPerRow * 2, (y+1) * bytesPerRow * 2) + '\n');
}

// ASCII preview on stderr
process.stderr.write('\n=== ASCII PREVIEW ===\n');
for (let y = 0; y < H; y++) {
  let row = '';
  for (let x = 0; x < W; x++) row += pix[y][x] ? '#' : '.';
  process.stderr.write(row + '\n');
}
