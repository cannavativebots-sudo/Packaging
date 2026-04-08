// Generates two Word documents:
// 1. resin8-disposable-TEMPLATE.docx  — label template with editable placeholders
// 2. Resin8-Disposable-Setup-Guide.docx — label purchasing + printer setup guide

const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, BorderStyle, WidthType, HeightRule, PageOrientation,
  convertInchesToTwip, convertMillimetersToTwip, ShadingType, TableLayoutType,
  HorizontalPositionAlign, VerticalPositionAlign, PageBreak
} = require('docx');
const fs = require('fs');

// ─── Helper: horizontal rule ────────────────────────────────────────────────
const hRule = () => new Paragraph({
  border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: '000000' } },
  spacing: { before: 40, after: 40 },
});

// ─── Helper: centered bold paragraph ───────────────────────────────────────
const centeredBold = (text, size = 18) => new Paragraph({
  alignment: AlignmentType.CENTER,
  children: [new TextRun({ text, bold: true, size })],
});

// ─── Helper: centered paragraph ────────────────────────────────────────────
const centered = (text, size = 16) => new Paragraph({
  alignment: AlignmentType.CENTER,
  children: [new TextRun({ text, size })],
});

// ─── Helper: left paragraph ────────────────────────────────────────────────
const left = (text, size = 16, bold = false) => new Paragraph({
  children: [new TextRun({ text, size, bold })],
  spacing: { before: 0, after: 20 },
});

// ─── Helper: field row (label: value) ──────────────────────────────────────
const field = (label, placeholder, size = 16) => new Paragraph({
  children: [
    new TextRun({ text: `${label}: `, size, bold: true }),
    new TextRun({ text: placeholder, size, color: '808080' }),
  ],
  spacing: { before: 0, after: 20 },
});

// ═══════════════════════════════════════════════════════════════════════════
// DOCUMENT 1: LABEL TEMPLATE
// Page size: 50mm × 40mm (matching the sticker exactly)
// ═══════════════════════════════════════════════════════════════════════════
const labelDoc = new Document({
  sections: [{
    properties: {
      page: {
        size: {
          width:  convertMillimetersToTwip(50),
          height: convertMillimetersToTwip(40),
        },
        margin: {
          top:    convertMillimetersToTwip(2),
          bottom: convertMillimetersToTwip(2),
          left:   convertMillimetersToTwip(2),
          right:  convertMillimetersToTwip(2),
        },
      },
    },
    children: [
      // Line 1 — Product name (largest, bold)
      new Paragraph({
        children: [new TextRun({
          text: '[STRAIN] Resin8 Disposable',
          bold: true,
          size: 28,       // 14pt
          color: '808080',
        })],
        spacing: { before: 0, after: 20 },
      }),

      // Line 2 — Company + License
      new Paragraph({
        children: [new TextRun({
          text: 'Cannavative Extracts, LLC  #72326121663352213340',
          size: 16,       // 8pt minimum
        })],
        spacing: { before: 0, after: 20 },
      }),

      // Line 3 — Dates
      new Paragraph({
        children: [
          new TextRun({ text: 'Prod: ', size: 16, bold: true }),
          new TextRun({ text: '[MM/DD/YY]', size: 16, color: '808080' }),
          new TextRun({ text: '   Test: ', size: 16, bold: true }),
          new TextRun({ text: '[MM/DD/YY]', size: 16, color: '808080' }),
          new TextRun({ text: '   Pkg: ', size: 16, bold: true }),
          new TextRun({ text: '[MM/DD/YY]', size: 16, color: '808080' }),
        ],
        spacing: { before: 0, after: 20 },
      }),

      // Line 4 — Run number
      new Paragraph({
        children: [
          new TextRun({ text: 'Run#: ', size: 16, bold: true }),
          new TextRun({ text: '[PRODUCTION RUN NUMBER]', size: 16, color: '808080' }),
        ],
        spacing: { before: 0, after: 20 },
      }),

      // Line 5 — THC + Net weight
      new Paragraph({
        children: [
          new TextRun({ text: 'THC: ', size: 16, bold: true }),
          new TextRun({ text: '[X.XX]', size: 16, color: '808080' }),
          new TextRun({ text: '%  (', size: 16 }),
          new TextRun({ text: '[XXX]', size: 16, color: '808080' }),
          new TextRun({ text: 'mg/pkg)   ', size: 16 }),
          new TextRun({ text: 'Net Wt: ', size: 16, bold: true }),
          new TextRun({ text: '1.0g', size: 16 }),
        ],
        spacing: { before: 0, after: 20 },
      }),

      // Line 6 — Other cannabinoids
      new Paragraph({
        children: [
          new TextRun({ text: 'CBD:', size: 16, bold: true }),
          new TextRun({ text: '[X]', size: 16, color: '808080' }),
          new TextRun({ text: '%(', size: 16 }),
          new TextRun({ text: '[X]', size: 16, color: '808080' }),
          new TextRun({ text: 'mg) CBC:', size: 16, bold: true }),
          new TextRun({ text: '[X]', size: 16, color: '808080' }),
          new TextRun({ text: '% CBG:', size: 16, bold: true }),
          new TextRun({ text: '[X]', size: 16, color: '808080' }),
          new TextRun({ text: '% CBN:', size: 16, bold: true }),
          new TextRun({ text: '[X]', size: 16, color: '808080' }),
          new TextRun({ text: '% THCV:', size: 16, bold: true }),
          new TextRun({ text: '[X]', size: 16, color: '808080' }),
          new TextRun({ text: '%', size: 16 }),
        ],
        spacing: { before: 0, after: 20 },
      }),

      // Line 7 — Terpenes
      new Paragraph({
        children: [
          new TextRun({ text: '[Terpene 1: X%]  [Terpene 2: X%]  [Terpene 3: X%]', size: 16, color: '808080' }),
        ],
        spacing: { before: 0, after: 20 },
      }),

      // Line 8 — Extraction
      new Paragraph({
        children: [new TextRun({ text: 'Extracted with CO2', size: 16 })],
        spacing: { before: 0, after: 40 },
      }),

      // Divider
      hRule(),

      // Required warnings
      centeredBold('THIS PRODUCT CONTAINS CANNABIS', 18),
      centered('KEEP OUT OF REACH OF CHILDREN', 16),
    ],
  }],
});

