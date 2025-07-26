// App State
let currentUser = null
let currentScreen = "login"
let users = []
let currentQuestCategory = "all"
let currentQuest = null
const userData = {
  name: "",
  level: 1,
  xp: 65,
  maxXP: 100,
  stats: {
    strength: 85,
    stamina: 70,
    endurance: 92,
  },
  nutrition: {
    protein: 120,
    proteinTarget: 150,
    carbs: 200,
    carbsTarget: 250,
    fats: 60,
    fatsTarget: 80,
    calories: 1850,
    caloriesTarget: 2200,
  },
  quests: [
    {
      id: 1,
      title: "Morning Push-ups",
      description: "Complete 3 sets of 15 push-ups",
      category: "strength",
      xp: 25,
      completed: false,
      difficulty: "Easy",
    },
    {
      id: 2,
      title: "Cardio Session",
      description: "30 minutes of running or cycling",
      category: "cardio",
      xp: 40,
      completed: true,
      difficulty: "Medium",
    },
    {
      id: 3,
      title: "Protein Intake",
      description: "Consume 30g of protein",
      category: "nutrition",
      xp: 15,
      completed: false,
      difficulty: "Easy",
    },
    {
      id: 4,
      title: "Flexibility Training",
      description: "15 minutes of stretching",
      category: "flexibility",
      xp: 20,
      completed: false,
      difficulty: "Easy",
    },
    {
      id: 5,
      title: "Strength Training",
      description: "Complete upper body workout",
      category: "strength",
      xp: 50,
      completed: false,
      difficulty: "Hard",
    },
  ],
  meals: [
    {
      id: 1,
      name: "Breakfast",
      description: "Oatmeal with berries and protein powder",
      calories: 450,
      time: "08:00",
    },
    {
      id: 2,
      name: "Lunch",
      description: "Grilled chicken with quinoa and vegetables",
      calories: 650,
      time: "13:00",
    },
    {
      id: 3,
      name: "Snack",
      description: "Greek yogurt with nuts",
      calories: 250,
      time: "16:00",
    },
    {
      id: 4,
      name: "Dinner",
      description: "Salmon with sweet potato and broccoli",
      calories: 500,
      time: "19:00",
    },
  ],
}

// DOM Elements
const screens = {
  login: document.getElementById("loginScreen"),
  signup: document.getElementById("signupScreen"),
  home: document.getElementById("homeScreen"),
  quests: document.getElementById("questsScreen"),
  stats: document.getElementById("statsScreen"),
  nutrition: document.getElementById("nutritionScreen"),
}

// Initialize App
document.addEventListener("DOMContentLoaded", () => {
  initializeApp()
  setupEventListeners()
  createParticles()
  setupEnhancedEffects()
})

function initializeApp() {
  // Check if user is logged in
  const savedUser = localStorage.getItem("solofit_user")
  if (savedUser) {
    currentUser = JSON.parse(savedUser)
    userData.name = currentUser.name
    showScreen("home")
  } else {
    showScreen("login")
  }
}

function setupEventListeners() {
  // Auth forms
  const loginForm = document.getElementById("loginForm")
  const signupForm = document.getElementById("signupForm")

  if (loginForm) loginForm.addEventListener("submit", handleLogin)
  if (signupForm) signupForm.addEventListener("submit", handleSignup)

  // Auth switches
  const showSignup = document.getElementById("showSignup")
  const showLogin = document.getElementById("showLogin")

  if (showSignup) showSignup.addEventListener("click", () => (window.location.href = "signup.html"))
  if (showLogin) showLogin.addEventListener("click", () => (window.location.href = "index.html"))

  // Logout
  const logoutBtn = document.getElementById("logoutBtn")
  if (logoutBtn) logoutBtn.addEventListener("click", handleLogout)

  // Navigation
  document.querySelectorAll(".nav-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const screen = e.currentTarget.dataset.screen
      navigateToScreen(screen)
      createRippleEffect(e.currentTarget, e)
    })
  })

  // Quest categories
  document.querySelectorAll(".category-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      document.querySelectorAll(".category-btn").forEach((b) => b.classList.remove("active"))
      e.currentTarget.classList.add("active")
      filterQuests(e.currentTarget.dataset.category)
      createButtonEffect(e.currentTarget)
    })
  })

  // Add meal button
  const addMealBtn = document.getElementById("addMealBtn")
  if (addMealBtn) addMealBtn.addEventListener("click", addMeal)

  // Penalty modal
  const acceptPenalty = document.getElementById("acceptPenalty")
  const declinePenalty = document.getElementById("declinePenalty")

  if (acceptPenalty) acceptPenalty.addEventListener("click", acceptPenaltyAction)
  if (declinePenalty) declinePenalty.addEventListener("click", declinePenaltyAction)

  // Enhanced button effects
  document.querySelectorAll(".btn-primary, .btn-secondary").forEach((btn) => {
    btn.addEventListener("click", (e) => createButtonRipple(e.currentTarget, e))
  })

  // Stat card hover effects
  document.querySelectorAll(".stat-card").forEach((card) => {
    card.addEventListener("mouseenter", () => createStatEffect(card))
  })
}

