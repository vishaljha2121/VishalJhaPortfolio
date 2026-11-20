const card = 'border: 1px solid var(--border); border-radius: 8px; padding: 1rem 1.1rem; background: rgba(255,255,255,0.6);'
const big = 'font-family: var(--font-serif); font-size: 2rem; line-height: 1.1;'
const small = 'font-size: 0.85rem; color: var(--secondary); margin-top: 0.4rem;'
const pre = 'background: #ffffff; color: var(--foreground); border: 1px solid var(--border); padding: 1.25rem 1.5rem; border-radius: 8px; overflow-x: auto; font-family: monospace; font-size: 0.9rem; margin-bottom: 2rem'
const mermaid = 'display: flex; justify-content: center; margin-bottom: 2rem; background: transparent;'
const th = 'padding: 0.75rem 1rem 0.75rem 0;'
const td = 'padding: 0.75rem 1rem 0.75rem 0; vertical-align: top;'
const tdm = 'padding: 0.75rem 0; color: var(--secondary); vertical-align: top;'
const row = 'border-bottom: 1px solid var(--border);'
const table = 'width: 100%; text-align: left; border-collapse: collapse; margin: 1.5rem 0 2rem; font-size: 0.95rem;'

const repo = 'https://github.com/vishaljha2121/Velocita/tree/orderbook/baseline'
const blob = 'https://github.com/vishaljha2121/Velocita/blob/orderbook/baseline'
const evidence = blob + '/docs/tape/evidence/README.md'
const site = '/VishalJhaPortfolio/tape'

const stat = (value: string, label: string, color = '') =>
    `<div style="${card}"><div style="${big}${color ? ` color: ${color};` : ''}">${value}</div><div style="${small}">${label}</div></div>`

const red = (title: string, text: string, color = '#ef4444') =>
    `<div style="border-left: 3px solid ${color}; padding: 0.5rem 1rem;"><strong>${title}</strong><div style="color: var(--secondary); font-size: 0.95rem;">${text}</div></div>`

const hours: [string, number, string][] = [
    ['00:00', 43.9, 'resend floods, refresh race'],
    ['01:00', 65.6, ''],
    ['02:00', 57.1, ''],
    ['03:00', 45.2, 'recorder fix live 03:56'],
    ['04:00', 98.7, ''],
    ['05:00', 100.0, ''],
    ['06:00', 86.8, 'watchdog stop'],
    ['07:00', 98.6, ''],
    ['08:00', 83.3, 'watchdog stop'],
    ['09:00', 100.0, ''],
    ['10:00', 100.0, ''],
    ['11:00', 100.0, ''],
    ['12:00', 100.0, ''],
    ['13:00', 100.0, ''],
    ['14:00', 88.5, 'flood, tape stopped'],
    ['18:00', 99.0, 'new 4-hour segment'],
    ['19:00', 94.6, 'dashboard burst'],
]

const hourBars = hours.map(([h, v]) => {
    const color = v >= 98 ? '#22c55e' : v >= 80 ? '#f59e0b' : '#ef4444'
    return `<div style="display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.3rem;"><div style="width: 3.2rem; font-size: 0.8rem; font-family: monospace;">${h}</div><div style="flex: 1; background: rgba(0,0,0,0.05); border-radius: 3px;"><div style="width: ${v}%; background: ${color}; height: 16px; border-radius: 3px;"></div></div><div style="width: 3.4rem; font-size: 0.8rem; font-weight: 600; text-align: right;">${v.toFixed(1)}%</div></div>`
}).join('\n')

const bar = (label: string, pct: number, value: string, color: string) =>
    `<div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.4rem;"><div style="width: 9rem; font-size: 0.85rem;">${label}</div><div style="flex: 1; background: rgba(0,0,0,0.05); border-radius: 4px;"><div style="width: ${pct}%; min-width: 3px; background: ${color}; height: 22px; border-radius: 4px;"></div></div><div style="width: 5rem; font-size: 0.9rem; font-weight: 600;">${value}</div></div>`

