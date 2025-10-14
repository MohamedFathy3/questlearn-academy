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
  children?: any[];
  phone?: string;
  birth_day?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (identifier: string, password: string, userType: 'student' | 'parent') => Promise<void>;
  logout: () => void;
  register: (formData: Record<string, any>) => Promise<void>;
  checkAuth: () => Promise<void>;
  refreshUserData: () => Promise<void>;
  updateProfile: (formData: FormData) => Promise<void>;
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
  const [userType, setUserType] = useState<'student' | 'parent' | null>(null);

  async function checkAuth() {
    try {
      console.log("🔄 Checking authentication...");
      const token = Cookies.get("token");
      const storedUserType = Cookies.get("userType") as 'student' | 'parent' | null;
      
      if (!token || !storedUserType) {
        console.log("❌ No token or user type found");
        setUser(null);
        setUserType(null);
        setLoading(false);
        return;
      }
      
      console.log("🔑 Found token, verifying...");
      setUserType(storedUserType);
      
      const endpoint = storedUserType === 'student' ? "/student/check-auth" : "/parent/check-auth";
      const data = await apiFetch<any>(endpoint);
      
      console.log("✅ User is authenticated:", data);
      
      if (storedUserType === 'student') {
        // معالجة response للطالب
        if (data.message && data.message.student) {
          setUser(data.message.student);
        } else if (data.student) {
          setUser(data.student);
        } else {
          setUser(data);
        }
      } else if (storedUserType === 'parent') {
        // معالجة response لولي الأمر
        if (data.message && data.message.parent) {
          setUser(data.message.parent);
        } else if (data.parent) {
          setUser(data.parent);
        } else {
          setUser(data);
        }
      }
      
      setError(null);
    } catch (err) {
      console.log("❌ Authentication check failed:", err);
      setUser(null);
      setUserType(null);
      Cookies.remove("token");
      Cookies.remove("userType");
      
      if (err instanceof Error) {
        if (!err.message.includes("401") && !err.message.includes("403")) {
          setError(err.message);
        }
      }
    } finally {
      setLoading(false);
    }
  }

  async function login(identifier: string, password: string, userType: 'student' | 'parent') {
    setLoading(true);
    setError(null);
    
    try {
      console.log("🔐 Attempting login...", { userType, identifier });
      
      let endpoint = '';
      let body = {};

      if (userType === 'student') {
        endpoint = "/student/login";
        body = { email: identifier, password };
      } else if (userType === 'parent') {
        endpoint = "/parent/login";
        body = { qr_code: identifier, password };
      }
      
      const response = await apiFetch<any>(endpoint, {
        method: "POST",
        body,
      });
      
      console.log("✅ Login response:", response);
      
      let userData;
      let token;

      if (userType === 'student') {
        // معالجة response للطالب
        if (response.message && response.message.student) {
          userData = response.message.student;
          token = response.message.token;
        } else if (response.student) {
          userData = response.student;
          token = response.token;
        } else {
          userData = response;
          token = response.token;
        }
      } else if (userType === 'parent') {
        // معالجة response لولي الأمر - بناءً على الـ response الجديد
        if (response.message && response.message.parent) {
          userData = response.message.parent;
          token = response.message.token;
        } else if (response.parent) {
          userData = response.parent;
          token = response.token;
        } else {
          userData = response;
          token = response.token;
        }
      }
      
      if (!userData || !token) {
        throw new Error("Invalid response from server");
      }
      
      if (token) {
        Cookies.set("token", token, { expires: 7 });
        Cookies.set("userType", userType, { expires: 7 });
        console.log("🔑 Token and user type stored");
      }
      
      // بناء كائن المستخدم بناءً على البيانات المستلمة
      const userObject: User = {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        image: userData.image,
        type: userType,
        qr_code: userData.qr_code,
        total_rate: userData.total_rate,
        courses: userData.courses,
        children: userData.children || (response.student ? [response.student] : []) // إضافة الأبناء إذا وجدوا
      };
      
      setUser(userObject);
      setUserType(userType);
      setError(null);
      
    } catch (err) {
      console.error("❌ Login failed:", err);
      setUser(null);
      setUserType(null);
      if (err instanceof Error) {
        const errorMessage = err.message || 'فشل تسجيل الدخول';
        setError(errorMessage);
      }
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

async function updateProfile(formData: FormData) {
  setLoading(true);
  setError(null);
  
  try {
    console.log("📝 Updating profile...");
    
    const endpoint = userType === 'student' ? "/student/update-profile" : "/parent/update-profile";
    const token = Cookies.get("token");
    
    console.log("🔑 Token exists:", !!token);
    console.log("👤 User type:", userType);
    
    if (!token) {
      throw new Error("No authentication token found");
    }

    // استخدام fetch مباشرة مع التحقق من البيانات
    console.log("📦 FormData contents before sending:");
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value, typeof value);
    }

    const response = await fetch(`/api${endpoint}`, {
      method: "POST",
      body: formData,
      headers: {
        'Authorization': `Bearer ${token}`,
        // لا تضيف Content-Type هنا - FormData يضيفه تلقائياً
      },
    });
    
    console.log("📡 Response status:", response.status);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.log("❌ Error response data:", errorData);
      
      if (response.status === 422) {
        // خطأ في التحقق من البيانات
        const errorMessage = errorData.message || 'بيانات غير صالحة';
        const fieldErrors = errorData.errors ? Object.values(errorData.errors).flat().join(', ') : '';
        throw new Error(`${errorMessage} ${fieldErrors}`);
      }
      
      if (response.status === 401) {
        // Token غير صالح
        console.log("❌ Token is invalid, logging out...");
        Cookies.remove("token");
        Cookies.remove("userType");
        setUser(null);
        setUserType(null);
        throw new Error("Session expired. Please login again.");
      }
      
      throw new Error(`Update failed: ${response.status}`);
    }

    const responseData = await response.json();
    console.log("✅ Profile update response:", responseData);
    
    // تحديث بيانات المستخدم
    let updatedUserData;
    
    if (userType === 'student') {
      if (responseData.message && responseData.message.student) {
        updatedUserData = responseData.message.student;
      } else if (responseData.student) {
        updatedUserData = responseData.student;
      } else {
        updatedUserData = responseData;
      }
    }
    
    if (updatedUserData) {
      setUser(prevUser => ({
        ...prevUser,
        ...updatedUserData,
        id: prevUser?.id || updatedUserData.id,
        type: prevUser?.type || userType || 'student'
      }));
    }
    
    setError(null);
    console.log("✅ Profile updated successfully");
    
  } catch (err) {
    console.error("❌ Profile update failed:", err);
    if (err instanceof Error) {
      setError(err.message);
    }
    throw err;
  } finally {
    setLoading(false);
  }
}
  function logout() {
    console.log("🚪 Logging out...");
    
    setUser(null);
    setUserType(null);
    setError(null);
    
    Cookies.remove("token");
    Cookies.remove("userType");
    setTimeout(() => {
      window.location.href = "/login";
    }, 500);
  }

  useEffect(() => {
    checkAuth();
  }, []);

  const refreshUserData = async () => {
    try {
      console.log("🔄 Refreshing user data...");
      await checkAuth();
    } catch (error) {
      console.error("❌ Error refreshing user data:", error);
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    error,
    login,
    logout,
    register,
    checkAuth,
    refreshUserData,
    updateProfile, // تمت الإضافة هنا
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}