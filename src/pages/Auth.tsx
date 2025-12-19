import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, Lock, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import Snowfall from "react-snowfall";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); 
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // ✅ password match check before submit
    if (!isLogin && password !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Password mismatch",
        description: "Passwords do not match. Please recheck.",
      });
      setLoading(false);
      return;
    }

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          toast({
            variant: "destructive",
            title: "Login failed",
            description: error.message,
          });
        } else {
          toast({
            title: "Welcome back!",
            description: "You have successfully logged in.",
          });
          navigate("/");
        }
      } else {
        const { error } = await signUp(email, password, fullName);
        if (error) {
          toast({
            variant: "destructive",
            title: "Signup failed",
            description: error.message,
          });
        } else {
          toast({
            title: "Account created!",
            description: "You have successfully signed up.",
          });
          navigate("/");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dark min-h-screen flex items-center justify-center px-4 relative">
      <Snowfall
        color="#fff"
        snowflakeCount={50}
        speed={[0.5, 1.0]}
        wind={[-0.5, 0.5]}
        radius={[0.5, 2.0]}
        style={{
          position: 'fixed',
          width: '100vw',
          height: '100vh',
          zIndex: 9999,
          pointerEvents: 'none'
        }}
      />


      {/* main container */}
      <div className="w-full max-w-3xl">
        {/* centered card */}
        <div className="mx-auto max-w-md card-surface rounded-2xl p-8 card-border bg-gradient-to-r from-primary via-electric to-hotpink bg-clip-text text-transparent border-[rgba(214, 207, 207, 0.05)] border-2">
          <div className="mb-4">
            <h2 className="text-3xl font-bold text-white">AniShow</h2>
            <p className="muted-sub mt-1 text-sm text-white">
              {isLogin ? "Login to your account" : "Create a new account"}
            </p>
          </div>

          {/* tabs */}
          <div className="flex bg-white/5 rounded-xl p-1 mb-6 border border-[rgba(255, 246, 246, 0.71)] bg-white/5">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                isLogin ? "bg-[#0f0a14] text-white shadow" : "text-[#9a93a7] hover:text-white"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                !isLogin ? "bg-[#0f0a14] text-white shadow" : "text-[#9a93a7] hover:text-white"
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* full name only on signup */}
            {!isLogin && (
              <div>
                <div className="relative mt-2">
                  <User className="absolute left-3 top-3.5 text-[#7d7588] w-4 h-4" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Full Name"
                    required
                    className="w-full pl-10 pr-3 py-2.5 rounded-lg bg-white/5 text-[#e6e1f6] border border-[rgba(255,255,255,0.04)] focus:outline-none focus:ring-2 focus:ring-[rgba(107,33,168,0.18)]"
                  />
                </div>
              </div>
            )}

            {/* email */}
            <div>

              <div className="relative mt-2">
                <Mail className="absolute left-3 top-3.5 text-[#7d7588] w-4 h-4" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  required
                  className="w-full pl-10 pr-3 py-2.5 rounded-lg bg-white/5 text-[#e6e1f6] border border-[rgba(255,255,255,0.04)] focus:outline-none focus:ring-2 focus:ring-[rgba(107,33,168,0.18)]"
                />
              </div>
            </div>

            {/* password */}
            <div>

              <div className="relative mt-2">
                <Lock className="absolute left-3 top-3.5 text-[#7d7588] w-4 h-4" />
                <input
                  type=""
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="password"
                  required
                  className="w-full pl-10 pr-3 py-2.5 rounded-lg bg-white/5 text-[#e6e1f6] border border-[rgba(255,255,255,0.04)] focus:outline-none focus:ring-2 focus:ring-[rgba(107,33,168,0.18)]"
                />
              </div>
            </div>

            {!isLogin && (
              <div>
                <div className="relative mt-2">
                  <Lock className="absolute left-3 top-3.5 text-[#7d7588] w-4 h-4" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    required
                    className="w-full pl-10 pr-3 py-2.5 rounded-lg bg-white/5 text-[#e6e1f6] border border-[rgba(255,255,255,0.04)] focus:outline-none focus:ring-2 focus:ring-[rgba(107,33,168,0.18)]"
                  />
                </div>
              </div>
            )}

            {/* submit button */}
            <button
              type="submit"
              disabled={loading}
              className="mt-2 py-2.5 rounded-lg btn-brand text-white font-semibold shadow-btn hover:opacity-95 transition duration-150 disabled:opacity-50 border border-[rgba(255,255,255,0.03)] hover:bg-purple-700 bg-white/5"
            >
              {loading
                ? isLogin
                  ? "Logging in..."
                  : "Creating account..."
                : isLogin
                ? "Login"
                : "Sign Up"}
            </button>
          </form>

          {/* toggle login/signup */}
          <div className="text-sm muted-sub mt-4 text-center text-white ">
            {isLogin ? (
              <>
                Don’t have an account yet?{" "}
                <button
                  onClick={() => setIsLogin(false)}
                  className="text-[rgba(107,33,168,1)] hover:underline"
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  onClick={() => setIsLogin(true)}
                  className="text-[rgba(107,33,168,1)] hover:underline"
                >
                  Login
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
