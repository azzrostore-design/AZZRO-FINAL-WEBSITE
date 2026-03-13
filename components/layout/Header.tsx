'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { Search, ShoppingBag, User, Heart, MapPin, Menu, Mic, Camera } from "lucide-react";
import { AZZRO_MEGA_MENU } from "@/lib/cms-data"

// ─── CONFIG ───────────────────────────────────────────────────────────────
const CONFIG = {
    language: 'en-IN',
    continuous: false,
    interimResults: true,
    contextTimeout: 60000,
    voiceSettings: { rate: 1.05, pitch: 1.25, volume: 1.0 },
};

const SHOPPING_KEYWORDS = {
    categories: ['saree', 'sari', 'kurta', 'kurti', 'lehenga', 'salwar', 'kameez', 'dupatta', 'blouse', 'dress', 'top', 'bottom', 'shirt', 'pant', 'jeans', 'skirt', 'jacket'],
    actions: ['show', 'find', 'search', 'display', 'get', 'browse', 'look', 'add', 'remove', 'delete', 'buy', 'purchase', 'cart', 'wishlist', 'want', 'need', 'looking'],
    colors: ['red', 'blue', 'green', 'yellow', 'black', 'white', 'pink', 'orange', 'purple', 'brown', 'gray', 'grey', 'golden', 'silver'],
    price: ['price', 'cost', 'rupees', 'rs', 'under', 'below', 'above', 'between', 'cheap', 'expensive', 'budget'],
    navigation: ['cart', 'checkout', 'orders', 'wishlist', 'account'],
    trending: ['new', 'latest', 'trending', 'popular', 'arrival'],
};

const NON_SHOPPING = [
    /what is|what's|who is|who's|when is|where is|why is|how is/i,
    /tell me about|explain|define/i,
    /weather|temperature/i,
    /calculate|math/i,
    /joke|funny|story/i,
];

function isShoppingCommand(cmd) {
    const lower = cmd.toLowerCase();
    const hasShopping = Object.values(SHOPPING_KEYWORDS).some(list => list.some(w => lower.includes(w)));
    return hasShopping && !NON_SHOPPING.some(p => p.test(lower));
}

function parseCommand(cmd) {
    const lower = cmd.toLowerCase();
    const parsed = { intent: null, category: null, color: null, priceMax: null, isComplete: false, missingInfo: [] };

    if (/show|find|search|display|browse|get|look|want|need|looking/i.test(lower)) parsed.intent = 'search';
    else if (/add.*cart|buy|purchase/i.test(lower)) { parsed.intent = 'add_cart'; parsed.isComplete = true; return parsed; }
    else if (/cart|bag/i.test(lower)) { parsed.intent = 'view_cart'; parsed.isComplete = true; return parsed; }
    else if (/checkout/i.test(lower)) { parsed.intent = 'checkout'; parsed.isComplete = true; return parsed; }
    else if (/new|latest|arrival/i.test(lower)) { parsed.intent = 'new_arrivals'; }
    else if (/trending|popular/i.test(lower)) { parsed.intent = 'trending'; }

    for (const cat of SHOPPING_KEYWORDS.categories) if (lower.includes(cat)) { parsed.category = cat; break; }
    for (const col of SHOPPING_KEYWORDS.colors) if (lower.includes(col)) { parsed.color = col; break; }

    const priceMatch = lower.match(/(?:under|below|less than)\s+(\d+)/i);
    if (priceMatch) parsed.priceMax = parseInt(priceMatch[1]);

    if (parsed.intent === 'search') {
        parsed.isComplete = !!parsed.category;
        if (!parsed.category) parsed.missingInfo.push('category');
    } else if (parsed.intent === 'new_arrivals' || parsed.intent === 'trending') {
        parsed.isComplete = true;
    }
    return parsed;
}

function buildSearchResponse(p) {
    let r = 'Here ';
    if (p.color && p.category) r += `are ${p.color} ${p.category}`;
    else if (p.category) r += `are our ${p.category}`;
    else if (p.color) r += `are ${p.color} products`;
    else r += 'are our products';
    if (p.priceMax) r += ` under ${p.priceMax} rupees`;
    return r + '!';
}

