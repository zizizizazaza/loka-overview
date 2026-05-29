import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import ConsensusChat from './ConsensusChat';

// Restrained palette — soft warm-white background, hairline borders, one accent.
const BG = '#FAFAF7';
const INK = '#111111';
const SUB = '#6B6B66';
const LINE = 'rgba(17,17,17,0.08)';
const ACCENT = '#1F1F1F';      // primary CTA uses ink, not neon
const HINT = '#E8F1A8';        // very soft lime, used sparingly as a tint

const useInView = (options?: IntersectionObserverInit) => {
    const ref = useRef<HTMLDivElement>(null);
    const [isInView, setIsInView] = useState(false);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) { setIsInView(true); observer.unobserve(el); }
        }, { threshold: 0.15, ...options });
        observer.observe(el);
        return () => observer.disconnect();
    }, []);
    return { ref, isInView };
};

// ─────────── Buttons ───────────
const PrimaryBtn: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { children: React.ReactNode }> = ({ children, className = '', ...rest }) => (
    <button {...rest} className={`inline-flex items-center justify-center gap-2 h-11 px-5 rounded-full text-[13px] font-medium tracking-tight text-white bg-[#111] hover:bg-black transition-colors ${className}`}>
        {children}
    </button>
);
const GhostBtn: React.FC<React.AnchorHTMLAttributes<HTMLAnchorElement> & { children: React.ReactNode }> = ({ children, className = '', ...rest }) => (
    <a {...rest} className={`inline-flex items-center justify-center gap-2 h-11 px-5 rounded-full text-[13px] font-medium tracking-tight text-[#111] bg-white border hover:bg-[#FAFAF7] transition-colors ${className}`} style={{ borderColor: LINE }}>
        {children}
    </a>
);

// ─────────── Backers strip ───────────
const BACKERS = [
    { name: 'Hetu', src: '/logos/partners/hetu.svg' },
    { name: 'MIT', src: '/logos/partners/logo-mit.svg' },
    { name: 'Columbia University', src: '/logos/partners/logo-cus.svg' },
    { name: 'National University of Singapore', src: '/logos/partners/logo-nus.svg' },
    { name: 'Washington University', src: '/logos/partners/logo-wash.svg' },
    { name: 'Manifold', src: '/logos/partners/logo-mh.svg' },
    { name: 'dao5', src: '/logos/partners/logo-dao5.svg' },
    { name: 'Robot Ventures', src: '/logos/partners/logo-robot.svg' },
];

const Backers: React.FC = () => (
    <div className="pt-2">
        <div className="text-[10.5px] uppercase tracking-[0.18em] text-[#9a9a93] mb-3">Backed by research labs & funds</div>
        <div className="flex flex-wrap items-center gap-x-7 gap-y-3">
            {BACKERS.map((b) => (
                <img
                    key={b.name}
                    src={b.src}
                    alt={b.name}
                    title={b.name}
                    className="h-5 md:h-[22px] w-auto opacity-60 hover:opacity-100 transition-opacity shrink-0"
                    style={{ filter: 'brightness(0)' }}
                />
            ))}
        </div>
    </div>
);

// ─────────── Top bar ───────────
const Nav: React.FC = () => (
    <nav className="flex items-center justify-between py-5">
        <button onClick={() => { const c = document.querySelector('.flex-1.overflow-y-auto'); (c || window).scrollTo({ top: 0, behavior: 'smooth' }); }} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <img src="/loka-logo-symbol.png" alt="Loka" className="w-6 h-6 object-contain" />
            <span className="text-[15px] font-semibold tracking-tight text-[#111]">Loka</span>
        </button>
        <div className="hidden md:flex items-center gap-7 text-[13px] text-[#444]">
            <a href="#why" className="hover:text-black transition-colors">Why Loka</a>
            <a href="#benchmark" className="hover:text-black transition-colors">Benchmark</a>
            <a href="#faq" className="hover:text-black transition-colors">FAQ</a>
        </div>
        <PrimaryBtn onClick={() => { window.location.pathname = '/'; }}>Open App</PrimaryBtn>
    </nav>
);