export const velocitaTapePost = {
    slug: 'velocita-tape-a-verifiable-recording-of-a-market-data-feed',
    title: 'Velocita Tape: A Verifiable Recording of a Public Market-Data Feed',
    date: '2026-11-20',
    description: 'Three home machines record the same exchange order-book feed, agree on it through Raft, and sign it into a Merkle log anyone can check offline. 21 hours, 564,319 updates compared, zero that differed.',
    tags: ['Distributed Systems', 'Raft', 'C++20', 'Aeron', 'Merkle Trees', 'Market Data', 'Verification'],
    githubUrl: repo,
    content: `
<p>
    An exchange sends its order book as a stream: a snapshot, then changes. Every client folds those changes into its own copy of the book. If a client misses or misapplies one message, its book is wrong, and nothing on the screen says so. The exchange only knows what it sent. One client only knows what it received. Nobody can show whether the feed was complete, correct, timely and the same for everyone.
</p>

<p>
    <strong>Velocita Tape</strong> measures those things from outside. Three machines on my desk (two mini PCs and a Raspberry Pi 5) each hold their own connection to the public, no-login feed of the twelve tokenized-stock books in True Markets' Orderbook Arena. Every frame they receive goes into one log that the three machines replicate with Raft. Each machine rebuilds all twelve books from that log, bit for bit the same, and the cluster signs the log's Merkle root every minute. Anyone with the log and three public keys can check every number below on their own computer, with no network and no trust in my machines.
</p>

<p>It never trades. It reads only the documented no-login channels, holds no exchange credentials, and a build check proves that no tape binary links any order-entry or signing code.</p>

<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(170px, 1fr)); gap: 1rem; margin: 2.5rem 0;">
    ${stat('0', 'of 564,319 updates differed between machines', '#16a34a')}
    ${stat('98.7–100%', 'identical at all 3 machines, every clean hour')}
    ${stat('99.95%', 'identical at both machines left, 7.2 h, no stops')}
    ${stat('19 ms', 'p50 arrival spread across 3 machines')}
    ${stat('23,723', 'real books rebuilt, all equal to the tape')}
    ${stat('34 / 34', 'planted bugs caught by the tests')}
</div>

<p style="font-size: 0.85rem; color: var(--secondary);">Scope: 13.8 recorded hours on 2026-11-12 with all three machines, and 7.2 hours on 2026-11-13 with two machines after one failed. All the machines sit on one home network, so the results describe delivery to one location, and only the no-login feed tier. Every figure links to the output that produced it in the <a href="${evidence}" target="_blank" rel="noopener noreferrer">evidence directory</a>, regenerated from the archived logs at the published commit.</p>

<h2 style="margin-top: 3rem">1. What a single client cannot see</h2>

<p>A feed client sees one stream from one place. To say something about the feed itself, you need more than one vantage point and a record nobody can quietly edit. I wanted to answer five questions:</p>

<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin: 1.5rem 0 2rem;">
    ${red('Complete', 'Did every subscriber get every update?', '#3b82f6')}
    ${red('Correct', 'Is the book you rebuild from it actually the book?', '#3b82f6')}
    ${red('Timely', 'How far apart do copies arrive?', '#3b82f6')}
    ${red('Live', 'How long can a healthy book stay silent?', '#3b82f6')}
    ${red('The same for everyone', 'Did any two machines get different bytes for one message?', '#3b82f6')}
</div>

<p>This sits on top of <a href="/VishalJhaPortfolio/blog/velocita-replicated-trading-on-a-raspberry-pi/">Velocita</a>, my replicated trading system on the same three machines. The tape reuses its Aeron transport and its Raft fork with the durable-quorum patch. It runs as a <em>separate</em> Raft group with its own ports, keys and data, so it can never send an order.</p>

<h2 style="margin-top: 3rem">2. Three recorders, one log</h2>

<div class="mermaid" style="${mermaid}">
flowchart TB
  F["Public feed<br/>DEPTH · EBBO · TRADE · INSTRUMENT"] --> R1["Recorder 1<br/>NUC1"]
  F --> R2["Recorder 2<br/>Pi 5"]
  F --> R3["Recorder 3<br/>NUC2"]
  R1 --> V["Three voters<br/>Raft over Aeron"]
  R2 --> V
  R3 --> V
  V --> L[("Replicated log<br/>4-hour segments")]
  L --> B["Reducer<br/>verdicts · 12 books · checks"]
  L --> M["Merkle tree, RFC 9162<br/>heads signed every 60 s, 2 of 3"]
  L --> X["Offline verifier"]
  M --> X
</div>

<p>Each <strong>recorder</strong> keeps every frame byte for byte, watches the sequence numbers for gaps, and submits each frame, sealed with an HMAC, to all three voters over Aeron. The <strong>voters</strong> put everything in one order through Raft. A pure reducer, which reads no clock and makes no system calls, then decides three things for every message:</p>

<ul>
    <li><strong>A verdict.</strong> Every update gets exactly one: identical at 3, 2 or 1 recorders, or <em>divergent</em> (different bytes for the same message). It closes when all three have reported, or 5 ticks after the first copy, so a silent machine can't hold it open.</li>
    <li><strong>The book.</strong> All twelve books are rebuilt in integer units of 10<sup>−9</sup>, so every machine computes the same bits.</li>
    <li><strong>Integrity checks.</strong> Crossed books, trades outside the book, and snapshots that disagree with updates are recorded but never change a book.</li>
</ul>

<p>A capture before writing any code, then the first live runs, settled the feed's rules. Some of them were not what the docs said:</p>

<table style="${table}">
    <thead><tr style="${row}"><th style="${th}">What the feed does</th><th style="${th}">What it changed</th></tr></thead>
    <tbody>
        <tr style="${row}"><td style="${td}"><strong>Updates replace whole levels</strong></td><td style="${tdm}">A level's new total, not a delta. The live field is <code>order_count</code>; the spec says <code>depth</code>. (D-03)</td></tr>
        <tr style="${row}"><td style="${td}"><strong>A snapshot shares its number with the next update</strong></td><td style="${tdm}">Keyed on sequence number alone, a snapshot and an update looked like two versions of one message, so the verdict key includes the message kind. (D-13)</td></tr>
        <tr style="${row}"><td style="${td}"><strong>A snapshot is a reply, not a broadcast</strong></td><td style="${tdm}">Two recorders subscribing 49 ms apart got different snapshots with the same number. Each snapshot is now its own verdict; only updates are compared. (D-25, D-26)</td></tr>
        <tr style="${row}"><td style="${td}"><strong>Up to 9 decimal places</strong></td><td style="${tdm}">Prices and sizes are integers at a fixed scale of 10<sup>−9</sup>, never floats. (D-04)</td></tr>
    </tbody>
</table>

<p>I also built smaller pieces instead of reusing big ones. The tape has its own compact Raft replica and write-ahead log rather than a fork of the trading kernel (D-05, D-06). It has its own WebSocket client over OpenSSL (D-11), and a JSON scanner that reads only the fields it needs and never allocates (D-12). An independent Python reference implementation checks the reducer, including on two real connections replayed through both.</p>

<h2 style="margin-top: 3rem">3. Turning a log into proof</h2>

<p>Agreement between three machines I own proves little if I can edit the record afterwards. So every log entry is a leaf in an RFC 9162 Merkle tree. Each minute, the voters sign the tree's root with Ed25519 keys that were generated on their own machines and have never left them. A head is published once two of the three have signed. Segments rotate every 4 hours, and each segment's first entry names the previous segment's last signed head, so the segments form one chain:</p>

<div class="mermaid" style="${mermaid}">
flowchart LR
  S1["Segment 68934737119228<br/>00:07–14:36 UTC<br/>741 signed heads"] -- "first entry names<br/>head 44460" --> S2["Segment 1794499200<br/>18:17–19:48 UTC<br/>75 signed heads"]
  S2 -. "next segments" .-> S3["…"]
</div>

<p>The verifier needs only the log, the heads and the public keys. It replays every entry through the same reducer the voters run, rebuilds the tree, and checks every head, the consistency between consecutive heads, and the link to the previous segment. This is the real output for the 16:00 segment:</p>

<pre style="${pre}">$ velocita-tape-verify --wal wal.log --heads heads --incarnation 1794499200 \\
      --previous-head ../68934737119228/heads/head-44460.json --key head-{1,2,3}.pub.pem
{"ok":true,"entries":121569,"heads_verified":75,"tick_spacing_flags":2,"symbols":12,
 "root":"6220035433496c15c2b39d0291a132f262ba5d6e24af9b66718c2c6ffbffbd64",
 "previous_segment":{"incarnation":68934737119228,"tick":44460,"linked":true}}</pre>

<p>Change one byte anywhere and it fails, naming the entry and the check that broke. The two <code>tick_spacing_flags</code> are the two times the tape was stopped. The verifier reports gaps like these instead of hiding them.</p>

<h2 style="margin-top: 3rem">4. Home Wi-Fi broke what localhost never did</h2>

<p>Everything passed on one machine. Then it went live on 2026-11-12 at 00:07 UTC over home Wi-Fi with Tailscale between the hosts. About 25 minutes later, each host was sending 1 to 2.5 MB/s, pings between hosts were losing 90–100% of packets, and Raft had gone through 36 terms. The books were still correct. The tape was just flooding the network it shares.</p>

<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem; margin: 1.5rem 0 2rem;">
    ${red('Resends that grew with the square of the RTT', 'The leader resent every unacknowledged entry on every heartbeat. On a slow link that fed on itself. Now each entry crosses once, with per-follower byte budgets and backed-off probes (D-42, D-43).')}
    ${red('Aeron multiplying loss', 'With a peer flapping, the Pi recorder’s embedded driver sent 1.22 GB in four minutes; the recorder itself could offer about 100 KB/s. Aeron’s frames were also bigger than the tunnel’s MTU; they now fit (D-53, D-56).')}
    ${red('A log that outgrew memory', 'The log grows about 30 KB/s, and every voter held all of it. The Pi was killed for memory in a loop, and that set off the flood. Fix: 4-hour segments chained by signed heads (D-54, D-55, D-58).')}
    ${red('A recorder racing the feed', 'The Pi got about 60% of the frames the NUCs got, nearly all of the shortfall in DEPTH. The feed handles one control request at a time, and my back-to-back unsubscribe and subscribe got rejected. Now requests are queued and the subscriptions are checked again (D-47).')}
</div>

<p>The last safety net is a per-host watchdog. If a host's Tailscale traffic stays above 600 KB/s for a minute, it stops the tape, and it restarts the tape once the link has been quiet for 5 minutes. The tape's own worst case is about 200 KB/s, so a trip means something has gone wrong. Each fix came with a test that fails without it, usually a slow or lossy simulated link. Before the fix, sending 303 entries to a follower over a 400 ms link took 5,314 sends; now it takes at most 1.25 per entry.</p>

<h2 style="margin-top: 3rem">5. What the feed looked like</h2>

<p>The first report covers 13.8 recorded hours on 2026-11-12: two linked segments with all three recorders. That was 289,636 update verdicts, 91.0% identical at all three, and <strong>none divergent</strong>. The overall share mostly reflects my own incidents, so the hourly view says more:</p>

<div style="margin: 2rem 0;">
    <div style="font-size: 0.85rem; color: var(--secondary); margin-bottom: 0.6rem;">Updates identical at all three recorders, by hour (UTC), 2026-11-12</div>
${hourBars}
    <div style="font-size: 0.85rem; color: #16a34a; margin-top: 0.6rem; font-weight: 600;">98.7–100% in every hour without an incident on our side; 0 divergent in every hour</div>
    <div style="font-size: 0.85rem; color: var(--secondary); margin-top: 0.4rem;">Short hours: 00:00–03:59 resend floods and the recorder refresh race (fixed 03:56); 06:00 and 08:00 watchdog stops; 14:00 flood, tape stopped; 19:00 a burst, likely from opening the dashboard.</div>
</div>

<p>Every hour that falls short lines up with a known problem on my side: the first night's floods and recorder bug (both since fixed), and the hours in which the watchdog stopped the tape. When the tape itself was healthy, the three machines saw the same updates.</p>

<table style="${table}">
    <thead><tr style="${row}"><th style="${th}">Measure</th><th style="${th}">Result</th></tr></thead>
    <tbody>
        <tr style="${row}"><td style="${td}">Arrival spread, first to last recorder</td><td style="${tdm}">p50 19 ms · p90 43 ms · p99 289 ms (clock error bound 3.9 ms)</td></tr>
        <tr style="${row}"><td style="${td}">DEPTH update cadence</td><td style="${tdm}">median about 1.0 s on ten books, 2.0 s on two, matching the documented 1 s batching</td></tr>
        <tr style="${row}"><td style="${td}">Rebuilt books</td><td style="${tdm}">all twelve valid on every machine, never crossed; the rebuilt best bid and offer agree with the exchange's own EBBO channel (at most 5 mismatches per book)</td></tr>
        <tr style="${row}"><td style="${td}">Book shape, US market hours</td><td style="${tdm}">spreads of 0.03 to 4.4 bp on very small size (median top of book 0.005 to 0.22 shares); 8 to 17 bp off-hours</td></tr>
        <tr style="${row}"><td style="${td}"><strong>Silences over 30 s</strong></td><td style="${tdm}">hundreds per quiet book, up to 31 minutes off-hours</td></tr>
    </tbody>
</table>

<p>The last row matters to anyone building on this feed. The docs treat about 30 seconds of silence as a dead connection. So a client that doesn't request heartbeats would keep dropping healthy connections on quiet books.</p>

<h2 style="margin-top: 3rem">6. Do the trades match the book?</h2>

<p>For each trade print, the checker asks whether the book changed the way the trade implies. Between 3 s before and 10 s after the print, a DEPTH change on the resting side, at the trade's price, should remove at least the trade's size.</p>

<div style="margin: 2rem 0;">
    <div style="font-size: 0.85rem; color: var(--secondary); margin-bottom: 0.5rem;">221 trades, 2026-11-12</div>
    <div style="display: flex; height: 34px; border-radius: 4px; overflow: hidden; font-size: 0.8rem; color: #fff; font-weight: 600;">
        <div style="width: 84.6%; background: #22c55e; display: flex; align-items: center; justify-content: center;">consistent 187</div>
        <div style="width: 1.8%; background: #f59e0b;"></div>
        <div style="width: 13.6%; background: #ef4444; display: flex; align-items: center; justify-content: center;">30</div>
    </div>
    <div style="font-size: 0.85rem; color: var(--secondary); margin-top: 0.5rem;">Green: consistent within 3 s. Amber: late, within 10 s (4). Red: unexplained (30, of which 12 overnight before the recorder fix).</div>
</div>

<p>The matching DEPTH change usually arrives about a millisecond <em>before</em> the trade print, so the two look like they are published in the same batch, DEPTH first. Most of the remaining unexplained trades printed at a price that never appeared as a level on the published book, while other levels on that side shrank. That is a question for the venue, not a conclusion: <strong>is a trade's price per fill, or one price per taker order?</strong> An order that sweeps several levels and reports one average price would explain most of them.</p>

<h2 style="margin-top: 3rem">7. Grading anyone's order-book client</h2>

<p>The tape knows the correct book after every update, so it can grade any program that builds books from this feed. The kit has a readable reference builder and a harness that talks to a client in any language over a line protocol. The harness sends one DEPTH message per line. The client answers with its book's state: <code>building</code>, <code>stale</code>, or <code>valid</code> with every level. Each valid book is compared with the tape's.</p>

<p>On recorder 1's own real stream (23,818 DEPTH messages, all twelve books), the reference builder matched the tape on all <strong>23,723</strong> books it reported valid. Then I wrote five broken clients, one for each mistake this feed makes easy:</p>

<table style="${table}">
    <thead><tr style="${row}"><th style="${th}">Broken client</th><th style="${th}">On the real stream</th></tr></thead>
    <tbody>
        <tr style="${row}"><td style="${td}">Adds update sizes instead of replacing them</td><td style="${tdm}">Caught: NVDAC bid 165.516 shows 0.266, the tape has 0.133</td></tr>
        <tr style="${row}"><td style="${td}">Treats a snapshot's number as the last update applied</td><td style="${tdm}">Caught at TSLAC on the second check</td></tr>
        <tr style="${row}"><td style="${td}">Parses decimals as floating point</td><td style="${tdm}">Caught: 2.142999999 where the tape has 2.143</td></tr>
        <tr style="${row}"><td style="${td}">Reads the spec's <code>depth</code> field instead of <code>order_count</code></td><td style="${tdm}">Caught: order count 0 where the tape has 2</td></tr>
        <tr style="${row}"><td style="${td}">Uses the book before SNAPSHOT_COMPLETE</td><td style="${tdm}">Not caught here: every real snapshot arrived as one message. The kit catches it on a two-part synthetic snapshot.</td></tr>
    </tbody>
</table>

<p>The last row is honest about what one day of data can show: a test only catches a bug if the data exercises it.</p>

<h2 style="margin-top: 3rem">8. Check a book yourself, in your browser</h2>

<p>The verifier can export one book at one moment as a 2.8 KB <strong>proof bundle</strong>: the book's levels, its log entry, 17 Merkle proof hashes, a signed head, and the three public keys. It writes the bundle only after the whole segment has verified. The proof page recomputes everything with your browser's WebCrypto and trusts only the key fingerprints built into it:</p>

<pre style="${pre}">Verified: this book is on the tape, under a head signed by voters 1, 2, 3.
  ✓ bundle      well formed
  ✓ book hash   8d67705e95a279cef0f1260099144bdb9e48ec2f9995b68cf20aefeee41bdaf8
  ✓ leaf hash   5d38f2e382fc7e62c513e324568f1203fd9b548fbd65c33023cbcaa86cd3af0f
  ✓ inclusion   entry 111428 is in the tree of 120615
  ✓ keys        all keys match the published fingerprints
  ✓ signatures  3 of 3 voters signed this head</pre>

<div style="${card} margin: 0 0 2rem;">
    <strong><a href="${site}/proof.html" target="_blank" rel="noopener noreferrer">Open the proof page →</a></strong>
    <div style="color: var(--secondary); font-size: 0.95rem; margin-top: 0.4rem;">The real NVDAC-USDC book just after update 173921. One self-contained file with no network requests. Press "Change one bid size" and watch it fail at <code>inclusion</code>: one altered size no longer leads to the signed root.</div>
</div>

<p>A bundle that brings its own keys fails at <code>keys</code>. Every 64-bit value travels as a decimal string, because JSON numbers lose precision above 2<sup>53</sup>, and a proof that rounds a size is no proof.</p>

<h2 style="margin-top: 3rem">9. Two machines left</h2>

<p>On the evening of 2026-11-12, NUC2 started returning input/output errors and then stopped accepting connections. It has not come back. The other two machines kept recording, and two complete, linked segments from 2026-11-13 (12:01 to 19:13 UTC, through the US open) verify with voters 1 and 2 signing every head. Two of three is the quorum the design asks for.</p>

<div style="margin: 2rem 0;">
    <div style="font-size: 0.85rem; color: var(--secondary); margin-bottom: 0.5rem;">Arrival spread, p99 · first to last recorder</div>
    ${bar('11-12 · 3 machines', 100, '289 ms', '#f59e0b')}
    ${bar('11-13 · NUC1 and Pi', 36.3, '105 ms', '#22c55e')}
    <div style="font-size: 0.85rem; color: var(--secondary); margin-top: 0.5rem;">Not a controlled comparison: one less machine, a different day, and after the fixes. The p50 was 19 ms and 10 ms.</div>
</div>

<table style="${table}">
    <thead><tr style="${row}"><th style="${th}">2026-11-13, 7.2 hours</th><th style="${th}">Result</th></tr></thead>
    <tbody>
        <tr style="${row}"><td style="${td}">Update verdicts</td><td style="${tdm}">274,683; <strong>99.95%</strong> identical at both machines, at least 99.7% in every hour</td></tr>
        <tr style="${row}"><td style="${td}">Divergent</td><td style="${tdm}"><strong>0</strong></td></tr>
        <tr style="${row}"><td style="${td}">Tape stops</td><td style="${tdm}">none (two gaps of 6 and 8 s at segment boundaries)</td></tr>
        <tr style="${row}"><td style="${td}">Sequence gaps, crossed books, EBBO mismatches</td><td style="${tdm}">0 on every book</td></tr>
        <tr style="${row}"><td style="${td}">Trades consistent with the book</td><td style="${tdm}">609 of 681 (89%), 26 late, 46 unexplained</td></tr>
    </tbody>
</table>

<p>The run ended at 19:13 UTC, and the archive shows the likely cause. The last head file in the segment is <strong>empty</strong>: 0 bytes, written at 19:13:23, and NUC1's disk is full today. The voter publishes a head by writing a temporary file and renaming it into place:</p>

<pre style="${pre}">void atomic_write(const std::filesystem::path&amp; path, const std::string&amp; text) {
    const auto tmp = path.string() + ".tmp";
    {
        std::ofstream out(tmp, std::ios::binary | std::ios::trunc);
        out &lt;&lt; text;              // unchecked: a full disk writes nothing
    }
    std::filesystem::rename(tmp, path);  // publishes it anyway
}</pre>

<p>The rename is atomic, but nothing checks that the write succeeded. The verifier refuses the empty head ("unreadable head"), which is the right answer. With that one file set aside, the other 191 heads verify. The fix is to check the write and <code>fsync</code> before renaming, and to alert on disk space before it runs out. I've recorded it (D-67) and left it for the next round. Here the proof system caught a bug in the code that writes the proofs.</p>

<h2 style="margin-top: 3rem">10. How I know it works</h2>

<ul>
    <li><strong>16 test suites</strong> cover the reducer against the independent reference, the replica under restarts and slow or lossy links, the recorder against a scripted feed that behaves like the real one (including its one-request-at-a-time rule), the watchdog, rotation, the report, the proof page and the book kit.</li>
    <li><strong>A mutation suite</strong> plants 34 bugs, among them closing a verdict one tick late, majority-voting divergent copies, skipping the HMAC check, accepting a corrupt log, and resending without back-off. All 34 are caught.</li>
    <li><strong>Symbol checks</strong> prove at link time that the reducer touches no clock, file or socket, and that no tape binary links any order-entry or signing code.</li>
    <li><strong>Reproducible outputs.</strong> Rerunning the report on the archived segments produced a byte-identical <code>summary.json</code>, and the proof bundle and page also came out byte-identical.</li>
</ul>

<p>The test map is also honest about the gaps: of the 92 test cases in the design, 49 are covered, 22 partly and 21 not yet.</p>

<h2 style="margin-top: 3rem">What I took away</h2>

<ul>
    <li><strong>A network you share is part of your system.</strong> Every serious bug here came from home Wi-Fi, not from the logic. Give every loop that sends a ceiling that holds even when the network misbehaves.</li>
    <li><strong>Read the feed before trusting the docs.</strong> A short capture and the first live runs changed the verdict key three times and found a field the spec names wrongly.</li>
    <li><strong>Make every claim checkable, including the uncomfortable ones.</strong> The verifier reports its own stops, the kit admits the trap it couldn't catch, and the signed log exposed the bug that ended its own run.</li>
</ul>

<p>
    Code, design records (decisions D-01 to D-67) and every number here: <a href="${repo}" target="_blank" rel="noopener noreferrer">GitHub</a> · <a href="${evidence}" target="_blank" rel="noopener noreferrer">evidence</a> · <a href="${blob}/docs/tape/DECISIONS.md" target="_blank" rel="noopener noreferrer">decision log</a> · <a href="${blob}/docs/tape/FINDINGS-2026-11-12-report.md" target="_blank" rel="noopener noreferrer">findings</a> · reports for <a href="${site}/report-2026-11-12.html" target="_blank" rel="noopener noreferrer">2026-11-12</a> and <a href="${site}/report-2026-11-13.html" target="_blank" rel="noopener noreferrer">2026-11-13</a>. Built with Claude as a coding collaborator, directed and reviewed by me.
</p>
`
}
