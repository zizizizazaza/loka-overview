import React, { useEffect, useMemo, useRef, useState } from 'react';

export type Stance = 'Bullish' | 'Bearish' | 'Neutral';
export type ChatPersona = {
    id: string;
    name: string;
    avatar: string;
    verdict: Stance;
};

const ROUNDTABLE: ChatPersona[] = [
    { id: 'buffett', name: 'Warren Buffett', avatar: '/avatars/warren_buffett.jpg', verdict: 'Bullish' },
    { id: 'munger', name: 'Charlie Munger', avatar: '/avatars/charlie_munger.jpg', verdict: 'Bullish' },
    { id: 'fundamental', name: 'Fundamental Analyst', avatar: '/avatars/fundamental_analyst.jpg', verdict: 'Bullish' },
    { id: 'valuation', name: 'Valuation Analyst', avatar: '/avatars/valuation_specialist.jpg', verdict: 'Neutral' },
    { id: 'macro', name: 'Macro Strategist', avatar: '/avatars/macro_enhanced.jpg', verdict: 'Bullish' },
    { id: 'sentiment', name: 'Sentiment Analyst', avatar: '/avatars/sentiment_analyst.jpg', verdict: 'Bullish' },
    { id: 'event', name: 'Event-Driven Analyst', avatar: '/avatars/event_driven.jpg', verdict: 'Bullish' },
    { id: 'risk', name: 'Risk Analyst', avatar: '/avatars/risk_enhanced.jpg', verdict: 'Bearish' },
];

const DIALOG: { id: string; side: 'L' | 'R'; text: string }[] = [
    { id: 'buffett', side: 'L', text: "Pricing power is intact and the moat keeps widening. Data-center demand isn't a one-quarter story — I'd hold and let it compound." },
    { id: 'risk', side: 'R', text: "Hyperscaler capex is concentrated in three buyers. If one trims orders next year, the multiple won't survive the headline." },
    { id: 'fundamental', side: 'L', text: "Gross margins are still expanding into next year, and the Blackwell mix is dilutive to nobody. Numbers are the cleanest in the cohort." },
    { id: 'event', side: 'R', text: "GTC plus the Blackwell ramp gives two clean catalysts before year-end. Implied moves are underpricing the optionality." },
    { id: 'valuation', side: 'L', text: "Trading at 32x forward earnings — rich, but not extreme given growth. I'd call this fair, not a screaming buy." },
    { id: 'sentiment', side: 'R', text: "Tone across analyst notes is net-positive but cooling at the edges. Retail enthusiasm is fading faster than institutional." },
    { id: 'macro', side: 'L', text: "Rate path supports growth multiples through Q2. A pause-then-cut backdrop is the friendliest environment for this name." },
    { id: 'munger', side: 'R', text: "Stay within your circle of competence. The thesis is simple and it's working — don't overthink the entry." },
];

const stanceStyle = (s: Stance) => {
    if (s === 'Bullish') return { bg: 'rgba(16,185,129,0.10)', fg: '#047857', dot: '#10b981' };
    if (s === 'Bearish') return { bg: 'rgba(239,68,68,0.10)', fg: '#b91c1c', dot: '#ef4444' };
    return { bg: 'rgba(0,0,0,0.05)', fg: '#525252', dot: '#9ca3af' };
};

const Avatar: React.FC<{ p: ChatPersona; size?: number; ring?: boolean }> = ({ p, size = 28, ring = false }) => (
    <img
        src={p.avatar}
        alt={p.name}
        className={`rounded-full object-cover shrink-0 ${ring ? 'ring-2 ring-white shadow-[0_4px_14px_rgba(0,0,0,0.12)]' : 'border border-gray-100'}`}
        style={{ width: size, height: size }}
        onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/avatars/default.jpg'; }}
    />
);

const StancePill: React.FC<{ s: Stance; compact?: boolean }> = ({ s, compact }) => {
    const st = stanceStyle(s);
    return (
        <span
            className={`inline-flex items-center gap-1 rounded-full font-medium ${compact ? 'text-[10px] px-1.5 py-[1px]' : 'text-[11px] px-2 py-[2px]'}`}
            style={{ backgroundColor: st.bg, color: st.fg }}
        >
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: st.dot }} />
            {s}
        </span>
    );
};

interface Props {
    feedHeight?: number;
    className?: string;
}

type Phase = 'typing' | 'joining' | 'chatting' | 'consensus';