function navigateToScreen(screenName) {
  const screenMap = {
    home: "dashboard.html",
    quests: "quests.html",
    stats: "stats.html",
    nutrition: "nutrition.html",
  }

  if (screenMap[screenName]) {
    window.location.href = screenMap[screenName]
  }
}

function showScreen(screenName) {
  currentScreen = screenName

  // Update content based on screen
  switch (screenName) {
    case "home":
      updateHomeScreen()
      break
    case "quests":
      updateQuestsScreen()
      break
    case "stats":
      updateStatsScreen()
      break
    case "nutrition":
      updateNutritionScreen()
      break
  }

  // Add screen transition effect
  createScreenTransition()
}

// Authentication
function handleLogin(e) {
  e.preventDefault()
  const email = document.getElementById("loginEmail").value
  const password = document.getElementById("loginPassword").value

  if (email && password) {
    currentUser = { email, name: "Tanmeet Singh" }
    localStorage.setItem("solofit_user", JSON.stringify(currentUser))
    userData.name = currentUser.name
    window.location.href = "dashboard.html"
    createSuccessEffect() // Show success effect
  }
}

function handleSignup(e) {
  e.preventDefault()
  const name = document.getElementById("signupName").value
  const email = document.getElementById("signupEmail").value
  const password = document.getElementById("signupPassword").value
  const fitnessLevel = document.getElementById("fitnessLevel").value

  if (name && email && password && fitnessLevel) {
    currentUser = { email, name, fitnessLevel }
    localStorage.setItem("solofit_user", JSON.stringify(currentUser))
    userData.name = currentUser.name
    window.location.href = "dashboard.html"
    createSuccessEffect()
  }
}

function handleLogout() {
  localStorage.removeItem("solofit_user")
  currentUser = null
  window.location.href = "index.html"
  createLogoutEffect()
}

// Home Screen Updates
function updateHomeScreen() {
  const userName = document.getElementById("userName")
  const userLevel = document.getElementById("userLevel")
  const currentXP = document.getElementById("currentXP")
  const maxXP = document.getElementById("maxXP")

  if (userName) userName.textContent = userData.name
  if (userLevel) userLevel.textContent = userData.level
  if (currentXP) currentXP.textContent = userData.xp
  if (maxXP) maxXP.textContent = userData.maxXP

  // Update XP bar with animation
  const xpPercentage = (userData.xp / userData.maxXP) * 100
  const xpFill = document.getElementById("xpFill")
  if (xpFill) xpFill.style.width = `${xpPercentage}%`

  // Update nutrition values
  const proteinValue = document.getElementById("proteinValue")
  const carbsValue = document.getElementById("carbsValue")
  const fatsValue = document.getElementById("fatsValue")

  if (proteinValue) proteinValue.textContent = userData.nutrition.protein
  if (carbsValue) carbsValue.textContent = userData.nutrition.carbs
  if (fatsValue) fatsValue.textContent = userData.nutrition.fats

  // Update quest list
  updateQuestList()

  // Draw nutrition speedometer
  drawNutritionSpeedometer()
}

function animateStatValue(elementId, targetValue) {
  const element = document.getElementById(elementId)
  if (!element) return

  const currentValue = Number.parseInt(element.textContent) || 0
  const increment = targetValue > currentValue ? 1 : -1
  const duration = 1000
  const steps = Math.abs(targetValue - currentValue)
  const stepDuration = duration / steps

  let current = currentValue
  const timer = setInterval(() => {
    current += increment
    element.textContent = current

    if (current === targetValue) {
      clearInterval(timer)
      createStatUpdateEffect(element)
    }
  }, stepDuration)
}

function updateQuestList() {
  const questList = document.getElementById("questList")
  if (!questList) return

  questList.innerHTML = ""

  // Show only first 3 quests on home screen
  const displayQuests = userData.quests.slice(0, 3)

  displayQuests.forEach((quest, index) => {
    const questElement = createQuestElement(quest, false)
    questElement.style.animationDelay = `${index * 0.1}s`
    questElement.classList.add("quest-slide-in")
    questList.appendChild(questElement)
  })
}

function createQuestElement(quest, detailed = true) {
  const questDiv = document.createElement("div")
  questDiv.className = `quest-item ${quest.completed ? "completed" : ""}`
  questDiv.onclick = () => toggleQuest(quest.id)

  questDiv.innerHTML = `
        <div class="quest-info">
            <h4>${quest.title}</h4>
            <p>${quest.description}</p>
            ${detailed ? `<span class="quest-difficulty">${quest.difficulty}</span>` : ""}
        </div>
        <div class="quest-reward">
            <div class="quest-xp">+${quest.xp} XP</div>
            <div class="quest-status">${quest.completed ? "Completed" : "Pending"}</div>
        </div>
    `

  return questDiv
}

