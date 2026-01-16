


import { Route, Routes } from "react-router-dom";
import Layout from "./components/layout";
import { adminRoutes, authRoutes } from "./routes/AllRoutes";
import Authmiddleware from "./middleware/Authmiddleware";
import { LoadScript } from "@react-google-maps/api";
import type { Libraries } from "@react-google-maps/api";

const libraries: Libraries = ["places"];

const App = () => {
  return (
    <LoadScript
      googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY || ""}
      libraries={libraries}
      loadingElement={<div>Loading maps...</div>}
    >
      <Routes>
        {adminRoutes?.map((route, index) => (
          <Route
            path={route?.path}
            element={
              <Authmiddleware>
                <Layout>{route?.component}</Layout>
              </Authmiddleware>
            }
            key={index}
          />
        ))}

        {authRoutes.map((route, index) => (
          <Route path={route?.path} element={route?.component} key={index} />
        ))}
      </Routes>
    </LoadScript>
  );
};

export default App;
