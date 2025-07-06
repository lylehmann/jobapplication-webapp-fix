"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Github, Mail, Eye, EyeOff, Zap } from "lucide-react"
import { useAuth } from "./auth-provider"

export function LoginForm() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")

  const { signIn, signUp, signInWithGitHub, signInAsDemoUser } = useAuth()

  // Check if we're in development mode
  const isDev =
    process.env.NODE_ENV === "development" ||
    (typeof window !== "undefined" && window.location.hostname === "localhost")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setMessage("")

    try {
      if (isLogin) {
        await signIn(email, password)
      } else {
        await signUp(email, password)
        if (!isDev) {
          setMessage("Check your email for the confirmation link!")
        }
      }
    } catch (err: any) {
      setError(err.message || "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const handleGitHubSignIn = async () => {
    setLoading(true)
    setError("")

    try {
      await signInWithGitHub()
    } catch (err: any) {
      setError(err.message || "An error occurred")
      setLoading(false)
    }
  }

  const handleDemoSignIn = async () => {
    setLoading(true)
    try {
      await signInAsDemoUser()
    } catch (err: any) {
      setError(err.message || "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Job Application Manager</CardTitle>
          <CardDescription className="text-center">Sign in to manage your job applications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {message && (
            <Alert>
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}

          {/* Development Demo Button - Always show for easy access */}
          <Button
            type="button"
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
            onClick={handleDemoSignIn}
            disabled={loading}
          >
            <Zap className="w-4 h-4 mr-2" />
            Continue as Demo User
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or</span>
            </div>
          </div>

          {/* GitHub Sign In */}
          <Button
            type="button"
            variant="outline"
            className="w-full bg-transparent"
            onClick={handleGitHubSignIn}
            disabled={loading}
          >
            <Github className="w-4 h-4 mr-2" />
            Continue with GitHub
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with email</span>
            </div>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter any email (demo mode)"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter any password (demo mode)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Loading..." : isLogin ? "Sign In" : "Sign Up"}
            </Button>
          </form>

          <div className="text-center text-sm">
            <span className="text-muted-foreground">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
            </span>{" "}
            <Button
              type="button"
              variant="link"
              className="p-0 h-auto font-normal"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "Sign up" : "Sign in"}
            </Button>
          </div>

          <div className="text-center text-xs text-muted-foreground mt-4 p-3 bg-muted/50 rounded-lg border">
            <div className="font-medium mb-1">🚀 Demo Mode Active</div>
            <div>Click "Continue as Demo User" for instant access, or use any email/password combination.</div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
