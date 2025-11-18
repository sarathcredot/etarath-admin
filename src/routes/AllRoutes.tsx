import React from "react";
import { Navigate } from "react-router-dom";
import Dashboard from "src/components/pages/Dashboard/dashboard";
// import Typography from "src/components/pages/elements/typography";
// import MediaAdd from "src/components/pages/media/media-add";
// import MediaSetting from "src/components/pages/media/media-setting";
import Blank from "src/components/pages/others/blank";
// import AccordionsPage from "src/components/pages/elements/accordions";
import AlertsPage from "../components/pages/elements/alerts";
// import ApperAnimationsPage from "../components/pages/elements/animations-appear";
import ButtonsPage from "../components/pages/elements/buttons";
// import CardsPage from "../components/pages/elements/cards";
import ChartsPage from "../components/pages/elements/charts";
// import HoverAnimationsPage from "../components/pages/elements/animations-hover";
import ModalsPage from "../components/pages/elements/modals";
import NotificationsPage from "../components/pages/elements/notifications";
// import ProgressBarsPage from "../components/pages/elements/progress-bars";
import TabsPage from "../components/pages/elements/tabs";
// import TreeViewsPage from "../components/pages/elements/treeviews";
// import TogglesPage from "../components/pages/elements/toggles";

import BasicFormsPage from "../components/pages/forms/basic";
// import FormLayoutsPage from "../components/pages/forms/layouts";
import FormValidationPage from "../components/pages/forms/validation";
import AdvancedFormsPage from "../components/pages/forms/advanced";
// import FormWizardsPage from "../components/pages/forms/wizards";
// import MultivendorSettings from "src/components/pages/multivendor/multivendor-settings";
// import Withdraws from "src/components/pages/multivendor/withdraws";
// import VendorList from "src/components/pages/multivendor/vendor-list";
import ForgotPassword from "src/components/pages/others/forgot-password";
import LockedScreen from "src/components/pages/others/locked-screen";
import SignIn from "src/components/pages/others/sign-in";
import SignUp from "src/components/pages/others/sign-up";
import PageNotFound from "src/components/pages/others/page-not-found";
import ErrorPage from "src/components/pages/others/error-page";
import Invoice from "src/components/pages/others/invoice";
import SessionTimeout from "src/components/pages/others/session-timeout";
import TimeLine from "src/components/features/elements/timeline";
import UserProfile from "src/components/pages/others/user-profile";
import LogViewer from "src/components/pages/others/log-viewer";
import BasicTablesPage from "../components/pages/tables/basic";
// import AdvancedTablesPage from "../components/pages/tables/advanced";
import ResponsiveTablesPage from "../components/pages/tables/responsive";
import UserList from "src/components/pages/users/user-list";
import UserCreate from "src/components/pages/users/user-create";
import UserDetail from "src/components/pages/users/user-detail";
import VendorsPage from "src/components/pages/vendors/VendorsPage";
import VendorsDetailPage from "src/components/pages/vendors/VendorsDetailPage";
import SalesExecutivesPage from "src/components/pages/sales_executives/SalesExecutivesPage";
import SalesExecutivesDetailPage from "src/components/pages/sales_executives/SalesExecutivesDetailPage";
import ProductsPage from "src/components/pages/products/ProductsPage";
import BrandPage from "src/components/pages/brands/BrandsPage";
import VendorPlans from "src/components/pages/subscriptions/vendor-plans/VendorPlans";
import VendorPlanDetailPage from "src/components/pages/subscriptions/vendor-plans/VendorPlanDetailPage";
import RetailerPlanDetailPage from "src/components/pages/subscriptions/retailer-plans/RetailerPlanDetailPage";
import RetailerPlans from "src/components/pages/subscriptions/retailer-plans/RetailerPlans";
import OffersPage from "src/components/pages/cms/offers/OffersPage";
import AttributesPage from "src/components/pages/attributes/AttributesPage";
import RetailersList from "src/components/pages/retailers/RetailersList";
import RetailersDetailPage from "src/components/pages/retailers/RetailersDetailPage";
import RetailersPage from "src/components/pages/retailers/RetailersPage";
import ProductsDetailPage from "src/components/pages/products/ProductsDetailPage";
import BrandsDetailPage from "src/components/pages/brands/BrandsDetailPage";
import AttributePage from "src/components/pages/attributes/attribute/AttributePage";
import BlogsPage from "src/components/pages/cms/blogs/BlogsPage";
import BlogCategories from "src/components/pages/cms/blogs/categories/BlogCategories";
import BlogTags from "src/components/pages/cms/blogs/tags/BlogTags";
import StockDetailPage from "src/components/pages/products/stock/StockDetailPage";
import KycsPage from "src/components/pages/kycs/KycsPage";
import TokenList from "src/components/pages/customer-supports/TokenList";
import OrderDetailPage from "src/components/pages/orders/OrderDetailPage";
import AddVendorPage from "src/components/pages/vendors/forms/add-vendor/AddVendorPage";

interface RouteProps {
  path: string;
  component: JSX.Element;
  exact?: boolean;
}