const ConsensusChat: React.FC<Props> = ({ feedHeight = 380, className = '' }) => {
    const rootRef = useRef<HTMLDivElement>(null);
    const feedRef = useRef<HTMLDivElement>(null);
    const [inView, setInView] = useState(false);
    const [run, setRun] = useState(0);

    const [typed, setTyped] = useState('');
    const [phase, setPhase] = useState<Phase>('typing');
    const [joinedCount, setJoinedCount] = useState(0);
    const [messages, setMessages] = useState<typeof DIALOG>([]);

    useEffect(() => {
        const el = rootRef.current;
        if (!el) return;
        const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold: 0.2 });
        io.observe(el);
        return () => io.disconnect();
    }, []);

    useEffect(() => {
        if (!inView) return;
        const QUESTION = "What's your take on NVIDIA?";
        setTyped(''); setPhase('typing'); setJoinedCount(0); setMessages([]);

        const timers: number[] = [];
        for (let i = 1; i <= QUESTION.length; i++) {
            timers.push(window.setTimeout(() => setTyped(QUESTION.slice(0, i)), 40 * i));
        }
        const typeDone = 40 * QUESTION.length + 350;
        timers.push(window.setTimeout(() => setPhase('joining'), typeDone));

        // Experts arrive one by one, large and centered
        const JOIN_STEP = 380;
        ROUNDTABLE.forEach((_, i) => {
            timers.push(window.setTimeout(() => setJoinedCount(i + 1), typeDone + 200 + i * JOIN_STEP));
        });

        const chatStart = typeDone + 200 + ROUNDTABLE.length * JOIN_STEP + 600;
        timers.push(window.setTimeout(() => setPhase('chatting'), chatStart));

        DIALOG.forEach((m, i) => {
            timers.push(window.setTimeout(() => setMessages(prev => [...prev, m]), chatStart + 250 + i * 1100));
        });

        const consensusAt = chatStart + 250 + DIALOG.length * 1100 + 400;
        timers.push(window.setTimeout(() => setPhase('consensus'), consensusAt));
        timers.push(window.setTimeout(() => setRun(r => r + 1), consensusAt + 5200));

        return () => { timers.forEach(clearTimeout); };
    }, [inView, run]);

    useEffect(() => {
        const el = feedRef.current;
        if (!el) return;
        el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
    }, [messages.length, phase]);

    const personaById = (id: string) => ROUNDTABLE.find(p => p.id === id)!;
    const tally = useMemo(() => {
        const t = { Bullish: 0, Bearish: 0, Neutral: 0 };
        ROUNDTABLE.forEach(p => { t[p.verdict]++; });
        return t;
    }, []);

    const showLineup = phase === 'joining';
    const showChat = phase === 'chatting' || phase === 'consensus';

    return (
        <div ref={rootRef} className={`w-full rounded-[24px] border bg-white relative overflow-hidden ${className}`} style={{ borderColor: 'rgba(0,0,0,0.07)', boxShadow: '0 1px 2px rgba(0,0,0,0.03), 0 24px 60px -28px rgba(0,0,0,0.15)' }}>
            {/* Header */}
            <div className="relative z-10 flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: 'rgba(0,0,0,0.05)' }}>
                <div className="flex items-center gap-2">
                    <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: '#10b981' }} />
                    <span className="text-[12px] font-medium text-gray-700">Roundtable · NVIDIA</span>
                </div>
                <span className="text-[11px] text-gray-400 tabular-nums">{joinedCount} of 14 joined</span>
            </div>

            {/* Question */}
            <div className="relative z-10 px-4 pt-4">
                <div className="flex items-start gap-2">
                    <span className="text-[11px] text-gray-400 mt-1.5">You</span>
                    <div className="px-3.5 py-2 rounded-2xl rounded-tl-sm bg-gray-900 text-white text-[13.5px] font-medium">
                        {typed || ' '}
                        {phase === 'typing' && <span className="inline-block w-[2px] h-[14px] ml-0.5 align-middle bg-white animate-pulse" />}
                    </div>
                </div>
            </div>

            {/* Stage area */}
            <div ref={feedRef} className="relative z-10 px-4 py-4 overflow-y-auto" style={{ height: feedHeight }}>
                {/* Lineup — experts entering, centered, large */}
                {showLineup && (
                    <div className="flex items-center justify-center min-h-full">
                        <div className="grid grid-cols-4 gap-x-4 gap-y-5 w-full max-w-[440px]">
                            {ROUNDTABLE.map((p, i) => {
                                const visible = i < joinedCount;
                                return (
                                    <div
                                        key={p.id}
                                        className="flex flex-col items-center text-center transition-all duration-500 ease-out"
                                        style={{
                                            opacity: visible ? 1 : 0,
                                            transform: visible ? 'translateY(0) scale(1)' : 'translateY(14px) scale(0.7)',
                                        }}
                                    >
                                        <Avatar p={p} size={64} ring />
                                        <div className="mt-2.5 text-[12px] font-medium text-gray-800 leading-tight">{p.name}</div>
                                    </div>
                                );
                            })}
                            {/* + more agents indicator */}
                            <div
                                className="flex flex-col items-center text-center transition-all duration-500 ease-out"
                                style={{
                                    opacity: joinedCount >= ROUNDTABLE.length ? 1 : 0,
                                    transform: joinedCount >= ROUNDTABLE.length ? 'translateY(0) scale(1)' : 'translateY(14px) scale(0.7)',
                                }}
                            >
                                <div className="w-16 h-16 rounded-full border-2 border-dashed flex items-center justify-center text-[13px] font-semibold text-gray-500" style={{ borderColor: 'rgba(0,0,0,0.15)' }}>
                                    +6
                                </div>
                                <div className="mt-2.5 text-[12px] font-medium text-gray-500 leading-tight">more agents</div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Top strip of avatars during chat */}
                {showChat && (
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center -space-x-2">
                            {ROUNDTABLE.map(p => <Avatar key={p.id} p={p} size={26} ring />)}
                        </div>
                        <span className="text-[11px] text-gray-400">debating…</span>
                    </div>
                )}

                {/* Chat */}
                {showChat && messages.map((m, i) => {
                    const p = personaById(m.id);
                    const left = m.side === 'L';
                    const st = stanceStyle(p.verdict);
                    return (
                        <div key={`msg-${i}`} className={`flex items-end gap-2 mb-3 ${left ? '' : 'flex-row-reverse'} animate-fadeIn`}>
                            <Avatar p={p} size={32} ring />
                            <div className="max-w-[82%] flex flex-col">
                                <div className={`flex items-center gap-1.5 mb-1 ${left ? '' : 'self-end flex-row-reverse'}`}>
                                    <span className="text-[11px] font-medium text-gray-700">{p.name}</span>
                                    <StancePill s={p.verdict} compact />
                                </div>
                                <div
                                    className={`px-3.5 py-2.5 text-[13px] leading-[1.5] ${left ? 'rounded-2xl rounded-bl-sm bg-gray-50 text-gray-800' : 'rounded-2xl rounded-br-sm text-gray-900'}`}
                                    style={!left ? { backgroundColor: st.bg } : undefined}
                                >
                                    {(() => {
                                        const limit = 72;
                                        const truncated = m.text.length > limit;
                                        const head = truncated ? m.text.slice(0, limit).replace(/[\s,.;:—-]+$/, '') + '…' : m.text;
                                        return (
                                            <>
                                                {head}
                                                {truncated && (
                                                    <button className="ml-1.5 text-[12px] font-medium underline decoration-dotted underline-offset-2 opacity-70 hover:opacity-100" style={{ color: left ? '#374151' : st.fg }}>
                                                        More
                                                    </button>
                                                )}
                                            </>
                                        );
                                    })()}
                                </div>
                            </div>
                        </div>
                    );
                })}

                {/* Consensus */}
                {phase === 'consensus' && (
                    <div className="pt-2 animate-fadeIn">
                        <div className="rounded-2xl border p-4" style={{ borderColor: 'rgba(0,0,0,0.08)', backgroundColor: '#FAFAF7' }}>
                            <div className="flex items-center justify-between mb-3">
                                <div className="text-[11px] font-medium text-gray-500">Consensus</div>
                                <div className="flex items-center -space-x-1.5">
                                    {ROUNDTABLE.map(p => <Avatar key={p.id} p={p} size={22} ring />)}
                                </div>
                            </div>
                            <div className="flex h-2 rounded-full overflow-hidden bg-gray-100 mb-3">
                                <div style={{ width: `${(11 / 14) * 100}%`, backgroundColor: '#10b981' }} />
                                <div style={{ width: `${(2 / 14) * 100}%`, backgroundColor: '#9ca3af' }} />
                                <div style={{ width: `${(1 / 14) * 100}%`, backgroundColor: '#ef4444' }} />
                            </div>
                            <div className="flex items-center justify-between text-[11.5px] font-medium">
                                <span style={{ color: '#047857' }}>11 Bullish</span>
                                <span className="text-gray-500">2 Neutral</span>
                                <span style={{ color: '#b91c1c' }}>1 Bearish</span>
                            </div>
                            <div className="mt-3 pt-3 border-t flex items-center justify-between" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
                                <div>
                                    <div className="text-[11px] font-medium text-gray-400 mb-0.5">Verdict</div>
                                    <div className="text-base font-semibold text-black tracking-tight">Bullish · NVIDIA</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-semibold tabular-nums" style={{ color: '#047857' }}>11 / 14</div>
                                    <div className="text-[11px] text-gray-500">agreement</div>
                                </div>
                            </div>
                        </div>

                        {/* Report affordance */}
                        <div className="mt-3 rounded-2xl border bg-white p-3.5 flex items-center justify-between gap-3 animate-fadeIn" style={{ borderColor: 'rgba(0,0,0,0.08)' }}>
                            <div className="flex items-center gap-3 min-w-0">
                                <div className="w-9 h-9 rounded-lg bg-[#F2F2EC] flex items-center justify-center shrink-0">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                        <path d="M14 2v6h6" />
                                        <path d="M8 13h8M8 17h6" />
                                    </svg>
                                </div>
                                <div className="min-w-0">
                                    <div className="text-[12.5px] font-medium text-[#111] truncate">NVIDIA consensus report</div>
                                    <div className="text-[11px] text-gray-500 truncate">14 analyst notes · charts · entry, sizing, stop · sources cited</div>
                                </div>
                            </div>
                            <button className="shrink-0 inline-flex items-center gap-1 h-8 px-3 rounded-full bg-[#111] text-white text-[11.5px] font-medium hover:bg-black transition-colors">
                                Open report →
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ConsensusChat;
