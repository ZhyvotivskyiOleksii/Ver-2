'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

type GlowConfig = {
  size: number;
  color: string;
  opacity: number;
  position: [number, number, number];
  tilt?: number;
  drift?: number;
  waveAmp?: number;
  waveSpeed?: number;
};

// Glow layers for atmospheric fog effect - deeper and more visible
const GLOW_LAYERS: GlowConfig[] = [
  // Deep blue fog - bottom left, creates depth
  {
    size: 1400,
    color: '#1e3a8a',
    opacity: 0.35,
    position: [-280, -180, -400],
    tilt: -5,
    waveAmp: 50,
    waveSpeed: 0.00015,
  },
  // Cyan/teal mist - left side
  {
    size: 1100,
    color: '#0891b2',
    opacity: 0.28,
    position: [-320, 60, -350],
    tilt: 8,
    waveAmp: 40,
    waveSpeed: 0.0002,
  },
  // Deep purple nebula - top center - more prominent
  {
    size: 1400,
    color: '#4c1d95',
    opacity: 0.32,
    position: [0, 200, -450],
    waveAmp: 35,
    waveSpeed: 0.00018,
  },
  // Rose/crimson fog - right edge
  {
    size: 1300,
    color: '#9f1239',
    opacity: 0.30,
    position: [350, -50, -380],
    tilt: -8,
    drift: 0.0001,
    waveAmp: 45,
    waveSpeed: 0.00022,
  },
  // Warm orange accent - far right
  {
    size: 1000,
    color: '#c2410c',
    opacity: 0.22,
    position: [380, 120, -500],
    tilt: 12,
    waveAmp: 30,
    waveSpeed: 0.00025,
  },
  // Deep space purple - far center background - base layer
  {
    size: 1800,
    color: '#2e1065',
    opacity: 0.20,
    position: [0, 0, -600],
    waveAmp: 25,
    waveSpeed: 0.00012,
  },
  // Extra deep violet - adds depth
  {
    size: 2000,
    color: '#1e1b4b',
    opacity: 0.15,
    position: [0, -100, -800],
    waveAmp: 20,
    waveSpeed: 0.0001,
  },
];

type StarLayerConfig = {
  count: number;
  color: number;
  size: number;
  depth: number;
  parallax: number;
  spin: number;
  speed: number;
  opacity: number;
  twinkle: number;
  twinkleSpeed: number;
};

const STAR_LAYERS: StarLayerConfig[] = [
  // Very distant tiny stars - more stars for richer sky
  { count: 1200, color: 0xffffff, size: 0.25, depth: 1600, parallax: 0.02, spin: -0.00003, speed: 0.003, opacity: 0.08, twinkle: 0.012, twinkleSpeed: 0.0001 },
  // Far distant stars
  { count: 800, color: 0xffffff, size: 0.4, depth: 1200, parallax: 0.05, spin: -0.00005, speed: 0.006, opacity: 0.12, twinkle: 0.018, twinkleSpeed: 0.00015 },
  // Mid-distance stars - brighter
  { count: 500, color: 0xffffff, size: 0.55, depth: 800, parallax: 0.12, spin: 0.00008, speed: 0.012, opacity: 0.18, twinkle: 0.025, twinkleSpeed: 0.0002 },
  // Closer stars - more visible
  { count: 300, color: 0xffffff, size: 0.75, depth: 550, parallax: 0.2, spin: -0.00006, speed: 0.02, opacity: 0.22, twinkle: 0.03, twinkleSpeed: 0.00025 },
  // Very close bright stars
  { count: 100, color: 0xffffff, size: 1.0, depth: 350, parallax: 0.3, spin: 0.00004, speed: 0.025, opacity: 0.28, twinkle: 0.04, twinkleSpeed: 0.0003 },
];

const FLOATING_PARTICLES = {
  count: 60,
  spread: new THREE.Vector3(260, 170, 240),
};

const ENABLE_FLOATING_PARTICLES = true;

