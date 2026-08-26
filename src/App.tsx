import { Navigate, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/dashboard";
import CreateTrain from "./pages/createTrain";
import TrainingPage from "./pages/trainPage";
import TreinoDetalhes from "./components/TreinoDetalhes";
import TrashPage from "./pages/trash";
import Progress from "./pages/progress";
import { Toaster } from "sonner";
import LandingPage from "./pages/landingPage";
import UserProfile from "./pages/userProfile";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Register from "./pages/criarConta";

export default function App() {
  return (
    <div>
      <Toaster richColors />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/registro" element={<Register />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />}>
            <Route index element={<Navigate to="treino" replace />} />
            <Route path="treino" element={<TrainingPage />} />
            <Route path="treino/:id" element={<TreinoDetalhes />} />
            <Route path="progress" element={<Progress />} />
            <Route path="create" element={<CreateTrain />} />
            <Route path="user" element={<UserProfile />} />
            <Route path="lixeira" element={<TrashPage />} />
          </Route>
        </Route>

        {/* Curinga para redirecionar rotas inexistentes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}