function toggleQuest(questId) {
  const quest = userData.quests.find((q) => q.id === questId)
  if (quest && !quest.completed) {
    quest.completed = true
    userData.xp += quest.xp

    // Create completion effect
    createQuestCompletionEffect()

    // Check for level up
    if (userData.xp >= userData.maxXP) {
      userData.level++
      userData.xp = userData.xp - userData.maxXP
      userData.maxXP += 50 // Increase XP requirement
      showLevelUpNotification()
    }

    updateHomeScreen()
    updateQuestsScreen()
  }
}

// Quests Screen
function updateQuestsScreen() {
  const questListFull = document.getElementById("questListFull")
  const completedQuests = document.getElementById("completedQuests")
  const totalQuests = document.getElementById("totalQuests")

  if (!questListFull) return

  const completed = userData.quests.filter((q) => q.completed).length

  if (completedQuests) completedQuests.textContent = completed
  if (totalQuests) totalQuests.textContent = userData.quests.length

  questListFull.innerHTML = ""
  userData.quests.forEach((quest, index) => {
    const questElement = createQuestElement(quest, true)
    questElement.style.animationDelay = `${index * 0.1}s`
    questElement.classList.add("quest-slide-in")
    questListFull.appendChild(questElement)
  })
}

function filterQuests(category) {
  const questListFull = document.getElementById("questListFull")
  if (!questListFull) return

  questListFull.innerHTML = ""

  const filteredQuests = category === "all" ? userData.quests : userData.quests.filter((q) => q.category === category)

  filteredQuests.forEach((quest, index) => {
    const questElement = createQuestElement(quest, true)
    questElement.style.animationDelay = `${index * 0.1}s`
    questElement.classList.add("quest-slide-in")
    questListFull.appendChild(questElement)
  })
}

// Stats Screen
function updateStatsScreen() {
  drawStatCircle("strengthChart", userData.stats.strength, "#ef4444")
  drawStatCircle("staminaChart", userData.stats.stamina, "#06b6d4")
  drawStatCircle("enduranceChart", userData.stats.endurance, "#10b981")
  drawProgressChart()
}

function drawStatCircle(canvasId, percentage, color) {
  const canvas = document.getElementById(canvasId)
  if (!canvas) return

  const ctx = canvas.getContext("2d")
  const centerX = canvas.width / 2
  const centerY = canvas.height / 2
  const radius = 45

  ctx.clearRect(0, 0, canvas.width, canvas.height)

  // Background circle
  ctx.beginPath()
  ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI)
  ctx.strokeStyle = "rgba(255, 255, 255, 0.2)"
  ctx.lineWidth = 8
  ctx.stroke()

  // Animated progress arc
  let currentPercentage = 0
  const targetPercentage = percentage
  const animationDuration = 1500
  const startTime = Date.now()

  function animateArc() {
    const elapsed = Date.now() - startTime
    const progress = Math.min(elapsed / animationDuration, 1)
    currentPercentage = targetPercentage * progress

    // Clear and redraw
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Background circle
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI)
    ctx.strokeStyle = "rgba(255, 255, 255, 0.2)"
    ctx.lineWidth = 8
    ctx.stroke()

    // Progress arc
    const startAngle = -Math.PI / 2
    const endAngle = startAngle + (2 * Math.PI * currentPercentage) / 100

    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, startAngle, endAngle)
    ctx.strokeStyle = color
    ctx.lineWidth = 8
    ctx.lineCap = "round"
    ctx.stroke()

    // Add glow effect
    ctx.shadowColor = color
    ctx.shadowBlur = 10
    ctx.stroke()
    ctx.shadowBlur = 0

    if (progress < 1) {
      requestAnimationFrame(animateArc)
    }
  }

  animateArc()
}

function drawProgressChart() {
  const canvas = document.getElementById("progressChart")
  if (!canvas) return

  const ctx = canvas.getContext("2d")
  const width = canvas.width
  const height = canvas.height

  ctx.clearRect(0, 0, width, height)

  // Sample progress data (last 7 days)
  const progressData = [75, 78, 82, 79, 85, 88, 92]
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

  // Draw grid with glow
  ctx.strokeStyle = "rgba(255, 255, 255, 0.1)"
  ctx.lineWidth = 1

  for (let i = 0; i <= 4; i++) {
    const y = ((height - 40) * i) / 4 + 20
    ctx.beginPath()
    ctx.moveTo(40, y)
    ctx.lineTo(width - 20, y)
    ctx.stroke()
  }

  // Draw progress line with animation
  ctx.strokeStyle = "#8b5cf6"
  ctx.lineWidth = 3
  ctx.shadowColor = "#8b5cf6"
  ctx.shadowBlur = 10
  ctx.beginPath()

  progressData.forEach((value, index) => {
    const x = 40 + ((width - 60) * index) / (progressData.length - 1)
    const y = height - 40 - (value / 100) * (height - 60)

    if (index === 0) {
      ctx.moveTo(x, y)
    } else {
      ctx.lineTo(x, y)
    }

    // Draw points with glow
    ctx.save()
    ctx.fillStyle = "#06b6d4"
    ctx.shadowColor = "#06b6d4"
    ctx.shadowBlur = 15
    ctx.beginPath()
    ctx.arc(x, y, 4, 0, 2 * Math.PI)
    ctx.fill()
    ctx.restore()
  })

  ctx.stroke()
  ctx.shadowBlur = 0

  // Draw labels
  ctx.fillStyle = "rgba(255, 255, 255, 0.8)"
  ctx.font = "12px Rajdhani"
  ctx.textAlign = "center"

  days.forEach((day, index) => {
    const x = 40 + ((width - 60) * index) / (days.length - 1)
    ctx.fillText(day, x, height - 5)
  })
}

