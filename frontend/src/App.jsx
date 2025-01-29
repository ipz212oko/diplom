import { Route, Routes } from "react-router";
import { Main } from "@/pages/Main";
import { DefaultLayout } from "@/layouts/DefaultLayout.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<DefaultLayout/>}>
        <Route index element={<Main />} />
      </Route>
    </Routes>
  );
}

export default App;
