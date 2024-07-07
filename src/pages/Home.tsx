import { useAuth } from "../components/AuthContextProvider";

export default function Home() {
  const authCtx = useAuth();
  return (
    <>
      <h1 className="text-9xl">Home</h1>
      <h2 className="text-7xl">{authCtx.name}</h2>
    </>
  );
}