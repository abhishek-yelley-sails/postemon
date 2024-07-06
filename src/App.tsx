import { QueryClientProvider, QueryClient } from 'react-query';
import Home from "./Home";

export default function App() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <Home />
    </QueryClientProvider>
  )
}