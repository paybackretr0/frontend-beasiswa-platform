import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthImg from "../../assets/auth.png";
import Button from "../../components/Button";

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Login - Beasiswa";
  }, []);

  return (
    <div className="min-h-screen flex">
      {/* Left: Background Image with Gradient */}
      <div className="hidden md:block w-0 md:w-[70%] relative">
        <img
          src={AuthImg}
          alt="Auth Illustration"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-[#2D60FF]/70 via-[#eaf0ff]/60 to-transparent" />
      </div>
      {/* Right: Login Form Centered */}
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-md bg-white rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-600 mb-6 text-center">
            Masuk Sistem Beasiswa
          </h2>
          <form className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Email Unand
              </label>
              <input
                type="email"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-[#2D60FF]"
                placeholder="nama@student.unand.ac.id"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Password
              </label>
              <input
                type="password"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-[#2D60FF]"
                placeholder="Password"
                required
              />
            </div>
            <div className="flex justify-between items-center text-sm">
              <button
                type="button"
                className="text-[#2D60FF] hover:cursor-pointer"
                onClick={() => alert("Fitur lupa password belum tersedia.")}
              >
                Lupa Password?
              </button>
              <button
                type="button"
                className="text-gray-500 hover:cursor-pointer"
                onClick={() => navigate("/")}
              >
                Beranda
              </button>
            </div>
            <Button type="submit" className="w-full">
              Masuk
            </Button>
          </form>
          <div className="mt-6 text-center text-sm">
            Belum punya akun?{" "}
            <button
              type="button"
              className="text-[#2D60FF] font-semibold hover:cursor-pointer"
              onClick={() => navigate("/signup")}
            >
              Buat akun disini
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
