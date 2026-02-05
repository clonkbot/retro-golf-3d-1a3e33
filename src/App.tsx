import { useState, useRef, useCallback, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, Sky, ContactShadows, Text } from '@react-three/drei'
import GolfCourse from './components/GolfCourse'
import GolfBall from './components/GolfBall'
import PowerMeter from './components/PowerMeter'
import GameUI from './components/GameUI'

export type GameState = 'aiming' | 'charging' | 'flying' | 'rolling' | 'scored' | 'stopped'

function App() {
  const [power, setPower] = useState(0)
  const [gameState, setGameState] = useState<GameState>('aiming')
  const [strokes, setStrokes] = useState(0)
  const [isCharging, setIsCharging] = useState(false)
  const [ballPosition, setBallPosition] = useState<[number, number, number]>([0, 0.2, 8])
  const [aimAngle, setAimAngle] = useState(0)
  const [showCelebration, setShowCelebration] = useState(false)
  const chargeInterval = useRef<number | null>(null)

  const startCharging = useCallback(() => {
    if (gameState !== 'aiming' && gameState !== 'stopped') return
    setIsCharging(true)
    setGameState('charging')
    setPower(0)

    chargeInterval.current = window.setInterval(() => {
      setPower(prev => {
        const next = prev + 2
        return next > 100 ? 100 : next
      })
    }, 30)
  }, [gameState])

  const releaseCharge = useCallback(() => {
    if (!isCharging) return
    setIsCharging(false)
    if (chargeInterval.current) {
      clearInterval(chargeInterval.current)
      chargeInterval.current = null
    }
    if (power > 5) {
      setGameState('flying')
      setStrokes(prev => prev + 1)
    } else {
      setGameState('aiming')
      setPower(0)
    }
  }, [isCharging, power])

  const onBallStopped = useCallback((pos: [number, number, number], scored: boolean) => {
    setBallPosition(pos)
    if (scored) {
      setGameState('scored')
      setShowCelebration(true)
    } else {
      setGameState('stopped')
      setPower(0)
    }
  }, [])

  const resetGame = useCallback(() => {
    setBallPosition([0, 0.2, 8])
    setStrokes(0)
    setPower(0)
    setGameState('aiming')
    setAimAngle(0)
    setShowCelebration(false)
  }, [])

  const adjustAim = useCallback((direction: 'left' | 'right') => {
    if (gameState !== 'aiming' && gameState !== 'stopped') return
    setAimAngle(prev => {
      const delta = direction === 'left' ? 0.05 : -0.05
      return Math.max(-Math.PI / 3, Math.min(Math.PI / 3, prev + delta))
    })
  }, [gameState])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !e.repeat) {
        e.preventDefault()
        startCharging()
      }
      if (e.code === 'ArrowLeft') adjustAim('left')
      if (e.code === 'ArrowRight') adjustAim('right')
      if (e.code === 'KeyR') resetGame()
    }
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault()
        releaseCharge()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [startCharging, releaseCharge, adjustAim, resetGame])

  return (
    <div className="w-screen h-screen bg-[#1a2f1a] overflow-hidden relative">
      {/* 3D Canvas */}
      <Canvas
        shadows
        camera={{ position: [0, 8, 16], fov: 45 }}
        style={{ background: 'linear-gradient(to bottom, #87CEEB 0%, #f4d03f 100%)' }}
      >
        <Sky sunPosition={[100, 20, 100]} turbidity={0.3} rayleigh={0.5} />
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[10, 20, 10]}
          intensity={1.5}
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-camera-far={50}
          shadow-camera-left={-20}
          shadow-camera-right={20}
          shadow-camera-top={20}
          shadow-camera-bottom={-20}
        />
        <pointLight position={[-5, 10, -5]} intensity={0.3} color="#f4d03f" />

        <GolfCourse />
        <GolfBall
          position={ballPosition}
          power={power}
          aimAngle={aimAngle}
          gameState={gameState}
          onStopped={onBallStopped}
        />

        {/* Aim direction indicator */}
        {(gameState === 'aiming' || gameState === 'stopped' || gameState === 'charging') && (
          <group position={[ballPosition[0], 0.05, ballPosition[2]]} rotation={[0, aimAngle, 0]}>
            <mesh position={[0, 0, -2]}>
              <coneGeometry args={[0.15, 0.4, 8]} />
              <meshStandardMaterial color="#c9a227" emissive="#c9a227" emissiveIntensity={0.3} />
            </mesh>
            <mesh position={[0, 0, -1]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.03, 0.03, 2, 8]} />
              <meshStandardMaterial color="#c9a227" emissive="#c9a227" emissiveIntensity={0.2} />
            </mesh>
          </group>
        )}

        <ContactShadows
          position={[0, 0.01, 0]}
          opacity={0.4}
          scale={30}
          blur={2}
          far={10}
        />

        <OrbitControls
          enablePan={false}
          minPolarAngle={0.3}
          maxPolarAngle={Math.PI / 2.2}
          minDistance={8}
          maxDistance={25}
          target={[0, 0, 2]}
        />
        <Environment preset="sunset" />

        {/* 3D Hole marker */}
        <Text
          position={[0, 2.5, -8]}
          fontSize={0.5}
          color="#c9a227"
          anchorX="center"
          anchorY="middle"
          font="https://fonts.gstatic.com/s/playfairdisplay/v30/nuFiD-vYSZviVYUb_rj3ij__anPXDTnCjmHKM4nYO7KN_qiTbtbK-F2rA0s.woff"
        >
          HOLE
        </Text>
      </Canvas>

      {/* Power Meter */}
      <PowerMeter power={power} isCharging={isCharging} />

      {/* Game UI */}
      <GameUI
        strokes={strokes}
        gameState={gameState}
        onStartCharge={startCharging}
        onReleaseCharge={releaseCharge}
        onAimLeft={() => adjustAim('left')}
        onAimRight={() => adjustAim('right')}
        onReset={resetGame}
        showCelebration={showCelebration}
      />

      {/* Footer */}
      <footer className="absolute bottom-3 left-0 right-0 text-center z-20">
        <p className="text-xs text-[#3d5c3d]/60 tracking-wide font-light">
          Requested by <span className="text-[#c9a227]/70">@RasmusLearns</span> · Built by <span className="text-[#c9a227]/70">@clonkbot</span>
        </p>
      </footer>
    </div>
  )
}

export default App
