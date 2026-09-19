"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export default function ThreeTopology() {
  const containerRef = useRef<HTMLDivElement>(null);

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

    // Subtle blue accent light near the primary cluster
    const accentLight = new THREE.PointLight(0x5B8DEF, 1.2, 40);
    accentLight.position.set(0, 4, 0);
    scene.add(accentLight);

    // Root group
    const topologyGroup = new THREE.Group();
    scene.add(topologyGroup);

    // Real enterprise infrastructure components
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
    }

    const nodeMeshes: NodeMeshItem[] = [];

    // Dark graphite metallic material for realistic infrastructure chassis
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

    // Wireframe for CAD/infrastructure technical feel
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

    nodesData.forEach((node) => {
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

      const mesh = new THREE.Mesh(geom, node.isPrimary ? activeChassisMat : chassisMat);
      nodeSubGroup.add(mesh);

      // Technical wireframe outline
      const wireGeom = new THREE.WireframeGeometry(geom);
      const wireMesh = new THREE.LineSegments(wireGeom, node.isPrimary ? activeWireMat : wireMat);
      wireMesh.scale.set(1.08, 1.08, 1.08);
      nodeSubGroup.add(wireMesh);

      // Subtle status pip at top of node (realistic LED indicator)
      const pipGeom = new THREE.SphereGeometry(0.2, 8, 8);
      const pipMat = new THREE.MeshBasicMaterial({
        color: node.isPrimary ? 0x5B8DEF : 0x43B581,
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
      });
    });

    // Technical network conduits
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

      // Subtle, thin enterprise line (not glowing neon)
      const isCoreLine = conn[0] === 0 || conn[1] === 0;
      const lineMat = new THREE.LineBasicMaterial({
        color: isCoreLine ? 0x303741 : 0x252B33,
        transparent: true,
        opacity: isCoreLine ? 0.7 : 0.4,
      });
      const line = new THREE.Line(lineGeom, lineMat);
      topologyGroup.add(line);

      // Small, restrained data packet
      const pktGeom = new THREE.SphereGeometry(0.14, 6, 6);
      const pktMat = new THREE.MeshBasicMaterial({
        color: index % 2 === 0 ? 0x5B8DEF : 0x729FF5,
        transparent: true,
        opacity: 0.8,
      });
      const packet = new THREE.Mesh(pktGeom, pktMat);
      packetGroup.add(packet);

      packetMeshes.push({
        mesh: packet,
        curve,
        progress: (index * 0.12) % 1,
        speed: 0.002 + Math.random() * 0.002,
      });
    });

    // Technical datum grid floor (clean enterprise floor plan)
    const gridHelper = new THREE.GridHelper(48, 32, 0x303741, 0x191E24);
    gridHelper.position.y = -9;
    const gridMat = gridHelper.material as THREE.Material;
    gridMat.transparent = true;
    gridMat.opacity = 0.35;
    topologyGroup.add(gridHelper);

    // Minimal floating telemetry datum points
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

    // Smooth, controlled mouse movement
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

    // Controlled, calm animation loop
    const clock = new THREE.Clock();
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Slow, steady rotation with smooth damping
      topologyGroup.rotation.y += 0.001;
      topologyGroup.rotation.y += (targetRotY - topologyGroup.rotation.y) * 0.03;
      topologyGroup.rotation.x += (targetRotX - topologyGroup.rotation.x) * 0.03;

      nodeMeshes.forEach((item, idx) => {
        item.mesh.rotation.y += item.speed;
        item.wire.rotation.y += item.speed;
        item.group.position.y += Math.sin(elapsedTime * 0.8 + idx) * 0.003;
      });

      packetMeshes.forEach((pkt) => {
        pkt.progress += pkt.speed;
        if (pkt.progress > 1) pkt.progress = 0;
        const pt = pkt.curve.getPoint(pkt.progress);
        pkt.mesh.position.copy(pt);
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