const adminRoutes: Array<RouteProps> = [
  // Dashboard
  { path: "/", exact: true, component: <Navigate to="/dashboard" /> },
  // { path: "/dashboard", exact: true, component: <Dashboard /> },

  // Vendors
  { path: "/vendors", exact: true, component: <VendorsPage /> },
  { path: "/vendors/detail", component: <VendorsDetailPage /> },
  { path: "/vendors/add-vendor", component: <AddVendorPage /> },

  // Retailers
  { path: "/retailers", exact: true, component: <RetailersPage /> },
  { path: "/retailers/detail", component: <RetailersDetailPage /> },

  // Sales Executives
  {
    path: "/sales-executives",
    exact: true,
    component: <SalesExecutivesPage />,
  },
  {
    path: "/sales-executives/detail",
    component: <SalesExecutivesDetailPage />,
  },

  // Products
  { path: "/products", exact: true, component: <ProductsPage /> },
  { path: "/products/detail", component: <ProductsDetailPage /> },

  // Stocks
  { path: "/stock/detail", component: <StockDetailPage /> },

  // Brands
  { path: "/brands", exact: true, component: <BrandPage /> },
  { path: "/brands/detail", component: <BrandsDetailPage /> },

  // Attributes
  { path: "/attributes", exact: true, component: <AttributesPage /> },
  { path: "/attributes/:attribute", component: <AttributePage /> },

  // Kycs
  { path: "/kycs", exact: true, component: <KycsPage /> },

  // Orders
  {
    path: "/orders/detail",
    component: <OrderDetailPage />,
  },

  // Subscriptions

  {
    path: "/subscriptions/vendor-plans",
    exact: true,
    component: <VendorPlans />,
  },
  {
    path: "/subscriptions/vendor-plans/detail",
    component: <VendorPlanDetailPage />,
  },
  {
    path: "/subscriptions/retailer-plans",
    exact: true,
    component: <RetailerPlans />,
  },
  {
    path: "/subscriptions/retailer-plans/detail",
    component: <RetailerPlanDetailPage />,
  },
  // { path: "/packages", exact:true, component: <PackagesList /> },
  // { path: "/packages/detail",  component: <PackagesDetailPage /> },

  // Customer Supports
  { path: "/customer-supports/:role", component: <TokenList /> },

  // CMS
  { path: "/cms/offers", component: <OffersPage /> },
  { path: "/cms/blogs", component: <BlogsPage /> },
  { path: "/cms/blogs/categories", component: <BlogCategories /> },
  { path: "/cms/blogs/tags", component: <BlogTags /> },

  // Components
  { path: "/elements/alerts", exact: true, component: <AlertsPage /> },
  { path: "/elements/buttons", exact: true, component: <ButtonsPage /> },
  { path: "/elements/charts", exact: true, component: <ChartsPage /> },
  { path: "/elements/modals", exact: true, component: <ModalsPage /> },
  {
    path: "/elements/notifications",
    exact: true,
    component: <NotificationsPage />,
  },
  { path: "/elements/tabs", exact: true, component: <TabsPage /> },
  { path: "/forms", exact: true, component: <BasicFormsPage /> },
  { path: "/forms/validation", exact: true, component: <FormValidationPage /> },
  { path: "/forms/advanced", exact: true, component: <AdvancedFormsPage /> },
  { path: "/pages/404", exact: true, component: <PageNotFound /> },
  { path: "/pages/500", exact: true, component: <ErrorPage /> },
  { path: "/pages/blank", exact: true, component: <Blank /> },
  { path: "/pages/invoice", exact: true, component: <Invoice /> },
  {
    path: "/pages/session-timeout",
    exact: true,
    component: <SessionTimeout />,
  },
  { path: "/pages/timeline", exact: true, component: <TimeLine /> },
  { path: "/pages/user-profile", exact: true, component: <UserProfile /> },
  { path: "/pages/log-viewer", exact: true, component: <LogViewer /> },
  { path: "/tables", exact: true, component: <BasicTablesPage /> },
  {
    path: "/tables/responsive",
    exact: true,
    component: <ResponsiveTablesPage />,
  },

  { path: "/users", exact: true, component: <UserList /> },
  { path: "/users/create", exact: true, component: <UserCreate /> },
  { path: "/users/:id", exact: true, component: <UserDetail /> },

  { path: "*", component: <Blank /> },

  // { path: "/media/settings", exact: true, component: <MediaSetting /> },
  // { path: "/media/create", exact: true, component: <MediaAdd /> },
  // { path: "/elements", exact: true, component: <Typography /> },
  // { path: "/elements/accordions", exact:true, component: <AccordionsPage /> },
  // { path: "/elements/cards", exact: true, component: <CardsPage /> },
  // { path: "/elements/animations-appear", exact:true, component: <ApperAnimationsPage /> },
  //   { path: "/elements/animations-hover", exact:true, component: <HoverAnimationsPage /> },
  // { path: "/elements/progress-bars", exact: true, component: <ProgressBarsPage /> },
  // { path: "/elements/treeviews", exact: true, component: <TreeViewsPage /> },
  // { path: "/elements/toggles", exact: true, component: <TogglesPage /> },
  // { path: "/forms/layouts", exact: true, component: <FormLayoutsPage /> },
  // { path: "/forms/wizards", exact: true, component: <FormWizardsPage /> },

  // { path: "/multivendor", exact: true, component: <VendorList /> },
  // { path: "/multivendor/withdraws", exact: true, component: <Withdraws /> },
  // { path: "/multivendor/settings", exact: true, component: <MultivendorSettings /> },

  // { path: "/tables/advanced", exact: true, component: <AdvancedTablesPage /> },
];

const authRoutes: Array<RouteProps> = [
  { path: "/login", component: <Blank /> },
  {
    path: "/pages/forgot-password",
    exact: true,
    component: <ForgotPassword />,
  },
  { path: "/pages/locked-screen", exact: true, component: <LockedScreen /> },
  { path: "/sign-in", exact: true, component: <SignIn /> },
  // { path: "/sign-in", exact: true, component: <Blank /> },
  { path: "/pages/sign-up", exact: true, component: <SignUp /> },
];

export { adminRoutes, authRoutes };
