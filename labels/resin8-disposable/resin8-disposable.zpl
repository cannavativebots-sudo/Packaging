; =============================================================================
; LABEL: Resin8 Disposable — Cannavative Extracts, LLC
; PRINTER: Zebra ZD420 @ 203 DPI
; SIZE: 50mm x 40mm (399 x 319 dots) — order 2"x1.57" or nearest standard
; COMPLIANCE: NCCR Regulation 12 §12.035 (Production Facility)
; FONT MINIMUM: 8pt = 23 dots @ 203 DPI ✓
; NOTE: NV cannabis symbol NOT required for non-edibles (NCCR 12.015/12.020)
;       Retail-only warnings NOT required for production facility (NCCR 12.045)
;
; PLACEHOLDERS — replace before printing:
;   {{STRAIN}}       e.g., Apple Jack
;   {{PRODUCED}}     e.g., 03/06/26
;   {{TESTED}}       e.g., 03/10/26
;   {{PACKAGED}}     e.g., 03/11/26
;   {{RUN_NUMBER}}   e.g., 1A4040300000273000125289
;   {{THC_PCT}}      e.g., 87.89
;   {{THC_MG}}       e.g., 878.9
;   {{CBD_PCT}}      e.g., 0.24
;   {{CBD_MG}}       e.g., 2.4
;   {{CBC_PCT}}      e.g., 0
;   {{CBG_PCT}}      e.g., 1.09
;   {{CBN_PCT}}      e.g., 0.63
;   {{THCV_PCT}}     e.g., 0.52
;   {{TERPENE_1}}    e.g., a-Pinene:4.18%
;   {{TERPENE_2}}    e.g., b-Pinene:0.55%
;   {{TERPENE_3}}    e.g., Caryophyllene:0.13%
; =============================================================================

^XA
^PW399
^LL319
^LH0,0
^CI28

; 12.035(a) — Establishment name + ID
^FO8,6^A0N,23,12^FDCannavative Extracts, LLC  #72326121663352213340^FS

; Product name (strain)
^FO8,32^A0N,25,14^FD{{STRAIN}} Resin8 Disposable^FS

; 12.035(e) — Date of production / testing / packaging
^FO8,60^A0N,23,12^FDProd: {{PRODUCED}}   Test: {{TESTED}}   Pkg: {{PACKAGED}}^FS

; 12.035(c) — Production run number
^FO8,86^A0N,23,12^FDRun#: {{RUN_NUMBER}}^FS

; 12.035(f)(h) — Cannabinoid profile + total THC (mg)  |  12.035(k) — Net weight
^FO8,112^A0N,23,12^FDTHC: {{THC_PCT}}%  ({{THC_MG}}mg/pkg)   Net Wt: 1.0g^FS

; 12.035(f) — Additional cannabinoids
^FO8,138^A0N,23,12^FDCBD:{{CBD_PCT}}%({{CBD_MG}}mg) CBC:{{CBC_PCT}}% CBG:{{CBG_PCT}}% CBN:{{CBN_PCT}}% THCV:{{THCV_PCT}}%^FS

; Terpene profile
^FO8,164^A0N,23,12^FD{{TERPENE_1}}  {{TERPENE_2}}  {{TERPENE_3}}^FS

; 12.035(l) — Extraction process + solvent
^FO8,190^A0N,23,12^FDExtracted with CO2^FS

; Divider
^FO5,216^GB389,2,2^FS

; 12.035(n) — Required warning
^FO8,221^A0N,25,14^FB383,1,0,C^FDTHIS PRODUCT CONTAINS CANNABIS^FS

; 12.035(d) — Required warning
^FO8,249^A0N,23,12^FB383,1,0,C^FDKEEP OUT OF REACH OF CHILDREN^FS

^XZ
