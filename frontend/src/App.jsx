import { Navigate, Route, Routes } from "react-router";
import { DefaultLayout } from "@/layouts/DefaultLayout.jsx";
import { Main } from "@/pages/Main";
import { NotFound } from "@/pages/NotFound.jsx";
import { SignUp } from "@/pages/SignUp.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<DefaultLayout/>}>
        <Route index element={<Main/>} />
        <Route path="sign-up" element={<SignUp/>} />
        <Route path="not-found" element={<NotFound/>}/>
      </Route>
      <Route path="*" element={<Navigate replace to="/not-found" />} />
    </Routes>
  );
}

export default App;
