declare module "canvas-confetti" {
  interface ConfettiOptions {
    particleCount?: number;
    spread?: number;
    startVelocity?: number;
    origin?: {
      x?: number;
      y?: number;
    };
    colors?: string[];
  }

  export default function confetti(options?: ConfettiOptions): Promise<null> | null;
}

declare module "qrcode" {
  interface QRCodeOptions {
    errorCorrectionLevel?: "L" | "M" | "Q" | "H";
    margin?: number;
    width?: number;
  }

  const QRCode: {
    toDataURL(text: string, options?: QRCodeOptions): Promise<string>;
  };

  export default QRCode;
}
