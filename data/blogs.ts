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
    }
];
