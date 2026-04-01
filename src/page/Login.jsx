import React, { useState } from "react";
// Import Shadcn UI components (adjust the import paths as needed)
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useNavigate } from "react-router";
import axiosInstance from "@/lib/axios";

 import img from "../assets/SHOTLIN sdxd32-01.svg"; // Adjust the path to your logo

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setError("Username and password are required.");
      return;
    }

    setError("");
    setLoading(true);
    try {
      const { data } = await axiosInstance.post("/api/v1/auth/login", {
        username,
        password,
      });
      // Store the token and redirect to dashboard
      if (data?.token) {
        localStorage.setItem("token", data.token);
      }
      navigate("/");
    } catch (err) {
      const message =
        err?.response?.data?.message || "Invalid credentials. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardContent>
          <div className="flex flex-col items-center mb-6">
            {/* Company Logo */}
            <img src={img} alt="Company Logo" className="h-12 mb-4" />
            {/* Login Title */}
            <h1 className="text-2xl font-bold text-center">Admin Panel Login</h1>
          </div>

          {/* Display error message if login fails */}
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <Label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 block w-full"
                required
                aria-describedby="username-desc"
              />
            </div>

            <div className="mb-6">
              <Label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full"
                required
                aria-describedby="password-desc"
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Logging in…" : "Login"}
            </Button>
          </form>

          {/* Forgot Password Link */}
          <div className="mt-4 text-center">
            <a
              href="/forgot-password"
              className="text-sm text-blue-600 hover:underline focus:outline-none focus:underline"
            >
              Forgot Password?
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
