import "./app.css";
import useApi from "./hooks/useApi";
import { ProfileData } from "./types/profileData";
import { FormEvent, useReducer, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Plane, useHelper } from "@react-three/drei";
import HeadMesh from "./components/headMesh";
import { PointLight, PointLightHelper } from "three";

export function App() {
  const [username, setUsername] = useState("ronaldarndt");

  const [data, setData] = useState<ProfileData>();
  const [loading, setLoading] = useState(false);

  const [_, rerender] = useReducer(x => x + 1, 0);

  const profileApi = useApi("https://api.ashcon.app/mojang/v2/user");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!username) return;

    setLoading(true);

    try {
      const resp = await profileApi.get<ProfileData>(username);

      setData(resp.data);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Username or uuid"
          value={username}
          onChange={e => setUsername(e.currentTarget.value)}
        />
        <button disabled={loading}>Search</button>
      </form>

      <button onClick={rerender}>Refresh</button>

      <Canvas
        style={{ height: 640, width: 960 }}
        camera={{ position: [10, 10, 10] }}
        dpr={[1, 2]}
      >
        <CanvasContent texture={data?.textures.skin.url} />
      </Canvas>

      {data ? <img src={data.textures.skin.url} /> : null}
    </div>
  );
}

function CanvasContent({ texture }: { texture?: string }) {
  const lightRef = useRef<PointLight>(null!);
  useHelper(lightRef, PointLightHelper, 1, "red");

  useFrame(r => {
    const date = r.clock.elapsedTime;
    lightRef.current.position.set(Math.cos(date) * 8, 16, Math.sin(date) * 8);
  });

  return (
    <>
      <ambientLight />
      <pointLight position={[16, 16, 16]} ref={lightRef} />

      {texture ? <HeadMesh texture={texture} /> : null}

      <Plane args={[64, 64]} rotation-x={-Math.PI / 2}>
        <meshStandardMaterial color="black" />
      </Plane>

      <OrbitControls enableDamping={false} maxPolarAngle={Math.PI / 2 - 0.1} />
    </>
  );
}
