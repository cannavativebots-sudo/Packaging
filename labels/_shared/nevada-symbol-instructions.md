# Nevada Universal Cannabis Symbol — Zebra ZD420

## Requirement
NCCR 12.015(1)(e) requires the Nevada CCB-approved universal cannabis symbol on all 
cannabis product labels. The symbol must appear on the final label.

## Getting the Symbol

1. Download the official symbol from:
   https://ccb.nv.gov (look under Resources > Universal Symbol)
   
2. The CCB provides it as a PNG or vector file.

## Converting for Zebra Printer

### Option A — ZebraDesigner (free, easiest)
1. Open ZebraDesigner Essentials (free download from zebra.com)
2. Create a 2"x2" label template
3. Insert > Graphic > import the PNG
4. Resize to approximately 10mm x 10mm (80x80 dots at 203dpi)
5. Position in top-right corner of label: X=310, Y=6 in dot coordinates
6. Export/print as ZPL — the designer will encode the graphic automatically

### Option B — Convert PNG to GRF manually
Use Zebra's free "ZBI Convert" or the online tool at labelary.com:
1. Upload the PNG
2. Get the ^GFA (graphic field) ZPL command
3. Paste into the template where indicated

### Placing in ZPL Template
Once you have the ^GFA string, add it to the template at position ^FO310,6:

```zpl
^FO310,6
^GFA,nnn,nnn,nnn,
[hex data here]
^FS
```

Or if stored in printer memory as NV_SYM.GRF:
```zpl
^FO310,6^XGR:NV_SYM.GRF,1,1^FS
```

## Symbol Size on 50mm x 51mm Label
Recommended: 12mm x 12mm = approximately 96 x 96 dots at 203 DPI
Place in upper-right corner so it doesn't interfere with text.
Adjust the company name / strain text fields to leave room on the right if needed.
