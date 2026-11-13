import { useEffect, useRef, useState } from 'react';

export interface SequenceLoadState {
  frames: HTMLImageElement[];
  progress: number;
  isLoaded: boolean;
  isLoading: boolean;
  errorCount: number;
}

/**
 * Formats a sequence URL template with 1-based frame index.
 * Supports patterns like:
 * - "/sequences/vanille/frame_{0001}.webp" -> pad 4
 * - "/sequences/vanille/frame_{index}.webp" -> pad 4
 * - "/sequences/vanille/frame_%04d.webp" -> pad 4
 * - Base directory "/sequences/vanille/" -> appends "frame_0001.webp"
 */
export function resolveFrameUrl(pattern: string, oneBasedIndex: number): string {
  const trimmed = pattern.trim();
  if (!trimmed) return '';

  const bracedDigits = trimmed.match(/\{(0+1?)\}/);
  if (bracedDigits) {
    const pad = bracedDigits[1].length;
    const padded = String(oneBasedIndex).padStart(pad, '0');
    return trimmed.replace(bracedDigits[0], padded);
  }

  const printfMatch = trimmed.match(/%0(\d+)d/);
  if (printfMatch) {
    const pad = Number(printfMatch[1]) || 4;
    const padded = String(oneBasedIndex).padStart(pad, '0');
    return trimmed.replace(printfMatch[0], padded);
  }

  if (trimmed.includes('{index}')) {
    const padded = String(oneBasedIndex).padStart(4, '0');
    return trimmed.replace('{index}', padded);
  }

  if (trimmed.endsWith('/')) {
    const padded = String(oneBasedIndex).padStart(4, '0');
    return `${trimmed}frame_${padded}.webp`;
  }

  return trimmed;
}

const sequenceCache = new Map<string, HTMLImageElement[]>();

export function useWebpSequence(sequencePattern: string, frameCount: number): SequenceLoadState {
  const safeCount = Math.max(1, Math.min(480, Math.round(frameCount) || 1));
  const cacheKey = `${sequencePattern}::${safeCount}`;

  const [state, setState] = useState<SequenceLoadState>(() => {
    const cached = sequenceCache.get(cacheKey);
    if (cached && cached.length === safeCount) {
      return {
        frames: cached,
        progress: 100,
        isLoaded: true,
        isLoading: false,
        errorCount: 0,
      };
    }
    return {
      frames: [],
      progress: 0,
      isLoaded: false,
      isLoading: true,
      errorCount: 0,
    };
  });

  const activeKeyRef = useRef(cacheKey);
  activeKeyRef.current = cacheKey;

  useEffect(() => {
    const cached = sequenceCache.get(cacheKey);
    if (cached && cached.length === safeCount) {
      setState({
        frames: cached,
        progress: 100,
        isLoaded: true,
        isLoading: false,
        errorCount: 0,
      });
      return;
    }

    let cancelled = false;
    const total = safeCount;
    const loadedFrames: HTMLImageElement[] = new Array(total);
    let completed = 0;
    let errors = 0;

    setState({
      frames: [],
      progress: 0,
      isLoaded: false,
      isLoading: true,
      errorCount: 0,
    });

    const CONCURRENCY = 12;
    let nextIndex = 0;

    const loadSingle = (idx: number): Promise<void> =>
      new Promise((resolve) => {
        const img = new Image();
        img.decoding = 'async';
        const url = resolveFrameUrl(sequencePattern, idx + 1);

        const finish = (ok: boolean) => {
          if (cancelled || activeKeyRef.current !== cacheKey) {
            resolve();
            return;
          }
          if (ok) {
            loadedFrames[idx] = img;
          } else {
            errors += 1;
          }
          completed += 1;
          const pct = Math.min(100, Math.round((completed / total) * 100));

          if (completed === total) {
            // Fill any missing frame slots with nearest valid frame so scrubbing never flickers
            let lastValid: HTMLImageElement | undefined;
            for (let i = 0; i < total; i++) {
              if (loadedFrames[i]) {
                lastValid = loadedFrames[i];
              } else if (lastValid) {
                loadedFrames[i] = lastValid;
              }
            }
            let firstValid = loadedFrames.find(Boolean);
            if (firstValid) {
              for (let i = 0; i < total; i++) {
                if (!loadedFrames[i]) loadedFrames[i] = firstValid;
              }
            }

            sequenceCache.set(cacheKey, loadedFrames);
            setState({
              frames: loadedFrames,
              progress: 100,
              isLoaded: true,
              isLoading: false,
              errorCount: errors,
            });
          } else if (completed % 3 === 0 || pct >= 98) {
            setState((prev) => ({
              ...prev,
              progress: pct,
              errorCount: errors,
            }));
          }
          resolve();
        };

        img.onload = () => finish(true);
        img.onerror = () => finish(false);
        img.src = url;
      });

    const worker = async () => {
      while (!cancelled && nextIndex < total) {
        const current = nextIndex;
        nextIndex += 1;
        await loadSingle(current);
      }
    };

    const workers = Array.from({ length: Math.min(CONCURRENCY, total) }, () => worker());
    Promise.all(workers);

    return () => {
      cancelled = true;
    };
  }, [cacheKey, safeCount, sequencePattern]);

  return state;
}
