import { useEffect, useRef, useCallback } from 'react';

// CSS上の表示幅(px) — w-24 = 96px
const DISPLAY_WIDTH = 96;

interface CardCanvasProps {
  src: string;
  alt: string;
  onError?: () => void;
}

const CardCanvas = ({ src, alt, onError }: CardCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const img = new Image();

    img.onload = () => {
      const dpr = window.devicePixelRatio ?? 1;
      const isLandscape = img.naturalWidth > img.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      if (isLandscape) {
        // 90度回転して縦向きに: CSS幅固定、高さ=元画像の幅に合わせたアスペクト比
        const cssHeight = Math.round((img.naturalWidth / img.naturalHeight) * DISPLAY_WIDTH);

        canvas.style.width = `${DISPLAY_WIDTH}px`;
        canvas.style.height = `${cssHeight}px`;
        canvas.width = DISPLAY_WIDTH * dpr;
        canvas.height = cssHeight * dpr;

        ctx.scale(dpr, dpr);
        ctx.translate(DISPLAY_WIDTH / 2, cssHeight / 2);
        ctx.rotate(Math.PI / 2);
        ctx.drawImage(img, -cssHeight / 2, -DISPLAY_WIDTH / 2, cssHeight, DISPLAY_WIDTH);
      } else {
        const cssHeight = Math.round((img.naturalHeight / img.naturalWidth) * DISPLAY_WIDTH);

        canvas.style.width = `${DISPLAY_WIDTH}px`;
        canvas.style.height = `${cssHeight}px`;
        canvas.width = DISPLAY_WIDTH * dpr;
        canvas.height = cssHeight * dpr;

        ctx.scale(dpr, dpr);
        ctx.drawImage(img, 0, 0, DISPLAY_WIDTH, cssHeight);
      }
    };

    img.onerror = () => onError?.();
    img.src = src;
  }, [src, onError]);

  useEffect(() => {
    draw();
  }, [draw]);

  return (
    <canvas
      ref={canvasRef}
      aria-label={alt}
      className="rounded border border-gray-700 group-hover:border-yellow-500 transition-colors"
    />
  );
};

export default CardCanvas;
