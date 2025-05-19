document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements
  const introScreen = document.getElementById("intro-screen")
  const mainApp = document.getElementById("main-app")
  const getStartedBtn = document.getElementById("get-started-btn")

  const passwordInput = document.getElementById("password-input")
  const clearBtn = document.getElementById("clear-btn")
  const strengthContainer = document.getElementById("strength-container")
  const strengthText = document.getElementById("strength-text")
  const strengthBar = document.getElementById("strength-bar")
  const strongMessage = document.getElementById("strong-message")

  const generateBtn = document.getElementById("generate-btn")
  const copyBtn = document.getElementById("copy-btn")
  const copyText = document.getElementById("copy-text")
  const copyIcon = document.getElementById("copy-icon")
  const checkIcon = document.getElementById("check-icon")

  const alternativeContainer = document.getElementById("alternative-container")
  const alternativePassword = document.getElementById("alternative-password")
  const tooltipBtn = document.getElementById("tooltip-btn")
  const tooltip = document.getElementById("tooltip")
  const shuffleBtn = document.getElementById("shuffle-btn")
  const altCopyBtn = document.getElementById("alt-copy-btn")
  const altCopyIcon = document.getElementById("alt-copy-icon")
  const altCheckIcon = document.getElementById("alt-check-icon")

  const emptyAnalysis = document.getElementById("empty-analysis")
  const analysisContent = document.getElementById("analysis-content")
  const entropyValue = document.getElementById("entropy-value")
  const entropyBar = document.getElementById("entropy-bar")
  const crackTime = document.getElementById("crack-time")
  const uppercaseCheck = document.getElementById("uppercase-check")
  const lowercaseCheck = document.getElementById("lowercase-check")
  const numbersCheck = document.getElementById("numbers-check")
  const specialCheck = document.getElementById("special-check")
  const uniquenessValue = document.getElementById("uniqueness-value")
  const uniquenessBar = document.getElementById("uniqueness-bar")

  const securityTip = document.getElementById("security-tip")

  // State
  let password = ""
  let alternativePwd = ""
  let strength = 0
  let hasUpper = false
  let hasLower = false
  let hasNumber = false
  let hasSpecial = false
  let entropy = 0
  let uniqueness = 0

  // Security Tips
  const securityTips = [
    "A password with 15+ characters and symbols takes centuries to crack!",
    "Never use the same password for multiple accounts.",
    "Consider using a password manager for better security.",
    "Change your critical passwords every 3-6 months.",
    "Avoid using personal information in your passwords.",
  ]
  let currentTip = 0

  // Event Listeners
  getStartedBtn.addEventListener("click", () => {
    introScreen.classList.add("hidden")
    mainApp.classList.remove("hidden")
  })

  passwordInput.addEventListener("input", (e) => {
    password = e.target.value

    if (password) {
      clearBtn.classList.remove("hidden")
      strengthContainer.classList.remove("hidden")
      copyBtn.classList.remove("hidden")
      emptyAnalysis.classList.add("hidden")
      analysisContent.classList.remove("hidden")

      analyzePassword(password)
      generateAlternative(password)
    } else {
      resetUI()
    }
  })

  clearBtn.addEventListener("click", () => {
    passwordInput.value = ""
    password = ""
    resetUI()
  })

  generateBtn.addEventListener("click", () => {
    const generatedPassword = generateStrongPassword()
    passwordInput.value = generatedPassword
    password = generatedPassword

    clearBtn.classList.remove("hidden")
    strengthContainer.classList.remove("hidden")
    copyBtn.classList.remove("hidden")
    emptyAnalysis.classList.add("hidden")
    analysisContent.classList.remove("hidden")

    analyzePassword(password)
    generateAlternative(password)
  })

  copyBtn.addEventListener("click", () => {
    copyToClipboard(password)

    copyText.textContent = "Copied!"
    copyText.classList.add("text-green-400")
    copyIcon.classList.add("hidden")
    checkIcon.classList.remove("hidden")

    setTimeout(() => {
      copyText.textContent = "Copy to Clipboard"
      copyText.classList.remove("text-green-400")
      copyIcon.classList.remove("hidden")
      checkIcon.classList.add("hidden")
    }, 2000)
  })

  tooltipBtn.addEventListener("click", () => {
    tooltip.classList.toggle("hidden")
  })

  shuffleBtn.addEventListener("click", () => {
    generateAlternative(password)
  })

  altCopyBtn.addEventListener("click", () => {
    copyToClipboard(alternativePwd)

    altCopyIcon.classList.add("hidden")
    altCheckIcon.classList.remove("hidden")

    setTimeout(() => {
      altCopyIcon.classList.remove("hidden")
      altCheckIcon.classList.add("hidden")
    }, 2000)
  })

  // Initialize security tip rotation
  setInterval(() => {
    currentTip = (currentTip + 1) % securityTips.length

    // Fade out
    securityTip.style.opacity = "0"

    setTimeout(() => {
      securityTip.textContent = securityTips[currentTip]
      // Fade in
      securityTip.style.opacity = "1"
    }, 500)
  }, 8000)

  // Functions
  function resetUI() {
    clearBtn.classList.add("hidden")
    strengthContainer.classList.add("hidden")
    strongMessage.classList.add("hidden")
    copyBtn.classList.add("hidden")
    alternativeContainer.classList.add("hidden")
    emptyAnalysis.classList.remove("hidden")
    analysisContent.classList.add("hidden")

    // Reset analysis
    strength = 0
    hasUpper = false
    hasLower = false
    hasNumber = false
    hasSpecial = false
    entropy = 0
    uniqueness = 0
    alternativePwd = ""
  }

  function analyzePassword(pwd) {
    // Check character types
    hasUpper = /[A-Z]/.test(pwd)
    hasLower = /[a-z]/.test(pwd)
    hasNumber = /[0-9]/.test(pwd)
    hasSpecial = /[^A-Za-z0-9]/.test(pwd)

    // Update character checks
    updateCharacterChecks()

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
    strength = strengthScore

    // Update strength UI
    updateStrengthUI()

    // Calculate entropy (simplified)
    const charsetSize = (hasLower ? 26 : 0) + (hasUpper ? 26 : 0) + (hasNumber ? 10 : 0) + (hasSpecial ? 33 : 0)
    const calculatedEntropy = pwd.length * Math.log2(Math.max(charsetSize, 1))
    entropy = Math.min(100, calculatedEntropy)

    // Update entropy UI
    entropyValue.textContent = `${Math.round(entropy)}/100`
    entropyBar.style.width = `${entropy}%`

    // Set crack time estimation
    const crackTimeText = getCrackTimeEstimation(calculatedEntropy)
    crackTime.textContent = crackTimeText

    // Update crack time color
    crackTime.className = "crack-time"
    if (crackTimeText === "Instantly" || crackTimeText === "Minutes") {
      crackTime.classList.add("weak")
    } else if (crackTimeText === "Hours") {
      crackTime.classList.add("medium")
    } else {
      crackTime.classList.add("strong")
    }

    // Set uniqueness (simulated)
    uniqueness = Math.min(100, strengthScore + Math.random() * 20)
    uniquenessValue.textContent = `${Math.round(uniqueness)}%`
    uniquenessBar.style.width = `${uniqueness}%`
  }

  function updateCharacterChecks() {
    // Update character checks
    if (hasUpper) {
      uppercaseCheck.classList.add("active")
    } else {
      uppercaseCheck.classList.remove("active")
    }

    if (hasLower) {
      lowercaseCheck.classList.add("active")
    } else {
      lowercaseCheck.classList.remove("active")
    }

    if (hasNumber) {
      numbersCheck.classList.add("active")
    } else {
      numbersCheck.classList.remove("active")
    }

    if (hasSpecial) {
      specialCheck.classList.add("active")
    } else {
      specialCheck.classList.remove("active")
    }
  }

  function updateStrengthUI() {
    // Update strength bar
    strengthBar.style.width = `${strength}%`

    // Update strength text and color
    strengthBar.className = "strength-bar"
    strengthText.className = "strength-text"

    if (strength < 30) {
      strengthText.textContent = "Weak"
      strengthText.classList.add("weak")
      strengthBar.classList.add("weak")
      strongMessage.classList.add("hidden")
    } else if (strength < 70) {
      strengthText.textContent = "Medium"
      strengthText.classList.add("medium")
      strengthBar.classList.add("medium")
      strongMessage.classList.add("hidden")
    } else {
      strengthText.textContent = "Strong"
      strengthText.classList.add("strong")
      strengthBar.classList.add("strong")
      strongMessage.classList.remove("hidden")
    }
  }

  function getCrackTimeEstimation(entropyValue) {
    if (entropyValue < 28) return "Instantly"
    if (entropyValue < 36) return "Minutes"
    if (entropyValue < 60) return "Hours"
    if (entropyValue < 80) return "Months"
    if (entropyValue < 100) return "Years"
    return "Centuries"
  }

  function generateAlternative(pwd) {
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

    alternativePwd = transformed
    alternativePassword.textContent = transformed
    alternativeContainer.classList.remove("hidden")
  }

  function generateStrongPassword() {
    const length = 16
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+"
    let generatedPassword = ""

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length)
      generatedPassword += charset[randomIndex]
    }

    return generatedPassword
  }

  function copyToClipboard(text) {
    const textarea = document.createElement("textarea")
    textarea.value = text
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand("copy")
    document.body.removeChild(textarea)
  }

  // Initialize with empty state
  resetUI()
})