// ─────────── Hero ───────────
const Hero: React.FC = () => {
    const go = () => { window.location.pathname = '/'; };
    return (
        <section className="pt-10 md:pt-16 pb-8">
            <div className="lg:grid lg:grid-cols-12 lg:gap-16 lg:items-center">
                {/* Left — copy */}
                <div className="lg:col-span-6 space-y-5">
                    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1 text-[14px] md:text-[15px] leading-[1.35]" style={{ color: '#5a5a55', fontWeight: 500 }}>
                        <span className="font-semibold text-[#0A7C4A] tabular-nums">1/10</span>
                        <span>the cost of GPT —</span>
                        <span className="font-semibold text-[#0A7C4A] tabular-nums">30%+</span>
                        <span>higher win rate.</span>
                    </div>
                    <h1 className="text-[40px] md:text-[54px] lg:text-[64px] tracking-[-0.04em] leading-[1.02]" style={{ fontFamily: "'Geist', 'Inter', sans-serif", fontWeight: 700, color: '#0A0A0A' }}>
                        Trade with a <span style={{ color: '#0A0A0A' }}>council</span>,<br />
                        not a <span style={{ color: '#C7C7BF', fontWeight: 600 }}>chatbot</span>.
                    </h1>
                    <p className="text-[15px] md:text-[16px] text-[#5a5a55] leading-[1.6] max-w-[520px]">
                        A desk of specialist AI analysts — fundamentals, macro, on-chain, risk —
                        debates every idea and ships one consensus call you can size, stop, and execute.
                    </p>
                    <div className="flex flex-wrap items-center gap-3 pt-1">
                        <PrimaryBtn onClick={go}>Try it free →</PrimaryBtn>
                        <GhostBtn href="#benchmark">Compare vs. GPT</GhostBtn>
                    </div>
                    <Backers />
                </div>

                {/* Right — animation */}
                <div className="lg:col-span-6 mt-14 lg:mt-0">
                    <div className="relative max-w-[520px] mx-auto lg:ml-auto lg:mr-0">
                        <div className="absolute -inset-6 rounded-[32px] bg-gradient-to-br from-[#F4F4EE] to-transparent -z-10" />
                        <div className="rounded-[24px] border bg-white/70 backdrop-blur-sm overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.03),0_20px_50px_-20px_rgba(0,0,0,0.12)]" style={{ borderColor: LINE }}>
                            <ConsensusChat feedHeight={500} />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

// ─────────── Battle arena (case-by-case head-to-head, aligned to AegeanBench contract) ───────────
type BattleModelId = 'loka' | 'gpt' | 'claude' | 'deepseek' | 'grok' | 'random';
type BattleAnswer = 'buy' | 'hold' | 'sell' | 'watch';
type Polarity = 'supportive' | 'bearish' | 'neutral';
type Difficulty = 'easy' | 'medium' | 'hard';
type AgentVote = { id: string; name: string; answer: BattleAnswer; confidence: number; rationale: string };
type Round = { round: number; agents: AgentVote[]; weightedVote: Partial<Record<BattleAnswer, number>>; converged: boolean };
type ConsensusTrace = { rounds: Round[]; finalDecision: BattleAnswer; roundsUsed: number; earlyStopped: boolean };
type AnonymizedReplay = { actionOriginal: BattleAnswer; actionAnon: BattleAnswer; confidenceGap: number };
type RunnerResult = {
    model: BattleModelId;
    label: string;
    color: string;
    type: 'consensus' | 'single_agent' | 'baseline';
    action: BattleAnswer;                // per_runner_response.action
    confidence: number;
    target_exposure_pct: number;         // 0..1
    rationale: string;
    latencyS: number;                    // latency_s
    tokensPrompt: number;
    tokensCompletion: number;
    simulated_return_pct: number;        // already includes fees + slippage, shown as %
    correct: boolean;
    trace?: ConsensusTrace;
    replay?: AnonymizedReplay;
};
type BattleCase = {
    id: string;
    asset: string;
    assetType: 'equity' | 'crypto' | 'macro';
    badge: string;
    asOf: string;
    question: string;
    windowDays: number;
    difficulty: Difficulty;
    inputs: {
        price: number;
        priceUnit: string;
        change30d: number;
        high52w: number;
        low52w: number;
        volume_avg_20d?: string;          // formatted, e.g. "52.3M"
        // fundamentals (equity only)
        pe?: number;
        revYoY?: number;
        marketCap?: string;
        headlines: { title: string; polarity: Polarity }[];
    };
    groundTruth: {
        forward_return_30d: number;          // actual return over the {windowDays} forward window, %
        benchmark_return_30d: number;        // same-window benchmark return, %
        benchmark_name: string;              // e.g. "SPY", "BTC index", "沪深 300"
        direction_label: 'bullish' | 'bearish' | 'neutral';
        summary: string;
    };
    runners: Partial<Record<BattleModelId, RunnerResult>>;
    /** Optional drama: highlight a memorization flip on this case. */
    spotlight?: { kind: 'memorization'; flippedModel: BattleModelId; note: string };
};

const BATTLE_COLORS: Record<BattleModelId, string> = {
    loka: '#0A0A0A',
    gpt: '#2C4DAA',
    claude: '#B7621B',
    deepseek: '#6F3BB5',
    grok: '#4A5C68',
    random: '#9CA3A0',
};
const BATTLE_LABELS: Record<BattleModelId, string> = {
    loka: 'Aegean Consensus',
    gpt: 'GPT-5',
    claude: 'Claude Opus 4.7',
    deepseek: 'DeepSeek V3',
    grok: 'Grok 4',
    random: 'Random baseline',
};
const BATTLE_PROVIDERS: Record<BattleModelId, string> = {
    loka: 'Aegean',
    gpt: 'OpenAI',
    claude: 'Anthropic',
    deepseek: 'DeepSeek',
    grok: 'xAI',
    random: 'Baseline',
};
const BATTLE_TYPES: Record<BattleModelId, 'consensus' | 'single_agent' | 'baseline'> = {
    loka: 'consensus',
    gpt: 'single_agent',
    claude: 'single_agent',
    deepseek: 'single_agent',
    grok: 'single_agent',
    random: 'baseline',
};

// Agent ids aligned to AegeanBench contract (per doc §5 consensus_trace example).
const mkLokaTrace = (
    final: BattleAnswer,
    finalVote: Partial<Record<BattleAnswer, number>>,
    rationales: { fundamental?: string; sentiment?: string; macro?: string; risk?: string; [k: string]: string | undefined },
    _twoRounds = true,
): ConsensusTrace => {
    // Accept legacy short keys (fund/sent) for backwards compat with mock data
    const fund = rationales.fundamental ?? rationales.fund ?? 'Fundamental signals weighed.';
    const sent = rationales.sentiment ?? rationales.sent ?? 'Sentiment signal aligned.';
    const macro = rationales.macro ?? 'Macro overlay considered.';
    const r1: Round = {
        round: 1, converged: false,
        agents: [
            { id: 'fundamental_specialist', name: 'Fundamental', answer: final === 'sell' ? 'hold' : 'buy', confidence: 0.62, rationale: fund },
            { id: 'sentiment_specialist', name: 'Sentiment', answer: final, confidence: 0.55, rationale: sent },
            { id: 'macro_specialist', name: 'Macro', answer: final, confidence: 0.58, rationale: macro },
        ],
        weightedVote: { buy: 1.20, hold: 0.55 },
    };
    const r2: Round = {
        round: 2, converged: true,
        agents: [
            { id: 'fundamental_specialist', name: 'Fundamental', answer: final, confidence: 0.74, rationale: 'After review, fundamentals support the call.' },
            { id: 'sentiment_specialist', name: 'Sentiment', answer: final, confidence: 0.66, rationale: 'Crowd sentiment confirms direction.' },
            { id: 'macro_specialist', name: 'Macro', answer: final, confidence: 0.71, rationale: 'Macro overlay aligns with thesis.' },
        ],
        weightedVote: finalVote,
    };
    const rounds = [r1, r2];
    return { rounds, finalDecision: final, roundsUsed: rounds.length, earlyStopped: rounds.length < 3 };
};

// Helper to keep runner construction terse
const runner = (
    model: BattleModelId,
    action: BattleAnswer,
    confidence: number,
    target_exposure_pct: number,
    rationale: string,
    simulated_return_pct: number,
    correct: boolean,
    latencyS: number,
    tokens: [number, number],
    extras: Partial<Pick<RunnerResult, 'trace' | 'replay'>> = {},
): RunnerResult => ({
    model,
    label: BATTLE_LABELS[model],
    color: BATTLE_COLORS[model],
    type: BATTLE_TYPES[model],
    action, confidence, target_exposure_pct, rationale,
    latencyS, tokensPrompt: tokens[0], tokensCompletion: tokens[1],
    simulated_return_pct, correct,
    ...extras,
});

const BATTLE_CASES: BattleCase[] = [
    {
        id: 'nvda-2026-02',
        asset: 'NVDA', assetType: 'equity', badge: 'US Equity', asOf: '2026-02-03',
        question: 'Should you take a position in NVDA today?',
        windowDays: 30,
        inputs: {
            price: 189.42, priceUnit: '$', change30d: -2.1, pe: 27, revYoY: 6.2, marketCap: '$4.6T',
            high52w: 214.10, low52w: 122.85,
            headlines: [
                { title: 'Q4 beats on data-center revenue', polarity: 'supportive' },
                { title: 'Hyperscaler capex guidance softens for H2', polarity: 'bearish' },
                { title: 'Blackwell ramp ahead of schedule, Jensen says', polarity: 'supportive' },
                { title: 'China export rules tightened again', polarity: 'bearish' },
            ],
        },
        groundTruth: {
            forward_return_30d: 4.2,
            benchmark_return_30d: 1.2,
            benchmark_name: 'SPY',
            direction_label: 'bullish',
            summary: 'NVDA rallied on continued data-center spend; closed +4.2% over the next 30 days.',
        },
        runners: {
            loka: {
                model: 'loka', label: 'Loka', color: BATTLE_COLORS.loka,
                action: 'buy', confidence: 0.78, target_exposure_pct:0.08,
                rationale: 'Council converged after risk agent dropped its objection — fundamentals expanding, valuation rich but justified by Blackwell ramp.',
                simulated_return_pct:0.34, correct: true,
                trace: mkLokaTrace('buy', { buy: 1.65, hold: 0.40, sell: 0.20 }, {
                    fund: 'Gross margins still expanding into next year.',
                    macro: 'Rate path supports growth multiples.',
                    risk: 'Hyperscaler capex concentration — watching for cuts.',
                    sent: 'Tone net-positive, cooling at retail edges.',
                }),
            },
            gpt: {
                model: 'gpt', label: 'GPT-5', color: BATTLE_COLORS.gpt,
                action: 'hold', confidence: 0.51, target_exposure_pct:0,
                rationale: 'Conflicting catalysts; prefer to wait for next earnings before sizing in.',
                simulated_return_pct:0, correct: false,
            },
            claude: {
                model: 'claude', label: 'Claude Opus 4.7', color: BATTLE_COLORS.claude,
                action: 'buy', confidence: 0.62, target_exposure_pct:0.05,
                rationale: 'Cash flow solid; valuation stretched but moat real. Modest entry size.',
                simulated_return_pct:0.21, correct: true,
            },
            deepseek: {
                model: 'deepseek', label: 'DeepSeek V3', color: BATTLE_COLORS.deepseek,
                action: 'sell', confidence: 0.45, target_exposure_pct:0.04,
                rationale: 'Hyperscaler capex concentration risk overweights the move.',
                simulated_return_pct:-0.17, correct: false,
            },
        },
    },
    {
        id: 'btc-2026-01',
        asset: 'BTC', assetType: 'crypto', badge: 'Crypto', asOf: '2026-01-18',
        question: 'After two weeks of ETF outflows, buy the dip on BTC?',
        windowDays: 14,
        inputs: {
            price: 92840, priceUnit: '$', change30d: -8.4, marketCap: '$1.83T',
            high52w: 112400, low52w: 41020,
            headlines: [
                { title: 'Spot BTC ETFs see 9 straight days of net outflows', polarity: 'bearish' },
                { title: 'On-chain: long-term holders distributing', polarity: 'bearish' },
                { title: 'Mt. Gox repayment window opens next week', polarity: 'bearish' },
                { title: 'Funding rates flipped negative on Binance', polarity: 'neutral' },
            ],
        },
        groundTruth: {
            forward_return_30d: -3.6,
            benchmark_return_30d: -3.6,
            benchmark_name: 'BTC index',
            direction_label: 'bearish',
            summary: 'BTC drifted lower as outflows continued; closed −3.6% over the 14-day window.',
        },
        runners: {
            loka: {
                model: 'loka', label: 'Loka', color: BATTLE_COLORS.loka,
                action: 'sell', confidence: 0.71, target_exposure_pct:0.06,
                rationale: 'Risk + on-chain agents flagged distribution; macro agreed liquidity is tight. Short with tight stop.',
                simulated_return_pct:0.22, correct: true,
                trace: mkLokaTrace('sell', { buy: 0.35, hold: 0.40, sell: 1.55 }, {
                    fund: 'No fundamental catalyst either way.',
                    macro: 'DXY firming, USD liquidity tight.',
                    risk: 'Negative funding + distribution = textbook bear setup.',
                    sent: 'Retail capitulation hasn\'t finished.',
                }),
            },
            gpt: {
                model: 'gpt', label: 'GPT-5', color: BATTLE_COLORS.gpt,
                action: 'buy', confidence: 0.54, target_exposure_pct:0.05,
                rationale: 'Long-term holders distributing is contrarian buy signal; outflows look exhausted.',
                simulated_return_pct:-0.18, correct: false,
            },
            claude: {
                model: 'claude', label: 'Claude Opus 4.7', color: BATTLE_COLORS.claude,
                action: 'hold', confidence: 0.55, target_exposure_pct:0,
                rationale: 'Catalysts mixed; sit on hands until ETF flows stabilize.',
                simulated_return_pct:0, correct: false,
            },
            deepseek: {
                model: 'deepseek', label: 'DeepSeek V3', color: BATTLE_COLORS.deepseek,
                action: 'sell', confidence: 0.58, target_exposure_pct:0.05,
                rationale: 'Distribution + macro headwind; expect another leg down.',
                simulated_return_pct:0.18, correct: true,
            },
        },
    },
    {
        id: 'aapl-2026-03',
        asset: 'AAPL', assetType: 'equity', badge: 'US Equity', asOf: '2026-03-12',
        question: 'AAPL just beat on earnings — is the rally already priced in?',
        windowDays: 30,
        inputs: {
            price: 232.18, priceUnit: '$', change30d: 6.4, pe: 32, revYoY: 3.1, marketCap: '$3.5T',
            high52w: 241.50, low52w: 178.20,
            headlines: [
                { title: 'iPhone services growth re-accelerates', polarity: 'supportive' },
                { title: 'Vision Pro Q1 sales miss whisper numbers', polarity: 'bearish' },
                { title: 'Buyback program lifted by $90B', polarity: 'supportive' },
                { title: 'Analysts split on AI strategy', polarity: 'neutral' },
            ],
        },
        groundTruth: {
            forward_return_30d: 1.1,
            benchmark_return_30d: 0.8,
            benchmark_name: 'SPY',
            direction_label: 'neutral',
            summary: 'AAPL drifted sideways then up; closed +1.1% in the next 30 days. Mostly a HOLD outcome.',
        },
        runners: {
            loka: {
                model: 'loka', label: 'Loka', color: BATTLE_COLORS.loka,
                action: 'hold', confidence: 0.66, target_exposure_pct:0,
                rationale: 'Council split — fundamentals OK but valuation rich at PE 32; risk agent vetoed sizing in this close to highs.',
                simulated_return_pct:0, correct: true,
                trace: mkLokaTrace('hold', { buy: 0.85, hold: 1.40, sell: 0.45 }, {
                    fund: 'Services beat is real but priced in.',
                    macro: 'No rate catalyst this month.',
                    risk: 'Within 4% of 52-week high — bad entry.',
                    sent: 'Crowd long, contrarian neutral.',
                }),
            },
            gpt: {
                model: 'gpt', label: 'GPT-5', color: BATTLE_COLORS.gpt,
                action: 'buy', confidence: 0.60, target_exposure_pct:0.05,
                rationale: 'Earnings beat + buyback expansion supports continuation.',
                simulated_return_pct:0.06, correct: false,
            },
            claude: {
                model: 'claude', label: 'Claude Opus 4.7', color: BATTLE_COLORS.claude,
                action: 'hold', confidence: 0.58, target_exposure_pct:0,
                rationale: 'Wait for a pullback; valuation rich, AI narrative still unsettled.',
                simulated_return_pct:0, correct: true,
            },
            deepseek: {
                model: 'deepseek', label: 'DeepSeek V3', color: BATTLE_COLORS.deepseek,
                action: 'buy', confidence: 0.52, target_exposure_pct:0.04,
                rationale: 'Momentum after earnings tends to persist for ~30 days.',
                simulated_return_pct:0.04, correct: false,
            },
        },
    },
    {
        id: 'baba-2026-04',
        asset: 'BABA', assetType: 'equity', badge: 'HK Equity', asOf: '2026-04-09',
        question: 'Regulatory clouds clearing — is BABA finally a buy?',
        windowDays: 60,
        inputs: {
            price: 86.40, priceUnit: '$', change30d: -3.8, pe: 11, revYoY: 7.4, marketCap: '$208B',
            high52w: 118.20, low52w: 73.10,
            headlines: [
                { title: 'Antitrust review formally closed by SAMR', polarity: 'supportive' },
                { title: 'Cloud revenue accelerating on AI demand', polarity: 'supportive' },
                { title: 'US delisting risk re-emerges in committee debate', polarity: 'bearish' },
                { title: 'Cash position now 40% of market cap', polarity: 'supportive' },
            ],
        },
        groundTruth: {
            forward_return_30d: 9.4,
            benchmark_return_30d: 2.1,
            benchmark_name: 'HSI',
            direction_label: 'bullish',
            summary: 'BABA re-rated as the regulatory overhang lifted; +9.4% over the 60-day window.',
        },
        runners: {
            loka: {
                model: 'loka', label: 'Loka', color: BATTLE_COLORS.loka,
                action: 'buy', confidence: 0.74, target_exposure_pct:0.07,
                rationale: 'Council aligned: fundamentals improving, valuation deep value (PE 11 with cash floor). Sized for re-rating thesis.',
                simulated_return_pct:0.66, correct: true,
                trace: mkLokaTrace('buy', { buy: 1.55, hold: 0.55, sell: 0.30 }, {
                    fund: 'PE 11 with cash = 40% of cap — margin of safety strong.',
                    macro: 'China stimulus tailwind starting to bite.',
                    risk: 'US delisting tail risk acknowledged but small.',
                    sent: 'Western sentiment bottoming.',
                }),
            },
            gpt: {
                model: 'gpt', label: 'GPT-5', color: BATTLE_COLORS.gpt,
                action: 'hold', confidence: 0.55, target_exposure_pct:0,
                rationale: 'Geopolitical tail risk still elevated; prefer to wait.',
                simulated_return_pct:0, correct: false,
            },
            claude: {
                model: 'claude', label: 'Claude Opus 4.7', color: BATTLE_COLORS.claude,
                action: 'buy', confidence: 0.61, target_exposure_pct:0.04,
                rationale: 'Value setup is rare at this scale; small starter position.',
                simulated_return_pct:0.38, correct: true,
            },
            deepseek: {
                model: 'deepseek', label: 'DeepSeek V3', color: BATTLE_COLORS.deepseek,
                action: 'buy', confidence: 0.58, target_exposure_pct:0.05,
                rationale: 'On-chain wallet flows show institutional accumulation in ADRs.',
                simulated_return_pct:0.47, correct: true,
            },
        },
    },
    {
        id: 'spy-fed-week',
        asset: 'SPY', assetType: 'macro', badge: 'Macro', asOf: '2026-05-13',
        question: 'Last day before the Fed dot plot — risk on or risk off?',
        windowDays: 7,
        inputs: {
            price: 568.20, priceUnit: '$', change30d: 1.4, pe: 22, marketCap: '—',
            high52w: 582.40, low52w: 482.60,
            headlines: [
                { title: 'CPI prints in line, services sticky', polarity: 'neutral' },
                { title: 'Two regional Fed presidents hint at pause', polarity: 'supportive' },
                { title: 'VIX term structure flattening sharply', polarity: 'neutral' },
                { title: 'Earnings beats running 76%', polarity: 'supportive' },
            ],
        },
        groundTruth: {
            forward_return_30d: 0.3,
            benchmark_return_30d: 0.3,
            benchmark_name: 'SPY (self)',
            direction_label: 'neutral',
            summary: 'SPY barely moved into and out of the Fed meeting; +0.3% over the 7-day window. HOLD wins.',
        },
        runners: {
            loka: {
                model: 'loka', label: 'Loka', color: BATTLE_COLORS.loka,
                action: 'hold', confidence: 0.69, target_exposure_pct:0,
                rationale: 'Council voted HOLD: macro setup neutral, vol compression suggests range-bound — bad expected value either way.',
                simulated_return_pct:0, correct: true,
                trace: mkLokaTrace('hold', { buy: 0.55, hold: 1.65, sell: 0.40 }, {
                    fund: 'Earnings are decent, nothing extreme.',
                    macro: 'Fed surprise risk both ways — coin flip.',
                    risk: 'Vol compression usually breaks AFTER FOMC, not into it.',
                    sent: 'Crowd positioned for dovish — squeezing room is small.',
                }),
            },
            gpt: {
                model: 'gpt', label: 'GPT-5', color: BATTLE_COLORS.gpt,
                action: 'buy', confidence: 0.56, target_exposure_pct:0.05,
                rationale: 'Pause narrative gaining traction; dot plot likely dovish.',
                simulated_return_pct:0.02, correct: false,
            },
            claude: {
                model: 'claude', label: 'Claude Opus 4.7', color: BATTLE_COLORS.claude,
                action: 'hold', confidence: 0.60, target_exposure_pct:0,
                rationale: 'Expected value too thin to size into; wait for Fed reaction.',
                simulated_return_pct:0, correct: true,
            },
            deepseek: {
                model: 'deepseek', label: 'DeepSeek V3', color: BATTLE_COLORS.deepseek,
                action: 'sell', confidence: 0.48, target_exposure_pct:0.04,
                rationale: 'Crowded long into Fed is asymmetric down risk.',
                simulated_return_pct:-0.01, correct: false,
            },
        },
    },
    {
        id: 'eth-2026-03',
        asset: 'ETH', assetType: 'crypto', badge: 'Crypto', asOf: '2026-03-22',
        question: 'L2 fee compression hurting ETH revenue — is the thesis broken?',
        windowDays: 30,
        inputs: {
            price: 3120, priceUnit: '$', change30d: -5.6, marketCap: '$375B',
            high52w: 4180, low52w: 2240,
            headlines: [
                { title: 'L2 transaction fees down 92% YoY', polarity: 'bearish' },
                { title: 'Validator queue empties, staking yields rising', polarity: 'neutral' },
                { title: 'Spot ETH ETF net inflows turn negative', polarity: 'bearish' },
                { title: 'Solana DEX volumes overtake Ethereum for 3rd month', polarity: 'bearish' },
            ],
        },
        groundTruth: {
            forward_return_30d: -7.2,
            benchmark_return_30d: -1.8,
            benchmark_name: 'BTC index',
            direction_label: 'bearish',
            summary: 'ETH continued under pressure as L2 cannibalization persisted; −7.2% over 30 days.',
        },
        runners: {
            loka: {
                model: 'loka', label: 'Loka', color: BATTLE_COLORS.loka,
                action: 'sell', confidence: 0.72, target_exposure_pct:0.06,
                rationale: 'Council aligned on SELL after 3 rounds: fundamentals deteriorating, sentiment bearish, no macro tailwind.',
                simulated_return_pct:0.43, correct: true,
                trace: mkLokaTrace('sell', { buy: 0.30, hold: 0.45, sell: 1.65 }, {
                    fund: 'Fee revenue collapse is structural, not cyclical.',
                    macro: 'No catalyst on the horizon.',
                    risk: 'Drawdown asymmetry — easy to manage with stop.',
                    sent: 'ETF outflows + competitor narrative weighs.',
                }),
            },
            gpt: {
                model: 'gpt', label: 'GPT-5', color: BATTLE_COLORS.gpt,
                action: 'hold', confidence: 0.50, target_exposure_pct:0,
                rationale: 'Long-term thesis intact despite short-term noise.',
                simulated_return_pct:0, correct: false,
            },
            claude: {
                model: 'claude', label: 'Claude Opus 4.7', color: BATTLE_COLORS.claude,
                action: 'sell', confidence: 0.59, target_exposure_pct:0.04,
                rationale: 'Fee compression is structural; reduce exposure.',
                simulated_return_pct:0.29, correct: true,
            },
            deepseek: {
                model: 'deepseek', label: 'DeepSeek V3', color: BATTLE_COLORS.deepseek,
                action: 'buy', confidence: 0.46, target_exposure_pct:0.05,
                rationale: 'Deep value at 0.3x prior cycle high.',
                simulated_return_pct:-0.36, correct: false,
            },
        },
    },
];

const polarityStyle: Record<Polarity, { bg: string; fg: string; label: string }> = {
    supportive: { bg: 'rgba(16,185,129,0.10)', fg: '#047857', label: 'supportive' },
    bearish: { bg: 'rgba(239,68,68,0.10)', fg: '#b91c1c', label: 'bearish' },
    neutral: { bg: 'rgba(0,0,0,0.05)', fg: '#525252', label: 'neutral' },
};

const answerStyle: Record<BattleAnswer, { bg: string; fg: string; label: string }> = {
    buy: { bg: 'rgba(16,185,129,0.12)', fg: '#047857', label: 'BUY' },
    hold: { bg: 'rgba(0,0,0,0.06)', fg: '#444', label: 'HOLD' },
    sell: { bg: 'rgba(239,68,68,0.12)', fg: '#b91c1c', label: 'SELL' },
    watch: { bg: 'rgba(0,0,0,0.04)', fg: '#7a7a73', label: 'WATCH' },
};

const difficultyStyle: Record<Difficulty, { bg: string; fg: string }> = {
    easy: { bg: 'rgba(16,185,129,0.10)', fg: '#047857' },
    medium: { bg: 'rgba(245,158,11,0.12)', fg: '#92400E' },
    hard: { bg: 'rgba(239,68,68,0.10)', fg: '#b91c1c' },
};

// Asset visual identity — soft tint + iconic glyph per asset class
const assetVisual = (c: BattleCase): { tint: string; ring: string; icon: React.ReactNode } => {
    if (c.assetType === 'crypto') {
        const glyph = c.asset === 'BTC' ? '₿' : c.asset === 'ETH' ? 'Ξ' : c.asset;
        return {
            tint: 'linear-gradient(135deg, #FFF1E0 0%, #FAFAF7 70%)',
            ring: '#F59E0B',
            icon: <div className="w-11 h-11 rounded-full flex items-center justify-center text-[20px] font-bold" style={{ background: '#F59E0B', color: '#fff' }}>{glyph}</div>,
        };
    }
    if (c.assetType === 'macro') {
        return {
            tint: 'linear-gradient(135deg, #E8EEFB 0%, #FAFAF7 70%)',
            ring: '#2C4DAA',
            icon: <div className="w-11 h-11 rounded-full flex items-center justify-center" style={{ background: '#2C4DAA', color: '#fff' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></svg>
            </div>,
        };
    }
    // equity (US / HK)
    const isHK = c.badge.toLowerCase().includes('hk');
    const bg = isHK ? '#C2410C' : '#0A0A0A';
    const tint = isHK ? 'linear-gradient(135deg, #FBEAE0 0%, #FAFAF7 70%)' : 'linear-gradient(135deg, #ECECE6 0%, #FAFAF7 70%)';
    return {
        tint, ring: bg,
        icon: <div className="w-11 h-11 rounded-md flex items-center justify-center text-[13px] font-bold tracking-tight" style={{ background: bg, color: '#fff' }}>{c.asset.slice(0, 4)}</div>,
    };
};

const CaseTeaserCard: React.FC<{ c: BattleCase; onOpen: () => void }> = ({ c, onOpen }) => {
    const v = assetVisual(c);
    return (
        <button
            onClick={onOpen}
            className="text-left rounded-2xl border p-5 md:p-6 group hover:shadow-[0_14px_32px_-14px_rgba(0,0,0,0.14)] hover:-translate-y-0.5 transition-all duration-200 relative overflow-hidden flex flex-col"
            style={{ borderColor: LINE, background: v.tint }}
        >
            <div className="flex items-start justify-between mb-4">
                {v.icon}
                <div className="text-right">
                    <div className="text-[10px] uppercase tracking-[0.14em] text-[#7a7a73] font-medium">{c.badge}</div>
                    <div className="text-[10.5px] text-[#9a9a93] tabular-nums mt-0.5">{c.asOf}</div>
                </div>
            </div>
            <div className="text-[18px] md:text-[19px] font-semibold text-[#111] tracking-tight leading-[1.3] min-h-[74px] mb-4">
                "{c.question}"
            </div>
            <div className="mt-auto pt-4 border-t flex items-center justify-between" style={{ borderColor: 'rgba(0,0,0,0.08)' }}>
                <div className="text-[11.5px] text-[#5a5a55]">
                    <span className="font-semibold text-[#111]">{c.asset}</span>
                    <span className="mx-1.5 text-[#bcbcb4]">·</span>
                    <span className="tabular-nums">{c.inputs.priceUnit}{c.inputs.price.toLocaleString()}</span>
                    <span className="mx-1.5 text-[#bcbcb4]">·</span>
                    <span>{c.windowDays}d</span>
                </div>
                <span className="text-[12px] font-semibold text-[#111] inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                    <span className="text-[13px]">⚔</span>
                    Battle
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                </span>
            </div>
        </button>
    );
};

type BattlePhase = 'pick' | 'battling' | 'done';

const BattleModal: React.FC<{ c: BattleCase; onClose: () => void }> = ({ c, onClose }) => {
    const allModels: BattleModelId[] = ['loka', 'gpt', 'claude', 'deepseek'];
    const [selected, setSelected] = useState<Set<BattleModelId>>(new Set(['loka', 'gpt', 'claude']));
    const [phase, setPhase] = useState<BattlePhase>('pick');
    const [revealed, setRevealed] = useState<Set<BattleModelId>>(new Set());
    const [traceStep, setTraceStep] = useState(0); // 0..3 for Loka
    const [showGT, setShowGT] = useState(false);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', onKey);
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = prevOverflow; };
    }, [onClose]);

    const toggle = (m: BattleModelId) => {
        setSelected((s) => {
            const n = new Set(s);
            if (n.has(m)) { if (n.size > 1) n.delete(m); } else { if (n.size < 4) n.add(m); }
            return n;
        });
    };

    const startBattle = () => {
        if (selected.size < 2) return;
        setPhase('battling');
        setRevealed(new Set());
        setTraceStep(0);
        setShowGT(false);

        const timers: number[] = [];
        const nonLoka = [...selected].filter((m) => m !== 'loka');
        nonLoka.forEach((m, i) => {
            timers.push(window.setTimeout(() => setRevealed((r) => new Set([...r, m])), 750 + i * 250 + Math.random() * 300));
        });
        if (selected.has('loka')) {
            // Animate consensus trace appearing one round at a time
            [1, 2, 3].forEach((step) => {
                timers.push(window.setTimeout(() => setTraceStep(step), 600 + step * 700));
            });
            timers.push(window.setTimeout(() => setRevealed((r) => new Set([...r, 'loka'])), 2900));
        }
        timers.push(window.setTimeout(() => { setShowGT(true); setPhase('done'); }, 3400));
        return () => { timers.forEach(clearTimeout); };
    };

    const reset = () => {
        setPhase('pick');
        setRevealed(new Set());
        setTraceStep(0);
        setShowGT(false);
    };

    const selectedArr = [...selected];
    const sortedByPL = phase === 'done' ? [...selectedArr].sort((a, b) => c.runners[b]!.simulated_return_pct - c.runners[a]!.simulated_return_pct) : selectedArr;
    const maxAbsPL = Math.max(0.5, ...selectedArr.map((m) => Math.abs(c.runners[m]!.simulated_return_pct)));

    return createPortal(
        <div className="fixed inset-0 z-[70] flex items-start md:items-center justify-center p-3 md:p-6 overflow-y-auto" style={{ backgroundColor: 'rgba(10,10,10,0.45)', backdropFilter: 'blur(4px)' }} onClick={onClose}>
            <div
                className="relative w-full max-w-[1040px] my-4 md:my-8 bg-white rounded-2xl shadow-[0_30px_80px_-20px_rgba(0,0,0,0.45)] overflow-hidden flex flex-col max-h-[calc(100vh-2rem)] md:max-h-[calc(100vh-4rem)]"
                onClick={(e) => e.stopPropagation()}
                style={{ border: `1px solid ${LINE}` }}
            >
                {/* Header */}
                <div className="px-6 md:px-8 pt-6 pb-4 flex items-start justify-between gap-4 border-b" style={{ borderColor: LINE }}>
                    <div>
                        <div className="flex items-center gap-2 text-[10.5px] uppercase tracking-[0.14em] text-[#9a9a93]">
                            <span>{c.badge}</span>
                            <span>·</span>
                            <span className="tabular-nums">{c.asOf}</span>
                            <span>·</span>
                            <span>{c.windowDays}-day forward</span>
                        </div>
                        <div className="mt-1 text-[20px] md:text-[22px] font-semibold text-[#111] tracking-tight">{c.asset}</div>
                        <div className="text-[14.5px] text-[#3a3a35] mt-1 leading-[1.45]">"{c.question}"</div>
                    </div>
                    <button onClick={onClose} aria-label="Close" className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-[#9a9a93] hover:bg-[#F2F2EC] transition-colors">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
                    </button>
                </div>

                {/* Scrollable region: inputs + results stay inside the modal viewport */}
                <div className="flex-1 overflow-y-auto">

                {/* Inputs (shown in pick + battling) — clearly labels "all models get the same data" */}
                {phase !== 'done' && (
                    <div className="px-6 md:px-8 py-5 bg-[#FAFAF7] border-b" style={{ borderColor: LINE }}>
                        <div className="flex items-baseline gap-2 mb-5">
                            <span className="text-[11px] uppercase tracking-[0.14em] text-[#0A0A0A] font-semibold">Every model is given the same inputs</span>
                            <span className="text-[11px] text-[#9a9a93]">— no model gets a head start</span>
                        </div>

                        {(() => {
                            const hasFundamentals = c.inputs.pe !== undefined || c.inputs.revYoY !== undefined;
                            return (
                                <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                                    {/* Technical indicators */}
                                    <div className={hasFundamentals ? 'md:col-span-5' : 'md:col-span-6'}>
                                        <div className="text-[10.5px] uppercase tracking-[0.14em] text-[#9a9a93] mb-2 flex items-center gap-1.5">
                                            <span className="w-1 h-3 bg-[#0A0A0A] rounded-sm" />
                                            Technical indicators
                                        </div>
                                        <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-[12.5px]">
                                            <div><div className="text-[#9a9a93]">Price</div><div className="font-medium text-[#111] tabular-nums">{c.inputs.priceUnit}{c.inputs.price.toLocaleString()}</div></div>
                                            <div><div className="text-[#9a9a93]">30d change</div><div className="font-medium tabular-nums" style={{ color: c.inputs.change30d >= 0 ? '#047857' : '#b91c1c' }}>{c.inputs.change30d >= 0 ? '+' : ''}{c.inputs.change30d}%</div></div>
                                            <div><div className="text-[#9a9a93]">52w range</div><div className="font-medium text-[#111] tabular-nums">{c.inputs.priceUnit}{c.inputs.low52w.toLocaleString()}–{c.inputs.high52w.toLocaleString()}</div></div>
                                            {c.inputs.volume_avg_20d && <div><div className="text-[#9a9a93]">Volume (20d avg)</div><div className="font-medium text-[#111] tabular-nums">{c.inputs.volume_avg_20d}</div></div>}
                                            {!hasFundamentals && c.inputs.marketCap && <div><div className="text-[#9a9a93]">Market cap</div><div className="font-medium text-[#111] tabular-nums">{c.inputs.marketCap}</div></div>}
                                        </div>
                                    </div>

                                    {/* Fundamentals (equity only) */}
                                    {hasFundamentals && (
                                        <div className="md:col-span-3">
                                            <div className="text-[10.5px] uppercase tracking-[0.14em] text-[#9a9a93] mb-2 flex items-center gap-1.5">
                                                <span className="w-1 h-3 bg-[#0A0A0A] rounded-sm" />
                                                Fundamentals
                                            </div>
                                            <div className="grid grid-cols-1 gap-y-2.5 text-[12.5px]">
                                                {c.inputs.marketCap && <div><div className="text-[#9a9a93]">Market cap</div><div className="font-medium text-[#111] tabular-nums">{c.inputs.marketCap}</div></div>}
                                                {c.inputs.pe !== undefined && <div><div className="text-[#9a9a93]">P/E (TTM)</div><div className="font-medium text-[#111] tabular-nums">{c.inputs.pe}</div></div>}
                                                {c.inputs.revYoY !== undefined && <div><div className="text-[#9a9a93]">Revenue YoY</div><div className="font-medium text-[#111] tabular-nums" style={{ color: c.inputs.revYoY >= 0 ? '#047857' : '#b91c1c' }}>{c.inputs.revYoY >= 0 ? '+' : ''}{c.inputs.revYoY}%</div></div>}
                                            </div>
                                        </div>
                                    )}

                                    {/* News sources */}
                                    <div className={hasFundamentals ? 'md:col-span-4' : 'md:col-span-6'}>
                                        <div className="text-[10.5px] uppercase tracking-[0.14em] text-[#9a9a93] mb-2 flex items-center gap-1.5">
                                            <span className="w-1 h-3 bg-[#0A0A0A] rounded-sm" />
                                            News sources <span className="text-[#bcbcb4] normal-case tracking-normal">({c.inputs.headlines.length})</span>
                                        </div>
                                        <div className="space-y-1.5">
                                            {c.inputs.headlines.map((h, i) => {
                                                const s = polarityStyle[h.polarity];
                                                return (
                                                    <div key={i} className="flex items-center gap-2 text-[12.5px] text-[#3a3a35]">
                                                        <span className="px-1.5 py-[1px] rounded-full text-[10.5px] font-medium shrink-0" style={{ backgroundColor: s.bg, color: s.fg }}>{s.label}</span>
                                                        <span className="truncate">{h.title}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            );
                        })()}
                    </div>
                )}

                {/* Body */}
                <div className="px-6 md:px-8 py-6">
                    {phase === 'pick' && (
                        <>
                            <div className="text-[11px] uppercase tracking-[0.14em] text-[#9a9a93] mb-3">Pick contestants (2–4)</div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                {allModels.map((m) => {
                                    const on = selected.has(m);
                                    return (
                                        <button key={m} onClick={() => toggle(m)} className="rounded-xl border px-3 py-2.5 text-left transition-all" style={{ borderColor: on ? '#0A0A0A' : LINE, backgroundColor: on ? '#FAFAF7' : '#fff' }}>
                                            <div className="flex items-center gap-2">
                                                <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: BATTLE_COLORS[m] }} />
                                                <span className="text-[12.5px] font-medium text-[#111]">{BATTLE_LABELS[m]}</span>
                                                <span className="ml-auto text-[11px]" style={{ color: on ? '#0A0A0A' : '#cfcfc6' }}>{on ? '✓' : '+'}</span>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                            <div className="mt-6 flex items-center justify-between">
                                <div className="text-[12px] text-[#9a9a93]">{selected.size}/4 selected · min 2</div>
                                <button onClick={startBattle} disabled={selected.size < 2} className="inline-flex items-center gap-2 h-11 px-6 rounded-full text-[13px] font-medium text-white bg-[#111] hover:bg-black disabled:bg-[#cfcfc6] disabled:cursor-not-allowed transition-colors">
                                    <span className="text-[15px]">⚔</span> Battle
                                </button>
                            </div>
                        </>
                    )}

                    {(phase === 'battling' || phase === 'done') && (
                        <>
                            {/* ──────────── 1. Each model's strategy ──────────── */}
                            <div className="flex items-baseline justify-between mb-1">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-[10px] font-semibold text-white bg-[#0A0A0A] px-1.5 py-[2px] rounded">1</span>
                                    <h4 className="text-[15px] font-semibold text-[#111] tracking-tight">{phase === 'battling' ? 'Models are deciding…' : 'Each model\'s strategy'}</h4>
                                </div>
                                {phase === 'done' && (
                                    <button onClick={reset} className="text-[12px] text-[#3a3a35] hover:text-[#111] underline decoration-dotted underline-offset-4">try different models</button>
                                )}
                            </div>
                            <p className="text-[12px] text-[#7a7a73] mb-4">Direction call, position size, and the model's reasoning in one line.</p>
                            <div className={`grid gap-3 ${selectedArr.length === 2 ? 'grid-cols-1 md:grid-cols-2' : selectedArr.length === 3 ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-2 md:grid-cols-4'}`}>
                                {selectedArr.map((m) => {
                                    const r = c.runners[m];
                                    const isShown = revealed.has(m);
                                    const aStyle = answerStyle[r.action];
                                    const stance = r.action === 'buy' ? 'Bullish call' : r.action === 'sell' ? 'Bearish call' : 'Stay on sidelines';
                                    return (
                                        <div key={m} className="rounded-xl border p-4 transition-all duration-300 flex flex-col" style={{ borderColor: LINE }}>
                                            <div className="flex items-center gap-2 mb-3">
                                                <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: r.color }} />
                                                <span className="text-[12px] font-semibold text-[#111] truncate">{r.label}</span>
                                            </div>
                                            {!isShown ? (
                                                <div className="space-y-2.5">
                                                    <div className="h-[6px] rounded-full bg-[#F2F2EC] overflow-hidden">
                                                        <div className="h-full rounded-full battle-think" style={{ backgroundColor: r.color }} />
                                                    </div>
                                                    <div className="text-[11px] text-[#9a9a93]">thinking…{m === 'loka' && ' (council debating)'}</div>
                                                    {m === 'loka' && (
                                                        <div className="space-y-1 mt-1.5">
                                                            {[1, 2, 3].map((round) => (
                                                                <div key={round} className="text-[10.5px] transition-opacity duration-300" style={{ opacity: traceStep >= round ? 1 : 0 }}>
                                                                    <span className="text-[#9a9a93]">R{round}</span>
                                                                    <span className="text-[#3a3a35] ml-1.5">{round === 1 ? 'agents commit' : round === 2 ? 'reconsider in public' : 'converged ✓'}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="animate-fadeIn flex-1 flex flex-col">
                                                    <div className="text-[10.5px] uppercase tracking-[0.12em] text-[#9a9a93] mb-1">{stance}</div>
                                                    <div className="flex items-baseline gap-2 flex-wrap mb-1">
                                                        <span className="px-2.5 py-[4px] rounded-md text-[14px] font-bold tracking-wide" style={{ backgroundColor: aStyle.bg, color: aStyle.fg }}>{aStyle.label}</span>
                                                        <span className="text-[13px] text-[#111] font-medium">{Math.round(r.target_exposure_pct * 100)}%</span>
                                                        <span className="text-[10.5px] text-[#9a9a93]">of book</span>
                                                    </div>
                                                    <div className="text-[10.5px] text-[#9a9a93] mb-2.5">confidence <span className="font-medium text-[#111] tabular-nums">{r.confidence.toFixed(2)}</span></div>
                                                    <div className="text-[11.5px] text-[#3a3a35] leading-[1.5] border-t pt-2.5 mt-auto" style={{ borderColor: LINE }}>"{r.rationale}"</div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            {/* ──────────── 2. The answer ──────────── */}
                            {showGT && (
                                <div className="mt-6 animate-fadeIn">
                                    <div className="flex items-baseline gap-2 mb-1">
                                        <span className="text-[10px] font-semibold text-white bg-[#0A0A0A] px-1.5 py-[2px] rounded">2</span>
                                        <h4 className="text-[15px] font-semibold text-[#111] tracking-tight">The answer</h4>
                                    </div>
                                    <p className="text-[12px] text-[#7a7a73] mb-3">What {c.asset} actually did over the next {c.windowDays} days.</p>
                                    {(() => {
                                        const gt = c.groundTruth;
                                        const forward = gt.forward_return_30d;
                                        const bench = gt.benchmark_return_30d;
                                        const excess = +(forward - bench).toFixed(2);
                                        const showBench = bench !== forward; // skip when asset = benchmark
                                        const fmt = (v: number) => `${v > 0 ? '+' : ''}${v.toFixed(1)}%`;
                                        const optimalCall = gt.direction_label === 'bullish' ? 'BUY' : gt.direction_label === 'bearish' ? 'SELL' : 'HOLD';
                                        return (
                                            <div className="rounded-xl border p-5 md:p-6" style={{ borderColor: '#0A0A0A', backgroundColor: '#0A0A0A', color: '#fff' }}>
                                                {/* Top row: hero number + summary */}
                                                <div className="flex items-end gap-5 flex-wrap">
                                                    <div>
                                                        <div className="text-[10.5px] uppercase tracking-[0.14em] text-white/50 mb-1">{c.windowDays}-day forward return</div>
                                                        <div className="text-[42px] md:text-[52px] font-semibold tabular-nums leading-none" style={{ color: forward > 0 ? '#BAFF29' : forward < 0 ? '#fca5a5' : '#fff' }}>
                                                            {fmt(forward)}
                                                        </div>
                                                    </div>
                                                    <div className="flex-1 min-w-[260px]">
                                                        <div className="text-[13px] text-white/75 leading-[1.55]">{gt.summary}</div>
                                                        <div className="mt-2 text-[10.5px] text-white/40">
                                                            Optimal call <span className="text-white font-medium">{optimalCall}</span>
                                                            <span className="mx-2">·</span>
                                                            asked {c.asOf}, resolved {c.windowDays}d later
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Breakdown — only show if benchmark != asset */}
                                                {showBench && (
                                                    <div className="mt-5 pt-4 border-t border-white/10 grid grid-cols-3 gap-3">
                                                        <div>
                                                            <div className="text-[10px] uppercase tracking-[0.14em] text-white/40 mb-1">{c.asset} return</div>
                                                            <div className="text-[16px] font-semibold tabular-nums" style={{ color: forward > 0 ? '#BAFF29' : forward < 0 ? '#fca5a5' : '#fff' }}>{fmt(forward)}</div>
                                                        </div>
                                                        <div>
                                                            <div className="text-[10px] uppercase tracking-[0.14em] text-white/40 mb-1">{gt.benchmark_name}, same window</div>
                                                            <div className="text-[16px] font-semibold tabular-nums text-white/85">{fmt(bench)}</div>
                                                        </div>
                                                        <div>
                                                            <div className="text-[10px] uppercase tracking-[0.14em] text-white/40 mb-1">Excess return</div>
                                                            <div className="text-[16px] font-semibold tabular-nums" style={{ color: excess > 0 ? '#BAFF29' : excess < 0 ? '#fca5a5' : '#fff' }}>{fmt(excess)}</div>
                                                        </div>
                                                    </div>
                                                )}
                                                {!showBench && (
                                                    <div className="mt-4 text-[11px] text-white/40">
                                                        {c.asset} is itself the benchmark for this window — excess return is by definition zero here.
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })()}
                                </div>
                            )}

                            {/* ──────────── 3. Closest to the answer ──────────── */}
                            {showGT && (
                                <div className="mt-6 animate-fadeIn">
                                    <div className="flex items-baseline gap-2 mb-1">
                                        <span className="text-[10px] font-semibold text-white bg-[#0A0A0A] px-1.5 py-[2px] rounded">3</span>
                                        <h4 className="text-[15px] font-semibold text-[#111] tracking-tight">Who got closest</h4>
                                    </div>
                                    <p className="text-[12px] text-[#7a7a73] mb-3">Models ranked by how much of the real {c.groundTruth.forward_return_30d > 0 ? 'rally' : c.groundTruth.forward_return_30d < 0 ? 'drop' : 'flat tape'} they actually captured.</p>
                                    <div className="rounded-xl border bg-white overflow-hidden" style={{ borderColor: LINE }}>
                                        {sortedByPL.map((m, idx) => {
                                            const r = c.runners[m];
                                            const pos = r.simulated_return_pct > 0;
                                            const neg = r.simulated_return_pct < 0;
                                            const wPct = (Math.abs(r.simulated_return_pct) / maxAbsPL) * 100;
                                            const verdict = !r.correct
                                                ? (r.action === 'hold' ? 'missed the move' : 'wrong direction')
                                                : r.action === 'hold' ? 'sat it out — no exposure' : `captured ${Math.abs(r.simulated_return_pct).toFixed(2)}% of the move`;
                                            return (
                                                <div key={m} className="grid grid-cols-12 items-center gap-3 px-4 py-3.5 border-b last:border-b-0" style={{ borderColor: LINE }}>
                                                    <div className="col-span-1 text-[14px] font-semibold text-[#9a9a93] tabular-nums">#{idx + 1}</div>
                                                    <div className="col-span-4 md:col-span-3 flex items-center gap-2 min-w-0">
                                                        <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: r.color }} />
                                                        <div className="min-w-0">
                                                            <div className="text-[12.5px] font-medium text-[#111] truncate">{r.label}</div>
                                                            <div className="text-[10.5px] text-[#9a9a93] truncate">{answerStyle[r.action].label} @ {Math.round(r.target_exposure_pct * 100)}%</div>
                                                        </div>
                                                    </div>
                                                    <div className="col-span-5 md:col-span-6 hidden md:block">
                                                        <div className="text-[11.5px] text-[#5a5a55] mb-1.5">{verdict}</div>
                                                        <div className="h-[5px] rounded-sm bg-[#F2F2EC] overflow-hidden">
                                                            <div className="h-full rounded-sm transition-all duration-700" style={{ width: `${wPct}%`, backgroundColor: r.color, opacity: neg ? 0.55 : 1 }} />
                                                        </div>
                                                    </div>
                                                    <div className="col-span-2 text-right text-[14px] font-semibold tabular-nums" style={{ color: pos ? '#047857' : neg ? '#b91c1c' : '#525252' }}>
                                                        {r.simulated_return_pct > 0 ? '+' : ''}{r.simulated_return_pct.toFixed(2)}%
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <div className="mt-2 text-[11px] text-[#9a9a93] px-1">
                                        Sim P&L assumes you sized exactly as the model called, applied to the real outcome above. Already includes fees + slippage.
                                    </div>
                                </div>
                            )}

                            {/* Collapsible full responses & debate trail */}
                            {showGT && (
                                <details className="mt-6 rounded-xl border bg-white group" style={{ borderColor: LINE }}>
                                    <summary className="cursor-pointer list-none px-5 py-3.5 flex items-center justify-between hover:bg-[#FAFAF7] transition-colors rounded-xl">
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-[10.5px] uppercase tracking-[0.14em] text-[#9a9a93]">Optional</span>
                                            <span className="text-[12.5px] font-medium text-[#111]">Full responses & Loka's debate trail</span>
                                        </div>
                                        <span className="text-[#9a9a93] text-[14px] transition-transform group-open:rotate-180">⌄</span>
                                    </summary>
                                    <div className="px-5 pb-5 pt-1 space-y-3">
                                        {selectedArr.map((m) => {
                                            const r = c.runners[m];
                                            const aStyle = answerStyle[r.action];
                                            return (
                                                <div key={m} className="rounded-lg border p-4" style={{ borderColor: LINE, backgroundColor: '#FAFAF7' }}>
                                                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                                                        <span className="w-2 h-2 rounded-sm" style={{ backgroundColor: r.color }} />
                                                        <span className="text-[12.5px] font-semibold text-[#111]">{r.label}</span>
                                                        <span className="px-1.5 py-[1px] rounded text-[10.5px] font-medium ml-1" style={{ backgroundColor: aStyle.bg, color: aStyle.fg }}>{aStyle.label}</span>
                                                        <span className="text-[10.5px] text-[#9a9a93]">@ {Math.round(r.target_exposure_pct * 100)}% · conf {r.confidence.toFixed(2)}</span>
                                                    </div>
                                                    <p className="text-[12.5px] text-[#3a3a35] leading-[1.55]">"{r.rationale}"</p>
                                                    {m === 'loka' && r.trace && (
                                                        <details className="mt-3 group/inner">
                                                            <summary className="text-[11px] text-[#0A7C4A] cursor-pointer hover:underline list-none flex items-center gap-1">
                                                                <span className="transition-transform group-open/inner:rotate-90">▸</span>
                                                                Debate trail · {r.trace.rounds.length} rounds{r.trace.earlyStopped && <span className="text-[#9a9a93] ml-1">· early-stopped</span>}
                                                            </summary>
                                                            <div className="mt-2 space-y-2">
                                                                {r.trace.rounds.map((rd) => (
                                                                    <div key={rd.round} className="rounded-md border bg-white p-2.5 text-[11px]" style={{ borderColor: LINE }}>
                                                                        <div className="flex items-center justify-between mb-1.5">
                                                                            <span className="font-medium text-[#111]">Round {rd.round}</span>
                                                                            <span className="text-[#9a9a93]">
                                                                                buy {(rd.weightedVote.buy ?? 0).toFixed(2)} · hold {(rd.weightedVote.hold ?? 0).toFixed(2)} · sell {(rd.weightedVote.sell ?? 0).toFixed(2)}
                                                                                {rd.converged && <span className="ml-2 text-[#047857]">converged ✓</span>}
                                                                            </span>
                                                                        </div>
                                                                        <div className="space-y-1">
                                                                            {rd.agents.map((a) => {
                                                                                const as = answerStyle[a.answer];
                                                                                return (
                                                                                    <div key={a.id} className="flex items-center gap-2">
                                                                                        <span className="text-[#7a7a73] w-20 shrink-0 truncate">{a.name}</span>
                                                                                        <span className="px-1.5 py-[1px] rounded text-[10px] font-medium" style={{ backgroundColor: as.bg, color: as.fg }}>{as.label}</span>
                                                                                        <span className="text-[#9a9a93] tabular-nums">{a.confidence.toFixed(2)}</span>
                                                                                    </div>
                                                                                );
                                                                            })}
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </details>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </details>
                            )}
                        </>
                    )}
                </div>
                </div>{/* /scroll region */}
            </div>
            <style>{`
                @keyframes battleThink { 0% { width: 0%; } 70% { width: 75%; } 100% { width: 92%; } }
                .battle-think { width: 0%; animation: battleThink 2.6s ease-out forwards; }
            `}</style>
        </div>,
        document.body
    );
};

const BattleArena: React.FC = () => {
    const [open, setOpen] = useState<BattleCase | null>(null);
    return (
        <div className="mt-10">
            <div className="flex items-baseline justify-between gap-3 flex-wrap mb-5">
                <div>
                    <h3 className="text-[20px] md:text-[22px] font-semibold text-[#111] tracking-tight">Battle the models on real trades</h3>
                    <p className="text-[13px] text-[#7a7a73] mt-1 max-w-2xl">Pick a case, pick contestants, watch them race. Loka's council debates in the open; the singletons answer in one breath.</p>
                </div>
                <div className="text-[11.5px] text-[#9a9a93]">6 cases · mock data preview</div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {BATTLE_CASES.map((c) => (
                    <CaseTeaserCard key={c.id} c={c} onOpen={() => setOpen(c)} />
                ))}
            </div>
            {open && <BattleModal c={open} onClose={() => setOpen(null)} />}
        </div>
    );
};

// ─────────── Section 2: Accuracy / Backtest / Comparison ───────────
type TipState = { x: number; y: number; color: string; title: string; lines: { k: string; v: string }[] };

const Accuracy: React.FC = () => {
    const { ref, isInView } = useInView();
    const [tip, setTip] = useState<TipState | null>(null);
    const showTip = (e: React.MouseEvent, payload: Omit<TipState, 'x' | 'y'>) => {
        setTip({ x: e.clientX, y: e.clientY, ...payload });
    };
    const moveTip = (e: React.MouseEvent) => {
        setTip((t) => (t ? { ...t, x: e.clientX, y: e.clientY } : t));
    };
    const hideTip = () => setTip(null);
    // Shared model palette across all charts in this section.
    // Editorial jewel-tone palette — richer than the previous grays, but kept printed-not-neon.
    const MODEL_COLORS = { loka: '#0A0A0A', gpt: '#2C4DAA', claude: '#B7621B', deepseek: '#6F3BB5' } as const;
    const bars = [
        { label: 'Aegean Consensus', sub: 'Loka', value: 74, color: MODEL_COLORS.loka, hl: true },
        { label: 'GPT-5', sub: 'OpenAI', value: 61, color: MODEL_COLORS.gpt },
        { label: 'Claude Opus 4.7', sub: 'Anthropic', value: 59, color: MODEL_COLORS.claude },
        { label: 'DeepSeek V3', sub: 'DeepSeek', value: 54, color: MODEL_COLORS.deepseek },
    ];
    // Radar dimensions — aligned to the 5 metrics that feed composite_score.
    // Each axis is normalized so "outer = better" (drawdown & memorization gap flipped).
    const radarAxes = ['Direction', 'Excess return', 'Sharpe', 'Drawdown', 'Generalization'];
    const radarAxisInfo: Record<string, string> = {
        'Direction': 'Share of trading questions where the model calls the right direction on a held-out set.',
        'Excess return': 'Strategy return minus the SPX benchmark over the same 90-day window.',
        'Sharpe': 'Return per unit of risk. Higher means smoother, more sustainable gains.',
        'Drawdown': 'Worst peak-to-trough loss during the run. Closer to zero is more survivable.',
        'Generalization': 'Score gap between likely-seen training cases and strictly post-cutoff cases. Smaller gap = real skill, not memorization.',
    };
    const radarSeries = [
        { name: 'Loka', color: MODEL_COLORS.loka, values: [79, 87, 94, 79, 89], raw: ['68%', '+8.2%', '1.84', '−4.2%', 'gap 3 pts'] },
        { name: 'GPT-5', color: MODEL_COLORS.gpt, values: [55, 51, 60, 53, 55], raw: ['60%', '+3.4%', '0.94', '−9.4%', 'gap 12 pts'] },
        { name: 'Claude Opus 4.7', color: MODEL_COLORS.claude, values: [49, 45, 56, 50, 59], raw: ['58%', '+2.7%', '0.82', '−10.1%', 'gap 11 pts'] },
        { name: 'DeepSeek V3', color: MODEL_COLORS.deepseek, values: [43, 39, 52, 37, 40], raw: ['56%', '+1.9%', '0.71', '−12.6%', 'gap 16 pts'] },
    ];
    // Direction accuracy — grouped against random baseline.
    const dirAcc = [
        { m: 'Loka', full: 'Loka', v: 68, color: MODEL_COLORS.loka },
        { m: 'GPT-5', full: 'GPT-5', v: 60, color: MODEL_COLORS.gpt },
        { m: 'Claude', full: 'Claude Opus 4.7', v: 58, color: MODEL_COLORS.claude },
        { m: 'DeepSeek', full: 'DeepSeek V3', v: 56, color: MODEL_COLORS.deepseek },
    ];
    // Excess return — 90-day cumulative line per model.
    const lineCurves = [
        { name: 'Loka', color: MODEL_COLORS.loka, d: 'M0,90 C30,86 55,80 80,70 C108,58 135,55 165,42 C195,28 230,22 260,15 C285,9 305,7 320,5' },
        { name: 'GPT-5', color: MODEL_COLORS.gpt, d: 'M0,90 C30,88 60,86 95,80 C130,74 160,72 195,66 C225,60 255,55 320,48' },
        { name: 'Claude Opus 4.7', color: MODEL_COLORS.claude, d: 'M0,90 C30,88 60,87 95,82 C130,77 165,75 200,70 C235,65 275,58 320,52' },
        { name: 'DeepSeek V3', color: MODEL_COLORS.deepseek, d: 'M0,90 C30,89 60,88 95,84 C130,80 165,78 200,75 C235,72 275,68 320,60' },
        { name: 'SPX (benchmark)', color: '#bdbdb6', d: 'M0,92 C40,90 80,89 120,87 C160,85 200,84 240,83 C280,82 320,82 320,82', dashed: true },
    ];
    // Sharpe — bullet bars (higher = better, 0–3 range mapped to 0–100%).
    const sharpeRows = [
        { m: 'Loka', v: 1.84, color: MODEL_COLORS.loka },
        { m: 'GPT-5', v: 0.94, color: MODEL_COLORS.gpt },
        { m: 'Claude Opus 4.7', v: 0.82, color: MODEL_COLORS.claude },
        { m: 'DeepSeek V3', v: 0.71, color: MODEL_COLORS.deepseek },
    ];
    // Max drawdown — negative bars (lower magnitude = better).
    const drawRows = [
        { m: 'Loka', v: -4.2, color: MODEL_COLORS.loka },
        { m: 'GPT-5', v: -9.4, color: MODEL_COLORS.gpt },
        { m: 'Claude Opus 4.7', v: -10.1, color: MODEL_COLORS.claude },
        { m: 'DeepSeek V3', v: -12.6, color: MODEL_COLORS.deepseek },
    ];
    return (
        <section id="benchmark" ref={ref} className={`mt-28 md:mt-36 transition-all duration-700 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            {/* Chart hover effects */}
            <style>{`
                .dir-bar { transition: transform 220ms cubic-bezier(0.16, 1, 0.3, 1); }
                .dir-bar:hover { transform: translateY(-3px); }
                .radar-dot { transition: transform 200ms ease; transform-box: fill-box; transform-origin: center; }
                .radar-dot:hover { transform: scale(2); }
                .excess-line { transition: stroke-width 200ms ease; cursor: default; }
                .excess-line:hover { stroke-width: 3; }
                .chart-row { transition: background-color 180ms ease, transform 180ms ease; }
                .chart-row:hover { background-color: rgba(10,10,10,0.025); }
                .chart-row:hover .chart-bar { filter: brightness(1.12); }
                .dumbbell-row { transition: background-color 180ms ease; }
                .dumbbell-row:hover { background-color: rgba(255,255,255,0.04); }
            `}</style>
            {/* Shared hover tooltip rendered to body so transformed ancestors don't shift it */}
            {tip && typeof document !== 'undefined' && createPortal(
                <div
                    className="fixed pointer-events-none z-[60] px-3 py-2 rounded-lg text-white text-[11.5px] leading-[1.45] shadow-[0_8px_24px_-6px_rgba(0,0,0,0.35)]"
                    style={{ left: tip.x + 14, top: tip.y + 14, backgroundColor: '#0F0F0F', minWidth: 160 }}
                >
                    <div className="flex items-center gap-1.5 mb-1.5 pb-1.5 border-b border-white/10">
                        <span className="w-2 h-2 rounded-sm" style={{ backgroundColor: tip.color }} />
                        <span className="font-semibold">{tip.title}</span>
                    </div>
                    {tip.lines.map((l, i) => (
                        <div key={i} className="flex items-baseline justify-between gap-4">
                            <span className="text-white/55">{l.k}</span>
                            <span className="font-medium tabular-nums">{l.v}</span>
                        </div>
                    ))}
                </div>,
                document.body
            )}
            <div className="max-w-2xl">
                <p className="text-[12px] text-[#9a9a93] mb-3 tracking-tight">02 — AegeanBench</p>
                <h2 className="text-[32px] md:text-[44px] font-semibold text-[#111] tracking-[-0.03em] leading-[1.05]">
                    The benchmark we publish.<br />
                    <span className="text-[#666]">Every model. Every metric. Same questions.</span>
                </h2>
                <p className="mt-4 text-[15px] md:text-[16px] text-[#5a5a55] leading-[1.55] max-w-xl">
                    AegeanBench runs every model — Loka's council and the frontier singletons —
                    against the same trading cases. Random and buy-and-hold sit on the leaderboard too,
                    so you can tell real skill from a friendly market.
                </p>
            </div>

            {/* Shared legend */}
            <div className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-1 text-[12px] text-[#5a5a55]">
                <span className="inline-flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: MODEL_COLORS.loka }} /> Loka <span className="text-[#9a9a93]">(consensus)</span></span>
                <span className="inline-flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: MODEL_COLORS.gpt }} /> GPT-5</span>
                <span className="inline-flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: MODEL_COLORS.claude }} /> Claude Opus 4.7</span>
                <span className="inline-flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: MODEL_COLORS.deepseek }} /> DeepSeek V3</span>
            </div>

            {/* Overall scorecard — radar + composite leaderboard inside one card */}
            <div className="mt-4 rounded-2xl border bg-white p-6 md:p-8" style={{ borderColor: LINE }}>
                <div className="mb-4">
                    <h3 className="text-[16px] md:text-[18px] font-semibold text-[#111] tracking-tight">Overall scorecard</h3>
                    <p className="text-[12.5px] text-[#7a7a73] leading-[1.55] mt-1 max-w-2xl">Five-dimension overview on the left, weighted composite leaderboard on the right. Same models, two ways to read the gap.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 items-center">
                    {/* Radar */}
                    <div className="flex flex-col items-center">
                        <svg viewBox="-260 -170 520 340" className="w-full max-w-[480px]">
                            {[0.25, 0.5, 0.75, 1].map((r) => {
                                const pts = radarAxes.map((_, i) => {
                                    const a = -Math.PI / 2 + (i * 2 * Math.PI) / radarAxes.length;
                                    return `${Math.cos(a) * 120 * r},${Math.sin(a) * 120 * r}`;
                                }).join(' ');
                                return <polygon key={r} points={pts} fill="none" stroke="#E5E5DE" strokeWidth="1" />;
                            })}
                            {radarAxes.map((label, i) => {
                                const a = -Math.PI / 2 + (i * 2 * Math.PI) / radarAxes.length;
                                const x = Math.cos(a) * 120, y = Math.sin(a) * 120;
                                const lx = Math.cos(a) * 142, ly = Math.sin(a) * 142;
                                const isMidV = Math.abs(Math.cos(a)) < 0.2;
                                const anchor = isMidV ? 'middle' : Math.cos(a) > 0 ? 'start' : 'end';
                                // approximate label width for ⓘ placement
                                const labelW = label.length * 6.2;
                                const iconDX = anchor === 'start' ? labelW + 6 : anchor === 'end' ? -(labelW + 6) : 0;
                                const iconDY = isMidV ? (Math.sin(a) > 0 ? 16 : -16) : 0;
                                const ix = lx + iconDX, iy = ly + iconDY;
                                return (
                                    <g key={label}>
                                        <line x1="0" y1="0" x2={x} y2={y} stroke="#EFEFE8" strokeWidth="1" />
                                        <text x={lx} y={ly} textAnchor={anchor} dominantBaseline={Math.sin(a) > 0.3 ? 'hanging' : Math.sin(a) < -0.3 ? 'auto' : 'middle'} fontSize="10.5" fill="#7a7a73">{label}</text>
                                        {/* info icon — hover for metric definition */}
                                        <g
                                            className="metric-info"
                                            style={{ cursor: 'help', transformBox: 'fill-box', transformOrigin: 'center' } as React.CSSProperties}
                                            onMouseEnter={(e) => showTip(e, { color: '#0A0A0A', title: label, lines: [{ k: 'what it measures', v: radarAxisInfo[label] }] })}
                                            onMouseMove={moveTip}
                                            onMouseLeave={hideTip}
                                        >
                                            <circle cx={ix} cy={iy} r="6.5" fill="#FAFAF7" stroke="#D4D4CB" strokeWidth="1" />
                                            <text x={ix} y={iy + 0.5} textAnchor="middle" dominantBaseline="middle" fontSize="8.5" fontStyle="italic" fill="#7a7a73" fontWeight="600">i</text>
                                            <circle cx={ix} cy={iy} r="11" fill="transparent" />
                                        </g>
                                    </g>
                                );
                            })}
                            {radarSeries.map((s) => {
                                const pts = s.values.map((v, i) => {
                                    const a = -Math.PI / 2 + (i * 2 * Math.PI) / radarAxes.length;
                                    const r = (isInView ? v : 0) / 100 * 120;
                                    return `${Math.cos(a) * r},${Math.sin(a) * r}`;
                                }).join(' ');
                                return (
                                    <g key={s.name}>
                                        <polygon points={pts} fill={s.color} fillOpacity={s.name === 'Loka' ? 0.13 : 0.05} stroke={s.color} strokeWidth={s.name === 'Loka' ? 2 : 1.3} style={{ transition: 'all 1s ease' }} />
                                        {s.values.map((v, i) => {
                                            const a = -Math.PI / 2 + (i * 2 * Math.PI) / radarAxes.length;
                                            const r = (isInView ? v : 0) / 100 * 120;
                                            return (
                                                <g key={i}>
                                                    <circle cx={Math.cos(a) * r} cy={Math.sin(a) * r} r={s.name === 'Loka' ? 3 : 2} fill={s.color} style={{ transition: 'all 1s ease' }} />
                                                    {/* invisible larger hit target for tooltip */}
                                                    <circle
                                                        className="radar-dot"
                                                        cx={Math.cos(a) * r}
                                                        cy={Math.sin(a) * r}
                                                        r="10"
                                                        fill="transparent"
                                                        style={{ cursor: 'default' }}
                                                        onMouseEnter={(e) => showTip(e, { color: s.color, title: s.name, lines: [{ k: radarAxes[i], v: s.raw[i] }, { k: 'normalized', v: `${v} / 100` }] })}
                                                        onMouseMove={moveTip}
                                                        onMouseLeave={hideTip}
                                                    />
                                                </g>
                                            );
                                        })}
                                    </g>
                                );
                            })}
                        </svg>
                    </div>

                    {/* Composite leaderboard (right column of the same card — same data, two views) */}
                    <div className="flex flex-col">
                        <div className="space-y-3.5">
                            {bars.map((b, i) => (
                                <div
                                    key={i}
                                    className="chart-row grid grid-cols-12 items-center gap-3 cursor-default px-2 -mx-2 py-1 rounded-md"
                                    onMouseEnter={(e) => showTip(e, { color: b.color, title: b.label, lines: [{ k: 'composite_score', v: `${b.value} / 100` }, { k: 'provider', v: b.sub }] })}
                                    onMouseMove={moveTip}
                                    onMouseLeave={hideTip}
                                >
                                    <div className="col-span-5 md:col-span-4">
                                        <div className="text-[12.5px] text-[#222] truncate">{b.label}</div>
                                        <div className="text-[10.5px] text-[#9a9a93]">{b.sub}</div>
                                    </div>
                                    <div className="col-span-6 md:col-span-7">
                                        <div className="h-[7px] rounded-sm bg-[#F2F2EC] overflow-hidden">
                                            <div
                                                className="chart-bar h-full rounded-sm transition-all duration-1000"
                                                style={{
                                                    width: isInView ? `${b.value}%` : '0%',
                                                    backgroundColor: b.color,
                                                    opacity: b.baseline ? 0.7 : 1,
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-span-1 text-right text-[12.5px] font-medium text-[#111] tabular-nums">{b.value}</div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 text-[11px] text-[#9a9a93]">0–100, higher is better · weighted blend of every metric below.</div>
                    </div>
                </div>
            </div>

            {/* Direction accuracy — grouped column chart vs random baseline */}
            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="rounded-2xl border bg-white p-6 md:p-7" style={{ borderColor: LINE }}>
                    <div className="mb-1">
                        <h3 className="text-[15px] font-semibold text-[#111] tracking-tight">Direction accuracy</h3>
                    </div>
                    <p className="text-[12.5px] text-[#7a7a73] leading-[1.55]">Share of trading questions where the model calls the right direction on a held-out test set.</p>
                    {(() => {
                        const W = 380, H = 240;
                        const padX = 36, padTop = 38, padBot = 42;
                        const innerW = W - padX * 2, innerH = H - padTop - padBot;
                        const yMax = 80;
                        const yFor = (v: number) => padTop + innerH - (v / yMax) * innerH;
                        const baseY = yFor(50);
                        const barW = 36;
                        return (
                            <svg viewBox={`0 0 ${W} ${H}`} className="w-full mt-4 overflow-visible">
                                {/* gridlines */}
                                {[0, 20, 40, 60, 80].map((g) => (
                                    <g key={g}>
                                        <line x1={padX} y1={yFor(g)} x2={W - padX} y2={yFor(g)} stroke="#F2F2EC" strokeWidth="1" />
                                        <text x={padX - 8} y={yFor(g) + 3} fontSize="9.5" fill="#bcbcb4" textAnchor="end" fontFeatureSettings="'tnum'">{g}</text>
                                    </g>
                                ))}
                                {/* bars */}
                                {dirAcc.map((d, i) => {
                                    const cx = padX + (innerW / dirAcc.length) * (i + 0.5);
                                    const x = cx - barW / 2;
                                    const h = isInView ? (d.v / yMax) * innerH : 0;
                                    const y = padTop + innerH - h;
                                    return (
                                        <g
                                            key={d.m}
                                            className="dir-bar"
                                            style={{ cursor: 'default', transformOrigin: `${cx}px ${padTop + innerH}px`, transition: 'transform 200ms ease' }}
                                            onMouseEnter={(e) => showTip(e, { color: d.color, title: d.full, lines: [{ k: 'direction_accuracy', v: `${d.v}%` }] })}
                                            onMouseMove={moveTip}
                                            onMouseLeave={hideTip}
                                        >
                                            {/* track behind bar */}
                                            <rect x={x} y={padTop} width={barW} height={innerH} fill="#F4F4EE" rx="2" />
                                            {/* value bar — flat color, no gradient */}
                                            <rect
                                                x={x}
                                                y={y}
                                                width={barW}
                                                height={h}
                                                fill={d.color}
                                                rx="2"
                                                style={{ transition: 'all 1s ease' }}
                                            />
                                            {/* numeric label */}
                                            <text x={cx} y={y - 10} textAnchor="middle" fontSize="13" fontWeight="700" fill="#111" fontFeatureSettings="'tnum'">
                                                {d.v}
                                                <tspan fontSize="9" fontWeight="500" fill="#9a9a93" dx="1">%</tspan>
                                            </text>
                                            {/* model name */}
                                            <text x={cx} y={padTop + innerH + 18} textAnchor="middle" fontSize="11" fill="#444">{d.m}</text>
                                        </g>
                                    );
                                })}
                            </svg>
                        );
                    })()}
                </div>
                {/* Sharpe — horizontal bullet */}
                <div className="rounded-2xl border bg-white p-6 md:p-7" style={{ borderColor: LINE }}>
                    <div className="mb-1">
                        <h3 className="text-[15px] font-semibold text-[#111] tracking-tight">Sharpe ratio <span className="ml-1 text-[10.5px] px-1.5 py-[1px] rounded-full font-medium align-middle" style={{ backgroundColor: 'rgba(186,255,41,0.18)', color: '#3a5a00' }}>✨ key</span></h3>
                    </div>
                    <p className="text-[12.5px] text-[#7a7a73] leading-[1.55]">Return per unit of risk. For the same return, lower volatility wins — a higher Sharpe means a smoother ride. Target zone is above 1.0.</p>
                    <div className="mt-5 space-y-4">
                        {sharpeRows.map((r) => {
                            const max = 2.4;
                            const w = isInView ? (r.v / max) * 100 : 0;
                            return (
                                <div
                                    key={r.m}
                                    className="chart-row cursor-default px-2 -mx-2 py-1 rounded-md"
                                    onMouseEnter={(e) => showTip(e, { color: r.color, title: r.m, lines: [{ k: 'sharpe', v: r.v.toFixed(2) }, { k: 'vs. target 1.0', v: r.v >= 1.0 ? `+${(r.v - 1).toFixed(2)}` : `−${(1 - r.v).toFixed(2)}` }] })}
                                    onMouseMove={moveTip}
                                    onMouseLeave={hideTip}
                                >
                                    <div className="flex items-baseline justify-between text-[12px] mb-1.5">
                                        <span className="text-[#333]">{r.m}</span>
                                        <span className="font-medium text-[#111] tabular-nums">{r.v.toFixed(2)}</span>
                                    </div>
                                    <div className="relative h-3 rounded-full bg-[#F2F2EC]">
                                        {/* target zone marker at 1.0 */}
                                        <div className="absolute top-[-3px] bottom-[-3px] w-px bg-[#cfcfc6]" style={{ left: `${(1.0 / max) * 100}%` }} />
                                        <div className="chart-bar absolute inset-y-0 left-0 rounded-full transition-all duration-1000" style={{ width: `${w}%`, backgroundColor: r.color }} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Excess return — multi-line + Max drawdown — diverging bars */}
            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="rounded-2xl border bg-white p-6 md:p-7" style={{ borderColor: LINE }}>
                    <div className="flex items-baseline justify-between gap-2 mb-1">
                        <h3 className="text-[15px] font-semibold text-[#111] tracking-tight">Cumulative excess return</h3>
                        <span className="text-[10.5px] text-[#9a9a93]">vs. SPX, 90 days</span>
                    </div>
                    <p className="text-[12.5px] text-[#7a7a73] leading-[1.55]">Strategy return minus SPX return over the same 90 days. In a bull market, beating zero doesn't matter — beating the index does.</p>
                    <svg viewBox="0 0 320 100" className="w-full mt-4">
                        <defs>
                            <linearGradient id="lokaFill" x1="0" x2="0" y1="0" y2="1">
                                <stop offset="0" stopColor={MODEL_COLORS.loka} stopOpacity="0.12" />
                                <stop offset="1" stopColor={MODEL_COLORS.loka} stopOpacity="0" />
                            </linearGradient>
                        </defs>
                        {/* gridlines */}
                        {[0, 25, 50, 75].map((y) => <line key={y} x1="0" y1={y} x2="320" y2={y} stroke="#F2F2EC" strokeWidth="1" />)}
                        {/* Loka filled area */}
                        <path d={`${lineCurves[0].d} L320,100 L0,100 Z`} fill="url(#lokaFill)" />
                        {lineCurves.map((c) => {
                            const finalReturn = c.name === 'Loka' ? '+8.2%' : c.name === 'GPT-5' ? '+3.4%' : c.name === 'Claude Opus 4.7' ? '+2.7%' : c.name === 'DeepSeek V3' ? '+1.9%' : '+1.2%';
                            const excessVsSPX = c.name === 'SPX (benchmark)' ? '0.0%' : (parseFloat(finalReturn) - 1.2).toFixed(1) + '%';
                            return (
                                <g key={c.name}>
                                    <path d={c.d} fill="none" stroke={c.color} strokeWidth={c.name === 'Loka' ? 2 : 1.5} strokeDasharray={c.dashed ? '3 3' : undefined} />
                                    {/* thicker invisible hit path for tooltip */}
                                    <path
                                        className="excess-line"
                                        d={c.d}
                                        fill="none"
                                        stroke="transparent"
                                        strokeWidth="14"
                                        onMouseEnter={(e) => showTip(e, { color: c.color, title: c.name, lines: [{ k: '90-day cumulative', v: finalReturn }, { k: 'excess vs. SPX', v: excessVsSPX }] })}
                                        onMouseMove={moveTip}
                                        onMouseLeave={hideTip}
                                    />
                                </g>
                            );
                        })}
                    </svg>
                    <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 text-[11.5px]">
                        <div className="flex items-center justify-between"><span className="inline-flex items-center gap-1.5"><span className="w-3 h-[2px]" style={{ backgroundColor: MODEL_COLORS.loka }} /> Loka</span><span className="font-medium text-[#111] tabular-nums">+8.2%</span></div>
                        <div className="flex items-center justify-between"><span className="inline-flex items-center gap-1.5"><span className="w-3 h-[2px]" style={{ backgroundColor: MODEL_COLORS.gpt }} /> GPT-5</span><span className="font-medium text-[#111] tabular-nums">+3.4%</span></div>
                        <div className="flex items-center justify-between"><span className="inline-flex items-center gap-1.5"><span className="w-3 h-[2px]" style={{ backgroundColor: MODEL_COLORS.deepseek }} /> DeepSeek</span><span className="font-medium text-[#111] tabular-nums">+1.9%</span></div>
                        <div className="flex items-center justify-between text-[#9a9a93]"><span className="inline-flex items-center gap-1.5"><span className="w-3 h-[2px] border-t border-dashed" style={{ borderColor: '#bdbdb6' }} /> SPX</span><span className="tabular-nums">+1.2%</span></div>
                    </div>
                </div>
                {/* Max drawdown — diverging bars to the left */}
                <div className="rounded-2xl border bg-white p-6 md:p-7" style={{ borderColor: LINE }}>
                    <div className="flex items-baseline justify-between gap-2 mb-1">
                        <h3 className="text-[15px] font-semibold text-[#111] tracking-tight">Max drawdown</h3>
                        <span className="text-[10.5px] text-[#9a9a93]">closer to 0 = better</span>
                    </div>
                    <p className="text-[12.5px] text-[#7a7a73] leading-[1.55]">Worst peak-to-trough loss across the run. Closer to zero = more survivable, easier to compound.</p>
                    <div className="mt-5 space-y-3.5">
                        {drawRows.map((r) => {
                            const max = 15;
                            const w = isInView ? (Math.abs(r.v) / max) * 100 : 0;
                            return (
                                <div
                                    key={r.m}
                                    className="chart-row grid grid-cols-12 items-center gap-3 cursor-default px-2 -mx-2 py-1 rounded-md"
                                    onMouseEnter={(e) => showTip(e, { color: r.color, title: r.m, lines: [{ k: 'max_drawdown', v: `${r.v.toFixed(1)}%` }, { k: 'note', v: 'closer to 0 is better' }] })}
                                    onMouseMove={moveTip}
                                    onMouseLeave={hideTip}
                                >
                                    <div className="col-span-3 text-[12px] text-[#333]">{r.m}</div>
                                    <div className="col-span-7 relative h-2.5 rounded-full bg-[#F2F2EC] overflow-hidden flex justify-end">
                                        <div className="chart-bar h-full rounded-full transition-all duration-1000" style={{ width: `${w}%`, backgroundColor: r.color }} />
                                    </div>
                                    <div className="col-span-2 text-right text-[12px] font-medium text-[#111] tabular-nums">{r.v.toFixed(1)}%</div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="mt-5 text-[11.5px] text-[#7a7a73] leading-[1.55]">
                        Loka's drawdown is roughly <span className="font-semibold text-[#111]">one third</span> of DeepSeek's —
                        which is exactly why the Sharpe ratios pull apart.
                    </div>
                </div>
            </div>

            {/* memorization_gap — dumbbell chart */}
            <div className="mt-3 rounded-2xl border p-6 md:p-8" style={{ borderColor: '#0A0A0A', backgroundColor: '#0A0A0A', color: '#fff' }}>
                <div className="flex items-baseline justify-between gap-2 flex-wrap">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-[10.5px] px-1.5 py-[1px] rounded-full font-medium" style={{ backgroundColor: 'rgba(239,68,68,0.18)', color: '#fca5a5' }}>⚠ killer metric</span>
                        </div>
                        <h3 className="mt-2 text-[18px] font-semibold tracking-tight">Memorization gap</h3>
                        <p className="mt-1 text-[12.5px] text-white/60 leading-[1.55] max-w-2xl">Pre-cutoff vs. post-cutoff scores. The wider the gap, the more the model is recalling answers rather than thinking.</p>
                    </div>
                    <span className="text-[10.5px] text-white/50">smaller gap = real generalization</span>
                </div>
                {/* dumbbell */}
                <div className="mt-6 space-y-5">
                    {[
                        { m: 'Loka', a: 78, b: 75, color: MODEL_COLORS.loka, gap: 3 },
                        { m: 'GPT-5', a: 72, b: 60, color: MODEL_COLORS.gpt, gap: 12 },
                        { m: 'Claude Opus 4.7', a: 70, b: 59, color: MODEL_COLORS.claude, gap: 11 },
                        { m: 'DeepSeek V3', a: 65, b: 49, color: MODEL_COLORS.deepseek, gap: 16 },
                    ].map((r) => {
                        const min = 40, max = 90;
                        const pct = (v: number) => ((v - min) / (max - min)) * 100;
                        const a = isInView ? pct(r.a) : 0;
                        const b = isInView ? pct(r.b) : 0;
                        return (
                            <div
                                key={r.m}
                                className="dumbbell-row group grid grid-cols-12 items-center gap-3 cursor-default px-2 -mx-2 py-1 rounded-md"
                                onMouseEnter={(e) => showTip(e, { color: r.color, title: r.m, lines: [{ k: 'pre-cutoff', v: `${r.a}` }, { k: 'post-cutoff', v: `${r.b}` }, { k: 'gap', v: `−${r.gap} pts` }] })}
                                onMouseMove={moveTip}
                                onMouseLeave={hideTip}
                            >
                                <div className="col-span-3 md:col-span-2 text-[12.5px]">{r.m}</div>
                                <div className="col-span-7 md:col-span-8 relative h-6">
                                    <div className="absolute inset-y-1/2 left-0 right-0 h-px bg-white/10" />
                                    <div className="absolute top-1/2 -translate-y-1/2 h-[3px] rounded-full transition-all duration-1000" style={{ left: `${Math.min(a, b)}%`, width: `${Math.abs(a - b)}%`, backgroundColor: 'rgba(255,255,255,0.35)' }} />
                                    <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full ring-2 transition-all duration-1000 group-hover:scale-110" style={{ left: `${a}%`, backgroundColor: '#fff', borderColor: r.color, color: r.color }} />
                                    <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full transition-all duration-1000 group-hover:scale-110" style={{ left: `${b}%`, backgroundColor: r.color }} />
                                </div>
                                <div className="col-span-2 text-right text-[12px] tabular-nums">
                                    <span className={r.gap <= 5 ? 'text-[#BAFF29] font-semibold' : 'text-white/80'}>−{r.gap}</span>
                                    <span className="text-white/40 ml-1">pts</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className="mt-6 pt-5 border-t border-white/10 flex flex-wrap items-center gap-x-5 gap-y-1 text-[11px] text-white/60">
                    <span className="inline-flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-white border-2" style={{ borderColor: '#fff' }} /> Likely in training</span>
                    <span className="inline-flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-white" /> Strictly post-cutoff</span>
                    <span className="ml-auto">Loka ≈ 3 pts · GPT-5 12 · Claude 11 · DeepSeek 16</span>
                </div>
            </div>

            <BattleArena />

            <p className="text-[11.5px] text-[#9a9a93] mt-10">AegeanBench snapshot · methodology and per-case results published on the live leaderboard. Paper-traded — past performance does not guarantee future returns.</p>
        </section>
    );
};

// ─────────── Section 3: Why multi-agent ───────────
type AnalystCard = { avatar: string; name: string; role: string; framework: string; skills: string[] };
const ANALYSTS: AnalystCard[] = [
    { avatar: '/avatars/warren_buffett.jpg', name: 'Warren Buffett', role: 'Competitive moats & value', framework: 'Buy wonderful businesses at fair prices, hold forever.', skills: ['Owner-mindset DCF', 'Moat depth'] },
    { avatar: '/avatars/charlie_munger.jpg', name: 'Charlie Munger', role: 'Mental models & inversion', framework: 'Multidisciplinary mental models, with inversion checks.', skills: ['Latticework', 'Pre-mortem'] },
    { avatar: '/avatars/stanley_druckenmiller.jpg', name: 'Druckenmiller', role: 'Macro liquidity & regime', framework: 'Top-down macro overlay with cross-asset correlation.', skills: ['Liquidity read', 'Regime shift'] },
    { avatar: '/avatars/peter_lynch.jpg', name: 'Peter Lynch', role: 'Growth at reasonable price', framework: 'Invest in what you understand — find growers fairly priced.', skills: ['Bottom-up', 'PEG hunt'] },
    { avatar: '/avatars/nassim_taleb.jpg', name: 'Nassim Taleb', role: 'Tail risk & fragility', framework: 'Non-linear risk modeling, fractal geometry, extreme value theory.', skills: ['Tail-risk', 'Anti-fragile'] },
    { avatar: '/avatars/aswath_damodaran.jpg', name: 'Damodaran', role: 'Intrinsic value', framework: 'Multi-model convergence with scenario-weighted fair value.', skills: ['Scenario DCF', 'Story↔numbers'] },
    { avatar: '/avatars/ben_graham.jpg', name: 'Ben Graham', role: 'Margin of safety', framework: 'Defensive — wide margin of safety, Mr. Market as servant.', skills: ['Net-net', 'Safety check'] },
    { avatar: '/avatars/michael_burry.jpg', name: 'Michael Burry', role: 'Contrarian deep value', framework: 'Look where nobody looks, short structural mispricings.', skills: ['Structural short', 'Forensic'] },
    { avatar: '/avatars/crypto_specialist.jpg', name: 'On-chain Specialist', role: 'Wallet flows & supply', framework: 'On-chain data analysis with token-economic modeling.', skills: ['Holder concentration', 'Flow tracing'] },
    { avatar: '/avatars/event_driven.jpg', name: 'Event-Driven', role: 'Catalysts & windows', framework: 'Event timeline with probability-weighted outcome modeling.', skills: ['M&A windows', 'Earnings'] },
    { avatar: '/avatars/sentiment_analyst.jpg', name: 'Sentiment Specialist', role: 'Crowd & contrarian', framework: 'Multi-source sentiment aggregation, contrarian signal detection.', skills: ['Funding skew', 'Note-tone'] },
    { avatar: '/avatars/risk_enhanced.jpg', name: 'Risk Officer', role: 'Pre-mortem first', framework: 'Risk-first — pre-mortem analysis, Monte Carlo simulations.', skills: ['Drawdown sim', 'Stop logic'] },
];

const Why: React.FC = () => {
    const { ref, isInView } = useInView();
    return (
        <section id="why" ref={ref} className={`mt-28 md:mt-36 transition-all duration-700 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <div className="max-w-2xl">
                <p className="text-[12px] text-[#9a9a93] mb-3 tracking-tight">03 — Why a council beats one model</p>
                <h2 className="text-[32px] md:text-[44px] font-semibold text-[#111] tracking-[-0.03em] leading-[1.05]">
                    One model has one worldview.<br />
                    <span className="text-[#666]">A council has frameworks.</span>
                </h2>
                <p className="mt-4 text-[15px] md:text-[16px] text-[#5a5a55] leading-[1.6] max-w-xl">
                    Each Loka agent isn't the same model in a costume — it has its own knowledge base, framework, and skills.
                    The friction between frameworks is the real signal.
                </p>
            </div>

            {/* Single vs Council — compact contrast with illustrations */}
            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Single LLM */}
                <div className="rounded-2xl border bg-white p-6 relative overflow-hidden" style={{ borderColor: LINE }}>
                    {/* Illustration: lonely node */}
                    <div className="relative h-[110px] mb-5 flex items-center justify-center">
                        <svg viewBox="0 0 280 110" className="absolute inset-0 w-full h-full">
                            {/* dotted concentric rings to hint isolation */}
                            <circle cx="140" cy="55" r="46" fill="none" stroke="#E5E5DE" strokeDasharray="2 4" />
                            <circle cx="140" cy="55" r="68" fill="none" stroke="#EFEFE8" strokeDasharray="2 6" />
                            {/* single output line */}
                            <line x1="140" y1="55" x2="240" y2="55" stroke="#D4D4CB" strokeWidth="1.5" />
                            <polygon points="238,51 248,55 238,59" fill="#D4D4CB" />
                            {/* question mark on the user side */}
                            <circle cx="40" cy="55" r="6" fill="#E5E5DE" />
                            <line x1="46" y1="55" x2="94" y2="55" stroke="#E5E5DE" strokeWidth="1.5" strokeDasharray="3 3" />
                        </svg>
                        {/* center node */}
                        <div className="relative w-[68px] h-[68px] rounded-full bg-[#F2F2EC] border flex items-center justify-center" style={{ borderColor: LINE }}>
                            <span className="text-[11px] font-semibold tracking-wider text-[#9a9a93]">LLM</span>
                        </div>
                    </div>
                    <div className="text-[11px] uppercase tracking-[0.14em] text-[#9a9a93] mb-2">A single LLM</div>
                    <div className="text-[18px] font-semibold text-[#111] tracking-tight">One prompt → one voice.</div>
                    <div className="mt-2 text-[13px] text-[#7a7a73] leading-[1.55]">One set of priors. You can't see what was considered, or how confidently it should have said so.</div>
                </div>

                {/* Loka council */}
                <div className="rounded-2xl border p-6 relative overflow-hidden" style={{ borderColor: '#0A0A0A', backgroundColor: '#0A0A0A', color: '#fff' }}>
                    {/* Illustration: orbiting avatars around a verdict */}
                    <div className="relative h-[110px] mb-5 flex items-center justify-center">
                        <svg viewBox="0 0 280 110" className="absolute inset-0 w-full h-full">
                            {/* connecting lines from outer ring to center */}
                            {[
                                [60, 32], [102, 18], [140, 14], [178, 18], [220, 32],
                                [60, 78], [102, 92], [178, 92], [220, 78],
                            ].map(([x, y], i) => (
                                <line key={i} x1={x} y1={y} x2="140" y2="55" stroke="rgba(255,255,255,0.18)" strokeWidth="0.8" />
                            ))}
                        </svg>
                        {/* avatars around the ring */}
                        {[
                            { x: 60, y: 32, src: '/avatars/warren_buffett.jpg' },
                            { x: 102, y: 18, src: '/avatars/charlie_munger.jpg' },
                            { x: 140, y: 14, src: '/avatars/peter_lynch.jpg' },
                            { x: 178, y: 18, src: '/avatars/stanley_druckenmiller.jpg' },
                            { x: 220, y: 32, src: '/avatars/nassim_taleb.jpg' },
                            { x: 60, y: 78, src: '/avatars/aswath_damodaran.jpg' },
                            { x: 102, y: 92, src: '/avatars/michael_burry.jpg' },
                            { x: 178, y: 92, src: '/avatars/ben_graham.jpg' },
                            { x: 220, y: 78, src: '/avatars/cathie_wood.jpg' },
                        ].map((a, i) => (
                            <img
                                key={i}
                                src={a.src}
                                alt=""
                                className="absolute w-7 h-7 rounded-full object-cover ring-2 ring-[#0A0A0A]"
                                style={{ left: `${(a.x / 280) * 100}%`, top: `${(a.y / 110) * 100}%`, transform: 'translate(-50%,-50%)' }}
                                onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/avatars/default.jpg'; }}
                            />
                        ))}
                        {/* center verdict node */}
                        <div className="relative w-[58px] h-[58px] rounded-full bg-white flex items-center justify-center shadow-[0_0_0_4px_rgba(255,255,255,0.06)]">
                            <span className="text-[10.5px] font-semibold tracking-wider text-[#0A0A0A]">VERDICT</span>
                        </div>
                    </div>
                    <div className="text-[11px] uppercase tracking-[0.14em] text-white/50 mb-2">The Loka council</div>
                    <div className="text-[18px] font-semibold tracking-tight">A roomful of frameworks → one verdict.</div>
                    <div className="mt-2 text-[13px] text-white/70 leading-[1.55]">Every viewpoint visible, every disagreement debated, every output an executable trade ticket.</div>
                </div>
            </div>

            {/* Pillar A — Methodology diversity */}
            <div className="mt-16">
                <div className="flex items-baseline gap-3 mb-6">
                    <span className="w-6 h-6 rounded-full bg-[#111] flex items-center justify-center text-[11px] font-semibold text-white shrink-0">A</span>
                    <div>
                        <h3 className="text-[20px] md:text-[24px] font-semibold text-[#111] tracking-tight">Every seat has its own thinking framework.</h3>
                        <p className="text-[13.5px] text-[#7a7a73] mt-1 max-w-3xl">A glimpse at twelve seats from a roster of investors and specialists. Each has a distinct knowledge base, mental framework, and skill set — open any one in the app to see its full profile.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {ANALYSTS.slice(0, 9).map((a) => (
                        <div key={a.name} className="rounded-2xl border bg-white p-5 hover:shadow-[0_8px_24px_-12px_rgba(0,0,0,0.12)] transition-shadow" style={{ borderColor: LINE }}>
                            <div className="flex items-start gap-3">
                                <img src={a.avatar} alt={a.name} className="w-12 h-12 rounded-full object-cover ring-2 ring-white shadow-[0_4px_14px_rgba(0,0,0,0.08)] shrink-0" onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/avatars/default.jpg'; }} />
                                <div className="min-w-0">
                                    <div className="text-[13.5px] font-semibold text-[#111] tracking-tight truncate">{a.name}</div>
                                    <div className="text-[11.5px] text-[#9a9a93] truncate">{a.role}</div>
                                </div>
                            </div>
                            <div className="mt-3 pt-3 border-t" style={{ borderColor: LINE }}>
                                <div className="text-[10.5px] uppercase tracking-[0.14em] text-[#9a9a93] mb-1">Framework</div>
                                <div className="text-[12.5px] text-[#3a3a35] leading-[1.55]">{a.framework}</div>
                            </div>
                            <div className="mt-3 flex flex-wrap gap-1.5">
                                {a.skills.map((sk) => (
                                    <span key={sk} className="inline-flex items-center gap-1 px-2 py-[2px] rounded-full text-[10.5px] font-medium" style={{ backgroundColor: '#F2F2EC', color: '#3a3a35' }}>
                                        <span className="w-1 h-1 rounded-full bg-[#0A7C4A]" />
                                        {sk}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-6 flex items-center justify-center gap-3 text-[#7a7a73]">
                    <div className="flex -space-x-2">
                        {['/avatars/cathie_wood.jpg', '/avatars/mohnish_pabrai.jpg', '/avatars/bill_ackman.jpg', '/avatars/rakesh_jhunjhunwala.jpg', '/avatars/phil_fisher.jpg'].map((src) => (
                            <img key={src} src={src} alt="" className="w-7 h-7 rounded-full object-cover ring-2 ring-[#FAFAF7]" onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/avatars/default.jpg'; }} />
                        ))}
                    </div>
                    <span className="text-[12.5px]">…and many more seats around the table</span>
                </div>
            </div>

            {/* Pillar B — Consensus process */}
            <div className="mt-16">
                <div className="flex items-baseline gap-3 mb-6">
                    <span className="w-6 h-6 rounded-full bg-[#111] flex items-center justify-center text-[11px] font-semibold text-white shrink-0">B</span>
                    <div>
                        <h3 className="text-[20px] md:text-[24px] font-semibold text-[#111] tracking-tight">How the roundtable converges.</h3>
                        <p className="text-[13.5px] text-[#7a7a73] mt-1">Four rounds. Independent takes, open review, debate on the sharpest point, then a weighted, executable verdict.</p>
                    </div>
                </div>

                <div className="rounded-2xl border bg-white overflow-hidden" style={{ borderColor: LINE }}>
                    <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x" style={{ borderColor: LINE }}>
                        {/* Round 1 */}
                        <div className="p-6 md:p-7">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="text-[10.5px] font-semibold text-[#0A7C4A] tracking-wide">Round 1</span>
                                <span className="text-[10.5px] text-[#9a9a93]">· blind</span>
                            </div>
                            <div className="text-[14px] font-semibold text-[#111] mb-3">Independent calls</div>
                            <div className="space-y-1.5">
                                {[
                                    { who: 'Buffett', call: 'Long · 0.72' },
                                    { who: 'Druckenmiller', call: 'Long · 0.61' },
                                    { who: 'Damodaran', call: 'Flat · 0.48' },
                                    { who: 'Taleb', call: 'Short · 0.55' },
                                ].map((r) => (
                                    <div key={r.who} className="px-2.5 py-1.5 rounded-md bg-[#FAFAF7] text-[12px] flex items-center justify-between">
                                        <span className="text-[#333]">{r.who}</span>
                                        <span className="text-[#7a7a73] tabular-nums">{r.call}</span>
                                    </div>
                                ))}
                            </div>
                            <p className="mt-4 text-[12px] text-[#7a7a73] leading-[1.55]">Each agent commits a direction + confidence without seeing the others.</p>
                        </div>

                        {/* Round 2 */}
                        <div className="p-6 md:p-7">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="text-[10.5px] font-semibold text-[#0A7C4A] tracking-wide">Round 2</span>
                                <span className="text-[10.5px] text-[#9a9a93]">· open review</span>
                            </div>
                            <div className="text-[14px] font-semibold text-[#111] mb-3">Reconsider, in public</div>
                            <div className="space-y-2">
                                <div className="px-2.5 py-2 rounded-md border text-[12px] leading-[1.5]" style={{ borderColor: LINE }}>
                                    <span className="text-[#333] font-medium">Damodaran</span> sees Buffett's cash-flow argument — revises <span className="tabular-nums">0.48 → 0.60</span>.
                                </div>
                                <div className="px-2.5 py-2 rounded-md border text-[12px] leading-[1.5]" style={{ borderColor: LINE }}>
                                    <span className="text-[#333] font-medium">Taleb</span> holds — tail risk not addressed.
                                </div>
                            </div>
                            <p className="mt-4 text-[12px] text-[#7a7a73] leading-[1.55]">Agents read every other's reasoning and update — or refuse to.</p>
                        </div>

                        {/* Round 3 */}
                        <div className="p-6 md:p-7">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="text-[10.5px] font-semibold text-[#0A7C4A] tracking-wide">Round 3</span>
                                <span className="text-[10.5px] text-[#9a9a93]">· debate</span>
                            </div>
                            <div className="text-[14px] font-semibold text-[#111] mb-3">Argue the sharpest split</div>
                            <div className="rounded-md border p-2.5 text-[12px] leading-[1.55] mb-2" style={{ borderColor: LINE, backgroundColor: HINT + '55' }}>
                                <div className="font-medium text-[#333] mb-0.5">Buffett →</div>
                                "Valuation looks rich on screens, free cash flow says otherwise."
                            </div>
                            <div className="rounded-md border p-2.5 text-[12px] leading-[1.55]" style={{ borderColor: LINE }}>
                                <div className="font-medium text-[#333] mb-0.5">Taleb ↩</div>
                                "Cash flow assumes regime continuity. What if it breaks?"
                            </div>
                            <p className="mt-4 text-[12px] text-[#7a7a73] leading-[1.55]">The biggest disagreement gets pressure-tested in the open.</p>
                        </div>

                        {/* Final */}
                        <div className="p-6 md:p-7 bg-[#FAFAF7]">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="text-[10.5px] font-semibold text-[#111] tracking-wide">Final</span>
                                <span className="text-[10.5px] text-[#9a9a93]">· weighted</span>
                            </div>
                            <div className="text-[14px] font-semibold text-[#111] mb-3">Executable verdict</div>
                            <div className="rounded-lg border bg-white p-3" style={{ borderColor: LINE }}>
                                <div className="text-[11px] text-[#9a9a93]">Direction</div>
                                <div className="text-[15px] font-semibold text-[#0A7C4A]">Long · NVDA</div>
                                <div className="mt-2 pt-2 border-t grid grid-cols-3 gap-2 text-[11.5px]" style={{ borderColor: LINE }}>
                                    <div><div className="text-[#9a9a93]">Entry</div><div className="font-medium text-[#111] tabular-nums">$173</div></div>
                                    <div><div className="text-[#9a9a93]">Size</div><div className="font-medium text-[#111] tabular-nums">1.5%</div></div>
                                    <div><div className="text-[#9a9a93]">Stop</div><div className="font-medium text-[#111] tabular-nums">$165</div></div>
                                </div>
                            </div>
                            <p className="mt-4 text-[12px] text-[#7a7a73] leading-[1.55]">Confidence-weighted consensus → a trade ticket you can execute, not a paragraph.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

// ─────────── FAQ ───────────
const faqs = [
    { q: 'What is Loka?', a: 'A multi-agent investing co-pilot. It runs independent low-cost LLMs in parallel, has them debate, and ships only consensus-backed trade calls with concrete entry, sizing, and stops.' },
    { q: 'Why is an ensemble of cheap models better than one big model?', a: 'Independent models make uncorrelated errors. When five small models converge, that signal is statistically stronger than one frontier model speaking with confidence — and an order of magnitude cheaper.' },
    { q: 'How accurate is it?', a: 'On a 500-question directional trading benchmark across crypto and US equities (May 2026), Loka scored 68.4% vs. GPT-5 63.1% and ChatGPT default 57.1%. Methodology available on request.' },
    { q: 'Is it cheaper than calling GPT-5 directly?', a: 'Roughly one-tenth the inference cost per call. The ensemble runs on mid-tier open models instead of frontier proprietary ones.' },
    { q: 'What happens when the agents disagree?', a: 'You see it. Split consensus is reported as such — Loka will tell you "no clear edge" rather than fake confidence.' },
    { q: 'Does Loka manage my money?', a: 'No. Loka generates calls with full reasoning and an audit trail. You decide whether to execute.' },
];

const FAQ: React.FC = () => {
    const [open, setOpen] = useState(0);
    return (
        <section id="faq" className="mt-28 md:mt-36">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
                {/* Sticky header column */}
                <div className="lg:col-span-5">
                    <div className="lg:sticky lg:top-8">
                        <p className="text-[12px] text-[#9a9a93] mb-3 tracking-tight">04 — FAQ</p>
                        <h2 className="text-[28px] md:text-[36px] lg:text-[44px] font-semibold text-[#111] tracking-[-0.03em] leading-[1.05]">
                            Common questions,<br /><span className="text-[#666]">straight answers.</span>
                        </h2>
                        <p className="mt-4 text-[14.5px] text-[#5a5a55] leading-[1.6] max-w-md">
                            Don't see your question? Open the app and ask the council directly — they'll route it to the right specialists.
                        </p>
                        <div className="mt-6 flex flex-wrap gap-2">
                            <a href="/" className="inline-flex items-center gap-1.5 h-9 px-4 rounded-full bg-[#111] text-white text-[12.5px] font-medium hover:bg-black transition-colors">
                                Ask the council →
                            </a>
                            <a href="mailto:hello@loka.io" className="inline-flex items-center gap-1.5 h-9 px-4 rounded-full border bg-white text-[12.5px] font-medium text-[#111]" style={{ borderColor: LINE }}>
                                Email us
                            </a>
                        </div>
                    </div>
                </div>
                {/* Accordion */}
                <div className="lg:col-span-7">
                    <div className="rounded-2xl border bg-white overflow-hidden" style={{ borderColor: LINE }}>
                        {faqs.map((f, i) => (
                            <div key={i} className="border-b last:border-b-0" style={{ borderColor: LINE }}>
                                <button onClick={() => setOpen(open === i ? -1 : i)} className="w-full text-left px-5 md:px-6 py-4 flex items-center justify-between gap-4 hover:bg-[#FAFAF7] transition-colors">
                                    <span className="text-[14px] font-medium text-[#111]">{f.q}</span>
                                    <span className="text-[20px] font-light text-[#9a9a93]">{open === i ? '−' : '+'}</span>
                                </button>
                                {open === i && (
                                    <div className="px-5 md:px-6 pb-5 text-[13.5px] text-[#5a5a55] leading-[1.6]">{f.a}</div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

// ─────────── Final CTA ───────────
const FinalCTA: React.FC = () => {
    const go = () => { window.location.pathname = '/'; };
    return (
        <section className="mt-28 md:mt-36 pb-16">
            <div className="rounded-[28px] border bg-white p-10 md:p-16 text-center" style={{ borderColor: LINE }}>
                <h2 className="text-[32px] md:text-[44px] font-semibold text-[#111] tracking-[-0.03em] leading-[1.05] max-w-2xl mx-auto">
                    Stop guessing.<br />
                    <span className="text-[#666]">Let the consensus call it.</span>
                </h2>
                <p className="mt-4 text-[15px] text-[#5a5a55] max-w-md mx-auto leading-[1.55]">
                    Run your first consensus trade call free. See the agreement before you size the position.
                </p>
                <div className="mt-8 flex items-center justify-center gap-3">
                    <PrimaryBtn onClick={go}>Try it free →</PrimaryBtn>
                    <GhostBtn href="#benchmark">See the data</GhostBtn>
                </div>
            </div>
            <div className="mt-10 flex flex-wrap items-center justify-between gap-4 text-[12px] text-[#9a9a93]">
                <div>© Loka, 2026</div>
                <div className="flex items-center gap-5">
                    <a href="#why" className="hover:text-[#111] transition-colors">Why Loka</a>
                    <a href="#benchmark" className="hover:text-[#111] transition-colors">Benchmark</a>
                    <a href="#faq" className="hover:text-[#111] transition-colors">FAQ</a>
                </div>
            </div>
        </section>
    );
};

// ─────────── Root ───────────
const LandingLoka: React.FC = () => {
    useEffect(() => {
        const prev = document.title;
        document.title = 'Loka — Multi-Agent Consensus for Investing';
        return () => { document.title = prev; };
    }, []);

    return (
        <div className="relative min-h-screen overflow-x-hidden" style={{ backgroundColor: BG, color: INK }}>
            <div className="max-w-[1200px] mx-auto px-5 sm:px-8 lg:px-10 relative z-10">
                <Nav />
                <Hero />
                <Accuracy />
                <Why />
                <FAQ />
                <FinalCTA />
            </div>
        </div>
    );
};

export default LandingLoka;
