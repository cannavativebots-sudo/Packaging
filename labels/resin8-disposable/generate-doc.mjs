import {
  Document, Packer, Paragraph, TextRun, AlignmentType,
  BorderStyle, convertInchesToTwip, Table, TableRow, TableCell,
  WidthType, VerticalAlign
} from "docx";
import { writeFileSync } from "fs";

// Label size: 2.0" x 2.0"
const W  = convertInchesToTwip(2.0);
const H  = convertInchesToTwip(2.0);
const MG = convertInchesToTwip(0.1);            // 0.1" — safe printable margin for ZD420
const CW = convertInchesToTwip(2.0 - 0.1 * 2); // content width = 1.8"

const FONT   = "Arial Narrow";
const SZ_TITLE = 20; // 10pt bold — product name
const SZ_BODY  = 16; // 8pt — minimum per NCCR Reg 12
const TIGHT  = { line: 175, lineRule: "exact", before: 0, after: 0 };

const t = (text, sz = SZ_BODY, bold = false) =>
  new TextRun({ text, font: FONT, size: sz, bold });

const p = (runs, align = AlignmentType.LEFT, spacing = TIGHT) =>
  new Paragraph({
    children: Array.isArray(runs) ? runs : [runs],
    alignment: align,
    spacing,
  });

// Border definitions
const THIN = { style: BorderStyle.SINGLE, size: 4, color: "000000" };
const HAIR = { style: BorderStyle.SINGLE, size: 2, color: "888888" };
const NONE = { style: BorderStyle.NONE,   size: 0, color: "FFFFFF" };

// Thin horizontal rule between sub-sections within a group
const rule = () => new Paragraph({
  border: { bottom: HAIR },
  spacing: { line: 80, lineRule: "exact", before: 0, after: 0 },
  children: [],
});

// Each group is a table row — borderBottom: false | "thin" | "hair"
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

const doc = new Document({
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
            top:          NONE,
            bottom:       NONE,
            left:         NONE,
            right:        NONE,
            insideH:      NONE,
            insideV:      NONE,
          },
          rows: [

            // ── GROUP 1: Flavor / Product line / Net Wt ──────────────────
            group([
              p([t("Apple Jack", SZ_TITLE, true)], AlignmentType.CENTER),
              p([t("Resin8 Disposable", SZ_TITLE, true)], AlignmentType.CENTER),
              p([t("Net Wt: 1.0g")], AlignmentType.CENTER),
            ], "hair"),

            // ── GROUP 2: Run# + Dates ─────────────────────────────────────
            group([
              p([t("Run#: 1A4040300000273000125289")]),
              p([t("Prod: 3/6/26  Test: 3/10/26  Pkg: 3/11/26")]),
            ]),                                      // solid line below dates

            // ── GROUP 3: Cannabinoids + Terpenes ─────────────────────────
            group([
              p([t("Total THC: 87.89%  (878.9mg/pkg)")]),
              p([t("Total CBD: 0.24%  (2.4mg/pkg)")]),
              rule(),
              p([t("CBC: 0%  CBG: 1.09%  CBN: 0.63%  THCV: 0.52%")]),
              rule(),
              p([t("a-Pinene: 4.18%  b-Pinene: 0.55%  Caryophyllene: 0.13%")]),
            ]),                                      // solid line below terpenes

            // ── GROUP 4: Solvent / Extraction method ─────────────────────
            group([
              p([t("Extracted with CO2")], AlignmentType.CENTER),
            ], false),                               // no border on last group

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

const buf = await Packer.toBuffer(doc);
writeFileSync("Apple Jack Resin8 Disposable.docx", buf);
console.log("Done: Apple Jack Resin8 Disposable.docx");