// Nutrition Screen
function updateNutritionScreen() {
  const caloriesConsumed = document.getElementById("caloriesConsumed")
  const caloriesTarget = document.getElementById("caloriesTarget")

  if (caloriesConsumed) caloriesConsumed.textContent = userData.nutrition.calories
  if (caloriesTarget) caloriesTarget.textContent = userData.nutrition.caloriesTarget

  drawNutritionPieSpeedometer()
  updateMealList()
}

function drawNutritionChart() {
  const canvas = document.getElementById("nutritionChart")
  if (!canvas) return

  const ctx = canvas.getContext("2d")
  const centerX = canvas.width / 2
  const centerY = canvas.height / 2
  const radius = 80

  ctx.clearRect(0, 0, canvas.width, canvas.height)

  const data = [
    { label: "Protein", value: userData.nutrition.protein, color: "#ef4444" },
    { label: "Carbs", value: userData.nutrition.carbs, color: "#06b6d4" },
    { label: "Fats", value: userData.nutrition.fats, color: "#10b981" },
  ]

  const total = data.reduce((sum, item) => sum + item.value, 0)
  let currentAngle = -Math.PI / 2

  data.forEach((item) => {
    const sliceAngle = (item.value / total) * 2 * Math.PI

    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle)
    ctx.lineTo(centerX, centerY)
    ctx.fillStyle = item.color
    ctx.fill()

    // Add glow effect
    ctx.shadowColor = item.color
    ctx.shadowBlur = 10
    ctx.fill()
    ctx.shadowBlur = 0

    currentAngle += sliceAngle
  })
}

function drawNutritionPieChart() {
  const canvas = document.getElementById("nutritionPieChart")
  if (!canvas) return

  const ctx = canvas.getContext("2d")
  const centerX = canvas.width / 2
  const centerY = canvas.height / 2
  const radius = 100

  ctx.clearRect(0, 0, canvas.width, canvas.height)

  const data = [
    { label: "Protein", value: userData.nutrition.protein, color: "#ef4444" },
    { label: "Carbs", value: userData.nutrition.carbs, color: "#06b6d4" },
    { label: "Fats", value: userData.nutrition.fats, color: "#10b981" },
  ]

  const total = data.reduce((sum, item) => sum + item.value, 0)
  let currentAngle = -Math.PI / 2

  data.forEach((item) => {
    const sliceAngle = (item.value / total) * 2 * Math.PI

    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle)
    ctx.lineTo(centerX, centerY)
    ctx.fillStyle = item.color
    ctx.fill()

    // Add stroke with glow
    ctx.strokeStyle = "rgba(255, 255, 255, 0.2)"
    ctx.lineWidth = 2
    ctx.shadowColor = item.color
    ctx.shadowBlur = 5
    ctx.stroke()
    ctx.shadowBlur = 0

    currentAngle += sliceAngle
  })
}

