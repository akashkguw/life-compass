import React from 'react'

interface ProgressRingProps {
  size: number
  strokeWidth: number
  progress: number
  color: string
}

export default function ProgressRing({
  size,
  strokeWidth,
  progress,
  color,
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDashoffset = circumference - (progress / 100) * circumference
  const cx = size / 2
  const cy = size / 2
  const gid = `rg-${size}`
  const isSmall = size <= 80

  return (
    <div className="progress-ring-container">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <defs>
          <linearGradient id={gid} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#a78bfa" />
          </linearGradient>
          <filter id={`glow-${size}`}>
            <feGaussianBlur stdDeviation="1.5" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        <circle cx={cx} cy={cy} r={radius} fill="none" stroke="var(--border-light)" strokeWidth={strokeWidth} opacity={0.4} />
        <circle
          cx={cx} cy={cy} r={radius} fill="none"
          stroke={`url(#${gid})`}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          filter={`url(#glow-${size})`}
          style={{
            transform: 'rotate(-90deg)',
            transformOrigin: `${cx}px ${cy}px`,
            transition: 'stroke-dashoffset 0.6s cubic-bezier(0.4,0,0.2,1)',
          }}
        />
        <text x={cx} y={isSmall ? cy : cy - 4} textAnchor="middle" dy="0.35em"
          style={{
            fontSize: `${isSmall ? Math.max(13, size / 4.8) : Math.max(16, size / 4.5)}px`,
            fontWeight: '800',
            fill: 'var(--text-primary)',
            pointerEvents: 'none',
            letterSpacing: '-0.02em',
          }}>
          {Math.round(progress)}%
        </text>
        {!isSmall && (
          <text x={cx} y={cy + 14} textAnchor="middle" dy="0.3em"
            style={{
              fontSize: `${Math.max(8, size / 10)}px`,
              fontWeight: '500',
              fill: 'var(--text-tertiary)',
              pointerEvents: 'none',
              textTransform: 'uppercase' as const,
              letterSpacing: '0.1em',
            }}>
            today
          </text>
        )}
      </svg>
    </div>
  )
}
