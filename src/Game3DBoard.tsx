import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';

interface Piece3D {
  mesh: THREE.Mesh;
  tileType: string;
  x: number;
  y: number;
  isAnimating: boolean;
}

export const Game3DBoard: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const piecesRef = useRef<Piece3D[]>([]);
  const [selectedPiece, setSelectedPiece] = useState<Piece3D | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // ===== SETUP SCENE =====
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf3e5f5);
    sceneRef.current = scene;

    // ===== SETUP CAMERA =====
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(7, 7, 12);
    camera.lookAt(3.5, 3.5, 0);
    cameraRef.current = camera;

    // ===== SETUP RENDERER =====
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // ===== LIGHTING =====
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(5, 8, 10);
    pointLight.castShadow = true;
    pointLight.shadow.mapSize.width = 2048;
    pointLight.shadow.mapSize.height = 2048;
    scene.add(pointLight);

    const pointLight2 = new THREE.PointLight(0xff69b4, 0.5);
    pointLight2.position.set(-5, 5, 5);
    scene.add(pointLight2);

    // ===== CREATE GROUND =====
    const groundGeometry = new THREE.PlaneGeometry(10, 10);
    const groundMaterial = new THREE.MeshStandardMaterial({
      color: 0xfce4ec,
      metalness: 0.1,
      roughness: 0.8,
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.receiveShadow = true;
    ground.position.z = -1;
    scene.add(ground);

    // ===== CREATE PIECES =====
    const tileTypes = ['🍭', '🍦', '🍬', '🦄', '☁️'];
    const colors = [
      0xff69b4, // Rosa
      0xffd700, // Giallo
      0xff1493, // Rosa scuro
      0x9370db, // Viola
      0x87ceeb, // Azzurro
    ];

    function createPiece(tileType: string, x: number, y: number): Piece3D {
      const colorIndex = tileTypes.indexOf(tileType);
      const color = colors[colorIndex];

      // Crea una sfera con effetto glow
      const geometry = new THREE.IcosahedronGeometry(0.4, 4);
      const material = new THREE.MeshStandardMaterial({
        color: color,
        metalness: 0.4,
        roughness: 0.6,
        emissive: color,
        emissiveIntensity: 0.2,
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.position.set(x * 1.5, y * 1.5, 0);

      // Aggiungi un glow ring intorno al pezzo
      const ringGeometry = new THREE.TorusGeometry(0.5, 0.05, 16, 100);
      const ringMaterial = new THREE.MeshStandardMaterial({
        color: color,
        emissive: color,
        emissiveIntensity: 0.5,
      });
      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      ring.position.copy(mesh.position);
      ring.rotation.x = Math.PI / 4;
      mesh.add(ring);

      scene.add(mesh);

      return {
        mesh,
        tileType,
        x,
        y,
        isAnimating: false,
      };
    }

    // Crea la griglia 7x7
    for (let x = 0; x < 7; x++) {
      for (let y = 0; y < 7; y++) {
        const randomTile = tileTypes[Math.floor(Math.random() * tileTypes.length)];
        const piece = createPiece(randomTile, x, y);
        piecesRef.current.push(piece);
      }
    }

    // ===== MOUSE INTERACTION =====
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    function onMouseClick(event: MouseEvent) {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);

      const meshes = piecesRef.current.map((p) => p.mesh);
      const intersects = raycaster.intersectObjects(meshes);

      if (intersects.length > 0) {
        const clickedMesh = intersects[0].object;
        const clickedPiece = piecesRef.current.find((p) => p.mesh === clickedMesh);

        if (clickedPiece) {
          if (selectedPiece === clickedPiece) {
            // Deselect
            setSelectedPiece(null);
            gsap.to(clickedPiece.mesh.scale, { x: 1, y: 1, z: 1, duration: 0.2 });
          } else if (selectedPiece) {
            // Swap pieces
            swapPieces(selectedPiece, clickedPiece);
            setSelectedPiece(null);
          } else {
            // Select
            setSelectedPiece(clickedPiece);
            gsap.to(clickedPiece.mesh.scale, { x: 1.2, y: 1.2, z: 1.2, duration: 0.2 });
          }
        }
      }
    }

    renderer.domElement.addEventListener('click', onMouseClick);

    // ===== ANIMATION LOOP =====
    function animate() {
      requestAnimationFrame(animate);

      // Rotate pieces
      piecesRef.current.forEach((piece) => {
        if (!piece.isAnimating) {
          piece.mesh.rotation.x += 0.005;
          piece.mesh.rotation.y += 0.008;
        }

        // Animate ring
        const ring = piece.mesh.children[0] as THREE.Mesh;
        if (ring) {
          ring.rotation.x += 0.02;
          ring.rotation.z += 0.01;
        }
      });

      // Rotate lights
      pointLight.position.x = Math.sin(Date.now() * 0.001) * 8;
      pointLight.position.z = Math.cos(Date.now() * 0.001) * 8 + 10;

      renderer.render(scene, camera);
    }

    animate();

    // ===== HANDLE RESIZE =====
    function handleResize() {
      if (!containerRef.current) return;

      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    }

    window.addEventListener('resize', handleResize);

    // ===== CLEANUP =====
    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('click', onMouseClick);
      containerRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  function swapPieces(piece1: Piece3D, piece2: Piece3D) {
    // Calcola la distanza
    const distance = Math.sqrt(
      Math.pow(piece1.x - piece2.x, 2) + Math.pow(piece1.y - piece2.y, 2)
    );

    // Solo swap se adiacenti
    if (distance !== 1) return;

    // Animate swap
    gsap.to(piece1.mesh.position, {
      x: piece2.x * 1.5,
      y: piece2.y * 1.5,
      duration: 0.3,
      ease: 'back.out',
    });

    gsap.to(piece2.mesh.position, {
      x: piece1.x * 1.5,
      y: piece1.y * 1.5,
      duration: 0.3,
      ease: 'back.out',
    });

    // Swap coordinates
    [piece1.x, piece2.x] = [piece2.x, piece1.x];
    [piece1.y, piece2.y] = [piece2.y, piece1.y];

    // Check for matches (placeholder)
    checkMatches();
  }

  function checkMatches() {
    // Placeholder per la logica di match
    console.log('Checking for matches...');
  }

  return (
    <div className="w-full h-screen bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200">
      <div ref={containerRef} className="w-full h-full" />
      <div className="absolute top-4 left-4 text-white bg-black bg-opacity-50 p-4 rounded-lg">
        <p className="text-sm">Clicca su due tessere adiacenti per scambiarle</p>
      </div>
    </div>
  );
};
