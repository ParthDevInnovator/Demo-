"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

interface ThreeTopologyProps {
  scrollProgress?: number; // 0–1, used for subtle camera parallax
}

export default function ThreeTopology({ scrollProgress = 0 }: ThreeTopologyProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef(scrollProgress);

  // Keep scroll ref in sync without re-running the main effect
  useEffect(() => {
    scrollRef.current = scrollProgress;
  }, [scrollProgress]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || 520;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(0, 16, 36);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    // Controlled, professional studio lighting
    const ambientLight = new THREE.AmbientLight(0x191E24, 1.8);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
    keyLight.position.set(20, 30, 20);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x729FF5, 0.6);
    fillLight.position.set(-20, -10, -15);
    scene.add(fillLight);

    const accentLight = new THREE.PointLight(0x5B8DEF, 1.2, 40);
    accentLight.position.set(0, 4, 0);
    scene.add(accentLight);

    // Root group
    const topologyGroup = new THREE.Group();
    scene.add(topologyGroup);

    // Infrastructure components
    const nodesData = [
      { name: "Kubernetes Control Plane", role: "core", pos: [0, 2, 0] as const, isPrimary: true, size: 2.0 },
      { name: "API Gateway", role: "gateway", pos: [-10, 4, 5] as const, isPrimary: false, size: 1.5 },
      { name: "Auth Service", role: "service", pos: [-13, -2, 2] as const, isPrimary: false, size: 1.3 },
      { name: "PostgreSQL Primary", role: "db", pos: [11, -3, 3] as const, isPrimary: false, size: 1.7 },
      { name: "Redis Cache Cluster", role: "cache", pos: [8, 5, -5] as const, isPrimary: false, size: 1.4 },
      { name: "Edge CDN Shard", role: "edge", pos: [-6, 8, -8] as const, isPrimary: false, size: 1.5 },
      { name: "Async Worker Pool", role: "worker", pos: [3, -6, -6] as const, isPrimary: false, size: 1.3 },
      { name: "Telemetry Engine", role: "telemetry", pos: [-8, -6, -4] as const, isPrimary: false, size: 1.4 },
    ];

    interface NodeMeshItem {
      group: THREE.Group;
      mesh: THREE.Mesh;
      wire: THREE.LineSegments;
      corePip: THREE.Mesh;
      speed: number;
      activated: boolean;
      activateAt: number; // ms from scene start
    }

    const nodeMeshes: NodeMeshItem[] = [];

    // Materials — nodes start dim and activate sequentially
    const chassisMat = new THREE.MeshStandardMaterial({
      color: 0x1E232B,
      metalness: 0.75,
      roughness: 0.25,
    });

    const activeChassisMat = new THREE.MeshStandardMaterial({
      color: 0x222C3D,
      metalness: 0.8,
      roughness: 0.2,
      emissive: 0x1E3A6E,
      emissiveIntensity: 0.25,
    });

    const wireMat = new THREE.LineBasicMaterial({
      color: 0x303741,
      transparent: true,
      opacity: 0.6,
    });

    const activeWireMat = new THREE.LineBasicMaterial({
      color: 0x5B8DEF,
      transparent: true,
      opacity: 0.45,
    });

    // Dim start materials for sequential activation
    const dimChassisMat = new THREE.MeshStandardMaterial({
      color: 0x131920,
      metalness: 0.5,
      roughness: 0.5,
      transparent: true,
      opacity: 0.4,
    });

    const dimWireMat = new THREE.LineBasicMaterial({
      color: 0x252B33,
      transparent: true,
      opacity: 0.2,
    });

    // Sequential activation timing: K8s core is already active, others activate 400ms apart
    const activationDelays = [0, 400, 700, 1000, 1300, 1600, 1900, 2200]; // ms

    nodesData.forEach((node, idx) => {
      const nodeSubGroup = new THREE.Group();
      nodeSubGroup.position.set(node.pos[0], node.pos[1], node.pos[2]);

      let geom: THREE.BufferGeometry;
      if (node.role === "core" || node.role === "db") {
        geom = new THREE.CylinderGeometry(node.size * 0.9, node.size * 0.9, node.size * 1.1, 12);
      } else if (node.role === "gateway" || node.role === "edge") {
        geom = new THREE.OctahedronGeometry(node.size * 0.95);
      } else {
        geom = new THREE.BoxGeometry(node.size * 1.1, node.size * 1.1, node.size * 1.1);
      }

      // Start dim, will activate
      const startDim = idx > 0;
      const mesh = new THREE.Mesh(
        geom,
        startDim ? dimChassisMat.clone() : (node.isPrimary ? activeChassisMat : chassisMat)
      );
      nodeSubGroup.add(mesh);

      const wireGeom = new THREE.WireframeGeometry(geom);
      const wireMesh = new THREE.LineSegments(
        wireGeom,
        startDim ? dimWireMat.clone() : (node.isPrimary ? activeWireMat : wireMat)
      );
      wireMesh.scale.set(1.08, 1.08, 1.08);
      nodeSubGroup.add(wireMesh);

      const pipGeom = new THREE.SphereGeometry(0.2, 8, 8);
      const pipMat = new THREE.MeshBasicMaterial({
        color: startDim ? 0x252B33 : (node.isPrimary ? 0x5B8DEF : 0x43B581),
        transparent: true,
        opacity: startDim ? 0.3 : 1.0,
      });
      const pip = new THREE.Mesh(pipGeom, pipMat);
      pip.position.set(0, node.size * 0.8, 0);
      nodeSubGroup.add(pip);

      topologyGroup.add(nodeSubGroup);
      nodeMeshes.push({
        group: nodeSubGroup,
        mesh,
        wire: wireMesh,
        corePip: pip,
        speed: 0.004 + Math.random() * 0.003,
        activated: !startDim,
        activateAt: activationDelays[idx],
      });
    });

    // Network connections
    const connections: [number, number][] = [
      [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [0, 7],
      [1, 5], [1, 2], [3, 4], [3, 6],
    ];

    const packetGroup = new THREE.Group();
    topologyGroup.add(packetGroup);

    interface PacketItem {
      mesh: THREE.Mesh;
      curve: THREE.QuadraticBezierCurve3;
      progress: number;
      speed: number;
      active: boolean;
      startDelay: number; // ms before this packet starts moving
    }

    const packetMeshes: PacketItem[] = [];

    connections.forEach((conn, index) => {
      const p1 = new THREE.Vector3(...nodesData[conn[0]].pos);
      const p2 = new THREE.Vector3(...nodesData[conn[1]].pos);

      const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
      mid.y += (Math.random() - 0.5) * 2.5;
      const curve = new THREE.QuadraticBezierCurve3(p1, mid, p2);
      const points = curve.getPoints(24);
      const lineGeom = new THREE.BufferGeometry().setFromPoints(points);

      const isCoreLine = conn[0] === 0 || conn[1] === 0;
      const lineMat = new THREE.LineBasicMaterial({
        color: isCoreLine ? 0x303741 : 0x252B33,
        transparent: true,
        opacity: isCoreLine ? 0.7 : 0.4,
      });
      const line = new THREE.Line(lineGeom, lineMat);
      topologyGroup.add(line);

      // Only ~60% of connections get animated packets for realism
      const hasPacket = index % 5 !== 0; // skip every 5th connection
      if (!hasPacket) {
        return;
      }

      const pktGeom = new THREE.SphereGeometry(0.14, 6, 6);
      const pktMat = new THREE.MeshBasicMaterial({
        color: index % 2 === 0 ? 0x5B8DEF : 0x729FF5,
        transparent: true,
        opacity: 0,
      });
      const packet = new THREE.Mesh(pktGeom, pktMat);
      packetGroup.add(packet);

      packetMeshes.push({
        mesh: packet,
        curve,
        progress: (index * 0.15) % 1,
        speed: 0.0018 + Math.random() * 0.002,
        active: false,
        startDelay: activationDelays[Math.min(conn[1], activationDelays.length - 1)] + 300,
      });
    });

    // Grid floor
    const gridHelper = new THREE.GridHelper(48, 32, 0x303741, 0x191E24);
    gridHelper.position.y = -9;
    const gridMat = gridHelper.material as THREE.Material;
    gridMat.transparent = true;
    gridMat.opacity = 0.35;
    topologyGroup.add(gridHelper);

    // Minimal telemetry datum points
    const partCount = 45;
    const partGeom = new THREE.BufferGeometry();
    const partPositions = new Float32Array(partCount * 3);
    for (let i = 0; i < partCount * 3; i += 3) {
      partPositions[i] = (Math.random() - 0.5) * 40;
      partPositions[i + 1] = (Math.random() - 0.5) * 24;
      partPositions[i + 2] = (Math.random() - 0.5) * 40;
    }
    partGeom.setAttribute("position", new THREE.BufferAttribute(partPositions, 3));
    const partMat = new THREE.PointsMaterial({
      color: 0x6F7782,
      size: 0.22,
      transparent: true,
      opacity: 0.5,
    });
    const particles = new THREE.Points(partGeom, partMat);
    topologyGroup.add(particles);

    // Mouse tracking
    let targetRotY = 0;
    let targetRotX = 0;
    const handleMouseMove = (e: MouseEvent) => {
      const normX = (e.clientX / window.innerWidth) * 2 - 1;
      const normY = -(e.clientY / window.innerHeight) * 2 + 1;
      targetRotY = normX * 0.2;
      targetRotX = normY * 0.12;
    };
    window.addEventListener("mousemove", handleMouseMove);

    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || 520;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener("resize", handleResize);

    const clock = new THREE.Clock();
    let animationFrameId: number;
    const sceneStartTime = performance.now();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();
      const elapsedMs = performance.now() - sceneStartTime;

      // Sequential node activation
      nodeMeshes.forEach((item, idx) => {
        if (!item.activated && elapsedMs >= item.activateAt) {
          item.activated = true;

          // Swap to active materials
          const node = nodesData[idx];
          const targetChassisMat = node.isPrimary ? activeChassisMat : chassisMat;
          const targetWireMat = node.isPrimary ? activeWireMat : wireMat;

          (item.mesh.material as THREE.MeshStandardMaterial).dispose();
          item.mesh.material = targetChassisMat;

          (item.wire.material as THREE.LineBasicMaterial).dispose();
          item.wire.material = targetWireMat;

          const pipMat = item.corePip.material as THREE.MeshBasicMaterial;
          pipMat.color.setHex(node.isPrimary ? 0x5B8DEF : 0x43B581);
          pipMat.opacity = 1.0;
        }
      });

      // Activate packets after their connected nodes are live
      packetMeshes.forEach((pkt) => {
        if (!pkt.active && elapsedMs >= pkt.startDelay) {
          pkt.active = true;
          (pkt.mesh.material as THREE.MeshBasicMaterial).opacity = 0.8;
        }
        if (pkt.active) {
          pkt.progress += pkt.speed;
          if (pkt.progress > 1) pkt.progress = 0;
          const pt = pkt.curve.getPoint(pkt.progress);
          pkt.mesh.position.copy(pt);
        }
      });

      // Slow, steady rotation with smooth damping
      topologyGroup.rotation.y += 0.0008;
      topologyGroup.rotation.y += (targetRotY - topologyGroup.rotation.y) * 0.03;
      topologyGroup.rotation.x += (targetRotX - topologyGroup.rotation.x) * 0.03;

      // Subtle scroll-based camera parallax
      const sp = scrollRef.current;
      const targetCamY = 16 - sp * 4; // moves slightly down as user scrolls
      const targetCamZ = 36 + sp * 4;
      camera.position.y += (targetCamY - camera.position.y) * 0.04;
      camera.position.z += (targetCamZ - camera.position.z) * 0.04;
      camera.lookAt(0, 0, 0);

      // Node float
      nodeMeshes.forEach((item, idx) => {
        if (item.activated) {
          item.mesh.rotation.y += item.speed;
          item.wire.rotation.y += item.speed;
          item.group.position.y += Math.sin(elapsedTime * 0.8 + idx) * 0.003;
        }
      });

      particles.rotation.y -= 0.0003;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full min-h-[520px] rounded-lg overflow-hidden bg-[#090B0E] border border-[#252B33]"
    />
  );
}
