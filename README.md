# Cannavative Extracts — Packaging Label Templates

Nevada cannabis production facility label templates for Zebra ZD420 thermal printer.
All labels comply with **NCCR Regulation 12** (July 2025 revision).

## Printer
- **Zebra ZD420** @ 203 DPI
- Label stock: **2" × 2"** direct thermal — Uline S-21297 (see printer-setup/ for full purchasing info)

## Labels

| Label | File | Size | Status |
|---|---|---|---|
| Resin8 Disposable | labels/resin8-disposable/ | 2" x 2" (50.8mm x 50.8mm) | ✅ Ready |

## Repository Structure

```
labels/
  resin8-disposable/
    resin8-disposable.zpl        # Template with {{PLACEHOLDERS}}
    EXAMPLE-apple-jack.zpl       # Filled example (batch 125289)
  _shared/
    nevada-symbol-instructions.md  # How to add required NV cannabis symbol

printer-setup/
  zd420-setup.md                 # Printer config, stock sourcing, troubleshooting
```

## Compliance Reference
- **Regulation 12**: https://ccb.nv.gov/wp-content/uploads/2025/07/Reg-12.pdf
- **Applicable section**: NCCR 12.035 (production facility label before sale to retail)
- **Font minimum**: 8-point (= 23 dots at 203 DPI) — all templates use ≥23 dot fonts
- **No italics** permitted on any label text

## Required Fields Checklist (NCCR 12.035)

- [x] Cannabis establishment name + ID
- [x] Production run number
- [x] Date of production / testing / packaging
- [x] Cannabinoid profile and potency (THC%, CBD%, mg totals)
- [x] Total THC in milligrams
- [x] Net weight
- [x] Extraction process and solvent (CO2)
- [x] "THIS PRODUCT CONTAINS CANNABIS"
- [x] "KEEP OUT OF REACH OF CHILDREN"
- [ ] Nevada universal cannabis symbol — **see labels/_shared/nevada-symbol-instructions.md**
