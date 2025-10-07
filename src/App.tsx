// import routes
// import Routes from "./routes";
import { Route, Routes } from "react-router-dom";
import Layout from "./components/layout";
import { adminRoutes, authRoutes } from "./routes/AllRoutes";
import Authmiddleware from "./middleware/Authmiddleware";

const App = () => {
  return (
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
  );
};

export default App;
