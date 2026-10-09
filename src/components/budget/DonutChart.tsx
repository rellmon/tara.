export interface DonutSegment {
  key: string
  value: number
  strokeClass: string
}

interface DonutChartProps {
  segments: DonutSegment[]
  ariaLabel: string
  centerLabel: string
  centerValue: string
}

const RADIUS = 40
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

function DonutChart({
  segments,
  ariaLabel,
  centerLabel,
  centerValue,
}: DonutChartProps) {
  const total = segments.reduce((sum, segment) => sum + segment.value, 0)
  if (total <= 0) return null

  let offset = 0

  return (
    <div className="relative h-44 w-44 shrink-0">
      <svg
        viewBox="0 0 100 100"
        role="img"
        aria-label={ariaLabel}
        className="h-full w-full -rotate-90"
      >
        {segments.map((segment) => {
          const length = (segment.value / total) * CIRCUMFERENCE
          const circle = (
            <circle
              key={segment.key}
              cx="50"
              cy="50"
              r={RADIUS}
              fill="none"
              strokeWidth="14"
              strokeDasharray={`${length} ${CIRCUMFERENCE - length}`}
              strokeDashoffset={-offset}
              className={segment.strokeClass}
            />
          )
          offset += length
          return circle
        })}
      </svg>

      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
        <span className="text-xs text-muted">{centerLabel}</span>
        <span className="break-words font-display text-base font-bold text-brand-900">
          {centerValue}
        </span>
      </div>
    </div>
  )
}

export default DonutChart