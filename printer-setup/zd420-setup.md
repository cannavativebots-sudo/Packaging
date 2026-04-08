# Zebra ZD420 Printer Setup — Cannavative Labels

## Label Stock to Purchase

**Recommended stock for Resin8 Disposable label:**

| Spec | Value |
|---|---|
| Size | **2" x 2" (50.8mm x 50.8mm)** |
| Type | Direct Thermal (DT) — no ribbon needed |
| Core | 1" or 3" (match your ZD420 spindle) |
| Perforation | Die-cut, gap-sensing |

**Where to buy:**
- Zebra genuine: part # 10010044 (2"×2" DT, 2580/roll)
- Amazon alternatives: search "2x2 direct thermal labels 1 inch core" — brands like OfficeSmartLabels, MFLABEL work fine
- **Uline: S-21297** (2"×2" white thermal, 500/roll — desktop qty, no min order)

---

## Initial Printer Configuration (ZD420)

### Step 1 — Set label size via front panel

1. Hold **PAUSE** + **CANCEL** buttons simultaneously while powering on
2. Keep holding until the indicator flashes — this enters **Configuration Mode**
3. Print a configuration label to confirm current settings

### Step 2 — Set via ZPL commands (recommended — send once)

Open a connection to the printer (USB or network) and send this one-time config string:

```zpl
^XA
^MMT              ; tear-off mode (change to ^MMC for cutter if installed)
^PW406            ; print width = 2" (406 dots at 203dpi)
^LL406            ; label length = 2" (406 dots at 203dpi)
^MAN              ; auto-sense label gap
^PR4,4            ; print speed 4 ips / slew speed 4 ips
^MD10             ; darkness 10 (adjust 0-30 to taste; start at 10)
^LH0,0            ; label home = top-left, no offset
^JMA              ; save settings to memory
^XZ
```

**Send this config block** using any of these methods:
- **ZebraNet Bridge / ZPL Toolbox** (Zebra's free utility): paste and send
- **Windows** — `copy config.zpl \\COMPUTER\ZebraZD420` (if shared via USB)
- **Direct USB raw print**: `copy /b config.zpl \\.\USB001` in Command Prompt

### Step 3 — Calibrate media

After loading 2"×2" label stock:
1. Press and hold **FEED** button for 2 seconds — printer will advance and measure gap
2. Print a test label to confirm positioning

---

## Margin / Offset Adjustments

If label content is shifted, adjust the `^LH` (Label Home) command:
- `^LH0,0` = no offset (use this as baseline)
- `^LH5,5` = 5 dots right, 5 dots down (~0.6mm each direction)
- `^LH10,0` = 10 dots right only

These are set **inside each ZPL label** (see the template file).

---

## DPI Reference (ZD420 standard = 203 DPI)

| Measurement | Dots at 203 DPI |
|---|---|
| 1mm | 8 dots |
| 5mm | 40 dots |
| 10mm | 80 dots |
| 25.4mm (1") | 203 dots |
| 50.8mm (2") | 406 dots |

**8-point font minimum (NCCR 12.010):**
- 8pt = 8/72 inch = 0.111" = 22.6 dots
- Use `^A0N,23,12` or larger in all ZPL templates (23-dot height = ~8.3pt ✓)

---

## Sending Labels to Print

For daily use, send the filled-in ZPL to the printer using one of:

1. **Zebra ZBI (recommended)**: install ZebraDesigner Essentials (free) to preview and print
2. **Raw USB print** (Windows Command Prompt):
   ```
   copy /b "resin8-disposable-filled.zpl" \\.\USB001
   ```
3. **Network (if using Ethernet adapter)**: send via port 9100 with any socket client

---

## Troubleshooting

| Problem | Fix |
|---|---|
| Label prints too light | Increase `^MD` value (e.g., `^MD15`) |
| Label prints too dark / smearing | Decrease `^MD` value |
| Content cut off on right | Reduce `^PW` or shrink right-most fields |
| Content cut off on bottom | Increase `^LL` or reduce font/line count |
| Blank labels feeding | Re-calibrate: hold FEED 2 sec with media loaded |
| Text too small to read | All fonts in template are at 23 dots = ~8.3pt (legal min) |
