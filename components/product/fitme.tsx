'use client';
// components/product/fitme.tsx
// AZZRO FIT ME — powered by fal.ai CatVTON (IDM-VTON removed)

import { useState, useRef, useCallback, useEffect } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────
interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  imageUrl: string;
  category?: string;
  [key: string]: any;
}

interface FitMeProductButtonProps {
  product: Product;
  variant: 'card' | 'image-overlay';
}

// FASHN v1.6 category + long garment detection
function detectCategory(category?: string, name?: string): {
  category: 'tops' | 'bottoms' | 'one-pieces' | 'auto';
  longGarment: boolean;
} {
  const text = ((category ?? '') + ' ' + (name ?? '')).toLowerCase();

  const isLong = text.includes('saree') || text.includes('sari') || text.includes('gown') ||
    text.includes('lehenga') || text.includes('maxi') || text.includes('anarkali') ||
    text.includes('sharara') || text.includes('palazzo') || text.includes('kurta');

  if (text.includes('pant') || text.includes('skirt') || text.includes('trouser') ||
      text.includes('lower') || text.includes('legging') || text.includes('jeans') ||
      text.includes('shorts') || text.includes('palazzo') || text.includes('sharara')) {
    return { category: 'bottoms', longGarment: false };
  }

  if (text.includes('saree') || text.includes('sari') || text.includes('dress') ||
      text.includes('jumpsuit') || text.includes('lehenga') || text.includes('gown') ||
      text.includes('suit') || text.includes('salwar') || text.includes('kurta') ||
      text.includes('anarkali') || text.includes('coord') || text.includes('set') ||
      text.includes('dungaree')) {
    return { category: 'one-pieces', longGarment: isLong };
  }

  if (text.includes('top') || text.includes('shirt') || text.includes('blouse') ||
      text.includes('jacket') || text.includes('tshirt') || text.includes('sweater') ||
      text.includes('hoodie') || text.includes('crop') || text.includes('tank')) {
    return { category: 'tops', longGarment: false };
  }

  return { category: 'auto', longGarment: isLong };
}

// Detect innerwear — FIT ME is hidden for these products
function isInnerwear(category?: string, name?: string): boolean {
  const text = ((category ?? '') + ' ' + (name ?? '')).toLowerCase();
  return (
    text.includes('innerwear') ||
    text.includes('inner wear') ||
    text.includes('underwear') ||
    text.includes('under wear') ||
    text.includes('undergarment') ||
    text.includes('lingerie') ||
    text.includes('bra') ||
    text.includes('bralette') ||
    text.includes('brief') ||
    text.includes('panty') ||
    text.includes('panties') ||
    text.includes('thong') ||
    text.includes('boxers') ||
    text.includes('boxer') ||
    text.includes('trunk') ||
    text.includes('trunks') ||
    text.includes('shapewear') ||
    text.includes('camisole') ||
    text.includes('slip') ||
    text.includes('teddy') ||
    text.includes('corset') ||
    text.includes('bodysuit') ||
    text.includes('thermal inner') ||
    text.includes('vest inner') ||
    text.includes('night suit') ||
    text.includes('nightsuit') ||
    text.includes('nightwear') ||
    text.includes('night wear') ||
    text.includes('sleepwear') ||
    text.includes('sleep wear') ||
    text.includes('bikini') ||
    text.includes('swimwear') ||
    text.includes('swim wear') ||
    text.includes('swimsuit')
  );
}

