import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import { RoutesEnum } from "@core/domain/domain.ts";
import { PrivLayout, PubLayout } from "@pages/Layout/Layout.tsx";
import Gallery from "@pages/Gallery/Gallery.tsx";
import Login from "@pages/Login/Login.tsx";
import Oauth from "@pages/Oauth/Oauth.tsx";

import "./App.css";
import { Upload } from "@pages/Gallery/Upload.tsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PubLayout />}>
          <Route path={RoutesEnum.Login} element={<Login />} />
        </Route>
        <Route element={<PrivLayout />}>
          <Route
            path={RoutesEnum.Photos}
            element={
              <>
                <Upload />
                <Gallery />
              </>
            }
          />
        </Route>
        <Route path="oauth/*" element={<Oauth />}></Route>
        <Route path="*" element={<Navigate to={RoutesEnum.Photos} />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
