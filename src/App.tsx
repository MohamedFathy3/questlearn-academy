import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/context/AuthContext"; // ✅ أضف هذا
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import HonorBoard from "./pages/HonorBoard";
import NotFound from "./pages/NotFound";
import LoginPage from "@/pages/LoginPage";
import Profile from "@/pages/Profile";
import Profileparent from "@/pages/Profileparent";
import RegisterPage from "@/pages/RegisterPage";
import Exam from "@/pages/exam";
import Detailscourse from "@/pages/CourseDatailstatunt";
import HonerBoard from "@/pages/HonorBoardStutent";
import ContactUs from "@/pages/Contact";
import EditProfile from '@/pages/EditProfile';
import ParentDetils from "@/pages/parentDetials";
import LIbraryStudent from "@/pages/library_student";
import LibraryTeacher from "@/pages/library_teacher";
import TeacherDetils from "@/pages/teacherDatails";
import ProtectedRoute from "@/components/ProtectedRoute";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 دقائق
      retry: 1,
    },
  },
});

const AppRoutes = () => {
  const { user } = useAuth(); // ✅ الآن في المكان الصحيح بعد AuthProvider

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/contact" element={<ContactUs />} />
      
      {/* Protected Routes */}
      <Route 
        path="/library_student" 
        element={
          <ProtectedRoute>
            <LIbraryStudent />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/library_teacher" 
        element={
          <ProtectedRoute>
            <LibraryTeacher />
          </ProtectedRoute>
        } 
      />
      
      <Route path="/profileParent" element={<Profileparent />} />
      <Route path="/profileTeacher/:id" element={<TeacherDetils />} />
      <Route path="/HonerBoard" element={<HonerBoard />} />
      <Route path="/courses" element={<Courses />} />
      <Route path="/course/:id" element={<CourseDetail />} />
      <Route path="/parent/child/:id" element={<ParentDetils />} />
      <Route path="/exam/:id" element={<Exam />} />
      <Route path="/Detailscourse/:id" element={<Detailscourse />} />
      <Route path="/honor-board" element={<HonorBoard />} />
      <Route path="/edit-profile" element={<EditProfile />} />

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
      
      <Route
        path="/login"
        element={!user ? <LoginPage /> : <Navigate to="/" replace />}
      />
      <Route
        path="/register"
        element={!user ? <RegisterPage /> : <Navigate to="/" replace />}
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={false} />
      <AuthProvider> {/* ✅ أضف AuthProvider هنا */}
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Layout>
              <AppRoutes /> {/* ✅ استخدم المكون المنفصل */}
            </Layout>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;