// ─── Main Modal ───────────────────────────────────────────────────────────
function FitMeTryOnModal({ product, onClose }: { product: Product; onClose: () => void }) {
  type Step = 'choose' | 'camera' | 'preview' | 'loading' | 'result';

  const [step, setStep] = useState<Step>('choose');
  const [cameraMode, setCameraMode] = useState<'selfie' | 'body'>('selfie');
  const [userPhotoBlob, setUserPhotoBlob] = useState<Blob | null>(null);
  const [userPhotoPreview, setUserPhotoPreview] = useState<string | null>(null);
  const [resultImageUrl, setResultImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => { stream?.getTracks().forEach((t) => t.stop()); };
  }, [stream]);

  const stopCamera = useCallback(() => {
    stream?.getTracks().forEach((t) => t.stop());
    setStream(null);
  }, [stream]);

  const startCamera = useCallback(async (mode: 'selfie' | 'body') => {
    setCameraMode(mode);
    setStep('camera');
    setError(null);
    try {
      const s = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: mode === 'selfie' ? 'user' : 'environment', width: { ideal: 1280 }, height: { ideal: 1280 } },
      });
      setStream(s);
      if (videoRef.current) videoRef.current.srcObject = s;
    } catch {
      setError('Camera access denied. Please upload a photo instead.');
      setStep('choose');
    }
  }, []);

  useEffect(() => {
    if (step === 'camera' && videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [step, stream]);

  const capturePhoto = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    if (cameraMode === 'selfie') { ctx.translate(canvas.width, 0); ctx.scale(-1, 1); }
    ctx.drawImage(video, 0, 0);
    canvas.toBlob((blob) => {
      if (!blob) return;
      stopCamera();
      setUserPhotoBlob(blob);
      setUserPhotoPreview(URL.createObjectURL(blob));
      setStep('preview');
    }, 'image/jpeg', 0.92);
  }, [cameraMode, stopCamera]);

  const handleGalleryUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { setError('Please select an image file.'); return; }
    if (file.size > 10 * 1024 * 1024) { setError('Image must be under 10MB.'); return; }
    setUserPhotoBlob(file);
    setUserPhotoPreview(URL.createObjectURL(file));
    setStep('preview');
    setError(null);
  }, []);

  // ── Run CatVTON ──
  const runTryOn = useCallback(async () => {
    if (!userPhotoBlob) return;
    setStep('loading');
    setError(null);

    try {
      const fd = new FormData();
      fd.append('humanImage', userPhotoBlob, 'user-photo.jpg');
      // Send garment URL — server fetches & uploads it to fal.ai storage directly
      fd.append('garmentImageUrl', product.imageUrl);
      fd.append('productName', product.name);
      fd.append('productCategory', product.category ?? '');

      const response = await fetch('/api/tryon', { method: 'POST', body: fd });
      const data = await response.json();

      if (!response.ok || !data.success) throw new Error(data.error || 'Try-on failed');

      // Proxy the result image to avoid CORS
      const proxied = `/api/tryon/fetch-image?url=${encodeURIComponent(data.imageUrl)}`;
      setResultImageUrl(proxied);
      setStep('result');
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
      setStep('preview');
    }
  }, [userPhotoBlob, product]);

  const reset = () => {
    stopCamera();
    setStep('choose');
    setUserPhotoBlob(null);
    setUserPhotoPreview(null);
    setResultImageUrl(null);
    setError(null);
  };

  const handleBackdrop = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) { stopCamera(); onClose(); }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4"
      onClick={handleBackdrop}
    >
      <div className="bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl overflow-hidden shadow-2xl max-h-[92vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-base font-bold uppercase tracking-widest text-black">✨ FIT ME</h2>
            <p className="text-[10px] text-gray-400 tracking-wider uppercase mt-0.5">Powered by fal.ai · CatVTON</p>
          </div>
          <button onClick={() => { stopCamera(); onClose(); }} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-500">✕</button>
        </div>

        {/* Product strip */}
        <div className="flex items-center gap-3 px-5 py-3 bg-gray-50 border-b border-gray-100">
          <img src={product.imageUrl} alt={product.name} className="w-10 h-12 object-cover rounded" />
          <div>
            <p className="text-xs font-bold text-black uppercase tracking-wide truncate max-w-[240px]">{product.name}</p>
            <p className="text-[10px] text-gray-400">{product.brand}</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">

          {/* CHOOSE */}
          {step === 'choose' && (
            <div className="p-5 space-y-3">
              <p className="text-sm text-gray-500 text-center mb-4">Upload or take a photo to see how this outfit looks on you</p>
              {error && <div className="text-xs text-red-500 bg-red-50 rounded-lg p-3 text-center">{error}</div>}
              <button onClick={() => startCamera('selfie')} className="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-gray-200 hover:border-black hover:bg-gray-50 transition-all">
                <div className="w-11 h-11 rounded-full bg-black text-white flex items-center justify-center text-xl flex-shrink-0">🤳</div>
                <div className="text-left">
                  <p className="text-sm font-bold text-black">Take a Selfie</p>
                  <p className="text-xs text-gray-400">Front camera — face & upper body</p>
                </div>
              </button>
              <button onClick={() => startCamera('body')} className="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-gray-200 hover:border-black hover:bg-gray-50 transition-all">
                <div className="w-11 h-11 rounded-full bg-black text-white flex items-center justify-center text-xl flex-shrink-0">🧍</div>
                <div className="text-left">
                  <p className="text-sm font-bold text-black">Full Body Photo</p>
                  <p className="text-xs text-gray-400">Rear camera — best for outfit matching</p>
                </div>
              </button>
              <button onClick={() => fileInputRef.current?.click()} className="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-gray-200 hover:border-black hover:bg-gray-50 transition-all">
                <div className="w-11 h-11 rounded-full bg-black text-white flex items-center justify-center text-xl flex-shrink-0">🖼️</div>
                <div className="text-left">
                  <p className="text-sm font-bold text-black">Upload from Gallery</p>
                  <p className="text-xs text-gray-400">JPG, PNG, WebP · Max 10MB</p>
                </div>
              </button>
              <input ref={fileInputRef} type="file" accept="image/jpeg,image/jpg,image/png,image/webp" className="hidden" onChange={handleGalleryUpload} />
              <p className="text-[10px] text-gray-300 text-center pt-2">Photos are processed securely and never stored</p>
            </div>
          )}

          {/* CAMERA */}
          {step === 'camera' && (
            <div className="flex flex-col">
              <div className="relative bg-black aspect-[3/4] w-full overflow-hidden">
                <video ref={videoRef} autoPlay playsInline muted className={`w-full h-full object-cover ${cameraMode === 'selfie' ? 'scale-x-[-1]' : ''}`} />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className={`border-2 border-white/50 rounded-xl ${cameraMode === 'selfie' ? 'w-48 h-64' : 'w-40 h-80'}`} />
                </div>
                <p className="absolute bottom-4 left-0 right-0 text-center text-white/70 text-xs">
                  {cameraMode === 'selfie' ? 'Position your face & shoulders in the frame' : 'Step back — show your full body'}
                </p>
              </div>
              <canvas ref={canvasRef} className="hidden" />
              <div className="p-5 flex gap-3">
                <button onClick={() => { stopCamera(); setStep('choose'); }} className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors">Back</button>
                <button onClick={capturePhoto} className="flex-1 py-3 rounded-xl bg-black text-white text-sm font-bold uppercase tracking-widest hover:bg-gray-800 active:scale-95 transition-all">📸 Capture</button>
              </div>
            </div>
          )}

          {/* PREVIEW */}
          {step === 'preview' && (
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider text-center">Your Photo</p>
                  <img src={userPhotoPreview!} alt="Your photo" className="w-full aspect-[3/4] object-cover rounded-xl" />
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider text-center">Garment</p>
                  <img src={product.imageUrl} alt={product.name} className="w-full aspect-[3/4] object-cover rounded-xl" />
                </div>
              </div>
              {error && <div className="text-xs text-red-500 bg-red-50 rounded-lg p-3 text-center">{error}</div>}
              <button onClick={runTryOn} className="w-full py-4 rounded-xl bg-black text-white font-bold text-sm uppercase tracking-widest hover:bg-gray-800 active:scale-95 transition-all">
                ✨ Generate My Outfit
              </button>
              <button onClick={reset} className="w-full py-3 rounded-xl border border-gray-200 text-sm text-gray-500 hover:bg-gray-50 transition-colors">
                Retake / Change Photo
              </button>
            </div>
          )}

          {/* LOADING */}
          {step === 'loading' && (
            <div className="flex flex-col items-center justify-center py-16 px-5 gap-5">
              <div className="relative w-20 h-20">
                <div className="absolute inset-0 rounded-full border-4 border-gray-100" />
                <div className="absolute inset-0 rounded-full border-4 border-black border-t-transparent animate-spin" />
                <span className="absolute inset-0 flex items-center justify-center text-2xl">✨</span>
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-black">CatVTON is fitting your outfit...</p>
                <p className="text-xs text-gray-400 mt-1">Powered by fal.ai GPU inference</p>
                <p className="text-xs text-gray-300 mt-1">Usually takes 10–15 seconds</p>
              </div>
              <div className="flex gap-1.5 mt-2">
                {['Fitting', 'Draping', 'Rendering'].map((label, i) => (
                  <div key={label} className="text-[10px] bg-gray-100 text-gray-500 px-2 py-1 rounded-full animate-pulse" style={{ animationDelay: `${i * 0.2}s` }}>
                    {label}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* RESULT */}
          {step === 'result' && resultImageUrl && (
            <div className="p-5 space-y-4">
              {/* Full result — prominent */}
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider text-center mb-2">Your Look ✨</p>
                <img src={resultImageUrl} alt="Try-on result" className="w-full rounded-2xl border border-gray-100 shadow-sm" style={{ maxHeight: '70vh', objectFit: 'contain' }} />
              </div>

              {/* Small before/after strip */}
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider text-center">Before</p>
                  <img src={userPhotoPreview!} alt="You" className="w-full h-28 object-cover rounded-xl" />
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider text-center">Garment</p>
                  <img src={product.imageUrl} alt={product.name} className="w-full h-28 object-cover rounded-xl" />
                </div>
              </div>

              <div className="flex gap-3 pt-1">
                <a href={resultImageUrl} download="azzro-tryon.jpg" className="flex-1 py-3 rounded-xl border border-gray-200 text-sm text-gray-500 hover:bg-gray-50 transition-colors text-center">
                  ⬇ Save
                </a>
                <button onClick={reset} className="flex-1 py-3 rounded-xl border border-gray-200 text-sm text-gray-500 hover:bg-gray-50 transition-colors">
                  Try Again
                </button>
                <button onClick={onClose} className="flex-1 py-3 rounded-xl bg-black text-white text-sm font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors">
                  Add to Bag
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

// ─── FIT ME Button ────────────────────────────────────────────────────────
export function FitMeProductButton({ product, variant }: FitMeProductButtonProps) {
  const [open, setOpen] = useState(false);

  // Hide FIT ME entirely for innerwear products
  if (isInnerwear(product.category, product.name)) return null;

  return (
    <>
      {variant === 'card' ? (
        <button
          className="absolute bottom-2 right-2 z-10 flex items-center gap-1.5 bg-black/85 backdrop-blur-sm text-white px-3 py-1.5 text-[10px] font-semibold tracking-[2px] uppercase opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300 hover:bg-[#c8a96e] hover:text-black rounded-sm"
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); setOpen(true); }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
            <circle cx="2" cy="6" r="1.5" />
            <circle cx="6" cy="6" r="1.5" />
            <circle cx="10" cy="6" r="1.5" />
          </svg>
          FIT ME
        </button>
      ) : (
        <button
          className="absolute bottom-4 left-4 z-10 flex items-center gap-2 bg-white/95 backdrop-blur-sm text-black px-4 py-2.5 text-[11px] font-bold tracking-[2.5px] uppercase shadow-lg hover:bg-[#c8a96e] hover:text-white transition-all duration-200 rounded-sm border border-black/10"
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); setOpen(true); }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="4" r="2.5" />
            <path d="M12 8c-3 0-5 1.5-5 4v4h2v6h2v-6h2v6h2v-6h2v-4c0-2.5-2-4-5-4z" />
          </svg>
          FIT ME
        </button>
      )}
      {open && <FitMeTryOnModal product={product} onClose={() => setOpen(false)} />}
    </>
  );
}
