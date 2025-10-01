import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { apiFetch } from "@/lib/api";
import Cookies from "js-cookie";

interface Course {
  id: number;
  title: string;
  description: string;
  image: string;
  price: string;
  teacher: {
    name: string;
  };
  subject: {
    name: string;
  };
  details: Array<{
    id: number;
    title: string;
    content_type: string;
  }>;
  exams:{
    id :number,
    title:string,
    description:string,
      duration:number,
      course_id:number,
      questions: Array<{
        id: number;
        question_text: string;
        options: Array<{
          id: number;
          choice_text: string;
          is_correct: boolean;
        }>;
      questions_count:number;

      }>;

    }
}

interface User {
  id: number;
  name: string;
  email: string;
  image?: string | null;
  type?: string;
  qr_code?: string;
  courses?: Course[];
  total_rate?: number;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (formData: Record<string, any>) => Promise<void>;
  checkAuth: () => Promise<void>;
   refreshUserData: () => Promise<void>; // أضف هذه الدالة

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
      
      const data = await apiFetch<any>("/student/check-auth");
      
      console.log("✅ User is authenticated:", data);
      
      // تحديث هنا ليشمل الكورسات
      if (data.message && data.message.student) {
        setUser(data.message.student);
      } else if (data.student) {
        setUser(data.student);
      } else {
        setUser(data);
      }
      
      setError(null);
    } catch (err) {
      console.log("❌ Authentication check failed:", err);
      setUser(null);
      Cookies.remove("token");
      
      if (err instanceof Error) {
        if (!err.message.includes("401") && !err.message.includes("403")) {
          setError(err.message);
        }
      }
    } finally {
      setLoading(false);
    }
  }

  async function login(email: string, password: string) {
    setLoading(true);
    setError(null);
    
    try {
      console.log("🔐 Attempting login...");
      
      const body = { email, password };
      
      const response = await apiFetch<any>("/student/login", {
        method: "POST",
        body,
      });
      
      console.log("✅ Login response:", response);
      
      const { student, token } = response.message;
      
      if (token) {
        Cookies.set("token", token, { expires: 7 });
        console.log("🔑 Token stored:", token);
      }
      
      setUser({
        id: student.id,
        name: student.name,
        email: student.email,
        image: student.image,
        courses: student.courses, // إضافة الكورسات
        type: student.type,
        qr_code: student.qr_code,
        total_rate: student.total_rate
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

  function logout() {
    console.log("🚪 Logging out...");
    
    setUser(null);
    setError(null);
    
    Cookies.remove("token");
    setTimeout(() => {
      window.location.href = "/login";
    }, 500);
  }

  useEffect(() => {
    checkAuth();
  }, []);


  // في الـ AuthProvider، أضف هذه الدالة
const refreshUserData = async () => {
  try {
    console.log("🔄 Refreshing user data...");
    await checkAuth(); // هذا سيحدث بيانات المستخدم بما فيهم الكورسات
  } catch (error) {
    console.error("❌ Error refreshing user data:", error);
  }
};

// أضف refreshUserData إلى value

  const value: AuthContextType = {
    user,
    loading,
    error,
    login,
    logout,
    register,
    checkAuth,
     refreshUserData, // أضف هذه

    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}