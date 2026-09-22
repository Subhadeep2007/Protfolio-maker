import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";


import Home
    from "../pages/Home";

import Login
    from "../pages/auth/Login";

import Register
    from "../pages/auth/Register";

import AdminLogin
    from "../pages/auth/AdminLogin";

import AdminRegister
    from "../pages/auth/AdminRegister";

import VerifyEmail
    from "../pages/auth/VerifyEmail";

import ForgotPassword
    from "../pages/auth/ForgotPassword";

import ResetPassword
    from "../pages/auth/ResetPassword";


import Dashboard
    from "../pages/dashboard/Dashboard";

import AdminDashboard
    from "../pages/admin/AdminDashboard";

import AdminUsers
    from "../pages/admin/AdminUsers";

import AdminUserDetails
    from "../pages/admin/AdminUserDetails";

import AdminPortfolios
    from "../pages/admin/AdminPortfolios";

import AdminPortfolioDetails
    from "../pages/admin/AdminPortfolioDetails";


import AdminLayout
    from "../components/admin/AdminLayout";


import PortfolioEditor
    from "../pages/builder/PortfolioEditor";

import PublicPortfolio
    from "../pages/public/PublicPortfolio";


import ProjectsPage
    from "../pages/dashboard/projects/ProjectsPage";

import SkillsPage
    from "../pages/dashboard/skills/SkillsPage";

import ExperiencePage
    from "../pages/dashboard/experience/ExperiencePage";

import EducationPage
    from "../pages/dashboard/education/EducationPage";

import CertificatesPage
    from "../pages/dashboard/certificates/CertificatesPage";

import PostsPage
    from "../pages/dashboard/posts/PostsPage";


import ProtectedRoute
    from "./ProtectedRoute";

import AdminRoute
    from "./AdminRoute";


const AppRoutes = () => {

    return (
        <BrowserRouter>

            <Routes>


                {/* ================= HOME ================= */}

                <Route
                    path="/"
                    element={<Home />}
                />


                {/* ================= AUTH ================= */}

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />

                <Route
                    path="/admin/login"
                    element={<AdminLogin />}
                />

                <Route
                    path="/admin/register"
                    element={<AdminRegister />}
                />

                <Route
                    path="/verify-email"
                    element={<VerifyEmail />}
                />

                <Route
                    path="/forgot-password"
                    element={<ForgotPassword />}
                />

                <Route
                    path="/reset-password"
                    element={<ResetPassword />}
                />


                {/* ================= PUBLIC PORTFOLIO ================= */}

                <Route
                    path="/portfolio/:slug"
                    element={
                        <PublicPortfolio />
                    }
                />


                {/* ================= USER ================= */}

                <Route element={<ProtectedRoute />}>

                    <Route
                        path="/dashboard"
                        element={<Dashboard />}
                    />

                    <Route
                        path="/dashboard/portfolio"
                        element={<PortfolioEditor />}
                    />

                    <Route
                        path="/dashboard/projects"
                        element={<ProjectsPage />}
                    />

                    <Route
                        path="/dashboard/skills"
                        element={<SkillsPage />}
                    />

                    <Route
                        path="/dashboard/experience"
                        element={<ExperiencePage />}
                    />

                    <Route
                        path="/dashboard/education"
                        element={<EducationPage />}
                    />

                    <Route
                        path="/dashboard/certificates"
                        element={<CertificatesPage />}
                    />

                    <Route
                        path="/dashboard/posts"
                        element={<PostsPage />}
                    />

                </Route>


                {/* ================= ADMIN ================= */}

                <Route element={<AdminRoute />}>

                    <Route
                        path="/admin"
                        element={<AdminLayout />}
                    >

                        <Route
                            index
                            element={
                                <AdminDashboard />
                            }
                        />

                        <Route
                            path="users"
                            element={
                                <AdminUsers />
                            }
                        />

                        <Route
                            path="users/:userId"
                            element={
                                <AdminUserDetails />
                            }
                        />

                        <Route
                            path="portfolios"
                            element={
                                <AdminPortfolios />
                            }
                        />

                        <Route
                            path="portfolios/:portfolioId"
                            element={
                                <AdminPortfolioDetails />
                            }
                        />

                    </Route>

                </Route>


                {/* ================= FALLBACK ================= */}

                <Route
                    path="*"
                    element={
                        <div
                            className="
                                flex
                                min-h-screen
                                items-center
                                justify-center
                                bg-[#050816]
                                px-6
                                text-center
                                text-white
                            "
                        >
                            404 — Page Not Found
                        </div>
                    }
                />

            </Routes>

        </BrowserRouter>
    );

};


export default AppRoutes;