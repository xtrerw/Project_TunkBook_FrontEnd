import { Routes, Route } from "react-router-dom";
import Admin from "./admin/Admin";
import HomeUsuario from "./usuario/Home";
import PaginaAdmin from "./admin/PaginaAdmin";
function App() {


  return (
      <div id="root">
        {/* la interface del administrador o usuario */}
        <Routes>
          <Route path="/admin" element={<Admin />} />
          <Route path="/paginaAdmin/*" element={<PaginaAdmin />} />
          {/* la interface del usuario */}
          <Route path="/*" element={<HomeUsuario />} />
        </Routes>
      </div>
  );
}

export default App;