function drawNutritionSpeedometer() {
  const canvas = document.getElementById("nutritionSpeedometer")
  if (!canvas) return

  const ctx = canvas.getContext("2d")
  const centerX = canvas.width / 2
  const centerY = canvas.height - 20
  const radius = 80

  ctx.clearRect(0, 0, canvas.width, canvas.height)

  // Calculate nutrition percentage
  const totalNutrition = userData.nutrition.protein + userData.nutrition.carbs + userData.nutrition.fats
  const targetNutrition =
    userData.nutrition.proteinTarget + userData.nutrition.carbsTarget + userData.nutrition.fatsTarget
  const percentage = Math.min((totalNutrition / targetNutrition) * 100, 100)

  // Draw speedometer background arc
  ctx.beginPath()
  ctx.arc(centerX, centerY, radius, Math.PI, 2 * Math.PI)
  ctx.strokeStyle = "rgba(255, 255, 255, 0.2)"
  ctx.lineWidth = 12
  ctx.stroke()

  // Draw progress arc
  const startAngle = Math.PI
  const endAngle = startAngle + (Math.PI * percentage) / 100

  ctx.beginPath()
  ctx.arc(centerX, centerY, radius, startAngle, endAngle)
  ctx.strokeStyle = percentage < 50 ? "#ef4444" : percentage < 80 ? "#f97316" : "#10b981"
  ctx.lineWidth = 12
  ctx.lineCap = "round"
  ctx.stroke()

  // Add glow effect
  ctx.shadowColor = ctx.strokeStyle
  ctx.shadowBlur = 15
  ctx.stroke()
  ctx.shadowBlur = 0

  // Draw needle
  const needleAngle = startAngle + (Math.PI * percentage) / 100
  const needleLength = radius - 10
  const needleX = centerX + Math.cos(needleAngle) * needleLength
  const needleY = centerY + Math.sin(needleAngle) * needleLength

  ctx.beginPath()
  ctx.moveTo(centerX, centerY)
  ctx.lineTo(needleX, needleY)
  ctx.strokeStyle = "#ffffff"
  ctx.lineWidth = 3
  ctx.stroke()

  // Draw center circle
  ctx.beginPath()
  ctx.arc(centerX, centerY, 8, 0, 2 * Math.PI)
  ctx.fillStyle = "#8b5cf6"
  ctx.fill()

  // Update percentage display
  const nutritionPercentage = document.getElementById("nutritionPercentage")
  if (nutritionPercentage) {
    nutritionPercentage.textContent = Math.round(percentage) + "%"
  }
}

function drawNutritionPieSpeedometer() {
  const canvas = document.getElementById("nutritionPieSpeedometer")
  if (!canvas) return

  const ctx = canvas.getContext("2d")
  const centerX = canvas.width / 2
  const centerY = canvas.height - 20
  const radius = 70

  ctx.clearRect(0, 0, canvas.width, canvas.height)

  // Calculate overall nutrition percentage
  const caloriesPercentage = (userData.nutrition.calories / userData.nutrition.caloriesTarget) * 100
  const percentage = Math.min(caloriesPercentage, 100)

  // Draw speedometer background arc
  ctx.beginPath()
  ctx.arc(centerX, centerY, radius, Math.PI, 2 * Math.PI)
  ctx.strokeStyle = "rgba(255, 255, 255, 0.2)"
  ctx.lineWidth = 15
  ctx.stroke()

  // Draw progress arc with gradient colors
  const startAngle = Math.PI
  const endAngle = startAngle + (Math.PI * percentage) / 100

  // Create gradient
  const gradient = ctx.createLinearGradient(centerX - radius, centerY, centerX + radius, centerY)
  if (percentage < 50) {
    gradient.addColorStop(0, "#ef4444")
    gradient.addColorStop(1, "#f97316")
  } else if (percentage < 80) {
    gradient.addColorStop(0, "#f97316")
    gradient.addColorStop(1, "#06b6d4")
  } else {
    gradient.addColorStop(0, "#06b6d4")
    gradient.addColorStop(1, "#10b981")
  }

  ctx.beginPath()
  ctx.arc(centerX, centerY, radius, startAngle, endAngle)
  ctx.strokeStyle = gradient
  ctx.lineWidth = 15
  ctx.lineCap = "round"
  ctx.stroke()

  // Add glow effect
  ctx.shadowColor = percentage < 50 ? "#ef4444" : percentage < 80 ? "#f97316" : "#10b981"
  ctx.shadowBlur = 20
  ctx.stroke()
  ctx.shadowBlur = 0

  // Draw needle
  const needleAngle = startAngle + (Math.PI * percentage) / 100
  const needleLength = radius - 15
  const needleX = centerX + Math.cos(needleAngle) * needleLength
  const needleY = centerY + Math.sin(needleAngle) * needleLength

  ctx.beginPath()
  ctx.moveTo(centerX, centerY)
  ctx.lineTo(needleX, needleY)
  ctx.strokeStyle = "#ffffff"
  ctx.lineWidth = 4
  ctx.stroke()

  // Draw center circle
  ctx.beginPath()
  ctx.arc(centerX, centerY, 10, 0, 2 * Math.PI)
  ctx.fillStyle = "#8b5cf6"
  ctx.fill()
  ctx.strokeStyle = "#ffffff"
  ctx.lineWidth = 2
  ctx.stroke()

  // Update percentage display
  const nutritionPercentageMain = document.getElementById("nutritionPercentageMain")
  if (nutritionPercentageMain) {
    nutritionPercentageMain.textContent = Math.round(percentage) + "%"
  }
}

function updateMealList() {
  const mealList = document.getElementById("mealList")
  if (!mealList) return

  mealList.innerHTML = ""

  userData.meals.forEach((meal, index) => {
    const mealDiv = document.createElement("div")
    mealDiv.className = "meal-item"
    mealDiv.style.animationDelay = `${index * 0.1}s`
    mealDiv.classList.add("meal-slide-in")
    mealDiv.innerHTML = `
            <div class="meal-info">
                <h4>${meal.name}</h4>
                <p>${meal.description}</p>
                <small>${meal.time}</small>
            </div>
            <div class="meal-calories">${meal.calories} kcal</div>
        `
    mealList.appendChild(mealDiv)
  })
}

