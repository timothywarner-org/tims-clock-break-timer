// Timer state management
let timerInterval = null;
let totalSeconds = 0;
let remainingSeconds = 0;
let isPaused = false;
let lastUpdateTime = null;
let startTime = null;
let pausedTime = 0; // Track total paused duration
let quotes = [];
let currentQuoteIndex = 0;
let quoteCarouselInterval = null;

// Timer state validation and recovery
function validateTimerState() {
    // Ensure positive values
    if (totalSeconds < 0) totalSeconds = 0;
    if (remainingSeconds < 0) remainingSeconds = 0;
    if (remainingSeconds > totalSeconds) remainingSeconds = totalSeconds;
    
    // Ensure consistent state
    if (totalSeconds === 0 && remainingSeconds > 0) {
        remainingSeconds = 0;
    }
    
    return true;
}

function saveTimerState() {
    try {
        const state = {
            totalSeconds,
            remainingSeconds,
            isPaused,
            startTime,
            pausedTime,
            timestamp: Date.now()
        };
        sessionStorage.setItem('timerState', JSON.stringify(state));
    } catch (error) {
        console.warn('Failed to save timer state:', error.message);
    }
}

function loadTimerState() {
    try {
        const saved = sessionStorage.getItem('timerState');
        if (!saved) return false;
        
        const state = JSON.parse(saved);
        const now = Date.now();
        
        // Only restore if saved less than 1 hour ago (prevent stale state)
        if (now - state.timestamp > 3600000) {
            sessionStorage.removeItem('timerState');
            return false;
        }
        
        // Restore state
        totalSeconds = state.totalSeconds || 0;
        remainingSeconds = state.remainingSeconds || 0;
        isPaused = state.isPaused || false;
        startTime = state.startTime;
        pausedTime = state.pausedTime || 0;
        
        // If timer was running, calculate elapsed time
        if (startTime && !isPaused && remainingSeconds > 0) {
            const elapsed = Math.floor((now - startTime - pausedTime) / 1000);
            remainingSeconds = Math.max(0, totalSeconds - elapsed);
        }
        
        validateTimerState();
        updateTimerDisplay();
        
        console.log('Timer state restored from session');
        return true;
        
    } catch (error) {
        console.warn('Failed to load timer state:', error.message);
        sessionStorage.removeItem('timerState');
        return false;
    }
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function updateTimerDisplay() {
    try {
        validateTimerState();
        
        const timerElement = document.getElementById('timerDisplay');
        const progressElement = document.getElementById('progressFill');
        
        if (!timerElement || !progressElement) {
            console.error('Timer display elements not found');
            return;
        }
        
        timerElement.textContent = formatTime(remainingSeconds);
        
        const progress = totalSeconds > 0 ? ((totalSeconds - remainingSeconds) / totalSeconds) * 100 : 0;
        progressElement.style.width = `${Math.max(0, Math.min(100, progress))}%`;
        
        if (remainingSeconds === 0 && totalSeconds > 0) {
            timerElement.classList.add('timer-expired');
            document.body.classList.add('timer-complete');
            document.title = 'Break Time is Over! - TechTrainerTim';
            
            // Remove flash effect after animation completes
            setTimeout(() => {
                document.body.classList.remove('timer-complete');
            }, 1000);
            
            // Clear timer state when complete
            sessionStorage.removeItem('timerState');
        } else {
            timerElement.classList.remove('timer-expired');
            document.body.classList.remove('timer-complete');
            if (remainingSeconds > 0) {
                document.title = `${formatTime(remainingSeconds)} - Break Timer`;
            } else {
                document.title = 'Break Timer - TechTrainerTim';
            }
            
            // Save state periodically
            saveTimerState();
        }
    } catch (error) {
        console.error('Error updating timer display:', error);
    }
}

// Fallback quotes - always available even if network fails
const fallbackQuotes = [
    "Take a moment to breathe and reset.",
    "Your brain needs breaks to maintain peak performance.",
    "Teaching is the highest form of understanding.",
    "Progress, not perfection.",
    "Safe spaces create brave learners.",
    "Every expert was once a beginner.",
    "Mistakes are proof that you are trying.",
    "Your questions matter more than your answers.",
    "Different brains, different gains.",
    "Movement is medicine for the mind."
];

// Load quotes from JSON file with robust error handling
async function loadQuotes() {
    let quotesLoaded = false;
    
    try {
        // Add timeout to prevent hanging
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        const response = await fetch('quotes.json', { 
            signal: controller.signal,
            cache: 'no-cache' // Ensure fresh quotes
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // Validate the quotes structure
        if (!data || !Array.isArray(data.quotes) || data.quotes.length === 0) {
            throw new Error('Invalid quotes data structure');
        }
        
        // Filter out empty or invalid quotes
        const validQuotes = data.quotes.filter(quote => 
            typeof quote === 'string' && quote.trim().length > 0
        );
        
        if (validQuotes.length === 0) {
            throw new Error('No valid quotes found in file');
        }
        
        quotes = validQuotes;
        quotesLoaded = true;
        console.log(`Successfully loaded ${quotes.length} quotes from quotes.json`);
        
    } catch (error) {
        console.warn('Failed to load quotes.json:', error.message);
        quotes = [...fallbackQuotes]; // Use fallback quotes
    }
    
    // Always shuffle, whether we loaded from file or used fallback
    shuffleQuotes();
    
    return quotesLoaded;
}

function shuffleQuotes() {
    for (let i = quotes.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [quotes[i], quotes[j]] = [quotes[j], quotes[i]];
    }
    currentQuoteIndex = 0;
}

function showNextQuote() {
    if (quotes.length === 0) return;
    
    const quoteElement = document.getElementById('quote');
    
    // Fade out
    quoteElement.style.opacity = '0';
    
    setTimeout(() => {
        quoteElement.textContent = quotes[currentQuoteIndex];
        currentQuoteIndex = (currentQuoteIndex + 1) % quotes.length;
        
        // If we've cycled through all quotes, shuffle again
        if (currentQuoteIndex === 0) {
            shuffleQuotes();
        }
        
        // Fade in
        quoteElement.style.opacity = '1';
    }, 300);
}

function startQuoteCarousel() {
    showNextQuote(); // Show first quote immediately
    quoteCarouselInterval = setInterval(showNextQuote, 8000); // Change every 8 seconds
}

function stopQuoteCarousel() {
    if (quoteCarouselInterval) {
        clearInterval(quoteCarouselInterval);
        quoteCarouselInterval = null;
    }
    
    const quoteElement = document.getElementById('quote');
    quoteElement.style.opacity = '0';
    setTimeout(() => {
        quoteElement.textContent = '';
        quoteElement.style.opacity = '1';
    }, 300);
}

function startTimer() {
    try {
        if (remainingSeconds <= 0) return;
        
        const startBtn = document.getElementById('startBtn');
        const pauseBtn = document.getElementById('pauseBtn');
        
        if (!startBtn || !pauseBtn) {
            console.error('Timer control buttons not found');
            return;
        }
        
        startBtn.disabled = true;
        pauseBtn.disabled = false;
        
        // If resuming from pause, adjust start time
        if (isPaused && startTime) {
            pausedTime += Date.now() - lastUpdateTime;
        } else {
            startTime = Date.now();
            pausedTime = 0;
        }
        
        isPaused = false;
        lastUpdateTime = Date.now();
        
        startQuoteCarousel();
        
        function tick() {
            try {
                const now = Date.now();
                const elapsed = Math.floor((now - startTime - pausedTime) / 1000);
                const newRemaining = Math.max(0, totalSeconds - elapsed);
                
                if (newRemaining !== remainingSeconds) {
                    remainingSeconds = newRemaining;
                    updateTimerDisplay();
                }
                
                if (remainingSeconds > 0 && !isPaused) {
                    timerInterval = requestAnimationFrame(tick);
                } else if (remainingSeconds === 0) {
                    stopTimer();
                }
            } catch (error) {
                console.error('Timer tick error:', error);
                stopTimer();
            }
        }
        
        timerInterval = requestAnimationFrame(tick);
        
    } catch (error) {
        console.error('Error starting timer:', error);
    }
}

function pauseTimer() {
    try {
        if (timerInterval) {
            cancelAnimationFrame(timerInterval);
            timerInterval = null;
        }
        
        lastUpdateTime = Date.now();
        isPaused = true;
        
        stopQuoteCarousel();
        
        const startBtn = document.getElementById('startBtn');
        const pauseBtn = document.getElementById('pauseBtn');
        
        if (startBtn && pauseBtn) {
            startBtn.disabled = false;
            pauseBtn.disabled = true;
        }
        
        saveTimerState();
        
    } catch (error) {
        console.error('Error pausing timer:', error);
    }
}

function stopTimer() {
    if (timerInterval) {
        cancelAnimationFrame(timerInterval);
        timerInterval = null;
    }
    stopQuoteCarousel();
    document.getElementById('startBtn').disabled = false;
    document.getElementById('pauseBtn').disabled = true;
    isPaused = false;
}

function resetTimer() {
    stopTimer();
    remainingSeconds = totalSeconds;
    updateTimerDisplay();
    document.getElementById('timerDisplay').classList.remove('timer-expired');
}

function setTimer(minutes) {
    stopTimer();
    totalSeconds = minutes * 60;
    remainingSeconds = totalSeconds;
    updateTimerDisplay();
}

// Event listeners
document.querySelectorAll('.preset-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const minutes = parseInt(btn.dataset.minutes);
        setTimer(minutes);
    });
});

