import Cookies from "js-cookie";

const API_BASE_URL = "/api";

export interface ApiFetchOptions extends RequestInit {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body?: any;
}

export async function apiFetch<T>(
  endpoint: string,
  options: ApiFetchOptions = {}
): Promise<T> {
  const token = Cookies.get("token");

  console.log("🔍 API Fetch Details:", {
    endpoint,
    method: options.method || "GET",
    hasToken: !!token,
    API_BASE_URL,
  });

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    "Accept": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    method: options.method || "GET",
    headers,
    credentials: "include",
    ...options,
  };

  if (options.body && typeof options.body !== "string") {
    config.body = JSON.stringify(options.body);
    console.log("📦 Request Body:", options.body);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    console.log("📡 Response Status:", response.status, response.statusText);

    if (response.status === 401) {
      console.log("🔐 401 Unauthorized - Token might be invalid");
    }

    if (!response.ok) {
      let errorMsg = `HTTP error! status: ${response.status}`;
      try {
        const errorText = await response.text();
        console.log("❌ Error Response Text:", errorText);

        if (errorText) {
          const parsedError = JSON.parse(errorText);
          errorMsg = parsedError.message || parsedError.error || errorText;
        }
      } catch (parseError) {
        console.log("❌ Raw Error Response:", parseError);
      }
      throw new Error(errorMsg);
    }

    const data = await response.json();
    console.log("✅ Success Response:", data);
    return data as T;
  } catch (error) {
    console.error("🚨 Fetch Error:", error);
    throw error;
  }
}
