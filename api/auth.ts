import api from "@/api/api";


export async function login(
  email: string,
  password: string
)  {
  try {
    const response = await api.post("/auth/login", { email, password });
    return response.data;
  } catch (error) {
    console.log("Login failed:", error);
    throw error;
  }
}

export async function register(
  name: string,
  email: string,
  password: string
) {
  try {
    const response = await api.post("/auth/register", {
      name,
      email,
      password,
    });
    return response.data;
  } catch (error) {
    console.log("Registration failed:", error);
  }
}

export async function sendOtp(email: string) {
  try {
    const response = await api.post("/auth/send-otp", { email });
    return response.data;
  } catch (error) {
    console.log("Failed to send OTP:", error);
  }
}

export async function verifyOtp(otp: string, email: string): Promise<void> {
  try {
    await api.post("/auth/verify-otp", { otp: parseInt(otp, 10), email });
  } catch (error) {
    console.log("Failed to verify OTP:", error);
  }
}
