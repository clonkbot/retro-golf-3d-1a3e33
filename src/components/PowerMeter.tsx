interface PowerMeterProps {
  power: number
  isCharging: boolean
}

export default function PowerMeter({ power, isCharging }: PowerMeterProps) {
  const getColorClass = () => {
    if (power < 40) return 'bg-emerald-500'
    if (power < 70) return 'bg-amber-400'
    return 'bg-red-500'
  }

  return (
    <div className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-10">
      {/* Outer frame */}
      <div className="relative bg-[#1a2f1a]/90 backdrop-blur-sm rounded-full p-2 md:p-3 shadow-2xl border border-[#c9a227]/30">
        {/* Meter container */}
        <div className="relative w-6 md:w-8 h-48 md:h-64 bg-[#0a1f0a] rounded-full overflow-hidden border-2 border-[#c9a227]/40">
          {/* Background gradient marks */}
          <div className="absolute inset-0 flex flex-col justify-between py-2">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className="w-full h-px bg-[#c9a227]/20"
              />
            ))}
          </div>

          {/* Power fill */}
          <div
            className={`absolute bottom-0 left-0 right-0 transition-all duration-75 ${getColorClass()}`}
            style={{
              height: `${power}%`,
              boxShadow: isCharging ? `0 0 20px ${power > 70 ? '#ef4444' : power > 40 ? '#fbbf24' : '#10b981'}` : 'none'
            }}
          >
            {/* Liquid surface effect */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-white/30 rounded-full" />
          </div>

          {/* Pulsing glow when charging */}
          {isCharging && (
            <div
              className="absolute inset-0 animate-pulse opacity-30"
              style={{
                background: `linear-gradient(to top, ${power > 70 ? '#ef4444' : power > 40 ? '#fbbf24' : '#10b981'}, transparent)`
              }}
            />
          )}
        </div>

        {/* Power percentage label */}
        <div className="absolute -right-12 md:-right-14 top-1/2 -translate-y-1/2 text-[#c9a227] font-serif text-lg md:text-2xl font-bold tracking-wider">
          {power}%
        </div>

        {/* Min/Max labels */}
        <div className="absolute -right-6 top-2 text-[#c9a227]/50 text-xs font-serif">MAX</div>
        <div className="absolute -right-6 bottom-2 text-[#c9a227]/50 text-xs font-serif">MIN</div>
      </div>

      {/* Label */}
      <div className="text-center mt-3 text-[#c9a227]/80 text-xs md:text-sm font-serif tracking-[0.2em] uppercase">
        Power
      </div>
    </div>
  )
}
