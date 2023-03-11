import { useTexture } from "@react-three/drei";
import Image from "image-js";
import { useEffect, useState } from "react";
import { DoubleSide, NearestFilter } from "three";

const DEBUG = false;

interface Props {
  texture: string;
}

export default function HeadMesh(props: Props) {
  const [textures, setTextures] = useState<string[]>([]);
  const [hatTextures, setHatTextures] = useState<string[]>([]);

  const maps = useTexture(textures);
  const hatMaps = useTexture(hatTextures);

  useEffect(() => {
    createMaps();
  }, [props.texture]);

  async function createMaps() {
    const img = await Image.load(props.texture);

    async function loadFace(x: number, y: number, pos: number) {
      let face = img.crop({ x, y, height: 8, width: 8 });

      if (DEBUG) {
        face = face
          .resize({ factor: 10 })
          .paintLabels([pos.toString()], [[40, 40]], {
            color: "red",
            font: "20px helvetica"
          });
      }

      return face.toDataURL();
    }

    const positions = [
      [16, 8],
      [0, 8],
      [8, 0],
      [16, 0],
      [8, 8],
      [24, 8],
      [48, 8],
      [32, 8],
      [40, 0],
      [48, 0],
      [40, 8],
      [56, 8]
    ];

    const textures = await Promise.all(
      positions.map(([x, y], i) => loadFace(x, y, i))
    );

    setTextures(textures.slice(0, 6));
    setHatTextures(textures.slice(6));
  }

  return (
    <>
      <mesh position={[0, 8, 0]}>
        <boxGeometry args={[8, 8, 8]} />

        {maps.map((map, i) => {
          map.magFilter = NearestFilter;
          return (
            <meshBasicMaterial key={i} map={map} attach={"material-" + i} />
          );
        })}
      </mesh>

      <mesh position={[0, 8, 0]} scale={1.2}>
        <boxGeometry args={[8, 8, 8]} />

        {hatMaps.map((map, i) => {
          map.magFilter = NearestFilter;

          return (
            <meshBasicMaterial
              key={i}
              map={map}
              attach={"material-" + i}
              side={DoubleSide}
              transparent
            />
          );
        })}
      </mesh>
    </>
  );
}