document.getElementById('customBtn').addEventListener('click', () => {
    const customInput = document.getElementById('customMinutes');
    const minutes = parseInt(customInput.value);
    if (minutes && minutes > 0 && minutes <= 999) {
        setTimer(minutes);
        customInput.value = '';
    }
});

document.getElementById('customMinutes').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        document.getElementById('customBtn').click();
    }
});

document.getElementById('startBtn').addEventListener('click', startTimer);
document.getElementById('pauseBtn').addEventListener('click', pauseTimer);
document.getElementById('resetBtn').addEventListener('click', resetTimer);

document.getElementById('fullscreenBtn').addEventListener('click', () => {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    switch(e.key) {
        case ' ':
            e.preventDefault();
            if (document.getElementById('startBtn').disabled) {
                pauseTimer();
            } else {
                startTimer();
            }
            break;
        case 'r':
        case 'R':
            resetTimer();
            break;
        case 'F11':
            e.preventDefault();
            document.getElementById('fullscreenBtn').click();
            break;
        case '1':
            setTimer(5);
            break;
        case '2':
            setTimer(8);
            break;
        case '3':
            setTimer(9);
            break;
        case '4':
            setTimer(10);
            break;
    }
});

// Network and visibility handling
let isOnline = navigator.onLine;
let isVisible = !document.hidden;

