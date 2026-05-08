'use client';

interface Props {
  size?: 'sm' | 'md' | 'lg';
  iconOnly?: boolean;
}

export default function AppLogo({ size = 'md', iconOnly = false }: Props) {
  const cfg = {
    sm: { box: 22, r: 5,  text: 'text-sm'  },
    md: { box: 28, r: 7,  text: 'text-base' },
    lg: { box: 34, r: 9,  text: 'text-lg'  },
  }[size];

  return (
    <div className="inline-flex items-center gap-1.5">
      {/* Icon */}
      <svg
        width={cfg.box}
        height={cfg.box}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="eg" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#60a5fa" />
            <stop offset="100%" stopColor="#2563eb" />
          </linearGradient>
          <linearGradient id="es" x1="0" y1="0" x2="0" y2="32" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="white" stopOpacity="0.2" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect width="32" height="32" rx="8" fill="url(#eg)" />
        <rect width="32" height="32" rx="8" fill="url(#es)" />
        {/* Three bars — top full, middle short, bottom full */}
        <rect x="8"  y="9.5"  width="16"   height="3" rx="1.5" fill="white" />
        <rect x="8"  y="14.5" width="10.5" height="3" rx="1.5" fill="white" opacity="0.85" />
        <rect x="8"  y="19.5" width="16"   height="3" rx="1.5" fill="white" />
      </svg>

      {/* Wordmark */}
      {!iconOnly && (
        <span className={`font-bold tracking-tight leading-none ${cfg.text}`}>
          <span className="text-gray-900">eval</span><span className="text-brand-500">io</span>
        </span>
      )}
    </div>
  );
}