export function ParallaxBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const container = containerRef.current;
    if (!container) return;

    const isMobile = window.matchMedia('(max-width: 768px)').matches;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      2000
    );
    camera.position.set(0, 0, 100);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    const maxPixelRatio = isMobile ? 1 : 1.25;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, maxPixelRatio));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const group = new THREE.Group();
    const starsGroup = new THREE.Group();
    scene.add(group);
    scene.add(starsGroup);

    const disposables: Array<THREE.Object3D | THREE.Material | THREE.BufferGeometry> = [];

    type StarMeta = {
      points: THREE.Points;
      config: StarLayerConfig;
      positions: Float32Array;
      twinklePhase: number;
    };
    const starFields: StarMeta[] = [];

    STAR_LAYERS.forEach(config => {
      const layerCount = Math.max(150, Math.round(config.count * (isMobile ? 0.5 : 1)));
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(layerCount * 3);
      for (let i = 0; i < layerCount; i += 1) {
        const i3 = i * 3;
        positions[i3] = (Math.random() - 0.5) * 500;
        positions[i3 + 1] = (Math.random() - 0.5) * 350;
        positions[i3 + 2] = -(Math.random() * config.depth + 100);
      }
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      const material = new THREE.PointsMaterial({
        size: config.size,
        color: config.color,
        transparent: true,
        opacity: config.opacity,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const points = new THREE.Points(geometry, material);
      starsGroup.add(points);
      starFields.push({ points, config, positions, twinklePhase: Math.random() * Math.PI * 2 });
      disposables.push(points, geometry, material);
    });

    const createGlowMaterial = (color: string, opacity: number) =>
      new THREE.ShaderMaterial({
        uniforms: {
          glowColor: { value: new THREE.Color(color) },
          glowOpacity: { value: opacity },
        },
        vertexShader: `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          varying vec2 vUv;
          uniform vec3 glowColor;
          uniform float glowOpacity;
          void main() {
            float dist = distance(vUv, vec2(0.5));
            // Very soft fog-like falloff - no visible edges
            float fog = 1.0 - smoothstep(0.0, 0.65, dist);
            // Extra soft outer edge
            float softEdge = pow(fog, 2.5);
            float alpha = softEdge * glowOpacity;
            gl_FragColor = vec4(glowColor, alpha);
          }
        `,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });

    const glowMeshes: Array<{ mesh: THREE.Mesh; config: GlowConfig }> = [];

    GLOW_LAYERS.forEach(config => {
      const geometry = new THREE.PlaneGeometry(config.size, config.size, 1, 1);
      const material = createGlowMaterial(config.color, config.opacity);
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(...config.position);
      mesh.rotation.x = THREE.MathUtils.degToRad(config.tilt ?? 0);
      group.add(mesh);

      glowMeshes.push({ mesh, config });
      disposables.push(mesh, geometry, material);
    });

    const dummy = new THREE.Object3D();
    let floatingMesh: THREE.InstancedMesh | null = null;
    type FloatingParticle = {
      position: THREE.Vector3;
      velocity: THREE.Vector3;
      baseScale: number;
      phase: number;
    };
    const floatingParticles: FloatingParticle[] = [];

    const floatingCount = ENABLE_FLOATING_PARTICLES
      ? Math.max(20, Math.round(FLOATING_PARTICLES.count * (isMobile ? 0.65 : 1)))
      : 0;

    if (floatingCount > 0) {
      const floatingGeometry = new THREE.SphereGeometry(0.6, 12, 12);
      const floatingMaterial = new THREE.MeshBasicMaterial({
        color: 0xfcf7ff,
        transparent: true,
        opacity: 0.28,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      floatingMesh = new THREE.InstancedMesh(floatingGeometry, floatingMaterial, floatingCount);
      floatingMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
      group.add(floatingMesh);
      disposables.push(floatingMesh, floatingGeometry, floatingMaterial);

      floatingParticles.push(
        ...Array.from({ length: floatingCount }, () => ({
          position: new THREE.Vector3(
            (Math.random() - 0.5) * FLOATING_PARTICLES.spread.x,
            (Math.random() - 0.5) * FLOATING_PARTICLES.spread.y,
            -80 - Math.random() * FLOATING_PARTICLES.spread.z
          ),
          velocity: new THREE.Vector3(
            (Math.random() - 0.5) * 0.015,  // Much slower
            (Math.random() - 0.5) * 0.015,
            (Math.random() - 0.5) * 0.008
          ),
          baseScale: Math.random() * 0.6 + 0.2,
          phase: Math.random() * Math.PI * 2,
        }))
      );
    }

    const pointer = { x: 0, y: 0 };
    const scroll = { target: 0 };

    const handlePointerMove = (event: PointerEvent) => {
      // Very subtle mouse influence - slow floating feeling
      pointer.x = (event.clientX / window.innerWidth - 0.5) * 0.15;
      pointer.y = (event.clientY / window.innerHeight - 0.5) * 0.12;
    };

    const handleScroll = () => {
      const maxScroll = Math.max(document.body.scrollHeight - window.innerHeight, 1);
      scroll.target = window.scrollY / maxScroll;
    };

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);
    handleScroll();

    let animationFrame: number;
    let previousTime = 0;
    const animate = (time = 0) => {
      animationFrame = requestAnimationFrame(animate);
      const delta = Math.min((time - previousTime) / 16.67 || 1, 3);
      previousTime = time;

      const scrollOffset = (scroll.target - 0.5) * 20;

      // Very slow, subtle camera movement - floating in space
      camera.position.z += ((100 + scroll.target * 30) - camera.position.z) * 0.008;
      camera.position.x += (pointer.x * 8 - camera.position.x) * 0.006;
      camera.position.y += (pointer.y * 6 - camera.position.y) * 0.006;
      camera.lookAt(0, 0, -100);

      // Gentle rotation - very slow response
      group.rotation.x += (pointer.y * 0.15 - group.rotation.x) * 0.012;
      group.rotation.y += (pointer.x * 0.15 - group.rotation.y) * 0.012;
      group.position.y += (scrollOffset - group.position.y) * 0.02;
      group.position.x += (pointer.x * 8 - group.position.x) * 0.015;

      // Stars move even slower for depth
      starsGroup.rotation.x += (pointer.y * 0.08 - starsGroup.rotation.x) * 0.008;
      starsGroup.rotation.y += (pointer.x * 0.08 - starsGroup.rotation.y) * 0.008;
      starFields.forEach(({ points, config, positions, twinklePhase }) => {
        points.rotation.z += config.spin * 0.5;
        points.position.x = pointer.x * 40 * config.parallax;
        points.position.y = scrollOffset * 2 * config.parallax;

        for (let i = 0; i < positions.length; i += 3) {
          positions[i + 2] += config.speed * delta;
          if (positions[i + 2] > -50) {
            positions[i + 2] = -config.depth - Math.random() * 80;
            positions[i] = (Math.random() - 0.5) * 500;
            positions[i + 1] = (Math.random() - 0.5) * 350;
          }
        }
        points.geometry.attributes.position.needsUpdate = true;
        const material = points.material as THREE.PointsMaterial;
        const twinkle = config.opacity + Math.sin(time * config.twinkleSpeed + twinklePhase) * config.twinkle;
        material.opacity = Math.max(0.05, twinkle);
      });

      // Glow meshes drift very slowly - like distant nebulae
      glowMeshes.forEach(({ mesh, config }) => {
        if (config.drift) {
          mesh.rotation.z += config.drift * 0.3;
        }
        if (config.waveAmp && config.waveSpeed) {
          // Very slow, gentle breathing movement
          mesh.position.x = config.position[0] + Math.sin(time * config.waveSpeed * 0.5) * config.waveAmp * 0.4;
          mesh.position.y = config.position[1] + Math.cos(time * config.waveSpeed * 0.4) * (config.waveAmp * 0.3);
        }
      });

      if (floatingMesh && floatingParticles.length) {
        const xLimit = FLOATING_PARTICLES.spread.x * 0.5;
        const yLimit = FLOATING_PARTICLES.spread.y * 0.5;
        const zMax = 40;
        const zMin = -FLOATING_PARTICLES.spread.z - 40;

        floatingParticles.forEach((particle, index) => {
          particle.position.addScaledVector(particle.velocity, delta);
          particle.phase += 0.0025 * delta;

          if (particle.position.x > xLimit) particle.position.x = -xLimit;
          if (particle.position.x < -xLimit) particle.position.x = xLimit;
          if (particle.position.y > yLimit) particle.position.y = -yLimit;
          if (particle.position.y < -yLimit) particle.position.y = yLimit;
          if (particle.position.z > zMax) particle.position.z = zMin;
          if (particle.position.z < zMin) particle.position.z = zMax;

          dummy.position.copy(particle.position);
          const scalePulse = particle.baseScale + Math.sin(particle.phase + index) * 0.12;
          dummy.scale.setScalar(scalePulse);
          dummy.rotation.z = Math.sin(time * 0.0002 + index) * 0.2;
          dummy.updateMatrix();
          floatingMesh.setMatrixAt(index, dummy.matrix);
        });
        floatingMesh.instanceMatrix.needsUpdate = true;
      }

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      disposables.forEach(obj => {
        if ('geometry' in obj && obj.geometry) obj.geometry.dispose();
        if ('material' in obj && obj.material) {
          if (Array.isArray(obj.material)) {
            obj.material.forEach(mat => mat.dispose());
          } else {
            obj.material.dispose();
          }
        }
        if ('dispose' in obj && typeof obj.dispose === 'function') {
          (obj as any).dispose?.();
        }
      });
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={containerRef} className="global-parallax" aria-hidden="true" />;
}
