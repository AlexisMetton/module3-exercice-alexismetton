import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import Characters from "./pages/Characters";
import Teams from "./pages/Teams";
import EditCharacter from "./pages/EditCharacter";
import EditTeams from "./pages/EditTeams";

const App = () => {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/characters" element={<Characters />} />
          <Route path="/characters/edit/:id" element={<EditCharacter />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/edit/teams/:id" element={<EditTeams />} />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </MainLayout>
    </Router>
  );
};

export default App;
