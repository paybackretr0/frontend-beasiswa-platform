import { Route } from "react-router-dom";
import NewsAdmin from "../pages/admin/websites/NewsAdmin";
import ArticleAdmin from "../pages/admin/websites/ArticleAdmin";
import RoleRoute from "./guards/RoleRoute";

const WebsiteRoutes = () => (
  <>
    <Route
      path="berita"
      element={
        <RoleRoute access="website">
          <NewsAdmin />
        </RoleRoute>
      }
    />
    <Route
      path="artikel"
      element={
        <RoleRoute access="website">
          <ArticleAdmin />
        </RoleRoute>
      }
    />
  </>
);

export default WebsiteRoutes;
