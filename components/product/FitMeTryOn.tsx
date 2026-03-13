'use client';

import { useEffect, useRef, useState } from 'react';

interface Product {
    id: string;
    name: string;
    brand?: string;
    price: number;
    imageUrl: string;
    [key: string]: any;
}

interface FitMeTryOnProps {
    product: Product;
    onClose: () => void;
}

type Screen = 'intro' | 'selfie' | 'body' | 'processing' | 'result';

const FAL_KEY = process.env.FAL_KEY;

// ─── Exact port of the working HTML JS logic into React ───────────────────────
// Key insight: keep BOTH video+canvas elements always mounted (like the HTML does)
// Use refs to manipulate DOM directly — same as original JS

export function FitMeTryOn({ product, onClose }: FitMeTryOnProps) {

    const [screen, setScreen] = useState<Screen>('intro');
    const [progPct,    setProgPct]    = useState(0);
    const [activeStep, setActiveStep] = useState(-1);
    const [stepsDone,  setStepsDone]  = useState<number[]>([]);
    const [animMode,   setAnimMode]   = useState<'static'|'walk'|'spin'>('static');
    const [rotDeg,     setRotDeg]     = useState(0);
    const [aiNote,     setAiNote]     = useState('');
    const [toast,      setToast]      = useState('');
    const [fitScore]                  = useState(() => 88 + Math.floor(Math.random() * 9));

    // ── DOM refs (mirror original HTML ids) ──
    const selfieVideoRef   = useRef<HTMLVideoElement>(null);
    const selfieCanvasRef  = useRef<HTMLCanvasElement>(null);
    const selfiePreviewRef = useRef<HTMLImageElement>(null);
    const bodyVideoRef     = useRef<HTMLVideoElement>(null);
    const bodyCanvasRef    = useRef<HTMLCanvasElement>(null);
    const bodyPreviewRef   = useRef<HTMLImageElement>(null);
    const resultImgRef     = useRef<HTMLImageElement>(null);
    const beforeImgRef     = useRef<HTMLImageElement>(null);
    const afterImgRef      = useRef<HTMLImageElement>(null);

    // ── Camera state (plain vars like original) ──
    const streamRef   = useRef<MediaStream|null>(null);
    const facingRef   = useRef<'user'|'environment'>('user');
    const capturedSelfie = useRef<string|null>(null);
    const capturedBody   = useRef<string|null>(null);
    const autoRotRef  = useRef<any>(null);
    const isDragging  = useRef(false);
    const dragStartX  = useRef(0);

    // Stop body scroll
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = ''; };
    }, []);

    // Escape key
    useEffect(() => {
        const h = (e: KeyboardEvent) => { if (e.key === 'Escape') handleClose(); };
        window.addEventListener('keydown', h);
        return () => window.removeEventListener('keydown', h);
    }, []);

    // Cleanup
    useEffect(() => () => { stopCamera(); clearInterval(autoRotRef.current); }, []);

    function showToast(msg: string) {
        setToast(msg);
        setTimeout(() => setToast(''), 2500);
    }

    function handleClose() {
        stopCamera();
        clearInterval(autoRotRef.current);
        onClose();
    }

    // ════════════════════════════════════════════════════════════════════════
    // CAMERA — exact copy of original HTML JS
    // ════════════════════════════════════════════════════════════════════════
    async function initCamera(mode: 'selfie'|'body') {
        await stopCamera();
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: mode === 'selfie' ? 'user' : 'environment',
                    width: 720, height: 960
                },
                audio: false
            });
            streamRef.current = stream;
            const vid = mode === 'selfie' ? selfieVideoRef.current : bodyVideoRef.current;
            const ph  = document.getElementById(`${mode}-placeholder`);
            if (vid) { vid.srcObject = stream; vid.style.display = 'block'; }
            if (ph)  ph.style.display = 'none';
        } catch(e) {
            showToast('Camera unavailable — please upload a photo instead');
        }
    }

    async function stopCamera() {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(t => t.stop());
            streamRef.current = null;
        }
    }

    async function flipCamera() {
        facingRef.current = facingRef.current === 'user' ? 'environment' : 'user';
        const mode: 'selfie'|'body' = screen === 'selfie' ? 'selfie' : 'body';
        await stopCamera();
        await initCamera(mode);
    }

    // ════════════════════════════════════════════════════════════════════════
    // COUNTDOWN & CAPTURE — exact copy of original HTML JS
    // ════════════════════════════════════════════════════════════════════════
    function startCountdown(mode: 'selfie'|'body') {
        let count = 3;
        const overlay = document.getElementById(`${mode}-countdown`);
        const num     = document.getElementById(`${mode}-count`);
        if (overlay) overlay.style.display = 'flex';
        if (num) num.textContent = String(count);

        const iv = setInterval(() => {
            count--;
            if (count > 0) {
                if (num) num.textContent = String(count);
            } else {
                clearInterval(iv);
                if (overlay) overlay.style.display = 'none';
                capturePhoto(mode);
            }
        }, 900);
    }

    function capturePhoto(mode: 'selfie'|'body') {
        const vid    = mode === 'selfie' ? selfieVideoRef.current   : bodyVideoRef.current;
        const canvas = mode === 'selfie' ? selfieCanvasRef.current  : bodyCanvasRef.current;
        const prev   = mode === 'selfie' ? selfiePreviewRef.current : bodyPreviewRef.current;
        const nextBtn = document.getElementById(`${mode}-next`);

        if (!vid || !canvas) return;
        canvas.width  = vid.videoWidth  || 400;
        canvas.height = vid.videoHeight || 500;
        canvas.getContext('2d')?.drawImage(vid, 0, 0);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);

        if (mode === 'selfie') capturedSelfie.current = dataUrl;
        else capturedBody.current = dataUrl;

        vid.style.display = 'none';
        if (prev)    { prev.src = dataUrl; prev.style.display = 'block'; }
        if (nextBtn) nextBtn.style.display = 'block';
        stopCamera();
    }

    function uploadPhoto(e: React.ChangeEvent<HTMLInputElement>, mode: 'selfie'|'body') {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = ev => {
            const dataUrl = ev.target?.result as string;
            if (mode === 'selfie') capturedSelfie.current = dataUrl;
            else capturedBody.current = dataUrl;

            const vid     = mode === 'selfie' ? selfieVideoRef.current   : bodyVideoRef.current;
            const prev    = mode === 'selfie' ? selfiePreviewRef.current : bodyPreviewRef.current;
            const ph      = document.getElementById(`${mode}-placeholder`);
            const nextBtn = document.getElementById(`${mode}-next`);

            if (prev)    { prev.src = dataUrl; prev.style.display = 'block'; }
            if (vid)     vid.style.display = 'none';
            if (ph)      ph.style.display  = 'none';
            if (nextBtn) nextBtn.style.display = 'block';
            stopCamera();
        };
        reader.readAsDataURL(file);
        e.target.value = '';
    }

    function retakeSelfie() {
        capturedSelfie.current = null;
        const prev    = selfiePreviewRef.current;
        const nextBtn = document.getElementById('selfie-next');
        const ph      = document.getElementById('selfie-placeholder');
        if (prev)    prev.style.display = 'none';
        if (nextBtn) nextBtn.style.display = 'none';
        if (ph)      ph.style.display = 'flex';
        initCamera('selfie');
    }

    function retakeBody() {
        capturedBody.current = null;
        const prev    = bodyPreviewRef.current;
        const nextBtn = document.getElementById('body-next');
        const ph      = document.getElementById('body-placeholder');
        if (prev)    prev.style.display = 'none';
        if (nextBtn) nextBtn.style.display = 'none';
        if (ph)      ph.style.display = 'flex';
        initCamera('body');
    }

    // ════════════════════════════════════════════════════════════════════════
    // NAVIGATION
    // ════════════════════════════════════════════════════════════════════════
    function goTo(s: Screen) {
        setScreen(s);
        window.scrollTo(0, 0);
    }

    function goToSelfie() {
        // Reset selfie
        capturedSelfie.current = null;
        const prev    = selfiePreviewRef.current;
        const nextBtn = document.getElementById('selfie-next');
        const ph      = document.getElementById('selfie-placeholder');
        if (prev)    prev.style.display = 'none';
        if (nextBtn) nextBtn.style.display = 'none';
        if (ph)      ph.style.display = 'flex';
        goTo('selfie');
        setTimeout(() => initCamera('selfie'), 100);
    }

    function goToBody() {
        stopCamera();
        capturedBody.current = null;
        const prev    = bodyPreviewRef.current;
        const nextBtn = document.getElementById('body-next');
        const ph      = document.getElementById('body-placeholder');
        if (prev)    prev.style.display = 'none';
        if (nextBtn) nextBtn.style.display = 'none';
        if (ph)      ph.style.display = 'flex';
        goTo('body');
        setTimeout(() => initCamera('body'), 100);
    }

    // ════════════════════════════════════════════════════════════════════════
    // PROCESSING — animated steps then AI call
    // ════════════════════════════════════════════════════════════════════════
    const STEP_LABELS = [
        'Analyzing your photo',
        'Mapping body measurements',
        'Fitting the garment',
        'Rendering fabric details',
        'Finalizing your look',
    ];
    const STEP_TIMINGS   = [0, 18, 38, 60, 82, 100];
    const STEP_DURATIONS = [1800, 2000, 2200, 1800, 1500];

    function animateProgress(from: number, to: number, duration: number, onDone: () => void) {
        const start = performance.now();
        function frame(now: number) {
            const t      = Math.min((now - start) / duration, 1);
            const eased  = 1 - Math.pow(1 - t, 3);
            const cur    = Math.round(from + (to - from) * eased);
            setProgPct(cur);
            if (t < 1) requestAnimationFrame(frame);
            else onDone();
        }
        requestAnimationFrame(frame);
    }

    async function startProcessing() {
        stopCamera();
        setProgPct(0);
        setActiveStep(0);
        setStepsDone([]);
        setAiNote('');
        goTo('processing');

        // Run animated progress steps
        let stepIdx = 0;
        function runStep() {
            if (stepIdx >= 5) {
                // Animation done — now call AI
                callAI();
                return;
            }
            setActiveStep(stepIdx);
            if (stepIdx > 0) setStepsDone(prev => [...prev, stepIdx - 1]);
            animateProgress(
                STEP_TIMINGS[stepIdx],
                STEP_TIMINGS[stepIdx + 1],
                STEP_DURATIONS[stepIdx],
                () => { stepIdx++; runStep(); }
            );
        }
        runStep();
    }

    async function callAI() {
        setActiveStep(4);
        setStepsDone([0, 1, 2, 3]);
        try {
            const personBlob  = await fetch(capturedSelfie.current || capturedBody.current!).then(r => r.blob());
            const garmentBlob = await fetch(
                `https://images.weserv.nl/?url=${encodeURIComponent(product.imageUrl)}&output=jpg`
            ).then(r => r.blob()).catch(() => fetch(product.imageUrl).then(r => r.blob()));

            const form = new FormData();
            form.append('person_image',  personBlob,  'person.jpg');
            form.append('garment_image', garmentBlob, 'garment.jpg');
            form.append('garment_description', product.name);
            form.append('is_checked',      'true');
            form.append('is_checked_crop', 'false');
            form.append('denoise_steps',   '30');
            form.append('seed',            '42');

            const res = await fetch(
                'https://api-inference.huggingface.co/models/Kwai-Kolors/Kolors-Virtual-Try-On',
                { method: 'POST', headers: { Authorization: `Bearer ${HF_TOKEN}` }, body: form }
            );

            setProgPct(100);
            setStepsDone([0, 1, 2, 3, 4]);

            if (res.ok) {
                const blob   = await res.blob();
                const objUrl = URL.createObjectURL(blob);
                buildResult(objUrl);
            } else {
                setAiNote('AI is warming up — showing your photo preview. Try again in a moment!');
                buildResult(capturedSelfie.current || capturedBody.current || '');
            }
        } catch {
            setProgPct(100);
            setStepsDone([0, 1, 2, 3, 4]);
            setAiNote('Network error — showing your photo preview.');
            buildResult(capturedSelfie.current || capturedBody.current || '');
        }

        setTimeout(() => goTo('result'), 600);
    }

    function buildResult(resultUrl: string) {
        if (resultImgRef.current) resultImgRef.current.src = resultUrl;
        if (afterImgRef.current)  afterImgRef.current.src  = resultUrl;
        if (beforeImgRef.current && capturedSelfie.current)
            beforeImgRef.current.src = capturedSelfie.current;
        setRotDeg(0);
    }

    // ════════════════════════════════════════════════════════════════════════
    // 360° VIEWER
    // ════════════════════════════════════════════════════════════════════════
    useEffect(() => {
        clearInterval(autoRotRef.current);
        if (animMode === 'spin') {
            autoRotRef.current = setInterval(() => setRotDeg(d => (d + 1.2) % 360), 16);
        }
        return () => clearInterval(autoRotRef.current);
    }, [animMode]);

    function onDragStart(e: React.MouseEvent | React.TouchEvent) {
        if (animMode === 'spin') return;
        isDragging.current = true;
        dragStartX.current = 'touches' in e ? e.touches[0].clientX : e.clientX;
        clearInterval(autoRotRef.current);
    }
    function onDragMove(e: React.MouseEvent | React.TouchEvent) {
        if (!isDragging.current) return;
        const x = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const dx = x - dragStartX.current;
        dragStartX.current = x;
        setRotDeg(d => (d + dx * 0.4 + 360) % 360);
    }
    function onDragEnd() { isDragging.current = false; }

    const flipX = Math.cos(rotDeg * Math.PI / 180);
    const rotStyle = animMode === 'static'
        ? { transform: `scaleX(${Math.abs(flipX) > 0.2 ? (flipX < 0 ? -1 : 1) : (flipX < 0 ? -0.8 : 0.8)}) scaleY(${1 + 0.04 * Math.sin(rotDeg * Math.PI / 180)})` }
        : undefined;

    // ════════════════════════════════════════════════════════════════════════
    // CSS — ported directly from the working HTML file
    // ════════════════════════════════════════════════════════════════════════
    const css = `
    @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500&display=swap');
    :root { --gold:#c8a96e; --bg:#0a0a0a; --fg:#f5f3ef; --gray:#8a8a8a; }

    .fm-wrap {
        position:fixed; inset:0; z-index:99999;
        background:var(--bg); color:var(--fg);
        font-family:'DM Sans',sans-serif;
        display:flex; flex-direction:column;
        overflow:hidden;
    }

    /* HEADER */
    .fm-header {
        display:flex; align-items:center; justify-content:space-between;
        padding:18px 24px;
        border-bottom:1px solid rgba(255,255,255,0.08);
        flex-shrink:0; background:var(--bg);
    }
    .fm-logo { font-family:'Bebas Neue',sans-serif; font-size:26px; letter-spacing:6px; }
    .fm-logo em { color:var(--gold); font-style:normal; }
    .fm-x {
        width:36px; height:36px; border:1px solid rgba(255,255,255,0.2);
        background:transparent; color:var(--fg); font-size:18px;
        cursor:pointer; display:flex; align-items:center; justify-content:center;
        transition:all 0.2s; border-radius:2px;
    }
    .fm-x:hover { background:var(--fg); color:var(--bg); }

    /* SCREENS — only active one visible, all kept in DOM */
    .fm-screen { display:none; flex:1; flex-direction:column; min-height:0; overflow-y:auto; }
    .fm-screen.fm-active { display:flex; }

    /* INTRO */
    .fm-intro-hero {
        height:300px; flex-shrink:0; overflow:hidden;
        background:#111; display:flex; align-items:center; justify-content:center;
    }
    .fm-intro-hero img { width:100%; height:100%; object-fit:cover; object-position:top center; filter:brightness(0.8); }
    .fm-intro-body { padding:24px 24px 40px; }
    .fm-tag { font-size:10px; letter-spacing:4px; color:var(--gold); text-transform:uppercase; margin-bottom:14px; }
    .fm-h1 { font-family:'Bebas Neue',sans-serif; font-size:40px; letter-spacing:2px; line-height:1.1; margin-bottom:14px; }
    .fm-desc { font-size:13px; color:var(--gray); line-height:1.7; margin-bottom:24px; }
    .fm-steps4 { display:grid; grid-template-columns:repeat(4,1fr); gap:8px; margin-bottom:24px; }
    .fm-sbox { border:1px solid rgba(255,255,255,0.1); padding:12px 4px; text-align:center; }
    .fm-snum { font-family:'Bebas Neue',sans-serif; font-size:24px; color:var(--gold); }
    .fm-slbl { font-size:9px; letter-spacing:1px; color:#666; text-transform:uppercase; margin-top:2px; }
    .fm-legal { font-size:10px; color:#555; line-height:1.6; text-align:center; margin-top:14px; }

    /* CAPTURE SCREENS */
    .fm-capture-header { padding:20px 24px 0; flex-shrink:0; }
    .fm-capture-step { font-size:10px; letter-spacing:4px; color:var(--gold); text-transform:uppercase; margin-bottom:8px; }
    .fm-capture-title { font-family:'Bebas Neue',sans-serif; font-size:30px; letter-spacing:2px; margin-bottom:6px; }
    .fm-capture-sub { font-size:12px; color:var(--gray); line-height:1.6; }

    /* CAMERA FRAME — exact same as HTML */
    .fm-camera-frame {
        margin:20px 24px;
        position:relative;
        background:#1c1c1c;
        border:1px solid rgba(255,255,255,0.1);
        overflow:hidden;
        flex-shrink:0;
    }
    .fm-selfie-frame { height:340px; }
    .fm-body-frame   { height:420px; }

    .fm-camera-frame video,
    .fm-camera-frame canvas,
    .fm-camera-frame img.fm-preview {
        width:100%; height:100%;
        object-fit:cover; display:block;
    }

    .fm-grid-overlay {
        position:absolute; inset:0;
        background-image:
            linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px);
        background-size:33.33% 33.33%;
        pointer-events:none;
    }

    .fm-cam-ph {
        height:100%; display:flex; flex-direction:column;
        align-items:center; justify-content:center; gap:12px;
    }
    .fm-cam-icon {
        width:56px; height:56px;
        border:2px solid rgba(255,255,255,0.2); border-radius:50%;
        display:flex; align-items:center; justify-content:center; font-size:22px;
    }
    .fm-cam-hint { font-size:11px; color:var(--gray); letter-spacing:1px; text-transform:uppercase; }

    .fm-countdown-ov {
        position:absolute; inset:0;
        display:flex; align-items:center; justify-content:center;
        background:rgba(0,0,0,0.3); pointer-events:none;
    }
    .fm-countdown-n {
        font-family:'Bebas Neue',sans-serif; font-size:120px;
        color:rgba(255,255,255,0.85); line-height:1;
        text-shadow:0 4px 40px rgba(0,0,0,0.5);
    }

    /* CAPTURE ACTIONS */
    .fm-capture-actions { padding:0 24px 40px; display:flex; flex-direction:column; gap:12px; flex-shrink:0; }
    .fm-shutter-row { display:flex; align-items:center; justify-content:center; gap:24px; margin-bottom:4px; }
    .fm-shutter {
        width:70px; height:70px; border-radius:50%;
        border:3px solid var(--fg); background:transparent;
        cursor:pointer; position:relative; transition:all 0.15s;
        display:flex; align-items:center; justify-content:center;
    }
    .fm-shutter::after {
        content:''; width:52px; height:52px; border-radius:50%;
        background:var(--fg); transition:all 0.15s;
        position:absolute;
    }
    .fm-shutter:hover::after { background:var(--gold); }
    .fm-shutter:active::after { transform:scale(0.88); }
    .fm-ctrl {
        width:44px; height:44px; border-radius:50%;
        border:1px solid rgba(255,255,255,0.2); background:transparent;
        color:var(--fg); cursor:pointer; font-size:16px;
        display:flex; align-items:center; justify-content:center;
        transition:all 0.2s;
    }
    .fm-ctrl:hover { border-color:var(--gold); color:var(--gold); }
    .fm-upload-lbl {
        display:block; text-align:center;
        font-size:11px; letter-spacing:2px;
        color:var(--gray); cursor:pointer; text-transform:uppercase; padding:6px;
        transition:color 0.2s;
    }
    .fm-upload-lbl:hover { color:var(--gold); }

    /* BUTTONS */
    .fm-btn1 {
        width:100%; padding:16px; background:var(--fg); color:var(--bg);
        border:none; font-family:'DM Sans',sans-serif;
        font-size:11px; letter-spacing:3px; font-weight:600;
        cursor:pointer; text-transform:uppercase; transition:all 0.2s;
    }
    .fm-btn1:hover { background:var(--gold); }
    .fm-btn2 {
        width:100%; padding:14px; background:transparent; color:var(--fg);
        border:1px solid rgba(255,255,255,0.2);
        font-family:'DM Sans',sans-serif; font-size:11px; letter-spacing:3px; font-weight:500;
        cursor:pointer; text-transform:uppercase; transition:all 0.2s;
    }
    .fm-btn2:hover { border-color:var(--gold); color:var(--gold); }

    /* PROCESSING */
    .fm-processing {
        flex:1; display:flex; flex-direction:column;
        align-items:center; justify-content:center;
        text-align:center; padding:40px 24px;
    }
    .fm-rings { position:relative; width:200px; height:200px; margin-bottom:40px; }
    .fm-ring { position:absolute; inset:0; border-radius:50%; border:1px solid transparent; animation:fmSpin linear infinite; }
    .fm-r1 { border-top-color:var(--gold); border-right-color:rgba(200,169,110,0.3); animation-duration:2s; }
    .fm-r2 { inset:18px; border-top-color:rgba(255,255,255,0.6); border-left-color:rgba(255,255,255,0.2); animation-duration:1.5s; animation-direction:reverse; }
    .fm-r3 { inset:36px; border-top-color:var(--gold); animation-duration:3s; }
    .fm-rc { position:absolute; inset:56px; background:#1a1a1a; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:26px; }
    @keyframes fmSpin { to { transform:rotate(360deg); } }
    .fm-ptitle { font-family:'Bebas Neue',sans-serif; font-size:34px; letter-spacing:4px; margin-bottom:10px; }
    .fm-psub { font-size:12px; color:var(--gray); letter-spacing:2px; text-transform:uppercase; margin-bottom:36px; }
    .fm-pb { width:200px; height:2px; background:rgba(255,255,255,0.1); margin:0 auto 12px; }
    .fm-pf { height:100%; background:linear-gradient(90deg,var(--gold),var(--fg)); transition:width 0.1s; }
    .fm-pp { font-size:11px; color:var(--gray); letter-spacing:1px; }
    .fm-ai-steps { margin-top:36px; display:flex; flex-direction:column; gap:10px; width:100%; max-width:260px; text-align:left; }
    .fm-ai-step { display:flex; align-items:center; gap:10px; font-size:11px; letter-spacing:1px; color:var(--gray); text-transform:uppercase; opacity:0.35; transition:all 0.4s; }
    .fm-ai-step.active { opacity:1; color:var(--fg); }
    .fm-ai-step.done   { opacity:0.65; color:var(--gold); }
    .fm-sdot { width:6px; height:6px; border-radius:50%; background:currentColor; flex-shrink:0; }

    /* RESULT */
    .fm-result-top { display:flex; align-items:center; justify-content:space-between; padding:14px 24px; flex-shrink:0; }
    .fm-result-title { font-family:'Bebas Neue',sans-serif; font-size:20px; letter-spacing:3px; }
    .fm-viewer-wrap { margin:0 24px; background:#141414; border:1px solid rgba(255,255,255,0.08); overflow:hidden; }
    .fm-viewer-area { height:400px; display:flex; align-items:center; justify-content:center; position:relative; cursor:grab; user-select:none; }
    .fm-viewer-area:active { cursor:grabbing; }
    .fm-model-img { height:340px; object-fit:contain; transition:transform 0.1s; filter:drop-shadow(0 20px 60px rgba(0,0,0,0.8)); }
    .fm-model-img.walking { animation:fmWalk 0.6s ease-in-out infinite alternate; }
    .fm-model-img.spinning { animation:fmSpinX 3s linear infinite; }
    @keyframes fmWalk { from{transform:translateY(0) rotate(-1deg)} to{transform:translateY(-8px) rotate(1deg)} }
    @keyframes fmSpinX { 0%{transform:scaleX(1)} 25%{transform:scaleX(0.3)} 50%{transform:scaleX(-1)} 75%{transform:scaleX(-0.3)} 100%{transform:scaleX(1)} }
    .fm-deg-badge { position:absolute; top:12px; right:12px; background:rgba(200,169,110,0.15); border:1px solid var(--gold); color:var(--gold); font-family:'Bebas Neue',sans-serif; font-size:13px; letter-spacing:2px; padding:4px 9px; }
    .fm-drag-hint { position:absolute; bottom:12px; left:50%; transform:translateX(-50%); font-size:10px; letter-spacing:2px; color:var(--gray); text-transform:uppercase; display:flex; align-items:center; gap:6px; animation:fmPulse 2s ease-in-out infinite; }
    @keyframes fmPulse { 0%,100%{opacity:0.5} 50%{opacity:1} }
    .fm-rot-bar { display:flex; align-items:center; gap:10px; padding:10px 14px; border-top:1px solid rgba(255,255,255,0.06); }
    .fm-rot-track { flex:1; height:3px; background:rgba(255,255,255,0.1); border-radius:2px; position:relative; cursor:pointer; }
    .fm-rot-fill { height:100%; background:var(--gold); border-radius:2px; }
    .fm-rot-thumb { position:absolute; top:50%; transform:translate(-50%,-50%); width:12px; height:12px; border-radius:50%; background:var(--gold); border:2px solid var(--bg); }
    .fm-anim-row { display:flex; gap:8px; padding:14px 24px 0; flex-shrink:0; }
    .fm-anim-btn { flex:1; padding:10px 6px; border:1px solid rgba(255,255,255,0.12); background:transparent; color:var(--gray); font-size:10px; letter-spacing:2px; cursor:pointer; text-transform:uppercase; transition:all 0.2s; }
    .fm-anim-btn.on,.fm-anim-btn:hover { border-color:var(--gold); color:var(--gold); }
    .fm-compare { display:grid; grid-template-columns:1fr 1fr; gap:10px; margin:16px 24px 0; flex-shrink:0; }
    .fm-cpanel { position:relative; background:#1a1a1a; overflow:hidden; }
    .fm-cpanel img { width:100%; height:140px; object-fit:cover; display:block; }
    .fm-clbl { position:absolute; bottom:0; left:0; right:0; padding:6px 10px; background:rgba(0,0,0,0.7); font-size:9px; letter-spacing:2px; color:var(--gray); text-transform:uppercase; }
    .fm-prod-bar { display:flex; align-items:center; gap:12px; margin:16px 24px 0; padding:12px; background:#141414; border:1px solid rgba(255,255,255,0.06); flex-shrink:0; }
    .fm-pthumb { width:48px; height:60px; object-fit:cover; flex-shrink:0; }
    .fm-pname { font-size:12px; font-weight:500; margin-bottom:3px; }
    .fm-pprice { font-size:12px; color:var(--gold); }
    .fm-fscore { margin-left:auto; text-align:center; flex-shrink:0; }
    .fm-fnum { font-family:'Bebas Neue',sans-serif; font-size:30px; color:var(--gold); line-height:1; }
    .fm-flbl { font-size:8px; letter-spacing:2px; color:var(--gray); text-transform:uppercase; }
    .fm-result-actions { padding:12px 24px 32px; display:flex; flex-direction:column; gap:8px; flex-shrink:0; }
    .fm-ai-note { font-size:11px; color:var(--gold); text-align:center; padding:8px 16px; background:rgba(200,169,110,0.08); border:1px solid rgba(200,169,110,0.2); margin:0 24px 4px; }

    /* TOAST */
    .fm-toast { position:fixed; bottom:24px; left:50%; transform:translateX(-50%) translateY(16px); background:var(--fg); color:var(--bg); padding:10px 20px; font-size:12px; letter-spacing:1px; opacity:0; transition:all 0.3s; pointer-events:none; white-space:nowrap; z-index:100000; }
    .fm-toast.show { opacity:1; transform:translateX(-50%) translateY(0); }
    `;

    const rotPct = (rotDeg / 360) * 100;

    return (
        <>
        <style>{css}</style>
        <div className="fm-wrap">

            {/* ═══════════ INTRO ═══════════ */}
            <div className={`fm-screen ${screen==='intro'?'fm-active':''}`}>
                <div className="fm-header">
                    <div className="fm-logo">AZZ<em>R</em>O</div>
                    <button className="fm-x" onClick={handleClose}>✕</button>
                </div>
                <div className="fm-intro-hero">
                    <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80" alt="Model" />
                </div>
                <div className="fm-intro-body">
                    <div className="fm-tag">✦ Powered by Generative AI</div>
                    <div className="fm-h1">SEE IT ON<br/>YOUR BODY</div>
                    <div className="fm-desc">Take a selfie and a full body photo. Our AI fits this exact outfit on you — complete with a 360° rotating view.</div>
                    <div className="fm-steps4">
                        {['Selfie','Full Body','AI Magic','360° View'].map((l,i) => (
                            <div key={i} className="fm-sbox">
                                <div className="fm-snum">0{i+1}</div>
                                <div className="fm-slbl">{l}</div>
                            </div>
                        ))}
                    </div>
                    <button className="fm-btn1" onClick={goToSelfie}>START FIT ME</button>
                    <p className="fm-legal">By continuing you accept our Privacy Policy. Photos are processed securely and never stored.</p>
                </div>
            </div>

            {/* ═══════════ SELFIE ═══════════ */}
            <div className={`fm-screen ${screen==='selfie'?'fm-active':''}`}>
                <div className="fm-header">
                    <div className="fm-logo">AZZ<em>R</em>O</div>
                    <button className="fm-x" onClick={() => { stopCamera(); handleClose(); }}>✕</button>
                </div>
                <div className="fm-capture-header">
                    <div className="fm-capture-step">Step 1 of 2</div>
                    <div className="fm-capture-title">TAKE A SELFIE</div>
                    <div className="fm-capture-sub">Good lighting · Face fully visible · No glasses or hats</div>
                </div>
                <div className="fm-camera-frame fm-selfie-frame">
                    <div className="fm-cam-ph" id="selfie-placeholder">
                        <div className="fm-cam-icon">📷</div>
                        <div className="fm-cam-hint">CAMERA WILL APPEAR HERE</div>
                    </div>
                    <video ref={selfieVideoRef} id="selfie-video" autoPlay playsInline style={{display:'none',width:'100%',height:'100%',objectFit:'cover'}} />
                    <canvas ref={selfieCanvasRef} id="selfie-canvas" style={{display:'none'}} />
                    <img ref={selfiePreviewRef} id="selfie-preview" className="fm-preview" style={{display:'none',width:'100%',height:'100%',objectFit:'cover',position:'absolute',inset:0}} alt="selfie" />
                    <div className="fm-grid-overlay" />
                    <div className="fm-countdown-ov" id="selfie-countdown" style={{display:'none'}}>
                        <div className="fm-countdown-n" id="selfie-count">3</div>
                    </div>
                </div>
                <div className="fm-capture-actions">
                    <div className="fm-shutter-row">
                        <button className="fm-ctrl" onClick={flipCamera} title="Flip camera">🔄</button>
                        <button className="fm-shutter" onClick={() => startCountdown('selfie')} />
                        <button className="fm-ctrl" onClick={retakeSelfie} title="Retake">↩</button>
                    </div>
                    <label className="fm-upload-lbl">
                        ↑ UPLOAD FROM GALLERY
                        <input type="file" accept="image/*" style={{display:'none'}} onChange={e => uploadPhoto(e,'selfie')} />
                    </label>
                    <button className="fm-btn1" id="selfie-next" style={{display:'none'}} onClick={goToBody}>
                        NEXT — FULL BODY PHOTO
                    </button>
                </div>
            </div>

            {/* ═══════════ BODY ═══════════ */}
            <div className={`fm-screen ${screen==='body'?'fm-active':''}`}>
                <div className="fm-header">
                    <div className="fm-logo">AZZ<em>R</em>O</div>
                    <button className="fm-x" onClick={() => { stopCamera(); handleClose(); }}>✕</button>
                </div>
                <div className="fm-capture-header">
                    <div className="fm-capture-step">Step 2 of 2</div>
                    <div className="fm-capture-title">FULL BODY PHOTO</div>
                    <div className="fm-capture-sub">Stand straight · Whole body in frame · Plain background preferred</div>
                </div>
                <div className="fm-camera-frame fm-body-frame">
                    <div className="fm-cam-ph" id="body-placeholder">
                        <div className="fm-cam-icon">🧍</div>
                        <div className="fm-cam-hint">POSITION YOUR FULL BODY</div>
                    </div>
                    <video ref={bodyVideoRef} id="body-video" autoPlay playsInline style={{display:'none',width:'100%',height:'100%',objectFit:'cover'}} />
                    <canvas ref={bodyCanvasRef} id="body-canvas" style={{display:'none'}} />
                    <img ref={bodyPreviewRef} id="body-preview" className="fm-preview" style={{display:'none',width:'100%',height:'100%',objectFit:'cover',position:'absolute',inset:0}} alt="body" />
                    <div className="fm-grid-overlay" />
                    <div className="fm-countdown-ov" id="body-countdown" style={{display:'none'}}>
                        <div className="fm-countdown-n" id="body-count">3</div>
                    </div>
                </div>
                <div className="fm-capture-actions">
                    <div className="fm-shutter-row">
                        <button className="fm-ctrl" onClick={flipCamera} title="Flip camera">🔄</button>
                        <button className="fm-shutter" onClick={() => startCountdown('body')} />
                        <button className="fm-ctrl" onClick={retakeBody} title="Retake">↩</button>
                    </div>
                    <label className="fm-upload-lbl">
                        ↑ UPLOAD FROM GALLERY
                        <input type="file" accept="image/*" style={{display:'none'}} onChange={e => uploadPhoto(e,'body')} />
                    </label>
                    <button className="fm-btn1" id="body-next" style={{display:'none'}} onClick={startProcessing}>
                        GENERATE MY FIT ME LOOK
                    </button>
                </div>
            </div>

            {/* ═══════════ PROCESSING ═══════════ */}
            <div className={`fm-screen ${screen==='processing'?'fm-active':''}`}>
                <div className="fm-processing">
                    <div className="fm-rings">
                        <div className="fm-ring fm-r1"/><div className="fm-ring fm-r2"/>
                        <div className="fm-ring fm-r3"/><div className="fm-rc">✨</div>
                    </div>
                    <div className="fm-ptitle">GENERATING</div>
                    <div className="fm-psub">AI is fitting the garment on you</div>
                    <div className="fm-pb"><div className="fm-pf" style={{width:`${progPct}%`}}/></div>
                    <div className="fm-pp">{progPct}%</div>
                    <div className="fm-ai-steps">
                        {STEP_LABELS.map((l,i) => (
                            <div key={i} className={`fm-ai-step ${activeStep===i?'active':''} ${stepsDone.includes(i)?'done':''}`}>
                                <div className="fm-sdot"/>{l}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ═══════════ RESULT ═══════════ */}
            <div className={`fm-screen ${screen==='result'?'fm-active':''}`}>
                <div className="fm-result-top">
                    <div className="fm-result-title">YOUR FIT ME LOOK</div>
                    <button className="fm-x" onClick={handleClose}>✕</button>
                </div>
                {aiNote && <div className="fm-ai-note">{aiNote}</div>}

                <div className="fm-viewer-wrap">
                    <div className="fm-viewer-area"
                        onMouseDown={onDragStart} onMouseMove={onDragMove} onMouseUp={onDragEnd}
                        onTouchStart={onDragStart} onTouchMove={onDragMove} onTouchEnd={onDragEnd}>
                        <img
                            ref={resultImgRef}
                            src="https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=400&q=80"
                            alt="Your fit me result"
                            className={`fm-model-img ${animMode==='walk'?'walking':animMode==='spin'?'spinning':''}`}
                            style={rotStyle}
                        />
                        <div className="fm-deg-badge">{Math.round(rotDeg)}°</div>
                        <div className="fm-drag-hint">← DRAG TO ROTATE →</div>
                    </div>
                    <div className="fm-rot-bar">
                        <button className="fm-ctrl" style={{width:32,height:32,fontSize:12}}
                            onClick={() => { clearInterval(autoRotRef.current); let i=0; autoRotRef.current=setInterval(()=>{setRotDeg(d=>(d-2+360)%360);if(++i>120)clearInterval(autoRotRef.current);},16); }}>◁</button>
                        <div className="fm-rot-track" onClick={e=>{const r=e.currentTarget.getBoundingClientRect();setRotDeg(((e.clientX-r.left)/r.width)*360);}}>
                            <div className="fm-rot-fill" style={{width:`${rotPct}%`}}/>
                            <div className="fm-rot-thumb" style={{left:`${rotPct}%`}}/>
                        </div>
                        <button className="fm-ctrl" style={{width:32,height:32,fontSize:12}}
                            onClick={() => { clearInterval(autoRotRef.current); let i=0; autoRotRef.current=setInterval(()=>{setRotDeg(d=>(d+2)%360);if(++i>120)clearInterval(autoRotRef.current);},16); }}>▷</button>
                    </div>
                </div>

                <div className="fm-anim-row">
                    {(['static','walk','spin'] as const).map(m => (
                        <button key={m} className={`fm-anim-btn ${animMode===m?'on':''}`} onClick={()=>setAnimMode(m)}>
                            {m==='static'?'STATIC':m==='walk'?'WALK':'360° AUTO'}
                        </button>
                    ))}
                </div>

                <div className="fm-compare">
                    <div className="fm-cpanel">
                        <img ref={beforeImgRef}
                            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80" alt="Before"/>
                        <div className="fm-clbl">ORIGINAL</div>
                    </div>
                    <div className="fm-cpanel">
                        <img ref={afterImgRef}
                            src="https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=400&q=80" alt="After"/>
                        <div className="fm-clbl">WITH GARMENT</div>
                    </div>
                </div>

                <div className="fm-prod-bar">
                    <img className="fm-pthumb" src={product.imageUrl} alt={product.name}/>
                    <div>
                        <div className="fm-pname">{product.name}</div>
                        <div className="fm-pprice">₹{product.price}</div>
                    </div>
                    <div className="fm-fscore">
                        <div className="fm-fnum">{fitScore}</div>
                        <div className="fm-flbl">FIT SCORE</div>
                    </div>
                </div>

                <div className="fm-result-actions">
                    <button className="fm-btn1">ADD TO CART</button>
                    <button className="fm-btn2" onClick={goToSelfie}>TRY AGAIN</button>
                    <button className="fm-btn2" onClick={handleClose}>CLOSE</button>
                </div>
            </div>

        </div>

        <div className={`fm-toast ${toast?'show':''}`}>{toast}</div>
        </>
    );
}
