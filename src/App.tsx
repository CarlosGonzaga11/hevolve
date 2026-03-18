import { Route, Routes } from "react-router-dom";
import Dashboard from "./pages/dashboard";
import CreateTrain from "./pages/createTrain";
import TrainingPage from "./pages/trainPage";
import TreinoDetalhes from "./components/TreinoDetalhes";
import User from "./pages/user";
import TrashPage from "./pages/trash";
import Progress from "./pages/progress";

export default function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Dashboard />}>
          <Route index element={<TrainingPage />} />
          <Route path="treino/:id" element={<TreinoDetalhes />} />
          <Route path="progress" element={<Progress />} />
          <Route path="create" element={<CreateTrain />} />
          <Route path="user" element={<User />} />
          <Route path="lixeira" element={<TrashPage />} />
        </Route>
      </Routes>
    </div>
  );
}
