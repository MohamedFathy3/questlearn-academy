import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import HonorBoard from "./pages/HonorBoard";
import NotFound from "./pages/NotFound";
import LoginPage from "@/pages/LoginPage";
import Profile from "@/pages/Profile";
import RegisterPage from "@/pages/RegisterPage";
import Exam from "@/pages/exam";
import Detailscourse from "@/pages/CourseDatailstatunt";
import HonerBoard from "@/pages/HonorBoardStutent";
import { useAuth } from "@/context/AuthContext";

const queryClient = new QueryClient();

const App = () => {
  const { user } = useAuth();  // هنا جبت حالة المستخدم

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/HonerBoard" element={<HonerBoard />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/course/:id" element={<CourseDetail />} />
              <Route path="/exam/:id" element={<Exam />} />
              <Route path="/course/:id" element={<CourseDetail />} />
              <Route path="/Detailscourse/:id" element={<Detailscourse />} />
              <Route path="/honor-board" element={<HonorBoard />} />
              <Route
                path="/categories"
                element={
                  <div className="p-8 text-center">
                    <h1 className="text-2xl">Categories Page - Coming Soon</h1>
                  </div>
                }
              />
              <Route
                path="/about"
                element={
                  <div className="p-8 text-center">
                    <h1 className="text-2xl">About Page - Coming Soon</h1>
                  </div>
                }
              />
              {/* شرط منع الدخول للصفحات دي لو المستخدم مسجل دخول */}
              <Route
                path="/login"
                element={!user ? <LoginPage /> : <Navigate to="/" replace />}
              />
              <Route
                path="/register"
                element={!user ? <RegisterPage /> : <Navigate to="/" replace />}
              />

              {/* هذا لازم يكون في الآخر */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