// ─── VOICE ASSISTANT MODAL ────────────────────────────────────────────────
function AzzroVoiceAssistant({ onClose }) {
    const router = useRouter();

    const [uiState, setUiState] = useState('idle');
    const [status, setStatus] = useState("Hi! I'm your shopping assistant. How can I help you today?");
    const [transcript, setTranscript] = useState('');
    const [response, setResponse] = useState({ text: '', type: '', visible: false });
    const [conversation, setConversation] = useState([]);
    const [transcriptActive, setTranscriptActive] = useState(false);
    const [commandPreview, setCommandPreview] = useState('');

    const exampleCommands = ["Show me sarees", "Go to cart", "Show me dresses under 2000", "Add this to cart", "Show trending"];

    // ── Refs ──
    const recognitionRef = useRef(null);
    const isSpeakingRef = useRef(false);  // ✅ AI is speaking — block mic completely
    const isClosedRef = useRef(false);  // ✅ Modal closed — stop everything
    const selectedVoice = useRef(null);
    const ctxRef = useRef({ waitingForInput: false, lastCommand: null, missingInfo: null, timestamp: null });

    // ── Rotating preview ──
    useEffect(() => {
        let i = 0;
        const iv = setInterval(() => {
            setCommandPreview(exampleCommands[i]);
            i = (i + 1) % exampleCommands.length;
        }, 1000);
        return () => clearInterval(iv);
    }, []);

    // ── Pick best voice ──
    useEffect(() => {
        const pick = () => {
            const voices = window.speechSynthesis.getVoices();
            if (!voices.length) return;
            const priorities = [
                v => v.name.includes('Zira') && v.lang.startsWith('en'),
                v => v.name.includes('Samantha'),
                v => (v.name.includes('Aria') || v.name.includes('Jenny')) && v.lang.startsWith('en'),
                v => v.name.includes('Google') && /female/i.test(v.name) && v.lang.startsWith('en'),
                v => (v.name.includes('Ava') || v.name.includes('Karen') || v.name.includes('Moira')) && v.lang.startsWith('en'),
                v => (v.name.includes('Heera') || v.name.includes('Veena')) && v.lang.includes('IN'),
                v => /female|woman/i.test(v.name) && v.lang.startsWith('en'),
                v => v.lang.startsWith('en-IN'),
                v => v.lang.startsWith('en'),
            ];
            for (const check of priorities) {
                const voice = voices.find(check);
                if (voice) { selectedVoice.current = voice; return; }
            }
        };
        const voices = window.speechSynthesis.getVoices();
        voices.length ? pick() : (window.speechSynthesis.onvoiceschanged = pick);
    }, []);

    // ── Stop everything ──
    // Called on close AND after valid command
    const stopAll = useCallback(() => {
        isClosedRef.current = true;
        // Stop recognition
        try { recognitionRef.current?.abort(); } catch (_) { }
        // Stop speech
        window.speechSynthesis.cancel();
        isSpeakingRef.current = false;
    }, []);

    // ── Create and start a FRESH recognition instance ──
    // A SpeechRecognition object cannot be restarted after abort() — we must
    // create a new one each time. This is the root cause of the "mic dies" bug.
    const startFreshMic = useCallback(() => {
        if (isClosedRef.current) return;
        if (isSpeakingRef.current) return;

        const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SR) return;

        // Discard old instance
        if (recognitionRef.current) {
            try { recognitionRef.current.onend = null; recognitionRef.current.abort(); } catch (_) { }
        }

        const r = new SR();
        r.lang = CONFIG.language;
        r.continuous = CONFIG.continuous;
        r.interimResults = CONFIG.interimResults;
        r.maxAlternatives = 1;
        recognitionRef.current = r;

        r.onstart = () => {
            if (isClosedRef.current) { try { r.abort(); } catch (_) { } return; }
            setUiState('listening');
            setStatus('Listening...');
        };

        r.onresult = (event) => {
            if (isClosedRef.current || isSpeakingRef.current) return;
            let interim = '', final = '';
            for (let i = event.resultIndex; i < event.results.length; i++) {
                const t = event.results[i][0].transcript;
                event.results[i].isFinal ? (final += t) : (interim += t);
            }
            if (interim) { setTranscript(interim); setTranscriptActive(true); }
            if (final) {
                setTranscript(final);
                setTranscriptActive(true);
                handleCommandRef.current(final.trim());
            }
        };

        r.onerror = (e) => {
            if (e.error === 'aborted') return;
            if (e.error === 'no-speech') {
                // Timed out with no input — restart mic so user can still speak
                setTimeout(() => startFreshMic(), 300);
                return;
            }
            const msgs = {
                'not-allowed': 'Microphone access denied. Please allow microphone.',
                'network': 'Network error. Please check your connection.',
                'audio-capture': 'No microphone found. Please connect a microphone.',
            };
            setStatus(msgs[e.error] || 'An error occurred.');
            showResp(msgs[e.error] || 'An error occurred.', 'error');
            setUiState('idle');
        };

        r.onend = () => {
            // Only restart if we ended without a final result and aren't speaking
            if (!isClosedRef.current && !isSpeakingRef.current) {
                setTimeout(() => startFreshMic(), 300);
            }
        };

        try { r.start(); } catch (_) { }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ── TTS — speak THEN optionally restart mic ──
    // restartMic = true  → invalid/incomplete command, keep listening after speaking
    // restartMic = false → valid command with navigation, stop after speaking
    const speak = useCallback((text, restartMic = false) => {
        if (isClosedRef.current) return;
        if (!('speechSynthesis' in window)) return;

        // Kill mic immediately so it cannot capture TTS audio
        isSpeakingRef.current = true;
        if (recognitionRef.current) {
            try { recognitionRef.current.onend = null; recognitionRef.current.abort(); } catch (_) { }
            recognitionRef.current = null;
        }
        window.speechSynthesis.cancel();

        const u = new SpeechSynthesisUtterance(text);
        if (selectedVoice.current) u.voice = selectedVoice.current;
        u.rate = CONFIG.voiceSettings.rate;
        u.pitch = CONFIG.voiceSettings.pitch;
        u.volume = CONFIG.voiceSettings.volume;
        u.lang = selectedVoice.current?.lang || 'en-US';

        u.onstart = () => {
            if (isClosedRef.current) { window.speechSynthesis.cancel(); return; }
            isSpeakingRef.current = true;
            setUiState('speaking');
            setStatus('Speaking...');
        };

        const afterSpeak = () => {
            isSpeakingRef.current = false;
            if (isClosedRef.current) return;

            if (restartMic) {
                setStatus("I'm listening... try again");
                setUiState('idle');
                // Wait for speaker echo to die before opening mic
                setTimeout(() => startFreshMic(), 700);
            } else {
                setUiState('idle');
                setStatus('Done!');
            }
        };

        u.onend = afterSpeak;
        u.onerror = afterSpeak;

        window.speechSynthesis.speak(u);
    }, [startFreshMic]);

    const showResp = useCallback((text, type) => {
        setResponse({ text, type, visible: true });
        setTimeout(() => setResponse(r => ({ ...r, visible: false })), 6000);
    }, []);

    const addMsg = useCallback((role, message) => {
        setConversation(prev => {
            const next = [...prev, { role, message, id: Date.now() }];
            return next.length > 10 ? next.slice(-10) : next;
        });
    }, []);

    // ── Execute VALID command ──
    const executeCommand = useCallback((parsed) => {
        let text = '', type = 'success';
        switch (parsed.intent) {
            case 'search':
                text = buildSearchResponse(parsed);
                router.push(`/products?q=${parsed.category || ''}&color=${parsed.color || ''}&maxPrice=${parsed.priceMax || ''}`);
                break;
            case 'add_cart':
                text = "Great! I've added that to your cart.";
                break;
            case 'view_cart':
                text = "Here's your shopping cart.";
                router.push('/cart');
                break;
            case 'checkout':
                text = "Taking you to checkout now.";
                router.push('/checkout');
                break;
            case 'new_arrivals':
                text = parsed.category ? `Here are our new ${parsed.category} arrivals!` : 'Here are our latest new arrivals!';
                break;
            case 'trending':
                text = parsed.category ? `Check out these trending ${parsed.category}!` : 'Here are our trending products!';
                break;
            default:
                text = "I can help you search for products. What would you like?";
                type = 'warning';
        }
        setTimeout(() => {
            addMsg('assistant', text);
            showResp(text, type);
            // ✅ Valid command — restartMic = false, stop after speaking
            speak(text, false);
            setUiState('success');
        }, 500);
    }, [addMsg, showResp, speak, router]);

    // ── Follow-up for incomplete commands ──
    const handleFollowUp = useCallback((resp) => {
        const ctx = ctxRef.current;
        if (Date.now() - ctx.timestamp > CONFIG.contextTimeout) {
            ctxRef.current.waitingForInput = false;
            const msg = 'Session timed out. Please start again.';
            showResp(msg, 'warning');
            speak(msg, false);
            setUiState('idle');
            return;
        }
        const last = ctx.lastCommand;
        if (ctx.missingInfo === 'category') {
            for (const cat of SHOPPING_KEYWORDS.categories) if (resp.includes(cat)) { last.category = cat; break; }
            if (!last.category) {
                const clarify = "I didn't catch that. Please say a product type like sarees, kurtas, or lehengas.";
                addMsg('assistant', clarify);
                showResp(clarify, 'question');
                // ✅ Still incomplete — restartMic = true
                speak(clarify, true);
                setUiState('idle');
                return;
            }
        }
        ctxRef.current = { waitingForInput: false, lastCommand: null, missingInfo: null, timestamp: null };
        last.isComplete = true;
        executeCommand(last);
    }, [addMsg, showResp, speak, executeCommand]);

    // ── Main command handler ──
    const handleCommandRef = useRef(null);
    const handleCommand = useCallback((command) => {
        if (isClosedRef.current) return;
        if (isSpeakingRef.current) return; // ✅ ignore if AI is speaking (its own voice)

        setUiState('processing');
        setStatus('Processing...');
        const lower = command.toLowerCase().trim();
        addMsg('user', command);

        if (ctxRef.current.waitingForInput) { handleFollowUp(lower); return; }

        if (!isShoppingCommand(command)) {
            // ✅ INVALID command — restartMic = true so user can try again
            const msg = "I'm your shopping assistant! I can help you find products, manage your cart, or checkout. What would you like to shop for?";
            setTimeout(() => {
                addMsg('assistant', msg);
                showResp(msg, 'warning');
                speak(msg, true); // ← true = restart mic after speaking
                setUiState('idle');
            }, 500);
            return;
        }

        const parsed = parseCommand(lower);
        if (parsed.isComplete) {
            executeCommand(parsed);
        } else {
            ctxRef.current = { waitingForInput: true, lastCommand: parsed, missingInfo: parsed.missingInfo[0], timestamp: Date.now() };
            const q = "What type of product are you looking for? For example, sarees, kurtas, or lehengas?";
            setTimeout(() => {
                addMsg('assistant', q);
                showResp(q, 'question');
                // ✅ Incomplete command — restartMic = true
                speak(q, true);
                setUiState('idle');
            }, 500);
        }
    }, [addMsg, handleFollowUp, showResp, speak, executeCommand]);

    // keep ref updated
    useEffect(() => { handleCommandRef.current = handleCommand; }, [handleCommand]);

    // ── Start mic on mount, clean up on unmount ──
    useEffect(() => {
        const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SR) { setStatus('Voice not supported. Please use Chrome.'); return; }

        isClosedRef.current = false;
        isSpeakingRef.current = false;

        navigator.mediaDevices?.getUserMedia({ audio: true })
            .then(() => { setTimeout(() => startFreshMic(), 400); })
            .catch(() => {
                setStatus('Microphone access denied. Please allow microphone.');
                showResp('Microphone access denied.', 'error');
            });

        return () => {
            isClosedRef.current = true;
            if (recognitionRef.current) {
                try { recognitionRef.current.onend = null; recognitionRef.current.abort(); } catch (_) { }
            }
            window.speechSynthesis.cancel();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ── Close handler ──
    const handleClose = useCallback(() => {
        stopAll(); // ✅ stop voice + recognition first
        onClose();
    }, [stopAll, onClose]);

    // ── Escape key ──
    useEffect(() => {
        const handler = (e) => { if (e.key === 'Escape') handleClose(); };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, [handleClose]);

    const isSpeakingUI = uiState === 'speaking';
    const isListeningUI = uiState === 'listening';

    const micBg = isListeningUI ? 'linear-gradient(135deg,#f093fb,#f5576c)'
        : isSpeakingUI ? 'linear-gradient(135deg,#fa709a,#f093fb)'
            : 'linear-gradient(135deg,#667eea,#764ba2)';

    const respColors = {
        success: { bg: 'linear-gradient(135deg,#e8f5e9,#c8e6c9)', color: '#2e7d32', border: '#43e97b' },
        error: { bg: 'linear-gradient(135deg,#ffebee,#ffcdd2)', color: '#c62828', border: '#f5576c' },
        warning: { bg: 'linear-gradient(135deg,#fff3e0,#ffe0b2)', color: '#e65100', border: '#ff9800' },
        question: { bg: 'linear-gradient(135deg,#e3f2fd,#bbdefb)', color: '#1565c0', border: '#667eea' },
    };
    const rc = respColors[response.type] || {};

    return (
        <>
            <style>{`
                @keyframes azzro-pulse { 0%{box-shadow:0 0 0 0 rgba(245,87,108,.7)} 100%{box-shadow:0 0 0 16px rgba(245,87,108,0)} }
                @keyframes azzro-speak { 0%,100%{transform:scale(1)} 50%{transform:scale(1.06)} }
                @keyframes azzro-wave  { 0%,100%{height:20px} 50%{height:35px} }
            `}</style>

            <div
                onClick={(e) => e.target === e.currentTarget && handleClose()}
                style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99999 }}
            >
                <div style={{ background: 'white', borderRadius: 24, padding: 40, maxWidth: 550, width: '90%', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.3)', position: 'relative' }}>

                    {/* Close button */}
                    <button
                        onClick={handleClose}
                        style={{ position: 'absolute', top: 16, right: 16, width: 32, height: 32, borderRadius: '50%', border: 'none', background: '#f0f0f0', cursor: 'pointer', fontSize: 16, color: '#666', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >✕</button>

                    {/* Mic visual */}
                    <div style={{ width: 120, height: 120, margin: '0 auto 24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: micBg, animation: isListeningUI ? 'azzro-pulse 1.5s ease-out infinite' : isSpeakingUI ? 'azzro-speak 0.6s ease-in-out infinite' : 'none' }}>
                        <svg width={48} height={48} viewBox="0 0 24 24">
                            <path fill="white" d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                            <path fill="white" d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
                        </svg>
                    </div>

                    {/* Speaking wave bars */}
                    {isSpeakingUI && (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, marginBottom: 20 }}>
                            {[0, 0.1, 0.2, 0.3, 0.4].map((d, i) => (
                                <div key={i} style={{ width: 4, height: 20, background: '#f5576c', borderRadius: 2, animation: `azzro-wave 0.6s ease-in-out ${d}s infinite` }} />
                            ))}
                        </div>
                    )}

                    {/* Status */}
                    <div style={{ textAlign: 'center', fontSize: 18, marginBottom: 20, minHeight: 30, color: isListeningUI ? '#f5576c' : isSpeakingUI ? '#fa709a' : '#666', fontWeight: (isListeningUI || isSpeakingUI) ? 600 : 400 }}>
                        {status}
                    </div>

                    {/* Conversation history */}
                    {conversation.length > 0 && (
                        <div style={{ maxHeight: 200, overflowY: 'auto', marginBottom: 16, padding: 12, background: '#f8f9fa', borderRadius: 12 }}>
                            {conversation.map(msg => (
                                <div key={msg.id} style={{ padding: '8px 12px', marginBottom: 8, borderRadius: 8, fontSize: 14, ...(msg.role === 'user' ? { background: '#667eea', color: 'white', marginLeft: 20, textAlign: 'right' } : { background: 'white', color: '#333', marginRight: 20, border: '1px solid #e0e0e0' }) }}>
                                    {msg.message}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Transcript / preview */}
                    <div style={{ background: '#f8f9fa', borderRadius: 12, padding: 16, marginBottom: 16, minHeight: 60, fontSize: 16, color: '#333', border: `2px solid ${transcriptActive ? '#667eea' : '#e0e0e0'}` }}>
                        {transcriptActive ? transcript : commandPreview}
                    </div>

                    {/* Response bubble */}
                    {response.visible && (
                        <div style={{ borderRadius: 12, padding: 16, marginBottom: 16, fontSize: 16, borderLeft: `4px solid ${rc.border}`, background: rc.bg, color: rc.color }}>
                            {response.text}
                        </div>
                    )}

                </div>
            </div>
        </>
    );
}

// ─── MAIN HEADER ──────────────────────────────────────────────────────────
export function Header() {
    const [voiceOpen, setVoiceOpen] = useState(false);
    const menus = Object.keys(AZZRO_MEGA_MENU)

    return (
        <>
            {/* Top Bar */}
            <div className="bg-gray-100 dark:bg-zinc-900 overflow-hidden h-9 flex items-center justify-between px-4 text-[11px] sm:text-xs tracking-wide z-50 relative">
                <div className="flex items-center gap-1 text-gray-500">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Delivering to <span className="font-semibold text-black dark:text-white">Bengaluru, 560001</span></span>
                </div>
                <div className="flex items-center gap-4">
                    <span className="hidden sm:inline-block text-gray-600 font-medium">Flat ₹400 Off on First Order | Code: <span className="text-primary font-bold">AZZRONEW</span></span>
                    <div className="flex gap-3 text-gray-500 sm:border-l sm:border-gray-300 sm:pl-3">
                        <Link href="/sell" className="hover:text-primary transition-colors font-semibold">Sell on AZZRO</Link>
                        <Link href="/track-order" className="hover:text-primary transition-colors">Track Order</Link>
                        <Link href="/contact" className="hover:text-primary transition-colors hidden sm:inline-block">Contact Us</Link>
                    </div>
                </div>
            </div>

            {/* Main Header */}
            <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md dark:bg-black/80 border-b border-gray-100 dark:border-white/10 transition-all shadow-sm">
                <div className="container mx-auto px-4 flex flex-col md:flex-row items-center md:h-20 py-3 md:py-0 gap-4 md:gap-8">

                    <div className="flex w-full md:w-auto items-center justify-between">
                        <div className="flex items-center gap-3">
                            <button className="md:hidden p-2 -ml-2 text-gray-700"><Menu className="w-6 h-6" /></button>
                            <Link href="/" className="flex-shrink-0">
                                <h1 className="text-2xl md:text-3xl font-extrabold tracking-tighter text-primary">AZZRO</h1>
                            </Link>
                        </div>
                        <div className="flex md:hidden items-center gap-4">
                            <Link href="/profile" className="text-gray-700"><User className="w-6 h-6" /></Link>
                            <Link href="/wishlist" className="text-gray-700"><Heart className="w-6 h-6" /></Link>
                            <Link href="/cart" className="relative text-gray-700">
                                <ShoppingBag className="w-6 h-6" />
                                <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent text-white text-[10px] flex items-center justify-center rounded-full font-bold">2</span>
                            </Link>
                        </div>
                    </div>

                    {/* Desktop Mega Menu */}
                    <nav className="hidden md:flex items-center gap-8 font-bold text-xs lg:text-sm text-gray-700 h-full uppercase tracking-wider">

                        {menus.map((menu) => {

                            const sections = AZZRO_MEGA_MENU[menu as keyof typeof AZZRO_MEGA_MENU]

                            return (

                                <div key={menu} className="group h-full flex items-center relative cursor-pointer border-b-4 border-transparent hover:border-accent hover:text-black transition-all">

                                    <Link href={`/category/${menu.toLowerCase().replaceAll(" ", "-")}`} className="py-7">
                                        {menu}
                                    </Link>

                                    <div className="opacity-0 invisible group-hover:opacity-100 group-hover:visible absolute top-full left-0 w-[700px] -translate-x-10 bg-white shadow-xl border border-gray-100 p-8 z-50 transition-all duration-200 ease-in-out hidden group-hover:block rounded-b-xl">

                                        <div className="grid grid-cols-3 gap-8 text-xs text-gray-500 normal-case">

                                            {Object.entries(sections).map(([section, items]: [string, string[]]) => (

                                                <div key={section}>

                                                    <h4 className="font-bold text-accent mb-3 uppercase tracking-widest text-[10px]">
                                                        {section}
                                                    </h4>

                                                    <ul className="space-y-2.5">

                                                        {items.map((item) => (
                                                            <li key={item} className="hover:text-black cursor-pointer">

                                                                <Link href={`/category/${item.toLowerCase().replaceAll(" ", "-")}`}>
                                                                    {item}
                                                                </Link>

                                                            </li>
                                                        ))}

                                                    </ul>

                                                </div>

                                            ))}

                                        </div>

                                    </div>

                                </div>

                            )

                        })}

                    </nav>

                    {/* Search Bar */}
                    <div className="flex w-full md:flex-1 md:max-w-xl relative group order-last md:order-none">
                        <div className="relative w-full">
                            <div className="flex items-center gap-3 bg-white dark:bg-black rounded-full shadow-sm border border-gray-200 dark:border-white/10 px-4 h-12 md:h-12">
                                <Search className="w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search for products, brands and more"
                                    className="flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400"
                                />
                                <div className="flex items-center gap-2">
                                    <button
                                        aria-label="Voice search"
                                        onClick={() => setVoiceOpen(true)}
                                        className="inline-flex items-center p-1 rounded-full hover:bg-gray-100 transition-colors"
                                    >
                                        <Mic className="w-5 h-5 text-gray-600 hover:text-black" />
                                    </button>
                                    <button aria-label="Visual search" className="inline-flex items-center p-1 rounded-full hover:bg-gray-100 transition-colors">
                                        <Camera className="w-5 h-5 text-gray-600 hover:text-black" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Desktop Right Icons */}
                    <div className="hidden md:flex items-center gap-4 md:gap-6 ml-auto">
                        <button className="flex flex-col items-center gap-0.5 group">
                            <Heart className="w-5 h-5 text-gray-700 group-hover:text-black transition-colors" />
                            <span className="text-[10px] font-bold text-gray-700 group-hover:text-black">Wishlist</span>
                        </button>
                        <Link href="/cart" className="flex flex-col items-center gap-0.5 group relative">
                            <ShoppingBag className="w-5 h-5 text-gray-700 group-hover:text-black transition-colors" />
                            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-accent text-white text-[10px] flex items-center justify-center rounded-full font-bold shadow-sm">2</span>
                            <span className="text-[10px] font-bold text-gray-700 group-hover:text-black">Bag</span>
                        </Link>
                        <button className="flex flex-col items-center gap-0.5 group pl-4 border-l border-gray-200">
                            <User className="w-5 h-5 text-gray-700 group-hover:text-black transition-colors" />
                            <span className="text-[10px] font-bold text-gray-700 group-hover:text-black">Profile</span>
                        </button>
                    </div>

                </div>
            </header >

            {voiceOpen && <AzzroVoiceAssistant onClose={() => setVoiceOpen(false)} />
            }
        </>
    );
}
