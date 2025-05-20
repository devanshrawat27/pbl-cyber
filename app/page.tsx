"use client"

import { useState, useEffect } from "react"
import { Lock, Copy, Shuffle, Shield, CheckCircle, AlertTriangle, X } from "lucide-react"
import { cn } from "@/lib/utils"

export default function SecurePassAI() {
  const [showIntro, setShowIntro] = useState(true)
  const [password, setPassword] = useState("")
  const [alternativePassword, setAlternativePassword] = useState("")
  const [strength, setStrength] = useState(0)
  const [copied, setCopied] = useState(false)
  const [altCopied, setAltCopied] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)

  // Password analysis states
  const [hasUpper, setHasUpper] = useState(false)
  const [hasLower, setHasLower] = useState(false)
  const [hasNumber, setHasNumber] = useState(false)
  const [hasSpecial, setHasSpecial] = useState(false)
  const [entropy, setEntropy] = useState(0)
  const [crackTime, setCrackTime] = useState("")
  const [uniqueness, setUniqueness] = useState(0)

  // Random security tips
  const securityTips = [
    "A password with 15+ characters and symbols takes centuries to crack!",
    "Never use the same password for multiple accounts.",
    "Consider using a password manager for better security.",
    "Change your critical passwords every 3-6 months.",
    "Avoid using personal information in your passwords.",
  ]
  const [currentTip, setCurrentTip] = useState(0)

  useEffect(() => {
    // Rotate tips every 8 seconds
    const tipInterval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % securityTips.length)
    }, 8000)

    return () => clearInterval(tipInterval)
  }, [])

  useEffect(() => {
    if (password) {
      analyzePassword(password)
      generateAlternative(password)
    } else {
      resetAnalysis()
    }
  }, [password])

  const resetAnalysis = () => {
    setStrength(0)
    setHasUpper(false)
    setHasLower(false)
    setHasNumber(false)
    setHasSpecial(false)
    setEntropy(0)
    setCrackTime("")
    setUniqueness(0)
    setAlternativePassword("")
  }

  const analyzePassword = (pwd) => {
    // Check character types
    setHasUpper(/[A-Z]/.test(pwd))
    setHasLower(/[a-z]/.test(pwd))
    setHasNumber(/[0-9]/.test(pwd))
    setHasSpecial(/[^A-Za-z0-9]/.test(pwd))

    // Calculate strength (0-100)
    let strengthScore = 0
    if (pwd.length > 0) strengthScore += Math.min(pwd.length * 2, 30)
    if (hasUpper) strengthScore += 15
    if (hasLower) strengthScore += 15
    if (hasNumber) strengthScore += 15
    if (hasSpecial) strengthScore += 25

    // Penalize for common patterns
    if (/^[a-zA-Z]+$/.test(pwd)) strengthScore -= 10
    if (/^[0-9]+$/.test(pwd)) strengthScore -= 15
    if (/^[a-zA-Z0-9]+$/.test(pwd)) strengthScore -= 5

    // Ensure strength is between 0-100
    strengthScore = Math.max(0, Math.min(100, strengthScore))
    setStrength(strengthScore)

    // Calculate entropy (simplified)
    const charsetSize = (hasLower ? 26 : 0) + (hasUpper ? 26 : 0) + (hasNumber ? 10 : 0) + (hasSpecial ? 33 : 0)

    const calculatedEntropy = pwd.length * Math.log2(Math.max(charsetSize, 1))
    setEntropy(Math.min(100, calculatedEntropy))

    // Set crack time estimation
    setCrackTime(getCrackTimeEstimation(calculatedEntropy))

    // Set uniqueness (simulated)
    setUniqueness(Math.min(100, strengthScore + Math.random() * 20))
  }

  const getCrackTimeEstimation = (entropyValue) => {
    if (entropyValue < 28) return "Instantly"
    if (entropyValue < 36) return "Minutes"
    if (entropyValue < 60) return "Hours"
    if (entropyValue < 80) return "Months"
    if (entropyValue < 100) return "Years"
    return "Centuries"
  }

  const generateAlternative = (pwd) => {
    if (!pwd) return

    // Simulate AI transformation (not actual AI)
    let transformed = ""

    for (let i = 0; i < pwd.length; i++) {
      const char = pwd[i]

      // Apply transformations
      if (char === "a" || char === "A") transformed += "@"
      else if (char === "e" || char === "E") transformed += "3"
      else if (char === "i" || char === "I") transformed += "!"
      else if (char === "o" || char === "O") transformed += "0"
      else if (char === "s" || char === "S") transformed += "$"
      else if (char === "t" || char === "T") transformed += "+"
      else if (char === "l" || char === "L") transformed += "1"
      else if (/[a-z]/.test(char) && Math.random() > 0.7) transformed += char.toUpperCase()
      else if (/[A-Z]/.test(char) && Math.random() > 0.7) transformed += char.toLowerCase()
      else if (/[0-9]/.test(char)) transformed += char
      else if (Math.random() > 0.8) transformed += char + char
      else transformed += char
    }

    // Add special character if none exists
    if (!hasSpecial && transformed.length > 0) {
      const specials = ["!", "@", "#", "$", "%", "^", "&", "*"]
      transformed += specials[Math.floor(Math.random() * specials.length)]
    }

    setAlternativePassword(transformed)
  }

  const generateStrongPassword = () => {
    const length = 16
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+"
    let generatedPassword = ""

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length)
      generatedPassword += charset[randomIndex]
    }

    setPassword(generatedPassword)
  }

  const copyToClipboard = (text, isAlt = false) => {
    navigator.clipboard.writeText(text)
    if (isAlt) {
      setAltCopied(true)
      setTimeout(() => setAltCopied(false), 2000)
    } else {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const getStrengthLabel = () => {
    if (strength < 30) return { text: "Weak", color: "text-red-500" }
    if (strength < 70) return { text: "Medium", color: "text-yellow-500" }
    return { text: "Strong", color: "text-green-500" }
  }

  const getStrengthColor = () => {
    if (strength < 30) return "bg-red-500"
    if (strength < 70) return "bg-yellow-500"
    return "bg-green-500"
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-gray-950 to-gray-950"></div>
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full filter blur-3xl"></div>
      </div>

      {showIntro ? (
        <div className="relative z-10 flex flex-col items-center justify-center text-center max-w-3xl mx-auto animate-fadeIn">
          <div className="mb-8 relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 blur-lg opacity-70 animate-pulse"></div>
            <div className="relative bg-gray-900 p-8 rounded-full border border-gray-800 shadow-xl">
              <Lock className="w-20 h-20 text-blue-400" />
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            SecurePass AI
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8">Your Smart Password Companion</p>

          <button
            onClick={() => setShowIntro(false)}
            className="px-8 py-4 text-lg font-medium rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 shadow-lg shadow-purple-500/20 transition-all duration-300 hover:shadow-purple-500/40 hover:scale-105"
          >
            Get Started
          </button>
        </div>
      ) : (
        <div className="relative z-10 w-full max-w-6xl mx-auto">
          <div className="flex flex-col items-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
              SecurePass AI
            </h1>
            <p className="text-gray-400">Your Smart Password Companion</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Panel: Password Analyzer */}
            <div className="bg-gray-900/60 backdrop-blur-md rounded-2xl p-6 border border-gray-800 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full filter blur-xl -translate-y-1/2 translate-x-1/2"></div>

              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Lock className="w-5 h-5 mr-2 text-blue-400" />
                Password Analyzer
              </h2>

              <div className="relative mb-6">
                <input
                  type="text"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full bg-gray-800/80 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                />
                {password && (
                  <button
                    onClick={() => setPassword("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {password && (
                <>
                  <div className="mb-6">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-400">Strength</span>
                      <span className={cn("text-sm font-medium", getStrengthLabel().color)}>
                        {getStrengthLabel().text}
                      </span>
                    </div>
                    <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className={cn("h-full transition-all duration-500", getStrengthColor())}
                        style={{ width: `${strength}%` }}
                      ></div>
                    </div>
                  </div>

                  {strength >= 70 && (
                    <div className="flex items-center mb-6 p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400">
                      <CheckCircle className="w-5 h-5 mr-2" />
                      <span>Strong password!</span>
                    </div>
                  )}
                </>
              )}

              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <button
                  onClick={generateStrongPassword}
                  className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 font-medium transition-all duration-300 flex items-center justify-center"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Generate Strong Password
                </button>

                {password && (
                  <button
                    onClick={() => copyToClipboard(password)}
                    className="flex-1 px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 font-medium transition-all duration-300 flex items-center justify-center"
                  >
                    {copied ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                        <span className="text-green-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-2" />
                        Copy to Clipboard
                      </>
                    )}
                  </button>
                )}
              </div>

              {password && alternativePassword && (
                <div className="mt-8 p-4 bg-gray-800/50 rounded-xl border border-gray-700">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-md font-medium text-blue-400">Memorable Alternative</h3>
                    <button
                      className="text-gray-400 hover:text-blue-400 transition-colors"
                      onClick={() => setShowTooltip(!showTooltip)}
                    >
                      <span className="text-xs underline">How does this work?</span>
                    </button>
                  </div>

                  {showTooltip && (
                    <div className="mb-3 p-3 bg-gray-800 rounded-lg text-sm text-gray-300">
                      We improved your password using semantic + secure AI rules, making it stronger while keeping it
                      memorable.
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-900 p-3 rounded-lg border border-gray-800 font-mono text-blue-300 overflow-x-auto">
                      {alternativePassword}
                    </div>
                    <button
                      onClick={() => generateAlternative(password)}
                      className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-all"
                      title="Generate new alternative"
                    >
                      <Shuffle className="w-5 h-5 text-blue-400" />
                    </button>
                    <button
                      onClick={() => copyToClipboard(alternativePassword, true)}
                      className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-all"
                      title="Copy to clipboard"
                    >
                      {altCopied ? (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      ) : (
                        <Copy className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Right Panel: Password Analysis */}
            <div className="bg-gray-900/60 backdrop-blur-md rounded-2xl p-6 border border-gray-800 shadow-xl relative overflow-hidden">
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/10 rounded-full filter blur-xl translate-y-1/2 -translate-x-1/2"></div>

              <h2 className="text-xl font-semibold mb-6 flex items-center">
                <Shield className="w-5 h-5 mr-2 text-purple-400" />
                Password Analysis
              </h2>

              {!password ? (
                <div className="flex flex-col items-center justify-center h-64 text-center text-gray-400">
                  <AlertTriangle className="w-12 h-12 mb-4 text-gray-600" />
                  <p className="text-lg mb-2">Enter a password to analyze</p>
                  <p className="text-sm max-w-md">
                    We'll show you detailed metrics and suggestions to improve your password security.
                  </p>
                </div>
              ) : (
                <>
                  <div className="mb-6">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-400">Entropy Score</span>
                      <span className="text-sm font-medium">{Math.round(entropy)}/100</span>
                    </div>
                    <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
                        style={{ width: `${entropy}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="mb-6 p-4 bg-gray-800/50 rounded-xl border border-gray-700">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-400">Estimated Crack Time</span>
                      <span
                        className={cn(
                          "text-sm font-medium",
                          crackTime === "Instantly" || crackTime === "Minutes"
                            ? "text-red-400"
                            : crackTime === "Hours"
                              ? "text-yellow-400"
                              : "text-green-400",
                        )}
                      >
                        {crackTime}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div
                      className={cn(
                        "p-3 rounded-lg border flex items-center",
                        hasUpper
                          ? "bg-green-500/10 border-green-500/20 text-green-400"
                          : "bg-gray-800/50 border-gray-700 text-gray-500",
                      )}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      <span className="text-sm">Uppercase</span>
                    </div>
                    <div
                      className={cn(
                        "p-3 rounded-lg border flex items-center",
                        hasLower
                          ? "bg-green-500/10 border-green-500/20 text-green-400"
                          : "bg-gray-800/50 border-gray-700 text-gray-500",
                      )}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      <span className="text-sm">Lowercase</span>
                    </div>
                    <div
                      className={cn(
                        "p-3 rounded-lg border flex items-center",
                        hasNumber
                          ? "bg-green-500/10 border-green-500/20 text-green-400"
                          : "bg-gray-800/50 border-gray-700 text-gray-500",
                      )}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      <span className="text-sm">Numbers</span>
                    </div>
                    <div
                      className={cn(
                        "p-3 rounded-lg border flex items-center",
                        hasSpecial
                          ? "bg-green-500/10 border-green-500/20 text-green-400"
                          : "bg-gray-800/50 border-gray-700 text-gray-500",
                      )}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      <span className="text-sm">Special</span>
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-400">Password Uniqueness</span>
                      <span className="text-sm font-medium">{Math.round(uniqueness)}%</span>
                    </div>
                    <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                        style={{ width: `${uniqueness}%` }}
                      ></div>
                    </div>
                  </div>
                </>
              )}

              {/* Security Tips */}
              <div className="mt-6 p-4 bg-blue-900/20 rounded-xl border border-blue-900/30 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5"></div>
                <h3 className="text-md font-medium text-blue-300 mb-2 relative">Security Tip</h3>
                <p className="text-sm text-gray-300 relative animate-fadeIn">{securityTips[currentTip]}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
