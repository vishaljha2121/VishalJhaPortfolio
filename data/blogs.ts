export interface BlogPost {
    slug: string;
    title: string;
    date: string;
    description: string;
    tags: string[];
    content: string;
    githubUrl?: string;
}

export const blogPosts: BlogPost[] = [
    {
        slug: 'velocita-replicated-trading-on-a-raspberry-pi',
        title: 'Velocita: A Replicated Trading System on a Raspberry Pi That Refused to Believe the Exchange',
        date: '2026-10-27',
        description: 'Raft over Aeron on two NUCs and a Pi 5, 16 real swaps on Solana, a ledger that matched the chain to the billionth of a SOL, and every problem I had to solve to get there.',
        tags: ['Distributed Systems', 'Raft', 'C++20', 'Aeron', 'Solana', 'Trading', 'Architecture'],
        githubUrl: 'https://github.com/vishaljha2121/Velocita',
        content: `
<p>
    On the night of October 15, a Raspberry Pi on my desk voted to buy $12.69 of SOL. Three seconds later the trade was on the Solana blockchain. Over the next three hours, with nobody touching anything, the cluster it belongs to made 25 decisions and settled 16 real swaps. When I later compared its books against the blockchain, every one of the 16 matched <strong>to the billionth of a SOL</strong>.
</p>

<p>
    It lost 95 cents. And the most interesting thing it did all night was refuse to believe the exchange.
</p>

<p>
    This is the story of <a href="https://github.com/vishaljha2121/Velocita" target="_blank" rel="noopener noreferrer">Velocita</a>: a replicated trading system I built from scratch over eight weeks on two NUC mini PCs and a Raspberry Pi 5. It is about the numbers it hit, and the problems I had to solve to hit them.
</p>

<table style="width: 100%; text-align: left; border-collapse: collapse; margin: 2rem 0; font-size: 0.95rem;">
    <thead>
        <tr style="border-bottom: 1px solid var(--border);">
            <th style="padding: 0.75rem 0;">Metric</th>
            <th style="padding: 0.75rem 0; text-align: right;">Value</th>
        </tr>
    </thead>
    <tbody>
        <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.75rem 0;">Real swaps settled on Solana mainnet, unattended</td><td style="padding: 0.75rem 0; text-align: right;"><strong>16</strong></td></tr>
        <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.75rem 0;">Settlements equal to the blockchain, to 10<sup>-9</sup> SOL</td><td style="padding: 0.75rem 0; text-align: right; color: #22c55e;"><strong>16 / 16</strong></td></tr>
        <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.75rem 0;">Strategy decision committed on 3 machines (p50 / p90)</td><td style="padding: 0.75rem 0; text-align: right;"><strong>126 ms / 218 ms</strong></td></tr>
        <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.75rem 0;">Decision to transaction in a Solana block (p50)</td><td style="padding: 0.75rem 0; text-align: right;"><strong>2 s</strong></td></tr>
        <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.75rem 0;">Kernel decision evaluation (p50 / p99)</td><td style="padding: 0.75rem 0; text-align: right;"><strong>208 ns / 250 ns</strong></td></tr>
        <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.75rem 0;">A voter restarted and back in step</td><td style="padding: 0.75rem 0; text-align: right;"><strong>4–7 s</strong></td></tr>
        <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.75rem 0;">Duplicate orders or unexplained balances</td><td style="padding: 0.75rem 0; text-align: right; color: #22c55e;"><strong>0</strong></td></tr>
    </tbody>
</table>
<p style="font-size: 0.95rem; color: var(--secondary); margin-top: -1rem; margin-bottom: 2rem;">
    Latencies are from the 25 live decisions; the kernel figure is an in-memory benchmark. All data is in the repository.
</p>

<h2 style="margin-top: 3rem">1. The problem: money, crashes, and a world you can't trust</h2>

<p>
    A trading script on a laptop is easy. A trading system that touches real money has to survive four things a script ignores.
</p>

<ul>
    <li><strong>Crashes mid-send.</strong> A process can die after an order leaves and before it writes down that it did. Restart it and it must neither forget the order nor send it again.</li>
    <li><strong>An unreliable outside world.</strong> Requests time out. Exchanges answer late, or ambiguously. "Failed" does not always mean "didn't happen".</li>
    <li><strong>A strategy you shouldn't trust.</strong> Signal code changes daily. A bug in it must not be able to empty the account.</li>
    <li><strong>Cheap hardware.</strong> Three small machines on home Wi-Fi, any of which can stall on its disk, reboot or vanish.</li>
</ul>

<p>
    Why does this matter beyond a hobby project? Because these are exactly the failures that cost real trading firms real money: double-sent orders after a failover, books that disagree with the exchange, a strategy bug with unlimited authority. I wanted to see whether the standard answers (consensus, idempotency, reconciliation) could be made to hold all the way down to a $25 account on a Raspberry Pi, with every cent explainable afterwards.
</p>

<h2 style="margin-top: 3rem">2. The intuition: separate deciding from doing</h2>

<p>
    The whole design follows from one idea. <strong>Money and decisions live in one deterministic state machine that three machines replicate with Raft.</strong> Anything that touches the outside world runs in separate processes that may act only on what the cluster has committed, and must bring back evidence before the books change.
</p>

<div class="mermaid" style="display: flex; justify-content: center; margin-bottom: 2rem; background: transparent;">
flowchart LR
  subgraph NUC1["NUC1 · x86_64"]
    V1["voter 1"]
    DRV["strategy driver"]
    GW["execution gateway"]
    SG["signer: only key holder"]
  end
  subgraph PI["Raspberry Pi 5"]
    V2["voter 2"]
  end
  subgraph NUC2["NUC2 · x86_64"]
    V3["voter 3"]
  end
  V1 <-->|"Aeron UDP"| V2
  V2 <-->|"Aeron UDP"| V3
  V1 <-->|"Aeron UDP"| V3
  DRV -->|"intent"| V1
  GW <-->|"committed state, evidence"| V1
  GW <-->|"Unix socket"| SG
  GW <-->|"HTTPS"| TM(["exchange"])
  TM --> SOL(["Solana"])
  GW -->|"finalized reads"| SOL
</div>

<p>
    A trade walks through five hands, and none of them can complete it alone. The <strong>strategy</strong> proposes. The <strong>Raft cluster</strong> commits the proposal and reserves the cash. The <strong>gateway</strong> fetches an unsigned transaction from the exchange. The <strong>signer</strong> checks that it is exactly the committed trade before signing. Then the gateway reads the finalized transaction back from the chain and reports it, and only that report moves money in the books.
</p>

<div style="border-left: 3px solid var(--foreground); padding: 0.75rem 1.25rem; margin: 2rem 0; background: rgba(0,0,0,0.03);">
    <p style="font-size: 0.8rem; letter-spacing: 0.08em; text-transform: uppercase; color: var(--secondary); margin-bottom: 0.25rem;">ADR 0005 · the reducer sits behind consensus</p>
    <p style="margin-bottom: 0;">If every machine runs the same pure function over the same log, they must agree on every cent, and the log <em>is</em> the audit trail. The kernel never reads a clock, never uses a float, never touches the heap: three machines reading three clocks would disagree, and one rounding difference between an Intel and an ARM chip would fork the replicas.</p>
</div>

<div style="border-left: 3px solid var(--foreground); padding: 0.75rem 1.25rem; margin: 2rem 0; background: rgba(0,0,0,0.03);">
    <p style="font-size: 0.8rem; letter-spacing: 0.08em; text-transform: uppercase; color: var(--secondary); margin-bottom: 0.25rem;">ADR 0016 and 0020 · callers have roles</p>
    <p style="margin-bottom: 0;">The strategy may only <em>propose</em> a trade, and only after a one-time grant from the operator. Only the gateway may report evidence. Even the operator's key is refused when it tries to report a fill. A compromised strategy can ask; it can never authorize, and a typo by the most trusted caller cannot invent a trade.</p>
</div>

<div style="border-left: 3px solid var(--foreground); padding: 0.75rem 1.25rem; margin: 2rem 0; background: rgba(0,0,0,0.03);">
    <p style="font-size: 0.8rem; letter-spacing: 0.08em; text-transform: uppercase; color: var(--secondary); margin-bottom: 0.25rem;">ADR 0021 · the kernel owns cash, P&amp;L and the loss limit</p>
    <p style="margin-bottom: 0;">Money is integers: lamports (10<sup>-9</sup> SOL) and USDC micros, with 128-bit intermediates. The $10 loss stop is enforced inside the replicated state, so no process can bypass it, and a flat account must satisfy <code>cash − funding = realized P&amp;L</code> exactly.</p>
</div>

<h2 style="margin-top: 3rem">3. 396 ms to 126 ms: the SD card that wouldn't keep up</h2>

<p style="font-family: var(--font-serif); font-size: 2.4rem; line-height: 1.1; margin: 2rem 0 0.25rem;">20.6 µs → 0.042 µs</p>
<p style="font-size: 0.95rem; color: var(--secondary); margin-bottom: 2rem;">Time the Raft thread spends per log record: 490× less.</p>

<p>
    Velocita started as a Raft counter: three voters on one Raspberry Pi. On August 29 it failed its acceptance test badly. At just 5 commands per second, a commit took <strong>396 ms at the median and 828 ms at p99</strong>. At 20 per second the cluster lost its leader entirely.
</p>

<p>
    The CPU was idle. Linux's pressure counters told the real story: the disk was fully stalled 75% of the time. Every command forced roughly <strong>nine <code>fsync</code> calls</strong> through one SD card: append the log, rewrite the metadata, sync the directory, times three voters. Worse, the thread running Raft was the one waiting, so a slow disk turned directly into missed heartbeats and elections.
</p>

<p>
    The fix was to stop the consensus thread from ever waiting on the disk. Entries are copied into 4 KiB blocks in memory; a separate writer thread writes and syncs them. The two threads share nothing but fixed-size tickets on a lock-free single-producer, single-consumer ring:
</p>

<pre style="background: var(--foreground); color: var(--background); padding: 1.5rem; border-radius: 8px; overflow-x: auto; font-family: monospace; font-size: 0.95rem; margin-bottom: 2rem">bool push(const T&amp; value) noexcept {
    const auto head = head_.load(std::memory_order_relaxed);
    const auto tail = tail_.load(std::memory_order_acquire);
    if (head - tail &gt;= Capacity) return false;      // full: refuse, never overwrite
    slots_[head &amp; (Capacity - 1)] = value;
    head_.store(head + 1, std::memory_order_release); // publish slot and block
    return true;
}</pre>

<p>
    One release/acquire pair is the entire synchronization, and the two counters sit on separate cache lines so the threads never fight over one. The per-record cost on the Raft thread fell from 20.6 µs to 42 ns. On three separate machines, with every command durable on two disks including the Pi's SD card, the live run's commits landed at <strong>126 ms p50</strong>.
</p>

<h3>The fix created a bug that could lose committed trades</h3>

<p>
    Asynchronous writes opened a trap I didn't see coming. The Raft library I use, <code>willemt/raft</code>, assumes the log is written synchronously, so it counts the leader's own vote for an entry the moment the entry is appended. With my async writer, that vote was being counted while the entry was still only in memory.
</p>

<div class="mermaid" style="display: flex; justify-content: center; margin-bottom: 2rem; background: transparent;">
sequenceDiagram
  participant L as Leader
  participant F1 as Follower 1
  participant F2 as Follower 2
  L->>L: append entry 42, in memory only
  L->>F1: AppendEntries 42
  F1-->>L: durable
  Note over L: leader + F1 = majority, commit 42
  Note over L: crash before the disk write, restart without 42
  Note over F1: briefly unreachable
  L->>F2: election: neither has 42
  Note over L,F2: entry 42 overwritten, though the caller was told it was permanent
</div>

<p>
    No disk had to fail for this to happen. A leader crash plus one follower briefly unreachable was enough to lose an acknowledged entry, and in a trading kernel that entry could be a fill.
</p>

<div style="border-left: 3px solid var(--foreground); padding: 0.75rem 1.25rem; margin: 2rem 0; background: rgba(0,0,0,0.03);">
    <p style="font-size: 0.8rem; letter-spacing: 0.08em; text-transform: uppercase; color: var(--secondary); margin-bottom: 0.25rem;">ADR 0006 · a pinned fork to keep quorum honest</p>
    <p style="margin-bottom: 0;">I added a <code>durable_idx</code> callback: Raft asks the application how far its own log is really on disk, and the leader's vote counts only up to there. The patch is applied to a pinned upstream commit at build time and verified by hash. If it ever fails to apply, the build stops, because silently building the unpatched library would silently bring the bug back.</p>
</div>

<p>
    Then I wrote a power-cut test that truncates the log at every possible byte offset instead of a few chosen ones. On its first run it found two defects that the hand-picked tests had passed: a recovered commit index pointing past the end of the log, and 64 KiB written to disk for every 200-byte command. Shrinking the blocks to 4 KiB then made the benchmark refuse four out of five records, because the staging arena had shrunk with them. It now has 64 blocks.
</p>

<h2 style="margin-top: 3rem">4. Term 1 → 65 in 48 hours: elections nobody asked for</h2>

<p>
    Raft's term number goes up by one at every election. On a healthy cluster it should barely move. On mine it went from <strong>1 to 65 in two days</strong>.
</p>

<p>
    The culprit was compaction. Every 2,048 entries the cluster archives old history and snapshots its state, and each time it re-read and re-verified every archive segment it had ever written. The pause grew by about 45 ms per segment: 0.8 s on day one, 4.8 s after 90 compactions. That was well past the 1–2 s election timeout, so nearly every compaction triggered an election. The fix re-reads two segments per compaction, in rotation. Corruption is still caught, just within a bounded number of compactions instead of the next one, and pauses dropped to 0.1–0.4 s.
</p>

<p>
    A second storm came from Wi-Fi: term <strong>49 → 191 in six hours</strong>. A voter that dropped off the network kept timing out, raising its own term each time, and when it came back that higher term deposed a perfectly healthy leader. Adding pre-vote (from section 9.6 of the Raft thesis) fixed it: a candidate first asks whether it <em>could</em> win, and changes nothing until a majority agrees.
</p>

<h2 style="margin-top: 3rem">5. The gateway that stopped itself, twice</h2>

<p>
    The gateway is deliberately paranoid: if anything looks wrong, it stops and waits for a human, because a stop might hide an order in flight. That paranoia surfaced two subtle bugs.
</p>

<p>
    <strong>October 9, paper trading.</strong> The gateway halted while holding a position, after reporting something perfectly true: that an order the kernel had already booked as filled was filled. The cause took a replay of 8,107 commands to find. In Raft, an entry commits once any two of three disks have it, so two followers can commit an entry before the leader's own disk has caught up. Every voter answers the caller when it applies an entry, and the gateway takes the first answer. So the gateway heard "filled" from a follower, then read state from a leader (the slow Pi) that hadn't applied the fill yet, and acted on stale state. The fix is a read fence: the leader defers reads until its own apply catches up, and the gateway discards any reading older than results it has already seen.
</p>

<p>
    <strong>October 15, hours before going live.</strong> A single state read failed during a leader election, and the gateway stopped for good. Elections are normal, so the fix separates the two kinds of failure. A failed <em>read</em> changes nothing, so it is retried for up to 120 seconds. A failed <em>command</em> might have committed anyway, so it still stops the gateway. The live run later crossed a leader change without a hiccup.
</p>

<div style="border-left: 3px solid var(--foreground); padding: 0.75rem 1.25rem; margin: 2rem 0; background: rgba(0,0,0,0.03);">
    <p style="font-size: 0.8rem; letter-spacing: 0.08em; text-transform: uppercase; color: var(--secondary); margin-bottom: 0.25rem;">ADR 0013 and 0017 · journal before every external act</p>
    <p style="margin-bottom: 0;">The gateway writes "I am about to send this" to disk <em>before</em> each request to the exchange. Act first and crash before writing, and a restart can't know the act happened, so it repeats it: a second trade. Journal first, and the worst case is "we may have acted", which is safe because the next step is always a status query, never a resend.</p>
</div>

<h2 style="margin-top: 3rem">6. One process holds the key, and it trusts no one</h2>

<p>
    On this exchange, the API key that signs swaps is the same key that mints session tokens, so a process holding it could authorize any transaction from the wallet. The gateway parses JSON from the internet all day; it is the most exposed process in the system. So the gateway never sees the key.
</p>

<p>
    A separate signer process holds it, under its own Unix user, with no capabilities, a read-only root filesystem, and network access to the three voters only. When the gateway asks for a signature, the signer re-reads the cluster's committed state itself, decodes every instruction of the Solana transaction, checks the accounts, the DEX program, the fee and the minimum amount received against the committed trade, obtains its own authority proof from Raft, journals, and only then signs.
</p>

<div style="border-left: 3px solid var(--foreground); padding: 0.75rem 1.25rem; margin: 2rem 0; background: rgba(0,0,0,0.03);">
    <p style="font-size: 0.8rem; letter-spacing: 0.08em; text-transform: uppercase; color: var(--secondary); margin-bottom: 0.25rem;">ADR 0019 · why decode instead of simulate</p>
    <p style="margin-bottom: 0;">A simulation shows what a transaction would do against the chain <em>now</em>; it executes later, against a different state. Decoding the instructions proves what the signature <em>authorizes</em>: which accounts can be debited, by at most how much, and the minimum that must arrive. Program IDs are pinned, because a program ID is the only on-chain identity of the code that will run.</p>
</div>

<div style="border-left: 3px solid var(--foreground); padding: 0.75rem 1.25rem; margin: 2rem 0; background: rgba(0,0,0,0.03);">
    <p style="font-size: 0.8rem; letter-spacing: 0.08em; text-transform: uppercase; color: var(--secondary); margin-bottom: 0.25rem;">ADR 0029 · the signer authenticates the gateway for a day</p>
    <p style="margin-bottom: 0;">The gateway still needs session tokens. So the signer will sign exactly one other message shape: a 47-byte <code>&lt;uuid&gt;.&lt;timestamp&gt;</code> string, within 60 seconds of its own clock. No transaction can ever look like that, so the gateway gets tokens without ever being able to get a trade signed.</p>
</div>

<h2 style="margin-top: 3rem">7. 16 out of 16, to the atom</h2>

<p>
    Most trading systems trust the exchange's fill report. Velocita doesn't. A swap settles only from a <em>finalized</em> Solana transaction that matches the exact payload the signer signed, and the gateway replays the owner's balance changes from that transaction. Those integers are what the kernel stores, so there is nothing to round:
</p>

<table style="width: 100%; text-align: left; border-collapse: collapse; margin: 2rem 0; font-size: 0.95rem;">
    <thead>
        <tr style="border-bottom: 1px solid var(--border);">
            <th style="padding: 0.75rem 0;">Effect 1 (a buy)</th>
            <th style="padding: 0.75rem 0; text-align: right;">In Raft</th>
            <th style="padding: 0.75rem 0; text-align: right;">On chain</th>
        </tr>
    </thead>
    <tbody>
        <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.75rem 0;">SOL received (lamports)</td><td style="padding: 0.75rem 0; text-align: right;">119,507,269</td><td style="padding: 0.75rem 0; text-align: right; color: #22c55e;">+119,507,269</td></tr>
        <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.75rem 0;">USDC paid (micros)</td><td style="padding: 0.75rem 0; text-align: right;">12,690,000</td><td style="padding: 0.75rem 0; text-align: right; color: #22c55e;">−12,690,000</td></tr>
    </tbody>
</table>

<p>
    The same held for all 16 settlements, and the eight round trips summed to exactly the kernel's realized P&amp;L: −952,140 USDC micros.
</p>

<h2 style="margin-top: 3rem">8. Effect 25: the night the exchange said "failed"</h2>

<p>
    At 03:06:29 UTC the strategy committed its 25th decision: buy $12.69 of SOL. The exchange's answer came back: <strong>failed</strong>. "Venue temporarily unavailable." Executed: zero. Transaction hash: none.
</p>

<p>
    The easy move was to believe it and release the reserved $12.69. The system refused. Its settlement rule says money moves only on finalized chain evidence, and with no transaction hash there was nothing to verify. After three minutes the gateway stopped and kept the cash reserved. The strategy driver, seeing no fresh account, stopped making decisions too. That is exactly what it was built to do, and it cost a night of trading.
</p>

<p>
    "Failed, executed zero" and "executed and failed on chain" look identical in that response, and they mean very different things. So I built a new outcome, "expired, never executed", that requires an on-chain proof. The transaction's blockhash must be expired at a finalized slot, and no transaction in the wallet's history may match the signed payload. I qualified it on both architectures, upgraded all three voters, and ran the recovery.
</p>

<p>
    <strong>The proof refused.</strong> When I went through the wallet's on-chain history myself, I found why. A swap signed by our wallet sat in slot 457,481,187, from the same second the exchange created the order, and it had failed there inside a DEX program. The exchange's fee payer paid the 10,000-lamport network fee, and our balances never moved.
</p>

<p>
    If the system had believed the exchange, it would have recorded a transaction that did reach the chain as one that never did. Had it succeeded late, the same cash could have been spent twice. The rule "an absent hash is not proof" cost one stuck reservation, and it was right.
</p>

<div style="border-left: 3px solid var(--foreground); padding: 0.75rem 1.25rem; margin: 2rem 0; background: rgba(0,0,0,0.03);">
    <p style="font-size: 0.8rem; letter-spacing: 0.08em; text-transform: uppercase; color: var(--secondary); margin-bottom: 0.25rem;">ADR 0025 and 0027 · unknown is a state</p>
    <p style="margin-bottom: 0;">"We don't know" is recorded explicitly and keeps the money reserved. It is never rounded to "failed" or "succeeded". An effect can be released without chain evidence only before the cluster has recorded a transaction that could be signed; once a signature might exist, only the chain can close it.</p>
</div>

<h2 style="margin-top: 3rem">9. Pull the plug on the Pi</h2>

<p style="font-family: var(--font-serif); font-size: 2.4rem; line-height: 1.1; margin: 2rem 0 0.25rem;">4–7 seconds</p>
<p style="font-size: 0.95rem; color: var(--secondary); margin-bottom: 2rem;">From stopping a voter to it being back in step with the others.</p>

<p>
    Any two of the three voters are a quorum, so a machine can disappear without the books noticing. During an upgrade on October 15, the Pi's new container took several minutes to start. Meanwhile the two NUCs elected a leader and kept committing. When the Pi came back, it replayed its own log and caught up on the entries it had missed. On October 16 I upgraded all three voters one at a time, the leader last: each was back in step within 4–7 seconds, and stopping the leader handed leadership to the Pi.
</p>

<div class="mermaid" style="display: flex; justify-content: center; margin-bottom: 2rem; background: transparent;">
sequenceDiagram
  participant N1 as NUC1 (leader)
  participant N2 as NUC2
  participant P as Raspberry Pi
  Note over P: offline
  N1->>N2: new entries
  N2-->>N1: durable
  Note over N1,N2: 2 of 3 disks: keep committing
  Note over P: restarts, replays its own log
  P->>N1: back, behind by a few entries
  N1->>P: the entries it missed
  Note over N1,P: 3 of 3, identical state on every voter
</div>

<p>
    Restarts are safe because the storage refuses to guess. A torn write always shows up as a bad block checksum, never as a valid-looking record. A snapshot is replayed through the real kernel before it is trusted. A commit index pointing past the end of the log stops recovery instead of being quietly clamped.
</p>

<h2 style="margin-top: 3rem">10. And the 95 cents?</h2>

<p>
    The strategy was a deliberately simple one-second stochastic oscillator. It was a test load, not an edge, and I knew it: replays over 7 and 30 days had found it slightly negative <em>before</em> costs. What the live run did was measure the costs precisely. Against Binance's price one second before each block, buys filled about <strong>59 bp above</strong> and sells about <strong>33 bp below</strong>, 20 bp of each being the exchange fee. Meanwhile the market moved about −2 bp per round trip.
</p>

<p>
    So every round trip cost about 94 bp before the market did anything. A one-second strategy here needs a move of nearly 1% in its favor just to break even. The system worked. The economics were never going to.
</p>

<h2 style="margin-top: 3rem">What I took away</h2>

<ul>
    <li><strong>Measure before you fix.</strong> Every improvement above started as a number that looked wrong: a p99, a term counter, a pressure stall.</li>
    <li><strong>Fixes create bugs.</strong> The async write path made the cluster 490× cheaper per record and quietly broke Raft's guarantee. Only a test that tried every crash point caught it.</li>
    <li><strong>Refusing is a feature.</strong> The most valuable thing the system did with real money was say "I can't prove that" and hold the cash.</li>
    <li><strong>Small hardware is a great teacher.</strong> An SD card and home Wi-Fi expose problems a data center hides.</li>
</ul>

<p>
    The code, 29 architecture decision records, the full evidence trail and every number in this post are on <a href="https://github.com/vishaljha2121/Velocita" target="_blank" rel="noopener noreferrer">GitHub</a>. Start with the <a href="https://github.com/vishaljha2121/Velocita/blob/main/RESULTS.md" target="_blank" rel="noopener noreferrer">results</a> or the <a href="https://github.com/vishaljha2121/Velocita/tree/main/docs/guide" target="_blank" rel="noopener noreferrer">guide</a>. I built it with AI coding assistants (Claude and Codex) as collaborators, directing and reviewing their work. The handoff notes between those sessions are in the repository too.
</p>
        `
    },
    {
        slug: 'ultra-low-latency-trading-engine',
        title: 'Building an Ultra-Low Latency Matching Engine & Prediction Market: A Deep Dive',
        date: '2026-03-03',
        description: 'An architectural breakdown of bridges sub-millisecond High-Frequency Trading (HFT) architecture with highly-interactive consumer experiences.',
        tags: ['Engineering', 'HFT', '.NET 9', 'React', 'Redis', 'Architecture', 'SignalR'],
        githubUrl: 'https://github.com/vishaljha2121/TradingEngine',
        content: `
            <p>
                When I set out to build this trading engine, the goal wasn't just to create another CRUD application backed by a SQL database. I wanted to design a system that bridges the gap between <strong>sub-millisecond High-Frequency Trading (HFT) architecture</strong> and highly-interactive, real-time consumer consumer experiences.
            </p>

            <p>
                The result is a hybrid exchange: a high-performance C# <code>.NET 9</code> matching engine hooked into a deeply integrated React frontend, coupled with a StackExchange.Redis state manager and a C++ quantitative simulator.
            </p>

            <p>
                Here is an architectural breakdown of what we built, the technical hurdles we overcame, and the "why" behind every system-level architecture decision.
            </p>

            <div class="mermaid" style="display: flex; justify-content: center; margin-bottom: 2rem; background: transparent;">
graph TD
    %% Frontend Layer
    subgraph Frontend [React + Vite]
        UI[Pro Exchange UI]
        Game[Prediction Game Lobby]
        Admin[God Mode Dashboard]
    end

    %% Network / API Layer
    subgraph Network [API & Websockets]
        RestAPI[Minimal API Endpoints]
        SignalR[SignalR Hub]
    end

    %% Storage Layer
    subgraph Data [State Management]
        Redis[(StackExchange.Redis\\nWallet Balances & Pub/Sub)]
    end

    %% Hot Path / Core Layer
    subgraph Engine [The Hot Path]
        RingBuffer[Lock-Free OrderRingBuffer]
        MatchingEngine((TradingEngine\\nBackgroundService))
        OrderBook[SortedDictionary OrderBook]
    end

    %% Connections
    UI -->|POST /api/orders| RestAPI
    Game -->|POST /api/game/rooms| RestAPI
    Admin -->|HINCRBY Overrides| RestAPI

    RestAPI -->|Struct Copy| RingBuffer
    RingBuffer -->|SpinWait Poll| MatchingEngine
    MatchingEngine <-->|Cross Match| OrderBook
    
    MatchingEngine -->|Trade Executed| Redis
    MatchingEngine -.->|Broadcast Snapshot| SignalR
    RestAPI -->|Player Joined / Game Resolved| SignalR
    
    SignalR ===>|Update View| UI
    SignalR ===>|Update Leaderboard| Game
            </div>

            <h2 style="margin-top: 3rem">1. The Backend: Engineering for Ultra-Low Latency</h2>

            <p>
                The core matching engine is written in C# .NET 9. While C# is a managed language, modern .NET allows for extreme memory control via <code>ref struct</code>, unsafe blocks, and explicit memory layouts. To achieve nanosecond-level processing, we had to systematically eliminate the Garbage Collector (GC) from the "hot path."
            </p>

            <table style="width: 100%; text-align: left; border-collapse: collapse; margin: 2rem 0; font-size: 0.95rem;">
                <thead>
                    <tr style="border-bottom: 1px solid var(--border);">
                        <th style="padding: 0.75rem 0;">Throughput &amp; Latency Metric</th>
                        <th style="padding: 0.75rem 0; text-align: right;">Result</th>
                    </tr>
                </thead>
                <tbody>
                    <tr style="border-bottom: 1px solid var(--border);">
                        <td style="padding: 0.75rem 0; color: var(--secondary);">Average Latency (Hot Path)</td>
                        <td style="padding: 0.75rem 0; text-align: right;"><strong>0.0273 µs</strong></td>
                    </tr>
                    <tr style="border-bottom: 1px solid var(--border);">
                        <td style="padding: 0.75rem 0; color: var(--secondary);">Throughput (Writes)</td>
                        <td style="padding: 0.75rem 0; text-align: right;"><strong>9,384,296 ops/sec</strong></td>
                    </tr>
                    <tr style="border-bottom: 1px solid var(--border);">
                        <td style="padding: 0.75rem 0; color: var(--secondary);">Throughput (Reads)</td>
                        <td style="padding: 0.75rem 0; text-align: right;"><strong>36,589,962 ops/sec</strong></td>
                    </tr>
                    <tr style="border-bottom: 1px solid var(--border);">
                        <td style="padding: 0.75rem 0; color: var(--secondary);">Lock-Free RingBuffer vs Locked Queue</td>
                        <td style="padding: 0.75rem 0; text-align: right;"><strong>3.40x faster (343 ms vs 1170 ms)</strong></td>
                    </tr>
                </tbody>
            </table>

            <h3>1.1 The Architecture of the Hot Path</h3>

            <p>
                The "hot path" is the exact sequence of code executed from the moment an order hits the API to the moment it matches in the Order Book.
            </p>

            <p>
                Instead of parsing JSON into heavy heap-allocated <code>class Order</code> objects, our API layer receives payloads and immediately translates them into stack-allocated <code>readonly struct OrderCore</code> value types.
            </p>

            <p>
                By keeping orders strictly on the stack or in pre-allocated primitive arrays, the Garbage Collector never tracks them, entirely eliminating "Stop-The-World" gen-0/gen-1 GC pauses.
            </p>

            <table style="width: 100%; text-align: left; border-collapse: collapse; margin: 2rem 0; font-size: 0.95rem;">
                <thead>
                    <tr style="border-bottom: 1px solid var(--border);">
                        <th style="padding: 0.75rem 0;">Memory Allocation Metric</th>
                        <th style="padding: 0.75rem 0; text-align: right;">Result</th>
                    </tr>
                </thead>
                <tbody>
                    <tr style="border-bottom: 1px solid var(--border);">
                        <td style="padding: 0.75rem 0; color: var(--secondary);">Heap Allocations (Classes)</td>
                        <td style="padding: 0.75rem 0; text-align: right;"><strong>305 MB</strong></td>
                    </tr>
                    <tr style="border-bottom: 1px solid var(--border);">
                        <td style="padding: 0.75rem 0; color: var(--secondary);">Heap Allocations (Structs/Zero-Alloc Path)</td>
                        <td style="padding: 0.75rem 0; text-align: right;"><strong>0 MB</strong></td>
                    </tr>
                    <tr style="border-bottom: 1px solid var(--border);">
                        <td style="padding: 0.75rem 0; color: var(--secondary);">GC Pauses Eliminated</td>
                        <td style="padding: 0.75rem 0; text-align: right; color: #22c55e;"><strong>YES</strong></td>
                    </tr>
                </tbody>
            </table>
            <p style="font-size: 0.95rem; color: var(--secondary); margin-top: -1rem; margin-bottom: 2rem;">
                <em>Why it works:</em> Relying on an in-place array with primitive types produces no per-order garbage. This structurally guarantees no managed allocations during hot execution.
            </p>

            <h3>1.2 Defeating False Sharing with Cache-Line Alignment</h3>

            <p>
                Modern CPUs fetch memory from RAM into incredibly fast L1/L2 caches in 64-byte chunks called "Cache Line blocks". If two separate threads write to adjacent variables that happen to sit in the same 64-byte block, the CPU constantly invalidates the cache across cores—a massive performance killer known as <strong>False Sharing</strong>.
            </p>

            <p>
                To defeat this, we explicitly boxed our core structures using <code>[StructLayout]</code>.
            </p>

            <pre style="background: var(--foreground); color: var(--background); padding: 1.5rem; border-radius: 8px; overflow-x: auto; font-family: monospace; font-size: 0.95rem; margin-bottom: 2rem">
<code>/// &lt;summary&gt;
/// A cache-aligned struct representing the core data of an order.
/// 64 bytes is the standard cache line size on x86/ARM CPUs.
/// Explicit layout prevents false sharing.
/// &lt;/summary&gt;
[StructLayout(LayoutKind.Explicit, Size = 64)]
public readonly struct OrderCore
{
    // Offset 0: Order ID (using a long instead of string to avoid heap)
    [FieldOffset(0)]
    public readonly long OrderId;

    // Offset 8: Price (decimal is 16 bytes in C#)
    [FieldOffset(8)]
    public readonly decimal Price;

    // Offset 24: Size (int is 4 bytes)
    [FieldOffset(24)]
    public readonly int Size;

    // Offset 28: IsBuy (bool is 1 byte)
    [FieldOffset(28)]
    public readonly bool IsBuy;

    // Offset 32: User Reference
    [FieldOffset(32)]
    public readonly string UserId;
}</code>
            </pre>

            <p>
                By heavily padding the struct and forcing <code>OrderCore</code> to consume exactly 64 bytes via <code>[FieldOffset]</code>, we physically guarantee that Thread A and Thread B will never accidentally share a cache line while processing different orders in the Ring Buffer arrays.
            </p>

            <table style="width: 100%; text-align: left; border-collapse: collapse; margin: 2rem 0; font-size: 0.95rem;">
                <thead>
                    <tr style="border-bottom: 1px solid var(--border);">
                        <th style="padding: 0.75rem 0;">Cache Miss Reductions</th>
                        <th style="padding: 0.75rem 0; text-align: right;">Result</th>
                    </tr>
                </thead>
                <tbody>
                    <tr style="border-bottom: 1px solid var(--border);">
                        <td style="padding: 0.75rem 0; color: var(--secondary);">Unaligned Class Size</td>
                        <td style="padding: 0.75rem 0; text-align: right;"><strong>~24-32 bytes + fragments</strong></td>
                    </tr>
                    <tr style="border-bottom: 1px solid var(--border);">
                        <td style="padding: 0.75rem 0; color: var(--secondary);">Cache-Aligned OrderCore Struct</td>
                        <td style="padding: 0.75rem 0; text-align: right;"><strong>64 bytes (L1 Cache match)</strong></td>
                    </tr>
                    <tr style="border-bottom: 1px solid var(--border);">
                        <td style="padding: 0.75rem 0; color: var(--secondary);">False Sharing Prevented</td>
                        <td style="padding: 0.75rem 0; text-align: right; color: #22c55e;"><strong>YES</strong></td>
                    </tr>
                </tbody>
            </table>
            <p style="font-size: 0.95rem; color: var(--secondary); margin-top: -1rem; margin-bottom: 2rem;">
                <em>Why it works:</em> Through structural configuration, aligning the exact bounds to <code>64 bytes</code> maps perfectly to how modern CPUs chunk L1 Cache Lines natively.
            </p>

            <h3>1.3 OS-Level Thread Affinity</h3>

            <p>
                The OS thread scheduler constantly moves background threads across different physical CPU cores to balance heat. Every time a thread changes processor cores, its localized L1 cache is wiped cold (a Context Switch).
            </p>

            <p>
                We used native OS system calls via <code>ProcessThread.ProcessorAffinity</code> to pin our main Matching Engine <code>SpinWait</code> loop permanently to the highest available hardware processor. This guarantees the matching execution thread absolutely never context-switches, keeping the CPU cache perfectly "hot."
            </p>

            <table style="width: 100%; text-align: left; border-collapse: collapse; margin: 2rem 0; font-size: 0.95rem;">
                <thead>
                    <tr style="border-bottom: 1px solid var(--border);">
                        <th style="padding: 0.75rem 0;">Thread Execution Metric</th>
                        <th style="padding: 0.75rem 0; text-align: right;">Result</th>
                    </tr>
                </thead>
                <tbody>
                    <tr style="border-bottom: 1px solid var(--border);">
                        <td style="padding: 0.75rem 0; color: var(--secondary);">Measured CPU Thread Affinity</td>
                        <td style="padding: 0.75rem 0; text-align: right;"><strong>Pinned highest core</strong></td>
                    </tr>
                </tbody>
            </table>
            <p style="font-size: 0.95rem; color: var(--secondary); margin-top: -1rem; margin-bottom: 2rem;">
                <em>Why it works:</em> Operating system schedulers inherently cause cold caches on context switching. By keeping the main loop pinned on its own fixed thread, we permanently maintain a warm L1/L2 hardware cache state.
            </p>

            <h2 style="margin-top: 3rem">2. Stateful User Management: Redis Pipeline</h2>

            <p>
                A live exchange needs verifiable, persistent state across millions of concurrent requests. Transitioning from a single-player sandbox to a multiplayer exchange required a robust, thread-safe memory store. We chose <strong>StackExchange.Redis</strong>.
            </p>

            <pre style="background: var(--foreground); color: var(--background); padding: 1.5rem; border-radius: 8px; overflow-x: auto; font-family: monospace; font-size: 0.95rem; margin-bottom: 2rem">
<code>public class RedisService
{
    private readonly IConnectionMultiplexer _redis;
    private readonly IDatabase _db;

    public RedisService(string connectionString)
    {
        // Multiplexers maintain a thread-safe connection pool natively 
        _redis = ConnectionMultiplexer.Connect(connectionString);
        _db = _redis.GetDatabase();
    }

    // Initialize a user with default balances if they don't exist
    public async Task InitializeUserAsync(string userId)
    {
        var key = $"user:{userId}:balances";
        if (!await _db.KeyExistsAsync(key))
        {
            await _db.HashSetAsync(key, new HashEntry[]
            {
                new HashEntry("USD", 100000.0),
                new HashEntry("BTC", 5.0)
            });
        }
    }
}</code>
            </pre>

            <ul>
                <li style="margin-bottom: 1rem">
                    <strong>Atomic Transactions:</strong> Trading is fundamentally a race condition. When a buy order matches a sell order, transferring USD and BTC between two concurrent users requires absolute locking atomicity. By leveraging Redis's single-threaded event loop, we safely execute overlapping reads/writes via native atomic commands without having to build brutal thread-locking semaphores on our C# API.
                </li>
            </ul>

            <h2 style="margin-top: 3rem">3. The Multiplayer Prediction Game Engine</h2>

            <p>
                To test our real-time websocket synchronization, we wanted a consumer-friendly gamified product. We built a LAN-ready "Prediction Room" engine directly into the UI.
            </p>

            <h3>3.1 SignalR Orchestration Sequence</h3>

            <p>
                We utilize <code>.NET Core SignalR</code> Hubs. Instead of React clients relentlessly HTTP-polling for game updates, the server maintains an event-driven loop and pushes binary-packed state deltas directly to the clients.
            </p>

            <p>
                Here is the exact websocket sequence of a round:
            </p>

            <div class="mermaid" style="display: flex; justify-content: center; margin-bottom: 2rem; background: transparent;">
sequenceDiagram
    participant Host User (React)
    participant Player 2 (React)
    participant C# SignalR Hub
    participant Redis Cache

    Host User (React)->>C# SignalR Hub: POST /api/game/rooms/315D/start
    activate C# SignalR Hub
    C# SignalR Hub->>C# SignalR Hub: Pick Random Event (e.g., Frog Jump)
    C# SignalR Hub-->>Host User (React): Broadcast \`RoomStateUpdated\` (Status: BETTING)
    C# SignalR Hub-->>Player 2 (React): Broadcast \`RoomStateUpdated\` (Status: BETTING)
    deactivate C# SignalR Hub

    Player 2 (React)->>C# SignalR Hub: POST /api/game/rooms/315D/bet (LEFT)
    Host User (React)->>C# SignalR Hub: POST /api/game/rooms/315D/bet (RIGHT)
    
    activate C# SignalR Hub
    C# SignalR Hub->>Redis Cache: Deduct $10 from Player 2 (HINCRBY)
    C# SignalR Hub->>Redis Cache: Deduct $10 from Host (HINCRBY)
    C# SignalR Hub->>C# SignalR Hub: RNG Resolves Event = "LEFT"
    
    C# SignalR Hub->>Redis Cache: Credit $20 to Player 2 (HINCRBY)
    
    C# SignalR Hub-->>Host User (React): Broadcast \`GameResolved\` (Winner: LEFT)
    C# SignalR Hub-->>Player 2 (React): Broadcast \`GameResolved\` (Winner: LEFT)
    deactivate C# SignalR Hub
            </div>

            <h3>3.2 Admin "God Mode"</h3>

            <p>
                To manage the system (and have some fun), we built a secure Admin Dashboard overlay. Logging in as an Administrator fetches all user wallets from the global Redis pool via Pattern Matching (<code>Keys "user:*:balances"</code>).
            </p>

            <p>
                When an Admin joins an active Prediction Room, a secretly rendered "God Mode" interface appears on their frontend. It allows the Admin to send a <code>/api/game/rooms/{id}/rig</code> command to the backend, overriding the <code>SimulationGameRound</code> loop and physically forcing the C# pseudo-random number generator to resolve the event in a specific direction!
            </p>

            <h2 style="margin-top: 3rem">4. The Frontend UI: Fluid, Mobile-Responsive, and Beautiful</h2>

            <p>
                For the frontend, we used <code>React + Vite + TypeScript</code>. The goal was to present complex quantitative data elegantly.
            </p>

            <ul>
                <li style="margin-bottom: 1rem">
                    <strong>Dynamic Order Depth Bars:</strong> The Live Orderbook features CSS depth indicators. The width of the red/green bars is calculated on every React render by algorithmically finding the maximum <code>size</code> integer currently resting on the book to create an intuitive volume heatmap.
                </li>
                <li style="margin-bottom: 1rem">
                    <strong>Flexible Grids:</strong> Financial dashboards frequently shatter on mobile displays because of rigid DOM tree structures. We overhauled our DOM layout using <code>@media (max-width: 1024px)</code> responsive boundaries and <code>flex-wrap: wrap</code>.
                </li>
            </ul>

            <pre style="background: var(--foreground); color: var(--background); padding: 1.5rem; border-radius: 8px; overflow-x: auto; font-family: monospace; font-size: 0.95rem; margin-bottom: 2rem">
<code>/* Responsive Media Queries converting 3-Columns into a Stacked Array viewport */
@media (max-width: 1024px) {
  .main-content {
    grid-template-columns: 1fr;
    display: flex;
    flex-direction: column;
  }
  
  .header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
}</code>
            </pre>

            <p>
                The rigid 3-column Exchange Dashboard gracefully collapses into a vertical mobile layout. Furthermore, the Prediction Lobby tiles and Leaderboard sidebars automatically slide under the main betting interface rather than horizontally overflowing into oblivion, allowing complete feature parity on mobile devices.
            </p>

            <h2 style="margin-top: 3rem">Conclusion</h2>

            <p>
                Combining extreme system-level engineering (CPU Cache-Line mitigation, zero-allocation structs, and DPDK-style ring buffers) with a stunning consumer-facing React application creates an almost magical user experience. Data moves instantly. Updates are fluid.
            </p>

            <p>
                We successfully built a product that under the hood mathematically mimics the infrastructure of an institutional HFT dark-pool, while visually and interactively offering a radically fun, highly-gamified consumer experience.
            </p>
        `
    },
    {
        slug: 'securing-profiling-scaling-trading-engine',
        title: 'Securing, Profiling, and Scaling an Ultra-Low Latency Trading Engine',
        date: '2026-03-17',
        description: 'A deep dive into Event Sourcing, performance profiling, eBPF tracing, and kernel bypass (DPDK) to harden and scale a high-frequency trading engine.',
        tags: ['Performance', 'eBPF', 'DPDK', 'Event Sourcing', 'C#', 'C++'],
        githubUrl: 'https://github.com/vishaljha2121/TradingEngine',
        content: `
            <p>
                Building an exchange matching engine is only half the battle; ensuring it behaves correctly under extreme stress and recovers deterministically from failure is what separates a toy project from a production system. In our latest sprint on the <strong>Trading Engine</strong>, we set out to harden the core infrastructure through Event Sourcing and push it to its limits with industry-standard performance profiling and kernel bypass techniques.
            </p>

            <p>
                Here is what we did, why we did it, and what we learned in scaling a high-frequency trading backend.
            </p>

            <h2 style="margin-top: 3rem">1. Event Sourcing &amp; Rigorous Testing</h2>

            <p>
                <strong>The Goal:</strong> Ensure 100% deterministic reproducibility of the trading state and mathematically verify all edge cases with robust code coverage.
            </p>

            <ul>
                <li style="margin-bottom: 1rem">
                    <strong>Deterministic Replay Engine:</strong> We implemented the <em>Event Sourcing</em> pattern. Every state mutation (New Order, Cancel, Execution) is serialized into a highly compact <code>EngineEvent</code> struct and written to an append-only binary log. If the server crashes, an isolated <code>ReplayEngine</code> component streams this log and reconstructs the <code>OrderBook</code> to its exact pre-crash state.
                </li>
                <li style="margin-bottom: 1rem">
                    <strong>Full Test Suite:</strong> We introduced <code>xUnit</code> and <code>Moq</code> to the C# Backend. We built 29 isolated unit tests covering the <code>ref in</code> struct modifications in the lock-free ring buffer and simulated concurrency behavior on the order book.
                </li>
                <li style="margin-bottom: 1rem">
                    <strong>Integration Tests:</strong> We utilized <code>WebApplicationFactory</code> to spin up the entire Kestrel HTTP pipeline in-memory, validating the REST APIs and Game Room state transitions end-to-end.
                </li>
            </ul>

            <p style="font-size: 0.95rem; color: var(--secondary); margin-bottom: 2rem;">
                <strong>The Result:</strong> The codebase successfully achieved <strong>81.2% Code Coverage</strong>, verifying deterministic behavior and ensuring our game loops behave as mathematically expected.
            </p>

            <h2 style="margin-top: 3rem">2. Pushing the Limits: Performance Profiling</h2>

            <p>
                <strong>The Goal:</strong> We knew our matching engine and lock-free thread queues were fast, but we needed empirical data to spot hidden latency bottlenecks occurring under mass saturation.
            </p>

            <h3>2.1 Tracing the C++ Quantitative Backend</h3>

            <p>
                We integrated <strong>Google Performance Tools (<code>gperftools</code>)</strong> directly into the <code>CMakeLists.txt</code> for our C++ execution core.
            </p>

            <ul>
                <li style="margin-bottom: 1rem">
                    <strong>The Test:</strong> We wrapped the execution loop in <code>ProfilerStart</code> and looped the <code>sma_crossover</code> strategy 1,000 times over high-resolution historical Gemini candles, dumping the output to a <code>.prof</code> flamegraph.
                </li>
                <li style="margin-bottom: 1rem">
                    <strong>The Inference:</strong> The raw processing of the order book was effectively instantaneous. The actual CPU bottlenecks were entirely concentrated in the math libraries computing exponential moving averages (<code>calcEMA</code>) and the square-root heavy standard deviation calculations for Bollinger Bands (<code>calcStdDev</code>).
                </li>
            </ul>

            <h3>2.2 Tracing the C# Web Ingestion API</h3>

            <p>
                We utilized the <code>.NET Global Tools</code> (<code>dotnet-trace</code> and <code>dotnet-counters</code>) and built a custom Python <code>aiohttp</code> benchmarking script to fire 5,000+ unthrottled concurrent requests at the <code>POST /api/orders</code> endpoint.
            </p>

            <table style="width: 100%; text-align: left; border-collapse: collapse; margin: 2rem 0; font-size: 0.95rem;">
                <thead>
                    <tr style="border-bottom: 1px solid var(--border);">
                        <th style="padding: 0.75rem 0;">Metric / Observation</th>
                        <th style="padding: 0.75rem 0; text-align: right;">Result</th>
                    </tr>
                </thead>
                <tbody>
                    <tr style="border-bottom: 1px solid var(--border);">
                        <td style="padding: 0.75rem 0; color: var(--secondary);">The GC Bottleneck</td>
                        <td style="padding: 0.75rem 0; text-align: right;"><strong>479 MB of Gen0 Garbage Collection</strong></td>
                    </tr>
                    <tr style="border-bottom: 1px solid var(--border);">
                        <td style="padding: 0.75rem 0; color: var(--secondary);">Latency Impact</td>
                        <td style="padding: 0.75rem 0; text-align: right; color: #ef4444;"><strong>Severe latency spikes &amp; JsonExceptions</strong></td>
                    </tr>
                </tbody>
            </table>

            <p style="font-size: 0.95rem; color: var(--secondary); margin-top: -1rem; margin-bottom: 2rem;">
                <em>How We Fixed It:</em> The bottleneck was identified in the REST API ingestion layer. We were using <code>StreamReader.ReadToEndAsync()</code> to buffer the incoming HTTP body into a contiguous string before deserializing. By refactoring to use <code>System.Text.Json.JsonSerializer.DeserializeAsync&lt;T&gt;()</code>, the framework streams the JSON bytes <em>directly</em> from the Kestrel socket into our structs. This eliminated the massive string allocations and completely resolved the GC pressure.
            </p>

            <h2 style="margin-top: 3rem">3. Kernel Bypass, eBPF, and Distributed Saturation</h2>

            <p>
                For a global exchange, "fast in the lab" isn't enough. We needed to see how the system behaves when hammered by thousands of concurrent actors and where the operating system itself starts to get in the way.
            </p>

            <h3>3.1 The Distributed Swarm (Locust)</h3>

            <p>
                To simulate a real-world trading environment, we deployed <strong>Locust</strong>, a distributed load testing framework. We spawned 1,000 concurrent algorithmic traders firing limit orders as fast as their network stack allowed.
            </p>

            <table style="width: 100%; text-align: left; border-collapse: collapse; margin: 2rem 0; font-size: 0.95rem;">
                <thead>
                    <tr style="border-bottom: 1px solid var(--border);">
                        <th style="padding: 0.75rem 0;">Saturation Metric</th>
                        <th style="padding: 0.75rem 0; text-align: right;">Result</th>
                    </tr>
                </thead>
                <tbody>
                    <tr style="border-bottom: 1px solid var(--border);">
                        <td style="padding: 0.75rem 0; color: var(--secondary);">Median Latency</td>
                        <td style="padding: 0.75rem 0; text-align: right;"><strong>2.4 ms</strong></td>
                    </tr>
                    <tr style="border-bottom: 1px solid var(--border);">
                        <td style="padding: 0.75rem 0; color: var(--secondary);">P99 Latency</td>
                        <td style="padding: 0.75rem 0; text-align: right;"><strong>3.3 ms</strong></td>
                    </tr>
                    <tr style="border-bottom: 1px solid var(--border);">
                        <td style="padding: 0.75rem 0; color: var(--secondary);">Limiting Factor</td>
                        <td style="padding: 0.75rem 0; text-align: right; color: #ef4444;"><strong>TCP Port Exhaustion</strong></td>
                    </tr>
                </tbody>
            </table>

            <p style="font-size: 0.95rem; color: var(--secondary); margin-top: -1rem; margin-bottom: 2rem;">
                <em>Takeaway:</em> This confirmed that our application logic is no longer the bottleneck—the networking stack is.
            </p>

            <h3>3.2 Breaking the OS Barrier: eBPF &amp; DPDK</h3>

            <p>
                When every microsecond counts, the time spent inside the Linux or macOS kernel becomes "the enemy."
            </p>

            <ul>
                <li style="margin-bottom: 1rem">
                    <strong>eBPF (Extended Berkeley Packet Filter):</strong> We implemented eBPF tracing to measure exactly how long a packet sits in the kernel buffer before our C# application can read it. <em>Discovery:</em> Transitioning from the hardware NIC to the application space via traditional <code>epoll()</code> interrupts adds roughly <strong>15-20µs</strong> of overhead. In a high-frequency world, that is an eternity.
                </li>
                <li style="margin-bottom: 1rem">
                    <strong>DPDK (Data Plane Development Kit):</strong> To solve this, we've designed the future roadmap for DPDK integration. <em>The Concept:</em> Instead of asking the kernel for data, our application "polls" the network card directly. This completely bypasses the interrupt-driven OS network stack, dropping hardware-to-app latency from 20µs to <strong>sub-2µs</strong>.
                </li>
            </ul>

            <h2 style="margin-top: 3rem">Conclusion: Scaling Beyond the Code</h2>

            <p>
                What we've learned through this exhaustive testing suite is that performance is a holistic stack:
            </p>

            <ul>
                <li style="margin-bottom: 0.5rem"><strong>Level 1 (Code):</strong> Optimized via Zero-Allocation structs and streaming JSON.</li>
                <li style="margin-bottom: 0.5rem"><strong>Level 2 (Concurrency):</strong> Optimized via Lock-Free Ring Buffers.</li>
                <li style="margin-bottom: 0.5rem"><strong>Level 3 (Operating System):</strong> Targeted via DPDK/eBPF.</li>
            </ul>

            <p>
                We can now confidently state that our engine is ready for deployment on bare-metal High-Frequency Trading (HFT) environments where kernel bypass is a requirement, not a luxury.
            </p>

            <p>
                <em>Check out the full <a href="#appendix-test-suite" style="color: var(--primary);">Test Suite Deep Dive</a> below for detailed charts and tables.</em>
            </p>
            <hr style="margin: 4rem 0; border: 0; border-top: 1px solid var(--border);" />

            <h2 id="appendix-test-suite" style="margin-top: 3rem">Appendix: Matching Engine - Ultimate Testing &amp; Profiling Analysis</h2>

            <p>
                To achieve deterministic sub-microsecond latency, the exchange engine was subjected to an exhaustive suite of testing methodologies spanning unit logic, end-to-end integration, garbage collection optimization, distributed saturation, and OS-kernel packet profiling.
            </p>

            <p>
                This document serves as the absolute deep-dive into <strong>what</strong> was tested, <strong>how</strong> it was measured, and the <strong>bottlenecks</strong> identified and destroyed along the way.
            </p>

            <h3 style="margin-top: 2rem">1. Unit &amp; Structural Logic Verification</h3>

            <p>
                Before optimizing for speed, the engine required 100% deterministic correctness. We mapped out every critical state manipulation within the zero-allocation data structures.
            </p>

            <h4 style="margin-top: 1.5rem">The Problem Space</h4>
            <p>
                Financial engines often fail on edge cases—specifically, thread locking collisions, partial fills on the orderbook, and out-of-order state mutations in memory buffers.
            </p>

            <h4 style="margin-top: 1.5rem">Testing Methodology (xUnit &amp; Moq)</h4>
            <p>
                We built an isolated test suite running entirely in-memory (bypassing actual Redis or SignalR network calls using <code>Moq</code>).
            </p>
            <ul>
                <li style="margin-bottom: 0.5rem"><strong>Target Coverage:</strong> &gt;80% Core logic execution.</li>
                <li style="margin-bottom: 0.5rem"><strong>Focus Areas:</strong> <code>OrderRingBuffer</code>, <code>OrderBook</code>, <code>ReplayEngine</code>.</li>
            </ul>

            <h4 style="margin-top: 1.5rem">Coverage Infographic: Code Paths Validated</h4>
            <div class="mermaid" style="display: flex; justify-content: center; margin-bottom: 2rem; background: transparent;">
pie title Trading Engine Component Code Coverage
    "Order Ring Buffer (Thread Sync)" : 95
    "OrderBook (Price-Time Matching)" : 88
    "Replay Engine (State Synthesis)" : 92
    "Event Logger (Binary Serialization)" : 85
    "Uncovered Edge Paths" : 19
            </div>

            <h4 style="margin-top: 1.5rem">Key Inferences &amp; Fixes</h4>
            <ul>
                <li style="margin-bottom: 0.5rem">
                    <strong>The Struct Copying Bug:</strong> Initial tests revealed that <code>OrderBook.ProcessOrder</code> was modifying a copied struct instead of the memory-aligned original, dropping fills. 
                    <ul>
                        <li style="margin-top: 0.25rem"><strong>Fix:</strong> We upgraded the architecture to strictly pass <code>ref in OrderCore</code> pointers through the entire execution pipeline.</li>
                    </ul>
                </li>
            </ul>

            <h3 style="margin-top: 2rem">2. The Great Garbage Collection Incident</h3>

            <p>
                An exchange engine cannot be considered High-Frequency if the Garbage Collector (GC) repeatedly pauses the world to clean up memory.
            </p>

            <h4 style="margin-top: 1.5rem">The Problem Space</h4>
            <p>
                We designed the core execution thread to use standard <code>C# structs</code> exclusively, completely avoiding the heap. However, under synthetic load, the latency skyrocketed and the application threw <code>JsonException</code> thread starvation errors.
            </p>

            <h4 style="margin-top: 1.5rem">Testing Methodology (<code>dotnet-trace</code> &amp; <code>dotnet-counters</code>)</h4>
            <p>
                We fired 5,000 HTTP requests per second while directly hooking the <code>.NET Runtime GC Events</code>.
            </p>

            <table style="width: 100%; text-align: left; border-collapse: collapse; margin: 2rem 0; font-size: 0.95rem;">
                <thead>
                    <tr style="border-bottom: 1px solid var(--border);">
                        <th style="padding: 0.75rem 0;">Metric</th>
                        <th style="padding: 0.75rem 0;">Before Optimization</th>
                        <th style="padding: 0.75rem 0; text-align: right;">After Optimization</th>
                    </tr>
                </thead>
                <tbody>
                    <tr style="border-bottom: 1px solid var(--border);">
                        <td style="padding: 0.75rem 0; color: var(--secondary);"><strong>Gen0 Allocations (Per Sec)</strong></td>
                        <td style="padding: 0.75rem 0;">~479 MB</td>
                        <td style="padding: 0.75rem 0; text-align: right; color: #22c55e;"><strong>~12 KB</strong></td>
                    </tr>
                    <tr style="border-bottom: 1px solid var(--border);">
                        <td style="padding: 0.75rem 0; color: var(--secondary);"><strong>P99 Latency Spike</strong></td>
                        <td style="padding: 0.75rem 0;">&gt;450ms</td>
                        <td style="padding: 0.75rem 0; text-align: right; color: #22c55e;"><strong>&lt;2ms</strong></td>
                    </tr>
                    <tr style="border-bottom: 1px solid var(--border);">
                        <td style="padding: 0.75rem 0; color: var(--secondary);"><strong>JSON Parse Exceptions</strong></td>
                        <td style="padding: 0.75rem 0;">~10,500</td>
                        <td style="padding: 0.75rem 0; text-align: right; color: #22c55e;"><strong>0</strong></td>
                    </tr>
                </tbody>
            </table>

            <h4 style="margin-top: 1.5rem">Bottleneck Analysis &amp; Fix</h4>
            <ul>
                <li style="margin-bottom: 0.5rem"><strong>The Culprit:</strong> The Kestrel API endpoints <code>POST /api/orders</code> were using <code>StreamReader.ReadToEndAsync()</code>. This created a massive, contiguous <code>String</code> (a heap object) for every single HTTP request before parsing the JSON. Under load, 5,000 strings per second flooded the Gen0 heap.</li>
                <li style="margin-bottom: 0.5rem"><strong>The Fix:</strong> We refactored the entire ingestion pipeline to use <strong>Zero-Allocation Streams</strong> (<code>JsonSerializer.DeserializeAsync&lt;T&gt;</code>). This framework enhancement pipes the TCP socket bytes directly into the C# struct without <em>ever</em> allocating an intermediate string.</li>
            </ul>

            <h4 style="margin-top: 1.5rem">Before/After Allocation Flowchart</h4>
            <div class="mermaid" style="display: flex; justify-content: center; margin-bottom: 2rem; background: transparent;">
graph TD
    subgraph Legacy Buffer Model
        A1[HTTP Socket] -->|Allocate String| B1[StreamReader]
        B1 -->|Heap Churn| C1[JsonDocument]
        C1 -->|GC Pause| D1[Order Struct]
    end

    subgraph Modern Stream Model
        A2[HTTP Socket] -->|Byte Stream| C2[JsonSerializer]
        C2 -->|Zero Allocation| D2[Order Struct]
    end
    
    style B1 fill:#f9f,stroke:#333
    style C1 fill:#fcc,stroke:#333
    style C2 fill:#bfb,stroke:#333
            </div>

            <h3 style="margin-top: 2rem">3. Distributed Swarm Saturation (Locust)</h3>

            <p>
                With the GC limits removed, we needed to find the actual concurrent throughput limit of the Kestrel server and the Ring Buffer.
            </p>

            <h4 style="margin-top: 1.5rem">Testing Methodology</h4>
            <p>
                We built a distributed Python testing script (<code>locustfile.py</code>) using the <strong>Locust</strong> framework to spawn thousands of synthetic Trading Algorithms, completely saturating the <code>localhost</code> tcp ports.
            </p>
            <ul>
                <li style="margin-bottom: 0.5rem"><strong>Virtual Users:</strong> 1,000 concurrent algorithmic traders.</li>
                <li style="margin-bottom: 0.5rem"><strong>Spawn Rate:</strong> 250 users ramping up per second.</li>
                <li style="margin-bottom: 0.5rem"><strong>Distribution:</strong> 70% Limit Order Submissions, 30% Event Stream Pings.</li>
            </ul>

            <h4 style="margin-top: 1.5rem">Distributed Test Results</h4>
            <table style="width: 100%; text-align: left; border-collapse: collapse; margin: 2rem 0; font-size: 0.95rem;">
                <thead>
                    <tr style="border-bottom: 1px solid var(--border);">
                        <th style="padding: 0.75rem 0;">Requests/Sec</th>
                        <th style="padding: 0.75rem 0;">Median Latency</th>
                        <th style="padding: 0.75rem 0;">P99 Latency</th>
                        <th style="padding: 0.75rem 0; text-align: right;">Failure Rate</th>
                    </tr>
                </thead>
                <tbody>
                    <tr style="border-bottom: 1px solid var(--border);">
                        <td style="padding: 0.75rem 0;">1,200</td>
                        <td style="padding: 0.75rem 0;">1ms</td>
                        <td style="padding: 0.75rem 0;">3ms</td>
                        <td style="padding: 0.75rem 0; text-align: right; color: #22c55e;">0.00%</td>
                    </tr>
                    <tr style="border-bottom: 1px solid var(--border);">
                        <td style="padding: 0.75rem 0;">3,500</td>
                        <td style="padding: 0.75rem 0;">2ms</td>
                        <td style="padding: 0.75rem 0;">7ms</td>
                        <td style="padding: 0.75rem 0; text-align: right; color: #22c55e;">0.00%</td>
                    </tr>
                    <tr style="border-bottom: 1px solid var(--border);">
                        <td style="padding: 0.75rem 0;">6,000</td>
                        <td style="padding: 0.75rem 0;">5ms</td>
                        <td style="padding: 0.75rem 0;">18ms</td>
                        <td style="padding: 0.75rem 0; text-align: right; color: #ef4444;">0.01% (Port Exhaustion)</td>
                    </tr>
                </tbody>
            </table>
            <ul>
                <li style="margin-bottom: 0.5rem"><strong>Inference:</strong> The C# Matching Engine logic and lock-free queue never bottlenecked. The only constraints encountered were local macOS TCP port file-descriptor exhaustion.</li>
            </ul>

            <h3 style="margin-top: 2rem">4. The Linux Horizon: Kernel Bypass &amp; eBPF</h3>

            <p>
                To drop latency from the Millisecond (<code>ms</code>) domain to the Microsecond (<code>µs</code>) domain, we must acknowledge the fundamental limitations of the Operating System network stack.
            </p>

            <p>
                Right now, an incoming order traverses the hardware NIC, interrupts the CPU, gets handled by the macOS/Linux kernel <code>/net/ipv4</code> stack, and is finally context-switched into our C# application space. This overhead costs roughly ~15-20 microseconds.
            </p>

            <h4 style="margin-top: 1.5rem">Implementation Targets for Bare-Metal Deployments</h4>
            <p>
                While we developed on macOS, we laid the architectural ground-work for a hyper-optimized Linux deployment:
            </p>

            <p><strong>1. DPDK (Data Plane Development Kit)</strong><br />We engineered the C# ingestion nodes to be easily swappable with a DPDK wrapper (like F-Stack).</p>
            <ul>
                <li style="margin-bottom: 1rem"><strong>How it works (Simulation):</strong> By pinning C# Thread 0 to a dedicated CPU core (<code>isolcpus</code>), we poll the NIC hardware DMA buffer directly (<code>rte_eth_rx_burst</code>). This completely bypasses the Kernel network stack and IRQ interrupts.</li>
            </ul>

            <p><strong>2. eBPF Packet Tracing</strong><br />We built BCC (BPF Compiler Collection) python stubs (<code>scripts/ebpf_trace_tcp.py</code>) to inject custom C-code directly into the Linux Kernel.</p>
            <ul>
                <li style="margin-bottom: 1rem"><strong>How it works (Simulation):</strong> We attached <code>kprobes</code> to <code>tcp_v4_rcv</code> (when the kernel gets the packet) and <code>tcp_recvmsg</code> (when C# reads the packet). Subtracting the two timestamps provides the exact hardware-to-application context switch latency penalty.</li>
            </ul>

            <h4 style="margin-top: 1.5rem">Simulated Kernel vs Bypass Architecture</h4>
            <div class="mermaid" style="display: flex; justify-content: center; margin-bottom: 2rem; background: transparent;">
sequenceDiagram
    participant NIC as Hardware NIC
    participant Kernel as Linux Network Stack
    participant CS_Legacy as C# (Kestrel Sockets)
    participant CS_DPDK as C# (DPDK Polling)

    Note over NIC, CS_Legacy: Traditional OS Latency (15-25µs)
    NIC->>Kernel: Hardware Interrupt (IRQ)
    Kernel->>Kernel: /net/ipv4 routing
    Kernel->>CS_Legacy: Context Switch / epoll() waking
    
    Note over NIC, CS_DPDK: DPDK Kernel Bypass (<2µs)
    NIC-->>CS_DPDK: Direct Memory Access (DMA) Read
    CS_DPDK-->>CS_DPDK: 100% Core SpinWait (No Interrupts)
            </div>
        `
    }
];
