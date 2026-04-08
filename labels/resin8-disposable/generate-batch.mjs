import {
  Document, Packer, Paragraph, TextRun, AlignmentType,
  BorderStyle, convertInchesToTwip, Table, TableRow, TableCell,
  WidthType, VerticalAlign
} from "docx";
import { writeFileSync } from "fs";

const W  = convertInchesToTwip(2.0);
const H  = convertInchesToTwip(2.0);
const MG = convertInchesToTwip(0.1);
const CW = convertInchesToTwip(2.0 - 0.1 * 2);

const FONT     = "Arial Narrow";
const SZ_TITLE = 20;
const SZ_BODY  = 16;
const TIGHT    = { line: 175, lineRule: "exact", before: 0, after: 0 };

const THIN = { style: BorderStyle.SINGLE, size: 4, color: "000000" };
const HAIR = { style: BorderStyle.SINGLE, size: 2, color: "888888" };
const NONE = { style: BorderStyle.NONE,   size: 0, color: "FFFFFF" };

const t = (text, sz = SZ_BODY, bold = false) =>
  new TextRun({ text, font: FONT, size: sz, bold });

const p = (runs, align = AlignmentType.LEFT, spacing = TIGHT) =>
  new Paragraph({ children: Array.isArray(runs) ? runs : [runs], alignment: align, spacing });

const rule = () => new Paragraph({
  border: { bottom: HAIR },
  spacing: { line: 80, lineRule: "exact", before: 0, after: 0 },
  children: [],
});

const group = (paragraphs, borderBottom = "thin") =>
  new TableRow({
    children: [
      new TableCell({
        width:         { size: CW, type: WidthType.DXA },
        verticalAlign: VerticalAlign.TOP,
        margins:       { top: 30, bottom: 30, left: 60, right: 60 },
        borders: {
          top:    NONE,
          left:   NONE,
          right:  NONE,
          bottom: borderBottom === "thin" ? THIN
                : borderBottom === "hair" ? HAIR
                : NONE,
        },
        children: paragraphs,
      }),
    ],
  });

function buildDoc(data) {
  return new Document({
    sections: [
      {
        properties: {
          page: {
            size:   { width: W, height: H },
            margin: { top: MG, bottom: MG, left: MG, right: MG },
          },
        },
        children: [
          new Table({
            width:  { size: CW, type: WidthType.DXA },
            borders: {
              top: NONE, bottom: NONE, left: NONE,
              right: NONE, insideH: NONE, insideV: NONE,
            },
            rows: [

              // GROUP 1: Flavor / Product line / Net Wt
              group([
                p([t(data.strain, SZ_TITLE, true)], AlignmentType.CENTER),
                p([t("Resin8 Disposable", SZ_TITLE, true)], AlignmentType.CENTER),
                p([t(`Net Wt: ${data.netWt}`)], AlignmentType.CENTER),
              ], "hair"),

              // GROUP 2: Run# + Dates
              group([
                p([t(`Run#: ${data.run}`)]),
                p([t(`Prod: ${data.prod}  Test: ${data.test}  Pkg: ${data.pkg}`)]),
              ]),

              // GROUP 3: Cannabinoids + Terpenes
              group([
                p([t(`Total THC: ${data.thcPct}%  (${data.thcMg}mg/pkg)`)]),
                p([t(`Total CBD: ${data.cbdPct}%  (${data.cbdMg}mg/pkg)`)]),
                rule(),
                p([t(`CBC: ${data.cbc}%  CBG: ${data.cbg}%  CBN: ${data.cbn}%  THCV: ${data.thcv}%`)]),
                rule(),
                p([t(`${data.terp1}  ${data.terp2}  ${data.terp3}`)]),
              ]),

              // GROUP 4: Solvent — centered
              group([
                p([t(data.solvent)], AlignmentType.CENTER),
              ], false),

            ],
          }),
          // Suppress Word's mandatory trailing paragraph — prevents blank second label
          new Paragraph({
            children: [new TextRun({ text: "", size: 1 })],
            spacing: { line: 20, lineRule: "exact", before: 0, after: 0 },
          }),
        ],
      },
    ],
  });
}

// ── Batch data ────────────────────────────────────────────────────────────────

const labels = [
  {
    filename: "Sunset Sherbet Resin8 Disposable.docx",
    strain:   "Sunset Sherbet",
    netWt:    "1.0g",
    run:      "1A4040300000273000125352",
    prod:     "4/3/26", test: "4/6/26", pkg: "4/8/26",
    thcPct:   "82.85", thcMg: "828.5",
    cbdPct:   "0.83",  cbdMg: "8.3",
    cbc: "1.33", cbg: "2.09", cbn: "1.28", thcv: "0.94",
    terp1: "a-Pinene: 2.68%", terp2: "Limonene: 1.55%", terp3: "b-Pinene: 0.35%",
    solvent: "Extracted with CO2",
  },
  {
    filename: "Tropic Thunder Resin8 Disposable.docx",
    strain:   "Tropic Thunder",
    netWt:    "1.0g",
    run:      "1A4040300000273000125353",
    prod:     "4/3/26", test: "4/6/26", pkg: "4/7/26",
    thcPct:   "82.43", thcMg: "824.3",
    cbdPct:   "0.75",  cbdMg: "7.5",
    cbc: "1.21", cbg: "2.30", cbn: "1.34", thcv: "0.91",
    terp1: "a-Pinene: 2.92%", terp2: "Limonene: 1.55%", terp3: "b-Pinene: 0.34%",
    solvent: "Extracted with CO2",
  },
  {
    filename: "Blueberry Resin8 Disposable.docx",
    strain:   "Blueberry",
    netWt:    "1.0g",
    run:      "1A4040300000273000125351",
    prod:     "4/3/26", test: "4/6/26", pkg: "4/7/26",
    thcPct:   "79.90", thcMg: "799.0",
    cbdPct:   "0.84",  cbdMg: "8.4",
    cbc: "0.85", cbg: "1.91", cbn: "1.41", thcv: "1.01",
    terp1: "a-Pinene: 4.51%", terp2: "b-Pinene: 0.60%", terp3: "Linalool: 0.32%",
    solvent: "Extracted with CO2",
  },
];

for (const data of labels) {
  const buf = await Packer.toBuffer(buildDoc(data));
  writeFileSync(data.filename, buf);
  console.log(`Done: ${data.filename}`);
}
