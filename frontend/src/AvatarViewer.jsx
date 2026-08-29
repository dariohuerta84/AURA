import { Suspense, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Environment, Html } from "@react-three/drei";
import { useLoader } from "@react-three/fiber";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import * as THREE from "three";

/**
 * Visor del avatar 3D. El "movimiento" es girar la camara arrastrando
 * el mouse (OrbitControls); no hay animacion de huesos.
 */

/**
 * Centra y escala el mesh para que siempre entre en cuadro.
 * TripoSR no devuelve una escala fija, asi que fijar scale/position a mano
 * hace que un avatar salga gigante y el siguiente microscopico.
 */
function encuadrar(objeto, alturaDeseada = 2) {
  const clon = objeto.clone(true);
  const caja = new THREE.Box3().setFromObject(clon);
  const tamano = caja.getSize(new THREE.Vector3());
  const centro = caja.getCenter(new THREE.Vector3());

  const mayor = Math.max(tamano.x, tamano.y, tamano.z) || 1;
  const escala = alturaDeseada / mayor;

  clon.position.set(-centro.x * escala, -centro.y * escala, -centro.z * escala);
  clon.scale.setScalar(escala);

  clon.traverse((hijo) => {
    if (!hijo.isMesh) return;
    // Los meshes de TripoSR llegan sin material PBR; sin esto se ven planos.
    if (!hijo.material || !hijo.material.isMeshStandardMaterial) {
      hijo.material = new THREE.MeshStandardMaterial({
        color: hijo.material?.color ?? new THREE.Color(0xcccccc),
        map: hijo.material?.map ?? null,
        vertexColors: !!hijo.geometry?.attributes?.color,
        roughness: 0.85,
        metalness: 0.0,
      });
    }
    hijo.material.side = THREE.DoubleSide;
  });

  return clon;
}

function ModeloGLB({ url }) {
  const { scene } = useGLTF(url);
  const listo = useMemo(() => encuadrar(scene), [scene]);
  return <primitive object={listo} />;
}

function ModeloOBJ({ url }) {
  const objeto = useLoader(OBJLoader, url);
  const listo = useMemo(() => encuadrar(objeto), [objeto]);
  return <primitive object={listo} />;
}

function Cargando() {
  return <Html center style={{ color: "#888", fontSize: 13 }}>Cargando modelo…</Html>;
}

export default function AvatarViewer({ avatarUrl }) {
  if (!avatarUrl) return null;

  const esObj = avatarUrl.split("?")[0].toLowerCase().endsWith(".obj");

  return (
    <div className="visor">
      <Canvas camera={{ position: [0, 0.6, 4], fov: 45 }} dpr={[1, 2]}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[3, 5, 2]} intensity={1.2} />
        <directionalLight position={[-3, 2, -2]} intensity={0.4} />
        <Suspense fallback={<Cargando />}>
          {esObj ? <ModeloOBJ url={avatarUrl} /> : <ModeloGLB url={avatarUrl} />}
          <Environment preset="studio" />
        </Suspense>
        <OrbitControls
          enablePan={false}
          enableZoom
          minDistance={1.5}
          maxDistance={8}
          autoRotate
          autoRotateSpeed={0.8}
        />
      </Canvas>
    </div>
  );
}
