/* eslint-disable no-console */

export interface AdSize {
  width: number;
  height: number;
}

/**
 * Defines a minimal MRAID API surface for type safety.
 */
declare global {
  interface Window {
    mraid?: {
      getState(): string;
      getCurrentPosition(): { width: number; height: number };
      addEventListener(
        event: string,
        listener: (...args: unknown[]) => void,
      ): void;
      addEventListener(
        event: "sizeChange",
        listener: (width: number, height: number) => void,
      ): void;
      removeEventListener(
        event: string,
        listener: (...args: unknown[]) => void,
      ): void;
      open(url: string): void;
    };
  }
}

/**
 * Handles MRAID readiness, resizing, and click-throughs for playable ads.
 */
export class MraidHelper {
  private static instanceRef?: MraidHelper;

  private isReadyFlag = false;

  private adSizeState: AdSize = { width: 600, height: 960 };

  private readyCallbacks: Array<() => void> = [];

  public static get instance(): MraidHelper {
    if (!this.instanceRef) {
      this.instanceRef = new MraidHelper();
    }
    return this.instanceRef;
  }

  public get adSize(): AdSize {
    return this.adSizeState;
  }

  public get isReady(): boolean {
    return this.isReadyFlag;
  }

  /**
   * Waits for MRAID readiness, then invokes the callback.
   */
  public waitForReady(callback: () => void): void {
    this.readyCallbacks.push(callback);

    if (typeof window === "undefined") return;
    const { mraid } = window;

    const init = (): void => {
      this.isReadyFlag = true;
      this.updateAdSize();
      console.log("[MRAID] Ready with size:", this.adSizeState);
      this.readyCallbacks.forEach((cb) => cb());
      this.readyCallbacks = [];
    };

    if (mraid) {
      if (mraid.getState() === "loading") {
        console.log("[MRAID] Waiting for ready event...");
        const onReady = (): void => {
          mraid.removeEventListener("ready", onReady);
          init();
        };
        mraid.addEventListener("ready", onReady);
      } else {
        console.log("[MRAID] Already ready");
        init();
      }

      // Watch for size/orientation changes
      mraid.addEventListener("sizeChange", (w: number, h: number) => {
        this.adSizeState = { width: w, height: h };
        console.log("[MRAID] Size changed:", this.adSizeState);
        this.applySizeToContainer();
      });
    } else {
      console.log("[MRAID] Not detected — running in browser fallback mode");
      this.isReadyFlag = true;
      this.updateAdSize();
      init();

      window.addEventListener("resize", () => {
        this.updateAdSize();
        this.applySizeToContainer();
      });
    }
  }

  /**
   * Opens a URL using mraid.open() if available.
   */
  public open(url: string): void {
    const { mraid } = window;
    if (mraid) {
      console.log("[MRAID] Opening via mraid.open()");
      mraid.open(url);
    } else {
      console.log("[MRAID] Opening via window.open()");
      window.open(url, "_blank");
    }
  }

  /**
   * Reads ad size from MRAID or falls back to window size.
   */
  private updateAdSize(): void {
    const { mraid } = window;
    if (mraid) {
      try {
        const pos = mraid.getCurrentPosition();
        this.adSizeState = { width: pos.width, height: pos.height };
      } catch (err) {
        console.warn(
          "[MRAID] getCurrentPosition() failed, fallback to default size",
          err,
        );
      }
    } else {
      this.adSizeState = {
        width: window.innerWidth,
        height: window.innerHeight,
      };
    }
  }

  /**
   * Applies the MRAID ad size to the #pixi-container element.
   */
  public applySizeToContainer(): void {
    const container = document.getElementById("pixi-container");
    if (!container) return;
    container.style.width = `${this.adSizeState.width}px`;
    container.style.height = `${this.adSizeState.height}px`;
    console.log("[MRAID] Container resized to:", this.adSizeState);
  }
}