function addMeal() {
  const newMeal = {
    id: userData.meals.length + 1,
    name: "Custom Meal",
    description: "User added meal",
    calories: 300,
    time: new Date().toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit" }),
  }

  userData.meals.push(newMeal)
  userData.nutrition.calories += newMeal.calories
  updateMealList()
  updateNutritionScreen()
  createMealAddedEffect()
}

// Enhanced Effects
function createParticles() {
  const container = document.getElementById("particles-container")
  if (!container) return

  function createParticle() {
    const particle = document.createElement("div")
    particle.className = "particle"
    particle.style.left = Math.random() * 100 + "%"
    particle.style.animationDuration = Math.random() * 3 + 3 + "s"
    particle.style.animationDelay = Math.random() * 2 + "s"
    container.appendChild(particle)

    // Remove particle after animation
    setTimeout(() => {
      if (container.contains(particle)) {
        container.removeChild(particle)
      }
    }, 6000)
  }

  // Create particles continuously
  setInterval(createParticle, 500)
}

function createRippleEffect(element, event) {
  const ripple = element.querySelector(".nav-ripple")
  if (ripple) {
    ripple.style.width = "60px"
    ripple.style.height = "60px"

    setTimeout(() => {
      ripple.style.width = "0"
      ripple.style.height = "0"
    }, 300)
  }
}

function createButtonRipple(button, event) {
  const rect = button.getBoundingClientRect()
  const size = Math.max(rect.width, rect.height)
  const x = event.clientX - rect.left - size / 2
  const y = event.clientY - rect.top - size / 2

  const ripple = document.createElement("div")
  ripple.style.cssText = `
    position: absolute;
    width: ${size}px;
    height: ${size}px;
    left: ${x}px;
    top: ${y}px;
    background: radial-gradient(circle, rgba(255,255,255,0.3), transparent);
    border-radius: 50%;
    transform: scale(0);
    animation: ripple 0.6s ease-out;
    pointer-events: none;
  `

  button.appendChild(ripple)

  setTimeout(() => {
    if (button.contains(ripple)) {
      button.removeChild(ripple)
    }
  }, 600)
}

function createStatEffect(card) {
  const particles = []
  for (let i = 0; i < 5; i++) {
    const particle = document.createElement("div")
    particle.className = "particle-burst"
    particle.style.left = Math.random() * 100 + "%"
    particle.style.top = Math.random() * 100 + "%"
    particle.style.setProperty("--dx", (Math.random() - 0.5) * 100 + "px")
    particle.style.setProperty("--dy", (Math.random() - 0.5) * 100 + "px")
    card.appendChild(particle)
    particles.push(particle)
  }

  setTimeout(() => {
    particles.forEach((particle) => {
      if (card.contains(particle)) {
        card.removeChild(particle)
      }
    })
  }, 1000)
}

function createQuestCompletionEffect() {
  const effect = document.createElement("div")
  effect.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 2rem;
    color: #10b981;
    font-weight: bold;
    z-index: 3000;
    animation: questComplete 2s ease-out forwards;
    pointer-events: none;
  `
  effect.textContent = "Quest Completed! ✓"
  document.body.appendChild(effect)

  setTimeout(() => {
    if (document.body.contains(effect)) {
      document.body.removeChild(effect)
    }
  }, 2000)
}

function createSuccessEffect() {
  const effect = document.createElement("div")
  effect.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: linear-gradient(45deg, #10b981, #059669);
    color: white;
    padding: 15px 20px;
    border-radius: 8px;
    font-weight: bold;
    z-index: 3000;
    animation: slideInRight 0.5s ease-out;
    box-shadow: 0 5px 15px rgba(16, 185, 129, 0.3);
  `
  effect.textContent = "Welcome, Hunter!"
  document.body.appendChild(effect)

  setTimeout(() => {
    if (document.body.contains(effect)) {
      document.body.removeChild(effect)
    }
  }, 3000)
}

