"use client";

import React, { Suspense, useMemo, Component } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Environment, Html } from "@react-three/drei";
import * as THREE from "three";

class ViewportErrorBoundary extends Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any) {
    console.warn("AvatarViewer 3D load error:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Html center style={{ color: "#ff3b5c", fontSize: 12, fontWeight: "600", textAlign: "center", background: "rgba(0,0,0,0.85)", padding: "10px 14px", borderRadius: 8, border: "1px solid #ff3b5c" }}>
          ⚠️ Error al cargar malla 3D
        </Html>
      );
    }
    return this.props.children;
  }
}

function encuadrar(objeto: THREE.Object3D, alturaDeseada = 2) {
  const clon = objeto.clone(true);

  // Orientar el personaje parado (TripoSR Z-up -> Three.js Y-up)
  clon.rotation.x = -Math.PI / 2;

  const caja = new THREE.Box3().setFromObject(clon);
  const tamano = caja.getSize(new THREE.Vector3());
  const centro = caja.getCenter(new THREE.Vector3());

  const mayor = Math.max(tamano.x, tamano.y, tamano.z) || 1;
  const escala = alturaDeseada / mayor;

  clon.position.set(-centro.x * escala, -centro.y * escala, -centro.z * escala);
  clon.scale.setScalar(escala);

  clon.traverse((hijo: any) => {
    if (!hijo.isMesh) return;
    if (!hijo.material || !hijo.material.isMeshStandardMaterial) {
      hijo.material = new THREE.MeshStandardMaterial({
        color: hijo.material?.color ?? new THREE.Color(0xcccccc),
        map: hijo.material?.map ?? null,
        vertexColors: !!hijo.geometry?.attributes?.color,
        roughness: 0.85,
        metalness: 0.1,
      });
    }
    hijo.material.side = THREE.DoubleSide;
  });

  return clon;
}

function ModeloGLB({ url }: { url: string }) {
  let targetUrl = url;
  if (targetUrl && typeof window !== "undefined") {
    if (targetUrl.includes("127.0.0.1:3212") || targetUrl.includes("localhost:3212")) {
      targetUrl = targetUrl.replace("http://127.0.0.1:3212", "https://tangy-clouds-grab.loca.lt").replace("http://localhost:3212", "https://tangy-clouds-grab.loca.lt");
    }
  }

  if (targetUrl && targetUrl.includes("loca.lt") && !targetUrl.includes("bypass-tunnel-reminder")) {
    targetUrl += (targetUrl.includes("?") ? "&" : "?") + "bypass-tunnel-reminder=true";
  }

  // Three.js GLTFLoader necesita saber que es un binario .glb por la extensión del URL
  if (targetUrl && !targetUrl.includes(".glb") && !targetUrl.includes(".gltf")) {
    targetUrl += "#avatar.glb";
  }

  const { scene } = useGLTF(targetUrl);
  const listo = useMemo(() => encuadrar(scene), [scene]);
  return <primitive object={listo} />;
}

function Cargando() {
  return (
    <Html center style={{ color: "#0ea5e9", fontSize: 12, fontWeight: "600", letterSpacing: "0.1em", whiteSpace: "nowrap" }}>
      SINTETIZANDO 3D...
    </Html>
  );
}

export default function AvatarViewer({ avatarUrl, theme = "equilibrio" }: { avatarUrl?: string; theme?: string }) {
  if (!avatarUrl) return null;

  const lightColor = theme === "prudencia" ? "#0ea5e9" : theme === "valentia" ? "#ff3b5c" : "#38bdf8";

  return (
    <div className="w-full h-full relative flex items-center justify-center">
      <Canvas camera={{ position: [0, 0.4, 3.8], fov: 45 }} dpr={[1, 2]}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[3, 5, 2]} intensity={1.5} color={lightColor} />
        <directionalLight position={[-3, 2, -2]} intensity={0.6} color="#ffffff" />
        <pointLight position={[0, -1, 2]} intensity={0.5} color={lightColor} />
        <Suspense fallback={<Cargando />}>
          <ViewportErrorBoundary key={avatarUrl}>
            <ModeloGLB url={avatarUrl} />
          </ViewportErrorBoundary>
          <Environment preset="night" />
        </Suspense>
        <OrbitControls
          enablePan={false}
          enableZoom
          minDistance={1.2}
          maxDistance={6}
          autoRotate
          autoRotateSpeed={1.2}
        />
      </Canvas>
    </div>
  );
}
