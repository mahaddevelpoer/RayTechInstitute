'use client';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { codiRobotPose } from '@/lib/learning/codi-tutor';

/** Small procedural robot. No model download, textures, physics or shadow maps. */
export function CodiRobot({ speaking, flying = false }: { speaking: boolean; flying?: boolean }) {
  const host = useRef<HTMLDivElement>(null);
  const pose = useRef({ speaking, flying });
  const redraw = useRef<() => void>();
  const [unavailable, setUnavailable] = useState(false);
  useEffect(() => { pose.current = { speaking, flying }; redraw.current?.(); }, [speaking, flying]);
  useEffect(() => {
    const element = host.current; if (!element) return;
    let renderer: THREE.WebGLRenderer;
    try { renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' }); }
    catch { setUnavailable(true); return; }
    renderer.setClearAlpha(0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.25));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    element.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(30, 1, .1, 30);
    camera.position.set(2.1, 1.9, 6.8); camera.lookAt(0, 1.1, 0);
    scene.add(new THREE.HemisphereLight(0xeaf6ff, 0x385175, 2));
    const light = new THREE.DirectionalLight(0xffffff, 2.8); light.position.set(-3, 5, 4); scene.add(light);
    const blue = new THREE.MeshStandardMaterial({ color: 0x187ed4, roughness: .3, metalness: .25 });
    const trim = new THREE.MeshStandardMaterial({ color: 0x8dcfff, roughness: .35, metalness: .3 });
    const dark = new THREE.MeshStandardMaterial({ color: 0x081c38, roughness: .55 });
    const eye = new THREE.MeshBasicMaterial({ color: 0x8deeff });
    const white = new THREE.MeshStandardMaterial({ color: 0xe9f5ff, roughness: .45 });
    const bot = new THREE.Group(); scene.add(bot);
    const box = (width: number, height: number, depth: number, material: THREE.Material, x: number, y: number, z: number, parent: THREE.Group = bot) => {
      const mesh = new THREE.Mesh(new RoundedBoxGeometry(width, height, depth, 2, Math.min(width, height, depth) * .2), material);
      mesh.position.set(x, y, z); parent.add(mesh); return mesh;
    };
    const head = new THREE.Group(); head.position.y = 1.69; bot.add(head);
    box(1.36, .92, .88, blue, 0, 0, 0, head);
    box(1.13, .61, .08, dark, 0, -.015, .455, head);
    const eyes = [-.28, .28].map(x => box(.19, .23, .035, eye, x, .045, .51, head));
    const mouth = [-.12, 0, .12].map(x => box(.065, .055, .035, eye, x, -.18, .51, head));
    box(.1, .23, .1, trim, 0, .55, 0, head);
    const antenna = new THREE.Mesh(new THREE.SphereGeometry(.1, 12, 8), eye); antenna.position.set(0, .72, 0); head.add(antenna);
    box(.18, .36, .46, trim, -.75, 0, 0, head); box(.18, .36, .46, trim, .75, 0, 0, head);
    box(.28, .16, .26, dark, 0, 1.12, 0);
    box(.93, .76, .65, blue, 0, .76, 0);
    box(.65, .3, .05, trim, 0, .84, .34);
    box(.29, .09, .035, dark, 0, .85, .38);
    const arms = [-1, 1].map(side => {
      const arm = new THREE.Group(); arm.position.set(side * .62, .96, 0); bot.add(arm);
      box(.22, .5, .25, trim, 0, -.2, .06, arm);
      const hand = new THREE.Mesh(new THREE.SphereGeometry(.16, 12, 8), white); hand.position.set(0, -.49, .09); arm.add(hand);
      return arm;
    });
    // Bent legs and forward-pointing boots make the resting pose visibly seated.
    for (const side of [-1, 1]) {
      box(.27, .22, .49, dark, side * .25, .35, .22);
      box(.26, .35, .23, trim, side * .25, .16, .43);
      box(.39, .19, .48, blue, side * .25, -.04, .55);
    }
    const shadow = new THREE.Mesh(new THREE.CircleGeometry(.75, 24), new THREE.MeshBasicMaterial({ color: 0x234c78, transparent: true, opacity: .14, depthWrite: false }));
    shadow.rotation.x = -Math.PI / 2; shadow.position.set(0, -.15, .1); scene.add(shadow);
    let disposed = false; let visible = true; let frame = 0; let last = 0;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const schedule = () => { if (!disposed && visible && !document.hidden && !frame) frame = requestAnimationFrame(draw); };
    const draw = (now: number) => {
      frame = 0; if (disposed || !visible || document.hidden) return;
      if (now - last >= 33 || reduced.matches) {
        last = now; const seconds = now / 1000; const state = pose.current;
        const animated = codiRobotPose(seconds, state.speaking, state.flying, reduced.matches);
        for (const mesh of eyes) mesh.scale.y = animated.eyeScale;
        mouth.forEach((mesh, index) => { mesh.scale.y = animated.mouth[index]; });
        bot.position.y = animated.bodyY; head.rotation.y = animated.headYaw;
        arms[0].rotation.z = -animated.arm; arms[1].rotation.z = animated.arm;
        bot.rotation.z = animated.lean;
        shadow.visible = !state.flying; renderer.render(scene, camera);
      }
      if (!reduced.matches) schedule();
    };
    redraw.current = schedule;
    const resize = () => { const width = element.clientWidth || 150; const height = element.clientHeight || 160; renderer.setSize(width, height); camera.aspect = width / height; camera.updateProjectionMatrix(); schedule(); };
    const observer = new ResizeObserver(resize); observer.observe(element);
    const intersection = new IntersectionObserver(entries => { visible = entries[0]?.isIntersecting !== false; if (!visible) { cancelAnimationFrame(frame); frame = 0; } else schedule(); }); intersection.observe(element);
    document.addEventListener('visibilitychange', schedule); reduced.addEventListener('change', schedule); resize();
    return () => {
      disposed = true; redraw.current = undefined; cancelAnimationFrame(frame); observer.disconnect(); intersection.disconnect(); document.removeEventListener('visibilitychange', schedule); reduced.removeEventListener('change', schedule);
      const geometries = new Set<THREE.BufferGeometry>(); const materials = new Set<THREE.Material>();
      scene.traverse(object => { if (object instanceof THREE.Mesh) { geometries.add(object.geometry); for (const material of Array.isArray(object.material) ? object.material : [object.material]) materials.add(material); } });
      geometries.forEach(geometry => geometry.dispose()); materials.forEach(material => material.dispose()); renderer.dispose(); renderer.forceContextLoss(); renderer.domElement.remove();
    };
  }, []);
  return <span ref={host} className="codi-robot" role="img" aria-label="Codi, a blue 3D robot tutor with blinking eyes" data-model-loaded={!unavailable}>{unavailable && <span className="codi-robot-fallback">Codi</span>}</span>;
}
