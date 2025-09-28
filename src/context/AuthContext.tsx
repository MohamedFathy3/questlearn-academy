import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { apiFetch } from "@/lib/api";
import Cookies from "js-cookie";

interface User {
  id: number;
  name: string;
  email: string;
  image?: string | null;
  type?: string;
  qr_code?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (formData: Record<string, any>) => Promise<void>;
  checkAuth: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

async function checkAuth() {
  try {
    console.log("🔄 Checking authentication...");
    const token = Cookies.get("token");
    
    if (!token) {
      console.log("❌ No token found");
      setUser(null);
      setLoading(false);
      return;
    }
    
    console.log("🔑 Found token, verifying...");
    
    // جرب الـ endpoint الصحيح - ممكن يكون مختلف في الباكند
    const data = await apiFetch<any>("/student/check-auth");
    
    console.log("✅ User is authenticated:", data);
    
    // إذا كان الـ response مختلف، عدل حسب ما يرجع الباكند
    if (data.message && data.message.student) {
      setUser(data.message.student);
    } else if (data.student) {
      setUser(data.student);
    } else {
      setUser(data); // إذا كان الـ response مباشر
    }
    
    setError(null);
  } catch (err) {
    console.log("❌ Authentication check failed:", err);
    setUser(null);
    Cookies.remove("token"); // نظف التوكن غير الصالح
    
    if (err instanceof Error) {
      if (!err.message.includes("401") && !err.message.includes("403")) {
        setError(err.message);
      }
    }
  } finally {
    setLoading(false);
  }
}

  // دالة تسجيل الدخول
// دالة تسجيل الدخول
async function login(email: string, password: string) {
  setLoading(true);
  setError(null);
  
  try {
    console.log("🔐 Attempting login...");
    
    const body = { email, password };
    
    // استخدم any مؤقتاً أو أنشئ interface للـ response
    const response = await apiFetch<any>("/student/login", {
      method: "POST",
      body,
    });
    
    console.log("✅ Login response:", response);
    
    // استخرج البيانات من الـ response
    const { student, token } = response.message;
    
    // خزن التوكن في الكوكيز
    if (token) {
      Cookies.set("token", token, { expires: 7 }); // ينتهي بعد 7 أيام
      console.log("🔑 Token stored:", token);
    }
    
    // ضبط بيانات المستخدم
    setUser({
      id: student.id,
      name: student.name,
      email: student.email,
      image: student.image,
    });
    
    setError(null);
    
  } catch (err) {
    console.error("❌ Login failed:", err);
    setUser(null);
    if (err instanceof Error) setError(err.message);
    throw err;
  } finally {
    setLoading(false);
  }
}

  // دالة تسجيل حساب جديد
  async function register(formData: Record<string, any>) {
    setLoading(true);
    setError(null);
    
    try {
      console.log("📝 Attempting registration...");
      
      const data = await apiFetch<User>("/student/register", {
        method: "POST",
        body: formData,
      });
      
      console.log("✅ Registration successful:", data);
      setUser(data);
      setError(null);
      
      // بعد التسجيل الناجح، تحقق من المصادقة
      await checkAuth();
      
    } catch (err) {
      console.error("❌ Registration failed:", err);
      setUser(null);
      if (err instanceof Error) setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  // دالة تسجيل الخروج
  function logout() {
    console.log("🚪 Logging out...");
    
    setUser(null);
    setError(null);
    
    // نظف التوكن من الكوكيز
    Cookies.remove("token");
     setTimeout(() => {
        window.location.href = "/login";
    }, 500);
    // ممكن تضيف هنا استدعاء API لتسجيل الخروج إذا كان عندك في الباكند
    // await apiFetch("/student/logout", { method: "POST" });
  }
const checkTokenValidity = () => {
  const token = Cookies.get("token");
  console.log("🔐 Token Status:", {
    exists: !!token,
    token: token ? `${token.substring(0, 10)}...` : 'None',
    timestamp: new Date().toISOString()
  });
  if (!token) {
    throw new Error("No authentication token found. Please login again.");
  }
  
  return token;
};
  // تحقق من المصادقة عند تحميل التطبيق
  useEffect(() => {
    checkAuth();
  }, []);

  const value: AuthContextType = {
    user,
    loading,
    error,
    login,
    logout,
    register,
    checkAuth,
    isAuthenticated: !!user, // خاصية مساعدة للتحقق من حالة المصادقة
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}