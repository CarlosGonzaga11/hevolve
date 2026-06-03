import { Route, Routes } from "react-router-dom";
import Dashboard from "./pages/dashboard";
import CreateTrain from "./pages/createTrain";
import TrainingPage from "./pages/trainPage";
import TreinoDetalhes from "./components/TreinoDetalhes";
import User from "./pages/user";
import TrashPage from "./pages/trash";
import Progress from "./pages/progress";
import { Toaster } from "sonner";
import LandingPage from "./pages/landingPage";
import Register from "./pages/criarConta";

export default function App() {
  return (
    <div>
      <Toaster richColors />
      <Routes>
        <Route path="/" element ={<LandingPage/>}/>
                <Route path="/registro" element ={<Register/>}/>
        <Route path="/dashboard" element={<Dashboard />}>
          <Route path="treino" index element={<TrainingPage />} />
          <Route path="treino/:id" element={<TreinoDetalhes />} />
          <Route path="progress" element={<Progress />} />
          <Route path="create" element={<CreateTrain />} />
          <Route path="create" element={<CreateTrain />} />
          <Route path="user" element={<User/>} />
          <Route path="lixeira" element={<TrashPage />} />
        </Route>
      </Routes>
    </div>
  );
}