// ═══════════════════════════════════════════════════════════════════════════
// DOCUMENT 2: SETUP GUIDE
// Standard letter page with purchasing + printer instructions
// ═══════════════════════════════════════════════════════════════════════════
const h1 = (text) => new Paragraph({
  children: [new TextRun({ text, bold: true, size: 32 })],
  spacing: { before: 300, after: 100 },
});
const h2 = (text) => new Paragraph({
  children: [new TextRun({ text, bold: true, size: 24, color: '2E4057' })],
  spacing: { before: 200, after: 80 },
});
const h3 = (text) => new Paragraph({
  children: [new TextRun({ text, bold: true, size: 20 })],
  spacing: { before: 160, after: 60 },
});
const p = (text, size = 20) => new Paragraph({
  children: [new TextRun({ text, size })],
  spacing: { before: 0, after: 80 },
});
const bullet = (text, size = 20) => new Paragraph({
  children: [new TextRun({ text, size })],
  bullet: { level: 0 },
  spacing: { before: 0, after: 60 },
});
const note = (text) => new Paragraph({
  children: [new TextRun({ text: `NOTE: ${text}`, size: 18, italics: true, color: '555555' })],
  spacing: { before: 60, after: 60 },
});

const guideDoc = new Document({
  sections: [{
    properties: {},
    children: [

      // ── Title ──────────────────────────────────────────────────────────
      centeredBold('Resin8 Disposable Label — Printer Setup Guide', 36),
      centered('Cannavative Extracts, LLC  |  Zebra ZD420  |  50mm × 40mm Labels', 20),
      hRule(),

      // ── SECTION 1: Label Stock ─────────────────────────────────────────
      h1('SECTION 1 — Label Stock to Purchase'),

      h2('Label Specifications'),
      bullet('Size: 2" × 1.57"  (50mm × 40mm)  — or nearest standard: 2" × 1.5"'),
      bullet('Type: Direct Thermal (DT) — no ribbon required'),
      bullet('Color: White matte'),
      bullet('Adhesive: Permanent'),
      bullet('Core: 1" (fits ZD420 standard spindle)'),
      bullet('Winding: Outside wound'),
      bullet('Gap: 3mm gap/notch between labels'),

      h2('Recommended Sources'),

      h3('Option A — Zebra Genuine (Most Reliable)'),
      bullet('Part #: 10010060'),
      bullet('Description: Zebra Z-Select 2000D, 2" × 1.5" Direct Thermal'),
      bullet('Order from: zebra.com or any authorized reseller'),
      bullet('Approx. cost: ~$40–$60 per roll (800 labels/roll)'),
      note('Closest standard to 50×40mm. Label will print at 50×38mm — adjust ^LL to 305 if needed.'),

      h3('Option B — Uline (Budget, Ships Fast)'),
      bullet('Part #: S-19164  (2" × 1.5" thermal, 1" core)'),
      bullet('Order from: uline.com'),
      bullet('Approx. cost: ~$30–$40 per roll'),

      h3('Option C — Custom Cut (Exact 50×40mm)'),
      bullet('Vendor: Lightning Labels (lightninglabels.com) or StickerGiant'),
      bullet('Specify: 50mm × 40mm, direct thermal, 1" core, outside wound, 3mm gap'),
      bullet('Minimum order: typically 250–500 labels'),
      note('Best for bulk orders. Exact size eliminates any margin adjustment.'),

      hRule(),

      // ── SECTION 2: Printer Setup ───────────────────────────────────────
      h1('SECTION 2 — Zebra ZD420 Printer Setup'),

      h2('Step 1 — Install Label Stock'),
      bullet('Open the top cover by pressing the release button on the front.'),
      bullet('Pull the media guides apart and load the label roll so it unwinds from the BOTTOM.'),
      bullet('Feed the labels through the media slot until they extend past the front edge.'),
      bullet('Slide the media guides in until they lightly touch the edges of the label roll.'),
      bullet('Close the top cover.'),

      h2('Step 2 — Calibrate the Printer'),
      bullet('With labels loaded and printer powered on, hold the FEED button for 2 seconds.'),
      bullet('The printer will advance several labels and then stop — this calibrates the gap sensor.'),
      bullet('Print a configuration label to confirm: hold both FEED + CANCEL for 2 seconds.'),

      h2('Step 3 — Send One-Time Configuration'),
      p('Connect the ZD420 to your computer via USB. Open Notepad, paste the following ZPL configuration block, save as "zd420-config.zpl", then send it to the printer using the command in Step 4.'),

      new Paragraph({
        children: [new TextRun({
          text: [
            '^XA',
            '^MMT              ; Tear-off mode',
            '^PW399            ; Print width = 50mm (399 dots @ 203 DPI)',
            '^LL319            ; Label length = 40mm (319 dots @ 203 DPI)',
            '^MAN              ; Auto-sense label gap',
            '^PR4,4            ; Print speed = 4 ips',
            '^MD10             ; Darkness = 10 (adjust 0–30 if needed)',
            '^LH0,0            ; Label home = top-left, no offset',
            '^JMA              ; Save all settings to printer memory',
            '^XZ',
          ].join('\n'),
          size: 18,
          font: 'Courier New',
        })],
        spacing: { before: 80, after: 80 },
        indent: { left: convertInchesToTwip(0.5) },
      }),

      h2('Step 4 — Send ZPL to Printer (Windows)'),
      p('Open Command Prompt and run:'),
      new Paragraph({
        children: [new TextRun({
          text: 'copy /b "zd420-config.zpl" \\\\\\\\.\\\\ USB001',
          size: 18,
          font: 'Courier New',
        })],
        indent: { left: convertInchesToTwip(0.5) },
        spacing: { before: 40, after: 80 },
      }),
      note('If your Zebra is connected to a different USB port, replace USB001 with USB002, etc. Check Device Manager > Ports if unsure.'),

      h2('Step 5 — Print a Label'),
      bullet('Open the label file: EXAMPLE-apple-jack.zpl'),
      bullet('Send to printer: copy /b "EXAMPLE-apple-jack.zpl" \\\\.\\USB001'),
      bullet('The label should print immediately.'),

      h2('Darkness / Quality Adjustment'),
      p('If labels print too light or too dark, resend the config with a different ^MD value:'),
      bullet('^MD8  → lighter (use if ink is bleeding or smearing)'),
      bullet('^MD10 → default starting point'),
      bullet('^MD15 → darker (use if text appears faint)'),
      bullet('^MD20 → very dark (use on rough or matte stocks)'),

      hRule(),

      // ── SECTION 3: Printing Workflow ───────────────────────────────────
      h1('SECTION 3 — Daily Printing Workflow'),

      h2('For each new batch:'),
      bullet('Open resin8-disposable.zpl in any text editor (Notepad works).'),
      bullet('Replace each [PLACEHOLDER] with the batch-specific value from your COA.'),
      bullet('Save the file with a new name (e.g., "CJ Apple Jack 125289.zpl").'),
      bullet('Send to printer: copy /b "CJ Apple Jack 125289.zpl" \\\\.\\USB001'),
      bullet('Verify first label before printing the full run.'),

      h2('Placeholders Reference'),
      bullet('[STRAIN]         — Strain name only, e.g., Apple Jack'),
      bullet('[MM/DD/YY] ×3    — Produced, Tested, Packaged dates'),
      bullet('[PRODUCTION RUN NUMBER] — Full run number from METRC/COA'),
      bullet('[THC%] [THC mg]  — From COA, e.g., 87.89 and 878.9'),
      bullet('[CBD%] [CBD mg]  — From COA'),
      bullet('[CBC/CBG/CBN/THCV %] — Minor cannabinoids from COA'),
      bullet('[Terpene 1/2/3]  — Top 3 terpenes with percentages'),

      hRule(),

      // ── SECTION 4: Compliance Reference ───────────────────────────────
      h1('SECTION 4 — Compliance Reference'),
      p('All fields on this label are required by Nevada Cannabis Compliance Regulation 12, Section 12.035 (Production Facility label before sale to retail store).'),

      new Paragraph({
        children: [
          new TextRun({ text: 'Regulation source: ', size: 20, bold: true }),
          new TextRun({ text: 'https://ccb.nv.gov/wp-content/uploads/2025/07/Reg-12.pdf', size: 20 }),
        ],
        spacing: { before: 60, after: 60 },
      }),

      h2('Required Fields (NCCR 12.035)'),
      bullet('Establishment name + cannabis establishment ID  [§12.035(a)]'),
      bullet('Production run number  [§12.035(c)]'),
      bullet('"Keep out of reach of children"  [§12.035(d)]'),
      bullet('Date of production / testing / packaging  [§12.035(e)]'),
      bullet('Cannabinoid profile and potency levels  [§12.035(f)]'),
      bullet('Total THC in milligrams  [§12.035(h)]'),
      bullet('Net weight  [§12.035(k)]'),
      bullet('Extraction process and solvent used  [§12.035(l)]'),
      bullet('"THIS PRODUCT CONTAINS CANNABIS"  [§12.035(n)]'),

      h2('Font Requirements  [§12.010(3)]'),
      bullet('Minimum 8-point font — all text on this label uses ≥8pt'),
      bullet('No italic text permitted anywhere on the label'),

      h2('Not Required for Non-Edible Concentrates/Vapes'),
      bullet('Nevada universal cannabis symbol (required for edibles only — §12.015, §12.020)'),
      bullet('"This product may be unlawful outside Nevada" (sales facility obligation — §12.045)'),
      bullet('"This product may have intoxicating effects" (sales facility obligation — §12.045)'),
    ],
  }],
});

// ── Write both files ─────────────────────────────────────────────────────────
(async () => {
  const labelBuf = await Packer.toBuffer(labelDoc);
  fs.writeFileSync('resin8-disposable-TEMPLATE.docx', labelBuf);
  console.log('Written: resin8-disposable-TEMPLATE.docx');

  const guideBuf = await Packer.toBuffer(guideDoc);
  fs.writeFileSync('Resin8-Disposable-Setup-Guide.docx', guideBuf);
  console.log('Written: Resin8-Disposable-Setup-Guide.docx');
})();
