# Velocita Tape publication evidence

Source: https://github.com/vishaljha2121/Velocita/tree/orderbook/baseline at 1b86010 (tape code at 8577e42 plus the
evidence commit). Every figure in the article comes from `docs/tape/evidence/` in that commit, which was
regenerated on 2026-11-20 from the archived segments.

## Claim map

- 289,636 verdicts, 91.0% 3 of 3, 0 divergent, spread p50/p90/p99 19/43/289 ms, clock bound 3.9 ms, hourly shares:
  evidence/report-2026-11-12/summary.json (completeness, timeliness, periods). Rerun byte-identical to the original.
- 274,683 verdicts, 274,532 at 2 of 3 (99.95%), 151 at 1 of 3, 0 divergent, p50/p90/p99 10/24/105 ms, every hour at
  least 99.73%, gaps 5.6 s and 8.2 s, 0 gap events, crossed, EBBO mismatches: evidence/report-2026-11-13-two-recorders/summary.json.
- 564,319 = 289,636 + 274,683; 21 hours = 13.772 + 7.203 recorded hours.
- Trades 187/4/30 of 221 and 609/26/46 of 681: summary.json trades.class.
- Segment entries, heads, roots, links: evidence/verify/*.json. Segment 1794585600 verified with its 0-byte
  head-11520.json excluded (191 of 192 heads); the article says so.
- Book kit 23,723 books, trap results: evidence/book-kit/*.json.
- Proof page six checks and tamper failure: evidence/proof/check-node*.json; hosted copy is
  evidence/proof/proof.html, byte-identical to the 2026-11-13 build.
- 16 suites, 34 of 34 mutants: evidence/tests/.
- Incidents and their numbers (36 terms, 1 to 2.5 MB/s, 1.22 GB in four minutes, 30 KB/s log growth, 60% of frames,
  5,314 sends for 303 entries, watchdog 600 KB/s for 60 s, 5 minute quiet restart): docs/tape/DECISIONS.md D-42, D-43,
  D-46, D-47, D-50, D-53, D-54, D-56, D-58.
- Feed rules: D-03, D-04, D-13, D-25, D-26. Book shape and silences: FINDINGS-2026-11-12-report.md.
- atomic_write excerpt: src/tape_voter.cpp lines 27 to 34, comments added for the article.

The disk-full cause of the 2026-11-13 stop is stated as likely, not proven: the empty head was written at the
tape's last moment and NUC1's root filesystem was at 100% on 2026-11-20.

## Hosted files

public/tape/proof.html, report-2026-11-12.html and report-2026-11-13.html are the evidence files unchanged. They are
self-contained (no network requests). The proof bundle publishes one NVDAC-USDC book at one instant, by owner
decision. No raw feed frames are published.

## Validation

Next production build and static export passed with Node 18.20.8 (Node 26 cannot run Next 12). Headless Chrome
render at 1440 px checked: Mermaid diagrams render, charts, tables and code blocks fit. The served proof page shows
"Verified ... signed by voters 1, 2, 3" with all six checks. Headless Chrome cannot narrow its window to 390 px, so
it clips the existing posts in the same way as this one; no real mobile device check was done.