function createLogoutEffect() {
  const effect = document.createElement("div")
  effect.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 20px;
    border-radius: 8px;
    font-weight: bold;
    z-index: 3000;
    animation: fadeInOut 2s ease-out forwards;
  `
  effect.textContent = "Logging out..."
  document.body.appendChild(effect)

  setTimeout(() => {
    if (document.body.contains(effect)) {
      document.body.removeChild(effect)
    }
  }, 2000)
}

function createMealAddedEffect() {
  const effect = document.createElement("div")
  effect.style.cssText = `
    position: fixed;
    bottom: 100px;
    right: 20px;
    background: linear-gradient(45deg, #06b6d4, #0ea5e9);
    color: white;
    padding: 10px 15px;
    border-radius: 8px;
    font-weight: bold;
    z-index: 3000;
    animation: slideInRight 0.5s ease-out;
    box-shadow: 0 5px 15px rgba(6, 182, 212, 0.3);
  `
  effect.textContent = "Meal Added!"
  document.body.appendChild(effect)

  setTimeout(() => {
    if (document.body.contains(effect)) {
      document.body.removeChild(effect)
    }
  }, 2000)
}

function createStatUpdateEffect(element) {
  element.style.animation = "statPulse 0.5s ease-out"
  setTimeout(() => {
    element.style.animation = ""
  }, 500)
}

function createScreenTransition() {
  const overlay = document.createElement("div")
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(45deg, rgba(139, 92, 246, 0.1), rgba(6, 182, 212, 0.1));
    z-index: 1500;
    animation: screenTransition 0.5s ease-out forwards;
    pointer-events: none;
  `
  document.body.appendChild(overlay)

  setTimeout(() => {
    if (document.body.contains(overlay)) {
      document.body.removeChild(overlay)
    }
  }, 500)
}

function createButtonEffect(button) {
  button.style.transform = "scale(0.95)"
  setTimeout(() => {
    button.style.transform = ""
  }, 150)
}

function setupEnhancedEffects() {
  // Add CSS animations
  const style = document.createElement("style")
  style.textContent = `
    @keyframes ripple {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }

    @keyframes questComplete {
      0% {
        opacity: 0;
        transform: translate(-50%, -50%) scale(0.5);
      }
      50% {
        opacity: 1;
        transform: translate(-50%, -50%) scale(1.2);
      }
      100% {
        opacity: 0;
        transform: translate(-50%, -50%) scale(1);
      }
    }

    @keyframes slideInRight {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    @keyframes fadeInOut {
      0%, 100% {
        opacity: 0;
      }
      50% {
        opacity: 1;
      }
    }

    @keyframes screenTransition {
      0% {
        opacity: 0;
      }
      50% {
        opacity: 1;
      }
      100% {
        opacity: 0;
      }
    }

    .quest-slide-in {
      animation: slideIn 0.5s ease-out forwards;
    }

    .meal-slide-in {
      animation: slideIn 0.5s ease-out forwards;
    }

    @keyframes slideIn {
      from {
        transform: translateY(20px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }

    .particle-burst {
      position: absolute;
      width: 4px;
      height: 4px;
      background: radial-gradient(circle, #8b5cf6, transparent);
      border-radius: 50%;
      animation: particleBurst 1s ease-out forwards;
    }

    @keyframes particleBurst {
      0% {
        opacity: 1;
        transform: scale(0);
      }
      50% {
        opacity: 0.8;
        transform: scale(1);
      }
      100% {
        opacity: 0;
        transform: scale(0) translate(var(--dx, 0), var(--dy, 0));
      }
    }
  `
  document.head.appendChild(style)
}

// Penalty System
function showPenaltyModal() {
  const modal = document.getElementById("penaltyModal")
  if (!modal) return

  modal.classList.add("active")

  let timeLeft = 5.0
  const timer = setInterval(() => {
    timeLeft -= 0.01
    const penaltyTimer = document.getElementById("penaltyTimer")
    if (penaltyTimer) penaltyTimer.textContent = timeLeft.toFixed(2)

    if (timeLeft <= 0) {
      clearInterval(timer)
      declinePenaltyAction()
    }
  }, 10)
}

function acceptPenaltyAction() {
  const modal = document.getElementById("penaltyModal")
  if (modal) modal.classList.remove("active")

  // Add penalty quest
  const penaltyQuest = {
    id: userData.quests.length + 1,
    title: "Penalty Quest: Extra Burpees",
    description: "Complete 50 burpees as penalty",
    category: "strength",
    xp: 30,
    completed: false,
    difficulty: "Hard",
  }
  userData.quests.push(penaltyQuest)
  updateQuestsScreen()
  createSuccessEffect()
}

function declinePenaltyAction() {
  const modal = document.getElementById("penaltyModal")
  if (modal) modal.classList.remove("active")

  // Reduce stats slightly
  userData.stats.strength = Math.max(0, userData.stats.strength - 2)
  userData.stats.stamina = Math.max(0, userData.stats.stamina - 2)
  userData.stats.endurance = Math.max(0, userData.stats.endurance - 2)
  updateHomeScreen()
  updateStatsScreen()

  const effect = document.createElement("div")
  effect.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: linear-gradient(45deg, #ef4444, #dc2626);
    color: white;
    padding: 20px;
    border-radius: 8px;
    font-weight: bold;
    z-index: 3000;
    animation: fadeInOut 2s ease-out forwards;
    text-align: center;
  `
  effect.innerHTML = "Stats Reduced!<br>-2 to all stats"
  document.body.appendChild(effect)

  setTimeout(() => {
    if (document.body.contains(effect)) {
      document.body.removeChild(effect)
    }
  }, 2000)
}

function showLevelUpNotification() {
  // Enhanced level up notification
  const notification = document.createElement("div")
  notification.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: linear-gradient(45deg, #8b5cf6, #06b6d4);
    color: white;
    padding: 30px;
    border-radius: 12px;
    font-size: 1.2rem;
    font-weight: bold;
    z-index: 3000;
    text-align: center;
    box-shadow: 0 0 50px rgba(139, 92, 246, 0.8);
    animation: levelUpAnimation 3s ease-out forwards;
  `
  notification.innerHTML = `
    <div style="font-size: 2rem; margin-bottom: 10px;">🎉 LEVEL UP! 🎉</div>
    <div>You are now Level ${userData.level}!</div>
    <div style="font-size: 0.9rem; margin-top: 10px; opacity: 0.8;">New challenges await!</div>
  `

  document.body.appendChild(notification)

  // Create particle burst effect
  for (let i = 0; i < 20; i++) {
    setTimeout(() => {
      const particle = document.createElement("div")
      particle.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        width: 6px;
        height: 6px;
        background: linear-gradient(45deg, #8b5cf6, #06b6d4);
        border-radius: 50%;
        z-index: 2999;
        animation: levelUpParticle 2s ease-out forwards;
        transform: translate(-50%, -50%);
      `
      particle.style.setProperty("--dx", (Math.random() - 0.5) * 400 + "px")
      particle.style.setProperty("--dy", (Math.random() - 0.5) * 400 + "px")
      document.body.appendChild(particle)

      setTimeout(() => {
        if (document.body.contains(particle)) {
          document.body.removeChild(particle)
        }
      }, 2000)
    }, i * 50)
  }

  setTimeout(() => {
    if (document.body.contains(notification)) {
      document.body.removeChild(notification)
    }
  }, 3000)

  // Add level up animation styles
  const style = document.createElement("style")
  style.textContent = `
    @keyframes levelUpAnimation {
      0% {
        opacity: 0;
        transform: translate(-50%, -50%) scale(0.5) rotate(-10deg);
      }
      20% {
        opacity: 1;
        transform: translate(-50%, -50%) scale(1.1) rotate(5deg);
      }
      40% {
        transform: translate(-50%, -50%) scale(0.95) rotate(-2deg);
      }
      60% {
        transform: translate(-50%, -50%) scale(1.05) rotate(1deg);
      }
      80% {
        transform: translate(-50%, -50%) scale(1) rotate(0deg);
      }
      100% {
        opacity: 1;
        transform: translate(-50%, -50%) scale(1) rotate(0deg);
      }
    }

    @keyframes levelUpParticle {
      0% {
        opacity: 1;
        transform: translate(-50%, -50%) scale(0);
      }
      50% {
        opacity: 1;
        transform: translate(calc(-50% + var(--dx, 0px)), calc(-50% + var(--dy, 0px))) scale(1);
      }
      100% {
        opacity: 0;
        transform: translate(calc(-50% + var(--dx, 0px)), calc(-50% + var(--dy, 0px))) scale(0);
      }
    }
  `
  document.head.appendChild(style)
}

// Initialize based on current page
if (window.location.pathname.includes("dashboard.html")) {
  document.addEventListener("DOMContentLoaded", () => {
    const savedUser = localStorage.getItem("solofit_user")
    if (savedUser) {
      currentUser = JSON.parse(savedUser)
      userData.name = currentUser.name
      showScreen("home")
    } else {
      window.location.href = "index.html"
    }
  })
} else if (window.location.pathname.includes("quests.html")) {
  document.addEventListener("DOMContentLoaded", () => {
    const savedUser = localStorage.getItem("solofit_user")
    if (savedUser) {
      currentUser = JSON.parse(savedUser)
      userData.name = currentUser.name
      showScreen("quests")
    } else {
      window.location.href = "index.html"
    }
  })
} else if (window.location.pathname.includes("stats.html")) {
  document.addEventListener("DOMContentLoaded", () => {
    const savedUser = localStorage.getItem("solofit_user")
    if (savedUser) {
      currentUser = JSON.parse(savedUser)
      userData.name = currentUser.name
      showScreen("stats")
    } else {
      window.location.href = "index.html"
    }
  })
} else if (window.location.pathname.includes("nutrition.html")) {
  document.addEventListener("DOMContentLoaded", () => {
    const savedUser = localStorage.getItem("solofit_user")
    if (savedUser) {
      currentUser = JSON.parse(savedUser)
      userData.name = currentUser.name
      showScreen("nutrition")
    } else {
      window.location.href = "index.html"
    }
  })
}

// Simulate missed workout (for demo) - only on dashboard
if (window.location.pathname.includes("dashboard.html")) {
  setTimeout(() => {
    if (currentUser) {
      showPenaltyModal()
    }
  }, 30000) // Show penalty modal after 30 seconds for demo
}
