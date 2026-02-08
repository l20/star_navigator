'use client';

import { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';
import { useMathStore } from '@/store/useMathStore';
import { Stage, Layer, Rect, Text, Circle } from 'react-konva';
import { synth } from '@/lib/audio/synth';

export default function GameCanvas() {
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Math Store Access
  const { a, h, k, targetA, completeLevel, isLevelComplete } = useMathStore();

  // Physics Refs
  const engineRef = useRef<Matter.Engine | null>(null);
  const runnerRef = useRef<Matter.Runner | null>(null);
  const bridgeBodiesRef = useRef<Matter.Body[]>([]);
  const merchantRef = useRef<Matter.Body | null>(null);
  const starFieldRef = useRef<{ x: number, y: number, z: number }[]>([]); // New Ref for Starfield Physics

  // Game State (Syncs with Physics)
  const [gameState, setGameState] = useState<{
    merchant: { x: number; y: number; angle: number } | null;
    cliffs: { x: number; y: number; width: number; height: number }[];
    bridgeSegments: { x: number; y: number; angle: number; width: number; height: number }[];
    stars: { x: number; y: number; radius: number; opacity: number }[]; // New Render State
  }>({
    merchant: null,
    cliffs: [],
    bridgeSegments: [],
    stars: []
  });

  // Rebuild Bridge when Math Params Change
  useEffect(() => {
    if (!engineRef.current) return;
    const world = engineRef.current.world;

    // 1. Remove old bridge
    if (bridgeBodiesRef.current.length > 0) {
      Matter.World.remove(world, bridgeBodiesRef.current);
    }

    // 2. Calculate new bridge points
    const bridgeStartX = dimensions.width * 0.2;
    const bridgeEndX = dimensions.width * 0.8;
    const segments = 20;
    const segmentWidth = (bridgeEndX - bridgeStartX) / segments;

    const newBodies: Matter.Body[] = [];

    for (let i = 0; i < segments; i++) {
      const centerX = bridgeStartX + i * segmentWidth + segmentWidth / 2;
      const centerY = a * Math.pow(centerX - h, 2) + k;
      const slope = 2 * a * (centerX - h);
      const angle = Math.atan(slope);

      const segment = Matter.Bodies.rectangle(centerX, centerY, segmentWidth + 2, 10, {
        isStatic: true,
        angle: angle,
        render: { fillStyle: '#cbd5e1' },
        friction: 0.8
      });
      newBodies.push(segment);
    }

    // 3. Add new bridge to world
    Matter.World.add(world, newBodies);
    bridgeBodiesRef.current = newBodies;

  }, [a, h, k, dimensions]);

  // Win Condition Check Loop
  useEffect(() => {
    const interval = setInterval(() => {
      // 1. Math Win Logic (Independent of Physics)
      // Relaxed threshold to 0.001 to ensure if MathOverlay shines, we trigger
      let isMathCorrect = true;

      // Check A
      if (targetA !== undefined && Math.abs(a - targetA) > 0.001) isMathCorrect = false;

      // Check H (Pixel tolerance relaxed to 30 to match visual feedback)
      if (useMathStore.getState().targetH !== undefined) {
        const th = useMathStore.getState().targetH!;
        if (Math.abs(h - th) > 30) isMathCorrect = false;
      }

      // Check K (Pixel tolerance relaxed to 30)
      if (useMathStore.getState().targetK !== undefined) {
        const tk = useMathStore.getState().targetK!;
        if (Math.abs(k - tk) > 30) isMathCorrect = false;
      }

      // [STORY MODE OVERRIDE] Level 3 Sacrifice Logic
      if (useMathStore.getState().storyMode && useMathStore.getState().level === 3) {
        // Target is a=10 (Scripted)
        if (Math.abs(a - 10) < 0.5) isMathCorrect = true;
        else isMathCorrect = false;
      }

      // Debug log every second to confirm loop is alive
      if (Math.random() < 0.05) console.log("Loop heartbeat. Correct:", isMathCorrect, "A:", a);

      if (isMathCorrect) {
        // A. Trigger Win IMMEDIATELY
        if (!isLevelComplete) {
          console.log("TRIGGERING WIN: Level Complete");
          completeLevel();
          synth.playTone(600, 'sine', 0.2, 0.2); // Success Sound
          synth.playTone(800, 'sine', 0.4, 0.2);
        }

        // B. Physical Celebration (Run to the right)
        // Only attempt physics if merchant exists
        if (merchantRef.current) {
          if (merchantRef.current.position.x < dimensions.width * 0.9) {
            if (merchantRef.current.isSleeping) Matter.Sleeping.set(merchantRef.current, false);
            Matter.Body.setVelocity(merchantRef.current, { x: 5, y: -2 });
          }
        }
      }

      // Stop here if no merchant ref (don't crash on respawn check)
      if (!merchantRef.current) return;

      // 3. Respawn Logic (Only if NOT won)
      if (!isLevelComplete && merchantRef.current.position.y > dimensions.height + 100) {
        Matter.Body.setPosition(merchantRef.current, { x: dimensions.width * 0.1, y: dimensions.height * 0.5 });
        Matter.Body.setVelocity(merchantRef.current, { x: 0, y: 0 });
      }
    }, 30); // 30ms interval = ~33fps checks (smoother movement)
    return () => clearInterval(interval);
  }, [a, targetA, dimensions, isLevelComplete, completeLevel]);

  // Init Physics (Run Once)
  useEffect(() => {
    if (!containerRef.current) return;

    // 1. Setup Matter.js Engine
    const engine = Matter.Engine.create();
    const world = engine.world;
    engineRef.current = engine;

    // 2. Create Level Layout
    const width = containerRef.current.offsetWidth;
    const height = containerRef.current.offsetHeight;

    // Static Cliffs
    const groundOptions = { isStatic: true, render: { fillStyle: '#334155' } };
    const leftCliff = Matter.Bodies.rectangle(width * 0.1, height * 0.7, width * 0.2, 20, groundOptions);
    const rightCliff = Matter.Bodies.rectangle(width * 0.9, height * 0.7, width * 0.2, 20, groundOptions);

    // Safety Wall on Right (Invisible) to catch winner
    const rightWall = Matter.Bodies.rectangle(width + 25, height / 2, 50, height * 2, { isStatic: true });

    // Death Zone Sensor
    const water = Matter.Bodies.rectangle(width / 2, height + 50, width, 100, { isStatic: true, isSensor: true });

    // Merchant (Rounded Corners for sliding)
    const merchant = Matter.Bodies.rectangle(width * 0.1, height * 0.5, 30, 30, {
      restitution: 0.1,
      friction: 0.5,
      density: 0.002,
      chamfer: { radius: 10 }, // ROUNDED CORNERS!
      label: 'merchant'
    });
    merchantRef.current = merchant;

    Matter.World.add(world, [leftCliff, rightCliff, rightWall, water, merchant]);

    // 3. Runner
    const runner = Matter.Runner.create();
    runnerRef.current = runner;
    Matter.Runner.run(runner, engine);

    // 4. Render Loop
    let animationFrameId: number;
    const loop = () => {
      // Update Stars (Warp Effect)
      const stars: { x: number; y: number; radius: number; opacity: number }[] = [];
      const centerX = width / 2;
      const centerY = height / 2;
      const speed = 2; // Much slower for ambient feel (was 25)

      // We use a persistent ref for stars to avoid jitter, but for React State approach
      // we'll regenerate 'view' positions from 'world' positions.
      // ACTUALLY: Let's use a MutableRef for star data to maintain continuity across frames
      // without heavy re-allocations, then just push render-ready data to state.

      if (!starFieldRef.current.length) {
        // Init stars - reduced count
        for (let i = 0; i < 60; i++) {
          starFieldRef.current.push({
            x: Math.random() * width - width / 2,
            y: Math.random() * height - height / 2,
            z: Math.random() * width // Depth
          });
        }
      } else if (starFieldRef.current.length > 60) {
        // Trim if too many (handling HMR or updates)
        starFieldRef.current = starFieldRef.current.slice(0, 60);
      }

      starFieldRef.current.forEach(star => {
        star.z -= speed;
        if (star.z <= 0) {
          star.z = width;
          star.x = Math.random() * width - width / 2;
          star.y = Math.random() * height - height / 2;
        }
      });

      // Project 3D stars to 2D
      const renderStars = starFieldRef.current.map(star => {
        const k = 128.0 / star.z; // Perspective scale
        const px = star.x * k + centerX;
        const py = star.y * k + centerY;

        // Don't render if out of bounds
        if (px < 0 || px > width || py < 0 || py > height) return null;

        const size = (1 - star.z / width) * 3;
        const opacity = (1 - star.z / width);

        return { x: px, y: py, radius: size, opacity };
      }).filter(Boolean) as { x: number; y: number; radius: number; opacity: number }[];


      // Sync React state with Matter.js bodies AND Stars
      setGameState({
        merchant: {
          x: merchant.position.x,
          y: merchant.position.y,
          angle: merchant.angle,
        },
        cliffs: [
          { x: leftCliff.position.x, y: leftCliff.position.y, width: width * 0.2, height: 20 },
          { x: rightCliff.position.x, y: rightCliff.position.y, width: width * 0.2, height: 20 },
        ],
        bridgeSegments: bridgeBodiesRef.current.map(b => ({
          x: b.position.x,
          y: b.position.y,
          angle: b.angle,
          width: (width * 0.6) / 20 + 2,
          height: 10
        })),
        stars: renderStars
      });
      animationFrameId = requestAnimationFrame(loop);
    };
    loop();

    // Resize
    const handleResize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight
        });
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      cancelAnimationFrame(animationFrameId);
      Matter.Runner.stop(runner);
      Matter.Engine.clear(engine);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full bg-slate-900 overflow-hidden relative">
      <Stage width={dimensions.width} height={dimensions.height}>
        <Layer>
          {/* Use solid dark background as user reverted transparency */}
          <Rect
            x={0}
            y={0}
            width={dimensions.width}
            height={dimensions.height}
            fill="#050510" // Dark Space
          />

          {/* Warp Starfield */}
          {gameState.stars.map((star, i) => (
            <Circle
              key={`star-${i}`}
              x={star.x}
              y={star.y}
              radius={star.radius}
              fill="#ffffff"
              opacity={star.opacity}
              shadowColor="white"
              shadowBlur={star.radius * 2}
            />
          ))}

          {/* Render Cliffs */}
          {gameState.cliffs.map((cliff, i) => (
            <Rect
              key={`cliff-${i}`}
              x={cliff.x - cliff.width / 2}
              y={cliff.y - cliff.height / 2}
              width={cliff.width}
              height={cliff.height}
              fill="#334155"
              stroke="#475569"
              strokeWidth={2}
            />
          ))}

          {/* Render Bridge Segments (The Dynamic Math Part) */}
          {gameState.bridgeSegments.map((seg, i) => (
            <Rect
              key={`seg-${i}`}
              x={seg.x}
              y={seg.y}
              width={seg.width}
              height={seg.height}
              offsetX={seg.width / 2}
              offsetY={seg.height / 2}
              rotation={(seg.angle * 180) / Math.PI}
              fill={isLevelComplete ? "#4ade80" : "#38bdf8"} // Green on success
              opacity={0.8}
              shadowBlur={5}
              shadowColor="#0ea5e9"
            />
          ))}

          {/* Render Merchant */}
          {gameState.merchant && (
            <Rect
              x={gameState.merchant.x}
              y={gameState.merchant.y}
              width={30}
              height={30}
              offsetX={15}
              offsetY={15}
              rotation={(gameState.merchant.angle * 180) / Math.PI}
              fill="#f59e0b"
              stroke="#b45309"
              strokeWidth={2}
              cornerRadius={4}
            />
          )}

          {/* Debug / Victory Info */}
          {isLevelComplete && (
            <Text
              text="引力场稳定！(GRAVITY STABILIZED)"
              x={dimensions.width / 2 - 200}
              y={dimensions.height / 2 - 50}
              fontSize={32}
              fontStyle="bold"
              fill="#4ade80"
              shadowColor="black"
              shadowBlur={10}
            />
          )}

          <Text
            text={`物理: 运行 | A: ${a.toFixed(5)} | Target: ${targetA ?? 'N/A'}`}
            x={dimensions.width - 350}
            y={20}
            fill="#22c55e"
            fontFamily="monospace"
            fontSize={12}
            opacity={0.5}
          />

          {/* Big Background System Message */}
          {/* <Text
            text={`SYSTEM // ${isLevelComplete ? 'TARGET_LOCKED' : 'AWAITING_INPUT'} // A:${a.toFixed(4)}`}
            x={20}
            y={dimensions.height - 40}
            fontSize={64}
            fontFamily="monospace"
            fill={isLevelComplete ? '#22c55e' : '#0ea5e9'}
            opacity={0.1}
            fontStyle="bold"
            listening={false}
          /> */}
          <Text
            text="[强制检测]"
            x={dimensions.width - 350}
            y={40}
            fill="#facc15"
            fontSize={12}
            fontFamily="monospace"
            onClick={() => {
              console.log("Force Check Clicked");
              if (targetA !== undefined && Math.abs(a - targetA) < 0.002) {
                completeLevel();
              }
            }}
            onMouseEnter={(e) => {
              const container = e.target.getStage()?.container();
              if (container) container.style.cursor = "pointer";
            }}
            onMouseLeave={(e) => {
              const container = e.target.getStage()?.container();
              if (container) container.style.cursor = "default";
            }}
          />
        </Layer>
      </Stage>
    </div>
  );
}
