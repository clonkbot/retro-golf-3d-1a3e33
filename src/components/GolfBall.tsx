import { useRef, useEffect, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Sphere } from '@react-three/drei'
import { GameState } from '../App'

interface GolfBallProps {
  position: [number, number, number]
  power: number
  aimAngle: number
  gameState: GameState
  onStopped: (pos: [number, number, number], scored: boolean) => void
}

const HOLE_POSITION = new THREE.Vector3(0, 0, -8)
const HOLE_RADIUS = 0.15
const GRAVITY = -15
const FRICTION = 0.985
const BOUNCE_DAMPING = 0.4
const MIN_VELOCITY = 0.05

export default function GolfBall({
  position,
  power,
  aimAngle,
  gameState,
  onStopped
}: GolfBallProps) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const velocity = useRef(new THREE.Vector3(0, 0, 0))
  const currentPos = useRef(new THREE.Vector3(...position))
  const [isFlying, setIsFlying] = useState(false)

  // Reset ball position when position prop changes
  useEffect(() => {
    currentPos.current.set(...position)
    if (meshRef.current) {
      meshRef.current.position.set(...position)
    }
  }, [position])

  // Launch the ball when gameState becomes 'flying'
  useEffect(() => {
    if (gameState === 'flying') {
      // Calculate initial velocity based on power and aim angle
      const speed = (power / 100) * 20 // Max speed of 20
      const launchAngle = 0.4 + (power / 100) * 0.3 // Higher power = higher arc

      // Direction based on aim angle (negative Z is toward hole)
      const dirX = Math.sin(aimAngle)
      const dirZ = -Math.cos(aimAngle)

      velocity.current.set(
        dirX * speed,
        speed * Math.sin(launchAngle),
        dirZ * speed * Math.cos(launchAngle)
      )
      setIsFlying(true)
    }
  }, [gameState, power, aimAngle])

  useFrame((_, delta) => {
    if (!isFlying || !meshRef.current) return

    const dt = Math.min(delta, 0.05) // Cap delta to prevent tunneling
    const pos = currentPos.current
    const vel = velocity.current

    // Apply gravity
    vel.y += GRAVITY * dt

    // Update position
    pos.x += vel.x * dt
    pos.y += vel.y * dt
    pos.z += vel.z * dt

    // Ground collision and bounce
    if (pos.y <= 0.2) {
      pos.y = 0.2
      if (vel.y < -1) {
        vel.y = -vel.y * BOUNCE_DAMPING
      } else {
        vel.y = 0
        // Apply ground friction
        vel.x *= FRICTION
        vel.z *= FRICTION
      }
    }

    // Keep ball on course (basic boundaries)
    if (pos.x < -5.5) {
      pos.x = -5.5
      vel.x = -vel.x * 0.5
    }
    if (pos.x > 5.5) {
      pos.x = 5.5
      vel.x = -vel.x * 0.5
    }
    if (pos.z < -10) {
      pos.z = -10
      vel.z = -vel.z * 0.5
    }
    if (pos.z > 10) {
      pos.z = 10
      vel.z = -vel.z * 0.5
    }

    // Update mesh position
    meshRef.current.position.copy(pos)

    // Rotate ball based on movement
    const moveSpeed = Math.sqrt(vel.x * vel.x + vel.z * vel.z)
    if (moveSpeed > 0.1) {
      meshRef.current.rotation.x += moveSpeed * dt * 3
      meshRef.current.rotation.z -= vel.x * dt * 3
    }

    // Check if ball is in the hole
    const distToHole = new THREE.Vector2(pos.x - HOLE_POSITION.x, pos.z - HOLE_POSITION.z).length()
    if (distToHole < HOLE_RADIUS && pos.y < 0.3 && moveSpeed < 3) {
      // Ball is in the hole!
      setIsFlying(false)
      onStopped([HOLE_POSITION.x, 0, HOLE_POSITION.z], true)
      return
    }

    // Check if ball has stopped
    const totalVelocity = vel.length()
    if (totalVelocity < MIN_VELOCITY && pos.y <= 0.21) {
      setIsFlying(false)
      onStopped([pos.x, pos.y, pos.z], false)
    }
  })

  return (
    <Sphere
      ref={meshRef}
      args={[0.15, 32, 32]}
      position={position}
      castShadow
    >
      <meshStandardMaterial
        color="#f5f5f5"
        roughness={0.3}
        metalness={0.1}
      />
    </Sphere>
  )
}
