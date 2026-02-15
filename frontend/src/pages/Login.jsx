import { useState } from "react";
import { Music, Mail, Lock, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AuthPage({ onLogin }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("login");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState("");
   const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
        const res = await fetch(`https://focusflow-7znc.onrender.com/users/login`, {
            method: "POST",
            headers: {"Content-Type":"application/json"},
            body: JSON.stringify({
                email: loginEmail,
                password: loginPassword,
            }),
        });

        const data = await res.json();

        if(!res.ok){
            alert(data.message || "Login failed!");
            return;
        }

        console.log("Login success:", data.user);

        localStorage.setItem('lofi_token', data.token);

         navigate('/');
    } catch (err) {
      console.error("Login error:", err);
      alert("Server connection error!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (registerPassword !== registerConfirmPassword) {
      alert("Passwords don't match!");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("https://focusflow-7znc.onrender.com/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: registerName,
          email: registerEmail,
          password: registerPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Register failed!");
        return;
      }

      console.log("✅ Register success:", data.user);

      localStorage.setItem('lofi_token', data.token);

      navigate('/');

    } catch (err) {
      console.error("❌ Register error:", err);
      alert("Server connection error!");
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 bg-violet-500/20 rounded-full blur-3xl -top-20 -left-20 animate-pulse" />
        <div
          className="absolute w-96 h-96 bg-fuchsia-500/20 rounded-full blur-3xl -bottom-20 -right-20 animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute w-64 h-64 bg-blue-500/20 rounded-full blur-3xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse"
          style={{ animationDelay: "2s" }}
        />
      </div>

      {/* Auth Card */}
      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl mb-4">
            <Music className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-white text-3xl mb-2">Lofi Radio</h1>
        </div>

        <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl p-6">
          {/* Tabs */}
          <div className="flex gap-2 p-1 bg-white/5 rounded-xl mb-6">
            <button
              onClick={() => setActiveTab("login")}
              className={`flex-1 py-2 px-4 rounded transition-all ${
                activeTab === "login"
                  ? "bg-white/20 text-white shadow-lg"
                  : "text-white/60 hover:text-white/80"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setActiveTab("register")}
              className={`flex-1 py-2 px-4 rounded transition-all ${
                activeTab === "register"
                  ? "bg-white/20 text-white shadow-lg"
                  : "text-white/60 hover:text-white/80"
              }`}
            >
              Register
            </button>
          </div>

          {/* Login Form */}
          {activeTab === "login" && (
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Email */}
              <div className="space-y-2">
                <label htmlFor="login-email" className="text-white text-sm block">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
                  <input
                    id="login-email"
                    type="email"
                    placeholder="your@email.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/20 rounded text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label htmlFor="login-password" className="text-white text-sm block">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
                  <input
                    id="login-password"
                    type="password"
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/20 rounded text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all"
                    required
                  />
                </div>
              </div>

              {/* Remember & Forgot */}
              <div className="flex items-center justify-between text-sm">
                <label className="d-flex align-items-center text-white/60 cursor-pointer m-0 p-0   ">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-white/20 bg-white/5 text-violet-500 focus:ring-violet-500/50 me-2"
                  />
                  <p className="m-0 p-0">Remember me</p>
                </label>
                <button
                  type="button"
                  className="text-violet-300 hover:text-violet-200 transition-colors"
                >
                  Forgot password?
                </button>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 text-white rounded transition-all shadow-lg hover:shadow-xl"
              >
                Login
              </button>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/20" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-transparent px-2 text-white/60 mt-5">
                    Or continue with
                  </span>
                </div>
              </div>

              {/* Google Login */}
              <button
                type="button"
                className="w-full py-3 bg-white/5 border border-white/20 text-white rounded hover:bg-white/10 transition-all flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </button>
            </form>
          )}

          {/* Register Form */}
          {activeTab === "register" && (
            <form onSubmit={handleRegister} className="space-y-4">
              {/* Username */}
              <div className="space-y-2">
                <label htmlFor="register-name" className="text-white text-sm block">
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
                  <input
                    id="register-name"
                    type="text"
                    placeholder="Your name"
                    value={registerName}
                    onChange={(e) => setRegisterName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/20 rounded text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label htmlFor="register-email" className="text-white text-sm block">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
                  <input
                    id="register-email"
                    type="email"
                    placeholder="your@email.com"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/20 rounded text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label htmlFor="register-password" className="text-white text-sm block">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
                  <input
                    id="register-password"
                    type="password"
                    placeholder="••••••••"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/20 rounded text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all"
                    required
                  />
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <label htmlFor="register-confirm" className="text-white text-sm block">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
                  <input
                    id="register-confirm"
                    type="password"
                    placeholder="••••••••"
                    value={registerConfirmPassword}
                    onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/20 rounded text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all"
                    required
                  />
                </div>
              </div>

              {/* Terms */}
              <div className="flex items-start gap-2 my-3">
                <input
                  type="checkbox"
                  required
                  className="mt-0 w-4 h-4 rounded border-white/20 bg-white/5 text-violet-500 focus:ring-violet-500/50"
                />
                <label className="d-flex gap-1 text-white/60 text-xs ">
                  I agree to the{" "}
                  <button type="button" className="text-violet-300 hover:text-violet-200">
                    Terms of Service
                  </button>{" "}
                  and{" "}
                  <button type="button" className="text-violet-300 hover:text-violet-200">
                    Privacy Policy
                  </button>
                </label>
              </div>

              {/* Register Button */}
              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 text-white rounded transition-all shadow-lg hover:shadow-xl"
              >
                Create Account
              </button>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-white/40 text-xs">
          <p>Join thousands of students studying with lofi beats 🎧</p>
        </div>
      </div>
    </div>
  );
}
