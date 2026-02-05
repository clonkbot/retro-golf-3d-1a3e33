import { useRef } from 'react'
import * as THREE from 'three'
import { Cylinder, Box } from '@react-three/drei'

export default function GolfCourse() {
  const grassMaterial = useRef<THREE.MeshStandardMaterial>(null!)

  return (
    <group>
      {/* Main fairway */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[12, 24]} />
        <meshStandardMaterial
          ref={grassMaterial}
          color="#2d5a2d"
          roughness={0.9}
          metalness={0}
        />
      </mesh>

      {/* Putting green (slightly different shade) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, -6]} receiveShadow>
        <circleGeometry args={[3, 32]} />
        <meshStandardMaterial color="#3a7a3a" roughness={0.7} />
      </mesh>

      {/* Rough edges */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-8, -0.01, 0]} receiveShadow>
        <planeGeometry args={[6, 24]} />
        <meshStandardMaterial color="#1a4a1a" roughness={1} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[8, -0.01, 0]} receiveShadow>
        <planeGeometry args={[6, 24]} />
        <meshStandardMaterial color="#1a4a1a" roughness={1} />
      </mesh>

      {/* Sand bunkers */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-3.5, 0.02, -4]} receiveShadow>
        <circleGeometry args={[1.2, 16]} />
        <meshStandardMaterial color="#e8d4a8" roughness={1} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[3, 0.02, -2]} receiveShadow>
        <circleGeometry args={[0.8, 16]} />
        <meshStandardMaterial color="#e8d4a8" roughness={1} />
      </mesh>

      {/* The Hole */}
      <Cylinder args={[0.15, 0.15, 0.3, 16]} position={[0, -0.1, -8]}>
        <meshStandardMaterial color="#1a1a1a" />
      </Cylinder>

      {/* Flag pole */}
      <Cylinder args={[0.02, 0.02, 2, 8]} position={[0, 1, -8]}>
        <meshStandardMaterial color="#c9a227" metalness={0.8} roughness={0.2} />
      </Cylinder>

      {/* Flag */}
      <mesh position={[0.3, 1.7, -8]}>
        <planeGeometry args={[0.6, 0.4]} />
        <meshStandardMaterial color="#8b0000" side={THREE.DoubleSide} />
      </mesh>

      {/* Decorative trees (simple cones) */}
      {[
        [-7, 0, -5],
        [-8, 0, 3],
        [7, 0, -3],
        [8, 0, 5],
        [-6, 0, 8],
        [6, 0, 9],
      ].map((pos, i) => (
        <group key={i} position={pos as [number, number, number]}>
          {/* Tree trunk */}
          <Cylinder args={[0.15, 0.2, 1, 8]} position={[0, 0.5, 0]} castShadow>
            <meshStandardMaterial color="#4a3728" />
          </Cylinder>
          {/* Tree foliage */}
          <mesh position={[0, 1.8, 0]} castShadow>
            <coneGeometry args={[0.8, 2, 8]} />
            <meshStandardMaterial color="#1a5a1a" />
          </mesh>
          <mesh position={[0, 2.5, 0]} castShadow>
            <coneGeometry args={[0.5, 1.2, 8]} />
            <meshStandardMaterial color="#1a6a1a" />
          </mesh>
        </group>
      ))}

      {/* Tee marker */}
      <Box args={[0.3, 0.1, 0.3]} position={[-0.5, 0.05, 8]}>
        <meshStandardMaterial color="#c9a227" metalness={0.6} roughness={0.3} />
      </Box>
      <Box args={[0.3, 0.1, 0.3]} position={[0.5, 0.05, 8]}>
        <meshStandardMaterial color="#c9a227" metalness={0.6} roughness={0.3} />
      </Box>
    </group>
  )
}
