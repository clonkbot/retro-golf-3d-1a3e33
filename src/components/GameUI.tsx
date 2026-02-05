import { GameState } from '../App'

interface GameUIProps {
  strokes: number
  gameState: GameState
  onStartCharge: () => void
  onReleaseCharge: () => void
  onAimLeft: () => void
  onAimRight: () => void
  onReset: () => void
  showCelebration: boolean
}

export default function GameUI({
  strokes,
  gameState,
  onStartCharge,
  onReleaseCharge,
  onAimLeft,
  onAimRight,
  onReset,
  showCelebration
}: GameUIProps) {
  const canShoot = gameState === 'aiming' || gameState === 'stopped'
  const isCharging = gameState === 'charging'

  return (
    <>
      {/* Top HUD */}
      <div className="absolute top-4 md:top-6 left-1/2 -translate-x-1/2 z-10">
        <div className="bg-[#1a2f1a]/90 backdrop-blur-sm px-6 md:px-10 py-3 md:py-4 rounded-full border border-[#c9a227]/30 shadow-2xl">
          <div className="flex items-center gap-4 md:gap-8">
            <div className="text-center">
              <div className="text-[#c9a227]/60 text-[10px] md:text-xs font-serif tracking-[0.2em] uppercase">Strokes</div>
              <div className="text-[#c9a227] text-2xl md:text-4xl font-serif font-bold">{strokes}</div>
            </div>
            <div className="w-px h-10 md:h-12 bg-[#c9a227]/20" />
            <div className="text-center">
              <div className="text-[#c9a227]/60 text-[10px] md:text-xs font-serif tracking-[0.2em] uppercase">Par</div>
              <div className="text-[#c9a227] text-2xl md:text-4xl font-serif font-bold">3</div>
            </div>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="absolute top-24 md:top-28 left-1/2 -translate-x-1/2 z-10 text-center">
        <p className="text-[#f5f5dc]/70 text-xs md:text-sm font-serif tracking-wide">
          {canShoot && 'Hold SPACE or tap SWING to charge shot'}
          {isCharging && 'Release to swing!'}
          {gameState === 'flying' && 'Nice shot!'}
          {gameState === 'rolling' && 'Rolling...'}
        </p>
      </div>

      {/* Control buttons - Mobile friendly */}
      <div className="absolute bottom-20 md:bottom-12 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-3 md:gap-4">
        {/* Aim controls */}
        {canShoot && (
          <div className="flex gap-4">
            <button
              onClick={onAimLeft}
              className="w-12 h-12 md:w-14 md:h-14 bg-[#1a2f1a]/90 backdrop-blur-sm border border-[#c9a227]/40 rounded-full text-[#c9a227] font-serif text-xl md:text-2xl hover:bg-[#c9a227]/20 active:scale-95 transition-all shadow-lg"
            >
              ←
            </button>
            <button
              onClick={onAimRight}
              className="w-12 h-12 md:w-14 md:h-14 bg-[#1a2f1a]/90 backdrop-blur-sm border border-[#c9a227]/40 rounded-full text-[#c9a227] font-serif text-xl md:text-2xl hover:bg-[#c9a227]/20 active:scale-95 transition-all shadow-lg"
            >
              →
            </button>
          </div>
        )}

        {/* Swing button */}
        {(canShoot || isCharging) && (
          <button
            onMouseDown={onStartCharge}
            onMouseUp={onReleaseCharge}
            onMouseLeave={onReleaseCharge}
            onTouchStart={(e) => { e.preventDefault(); onStartCharge(); }}
            onTouchEnd={(e) => { e.preventDefault(); onReleaseCharge(); }}
            className={`
              px-8 md:px-12 py-4 md:py-5 rounded-full font-serif text-base md:text-lg tracking-[0.15em] uppercase
              transition-all duration-150 shadow-xl select-none touch-none
              ${isCharging
                ? 'bg-[#c9a227] text-[#1a2f1a] scale-95 shadow-[0_0_30px_rgba(201,162,39,0.5)]'
                : 'bg-[#1a2f1a]/90 backdrop-blur-sm border-2 border-[#c9a227] text-[#c9a227] hover:bg-[#c9a227]/20'
              }
            `}
          >
            {isCharging ? 'Release!' : 'Swing'}
          </button>
        )}

        {/* Reset button */}
        <button
          onClick={onReset}
          className="px-4 md:px-6 py-2 md:py-2 text-[#c9a227]/60 font-serif text-xs md:text-sm tracking-wider hover:text-[#c9a227] transition-colors"
        >
          [R] Reset
        </button>
      </div>

      {/* Celebration overlay */}
      {showCelebration && (
        <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
          <div className="text-center animate-bounce">
            <div className="bg-[#1a2f1a]/95 backdrop-blur-md px-8 md:px-16 py-8 md:py-12 rounded-3xl border-2 border-[#c9a227] shadow-2xl pointer-events-auto">
              <div className="text-6xl md:text-8xl mb-4">🏆</div>
              <h2 className="text-[#c9a227] text-3xl md:text-5xl font-serif font-bold mb-2">
                {strokes === 1 ? 'HOLE IN ONE!' : strokes === 2 ? 'EAGLE!' : strokes === 3 ? 'BIRDIE!' : 'IN THE HOLE!'}
              </h2>
              <p className="text-[#f5f5dc]/70 text-lg md:text-xl font-serif mb-6">
                {strokes} {strokes === 1 ? 'stroke' : 'strokes'}
              </p>
              <button
                onClick={onReset}
                className="px-6 md:px-8 py-3 md:py-4 bg-[#c9a227] text-[#1a2f1a] font-serif text-base md:text-lg tracking-wider rounded-full hover:bg-[#d4af37] transition-colors shadow-lg"
              >
                Play Again
              </button>
            </div>
          </div>

          {/* Confetti-like particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-3 h-3 rounded-full animate-ping"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  backgroundColor: ['#c9a227', '#f5f5dc', '#2d5a2d', '#8b0000'][i % 4],
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${1 + Math.random()}s`
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Keyboard hints (desktop only) */}
      <div className="hidden md:block absolute bottom-6 right-6 z-10">
        <div className="bg-[#1a2f1a]/80 backdrop-blur-sm px-4 py-3 rounded-xl border border-[#c9a227]/20 text-[#c9a227]/50 text-xs font-serif">
          <div className="flex items-center gap-3 mb-1">
            <kbd className="px-2 py-1 bg-[#0a1f0a] rounded text-[10px]">SPACE</kbd>
            <span>Hold to charge</span>
          </div>
          <div className="flex items-center gap-3 mb-1">
            <kbd className="px-2 py-1 bg-[#0a1f0a] rounded text-[10px]">← →</kbd>
            <span>Aim</span>
          </div>
          <div className="flex items-center gap-3">
            <kbd className="px-2 py-1 bg-[#0a1f0a] rounded text-[10px]">R</kbd>
            <span>Reset</span>
          </div>
        </div>
      </div>
    </>
  )
}
