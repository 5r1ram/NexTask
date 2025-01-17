import { 
    Refine,
    GitHubBanner, 
    WelcomePage,
    Authenticated, 
} from '@refinedev/core';
import { DevtoolsPanel, DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";

import { AuthPage,ErrorComponent
,useNotificationProvider
,ThemedLayoutV2
,ThemedSiderV2} from '@refinedev/antd';
import "@refinedev/antd/dist/reset.css";

import { authProvider, dataProvider, liveProvider } from './providers';
import { Home, ForgotPassword, Login, Register, CompanyList } from "./pages";

import { App as AntdApp } from "antd"
import { BrowserRouter, Route, Routes, Outlet } from "react-router-dom";
import routerBindings, { NavigateToResource, CatchAllNavigate, UnsavedChangesNotifier, DocumentTitleHandler } from "@refinedev/react-router-v6";
import { BlogPostList, BlogPostCreate, BlogPostEdit, BlogPostShow } from "./pages/blog-posts";
import { CategoryList, CategoryCreate, CategoryEdit, CategoryShow } from "./pages/categories";
import Layout from './components/layout';
import { resources } from './config/resources';

function App() {
    return (
        <BrowserRouter>
        {/* <GitHubBanner /> */}
        <RefineKbarProvider>
        <AntdApp>
            <DevtoolsProvider>
                <Refine 
                    dataProvider={dataProvider}
                    liveProvider={liveProvider}
                    notificationProvider={useNotificationProvider}
                    routerProvider={routerBindings}
                    authProvider={authProvider}
                    resources={resources}
                    options={{
                        syncWithLocation: true,
                        warnWhenUnsavedChanges: true,
                        useNewQueryKeys: true,
                        projectId: "EDVVv2-C764DB-Ku8anC",
                        liveMode: "auto",
                    }}
                >
                    <Routes>
                        <Route path='/register' element={<Register />} />
                        <Route path='/login' element={<Login />} /> 
                        <Route path='/forgot-password' element={<ForgotPassword />} />
                        <Route 
                            element={
                            <Authenticated
                                key="authenticated-layout"
                                fallback={<CatchAllNavigate to='/login' />}
                            >
                                <Layout>
                                    <Outlet />
                                </Layout>
                            </Authenticated>
                        }>
                            <Route index element={<Home />} />
                            <Route path="/companies" element={<CompanyList />} />
                        </Route>
                    </Routes>

                    <RefineKbar />
                    <UnsavedChangesNotifier />
                    <DocumentTitleHandler />
                </Refine>
            <DevtoolsPanel />
            </DevtoolsProvider>
            </AntdApp>
        </RefineKbarProvider>
        </BrowserRouter>
      );
}

export default App;