function handleOnlineStatus() {
    isOnline = navigator.onLine;
    if (isOnline) {
        console.log('Connection restored');
        // Optionally reload quotes if we're using fallbacks
        if (quotes === fallbackQuotes) {
            loadQuotes();
        }
    } else {
        console.warn('Connection lost - using offline mode');
    }
}

function handleVisibilityChange() {
    isVisible = !document.hidden;
    
    if (isVisible) {
        console.log('Tab visible - resuming normal operation');
        // Sync timer state when tab becomes visible
        if (startTime && !isPaused && remainingSeconds > 0) {
            const now = Date.now();
            const elapsed = Math.floor((now - startTime - pausedTime) / 1000);
            const newRemaining = Math.max(0, totalSeconds - elapsed);
            
            if (Math.abs(newRemaining - remainingSeconds) > 2) {
                remainingSeconds = newRemaining;
                updateTimerDisplay();
            }
        }
    } else {
        console.log('Tab hidden - timer continues in background');
    }
}

// Global error handler
window.addEventListener('error', (event) => {
    console.error('Global error caught:', event.error);
    
    // Try to recover from critical errors
    if (event.error && event.error.message) {
        const message = event.error.message.toLowerCase();
        
        // Handle specific error types
        if (message.includes('timer') || message.includes('display')) {
            console.warn('Timer error detected - attempting recovery');
            try {
                validateTimerState();
                updateTimerDisplay();
            } catch (recoveryError) {
                console.error('Recovery failed:', recoveryError);
                resetTimer();
            }
        }
    }
});

// Unhandled promise rejection handler
window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    event.preventDefault(); // Prevent default browser handling
});

// Initialize application with error handling
async function initializeApp() {
    try {
        // Set up event listeners
        window.addEventListener('online', handleOnlineStatus);
        window.addEventListener('offline', handleOnlineStatus);
        document.addEventListener('visibilitychange', handleVisibilityChange);
        
        // Load timer state if available
        const stateRestored = loadTimerState();
        
        // Load quotes
        await loadQuotes();
        
        // Set default timer if no state was restored
        if (!stateRestored) {
            setTimer(10);
        }
        
        console.log('Application initialized successfully');
        
    } catch (error) {
        console.error('Failed to initialize application:', error);
        
        // Fallback initialization
        try {
            quotes = [...fallbackQuotes];
            shuffleQuotes();
            setTimer(10);
            console.log('Fallback initialization completed');
        } catch (fallbackError) {
            console.error('Fallback initialization failed:', fallbackError);
        }
    }
}

// Start the application
initializeApp();