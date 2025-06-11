function updateClock() {
    try {
        const now = new Date();
        
        // Validate that we have a valid date
        if (isNaN(now.getTime())) {
            console.error('Invalid date detected');
            return;
        }
        
        updateDigitalClock(now);
        drawAnalogClock(now);
        
    } catch (error) {
        console.error('Error updating clock:', error);
        // Attempt recovery by trying again in 1 second
        setTimeout(updateClock, 1000);
    }
}

function updateDigitalClock(now) {
    try {
        const timeElement = document.getElementById('digitalTime');
        const dateElement = document.getElementById('digitalDate');
        
        if (!timeElement || !dateElement) {
            console.error('Digital clock elements not found');
            return;
        }
        
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');
        
        timeElement.textContent = `${hours}:${minutes}:${seconds}`;
        
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        dateElement.textContent = now.toLocaleDateString('en-US', options);
        
    } catch (error) {
        console.error('Error updating digital clock:', error);
    }
}

function drawAnalogClock(now) {
    try {
        const canvas = document.getElementById('analogClock');
        if (!canvas) {
            console.error('Analog clock canvas not found');
            return;
        }
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            console.error('Cannot get canvas 2D context');
            return;
        }
        
        // Update canvas size to match CSS size
        const rect = canvas.getBoundingClientRect();
        const size = Math.min(rect.width, rect.height);
        canvas.width = size;
        canvas.height = size;
        
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = (canvas.width / 2) - 20;
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw outer circle
        ctx.strokeStyle = '#222';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.stroke();
        
        // Draw hour markers and numbers
        ctx.strokeStyle = '#444';
        ctx.lineWidth = Math.max(2, radius / 80);
        ctx.fillStyle = '#e0e0e0';
        ctx.font = `${Math.max(12, radius / 8)}px Poppins, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        for (let i = 0; i < 12; i++) {
            const angle = (i * 30 - 90) * (Math.PI / 180);
            const x1 = centerX + Math.cos(angle) * (radius - 15);
            const y1 = centerY + Math.sin(angle) * (radius - 15);
            const x2 = centerX + Math.cos(angle) * (radius - 25);
            const y2 = centerY + Math.sin(angle) * (radius - 25);
            
            // Draw hour marker
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
            
            // Draw hour number
            const number = i === 0 ? 12 : i;
            const numberX = centerX + Math.cos(angle) * (radius - 35);
            const numberY = centerY + Math.sin(angle) * (radius - 35);
            ctx.fillText(number.toString(), numberX, numberY);
        }
        
        // Draw minute markers
        ctx.strokeStyle = '#333';
        ctx.lineWidth = Math.max(1, radius / 200);
        for (let i = 0; i < 60; i++) {
            if (i % 5 !== 0) {
                const angle = (i * 6 - 90) * (Math.PI / 180);
                const x1 = centerX + Math.cos(angle) * (radius - 10);
                const y1 = centerY + Math.sin(angle) * (radius - 10);
                const x2 = centerX + Math.cos(angle) * (radius - 15);
                const y2 = centerY + Math.sin(angle) * (radius - 15);
                
                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.stroke();
            }
        }
        
        const hours = now.getHours() % 12;
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();
        
        // Draw hour hand
        const hourAngle = ((hours + minutes / 60) * 30 - 90) * (Math.PI / 180);
        drawHand(ctx, centerX, centerY, hourAngle, radius * 0.5, Math.max(4, radius / 30), '#666');
        
        // Draw minute hand
        const minuteAngle = ((minutes + seconds / 60) * 6 - 90) * (Math.PI / 180);
        drawHand(ctx, centerX, centerY, minuteAngle, radius * 0.7, Math.max(3, radius / 50), '#888');
        
        // Draw second hand
        const secondAngle = (seconds * 6 - 90) * (Math.PI / 180);
        drawHand(ctx, centerX, centerY, secondAngle, radius * 0.85, Math.max(1, radius / 100), '#2196f3');
        
        // Draw center dot
        ctx.fillStyle = '#2196f3';
        ctx.beginPath();
        ctx.arc(centerX, centerY, Math.max(4, radius / 30), 0, 2 * Math.PI);
        ctx.fill();
        
    } catch (error) {
        console.error('Error drawing analog clock:', error);
    }
}

function drawHand(ctx, centerX, centerY, angle, length, width, color) {
    try {
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(
            centerX + Math.cos(angle) * length,
            centerY + Math.sin(angle) * length
        );
        ctx.stroke();
    } catch (error) {
        console.error('Error drawing clock hand:', error);
    }
}

// Global error handler for clock page
window.addEventListener('error', (event) => {
    console.error('Clock page error:', event.error);
    
    // Try to recover by restarting clock updates
    setTimeout(() => {
        try {
            updateClock();
        } catch (recoveryError) {
            console.error('Clock recovery failed:', recoveryError);
        }
    }, 1000);
});

// Initialize clock with error handling
function initializeClock() {
    try {
        // Verify required elements exist
        const timeElement = document.getElementById('digitalTime');
        const dateElement = document.getElementById('digitalDate');
        const canvas = document.getElementById('analogClock');
        
        if (!timeElement || !dateElement || !canvas) {
            throw new Error('Required clock elements not found');
        }
        
        // Handle window resize
        window.addEventListener('resize', () => {
            updateClock();
        });
        
        // Start clock updates
        updateClock();
        setInterval(updateClock, 250);
        
        console.log('Clock initialized successfully');
        
    } catch (error) {
        console.error('Failed to initialize clock:', error);
        
        // Fallback: show error message
        document.body.innerHTML = `
            <div style="color: #e74c3c; text-align: center; padding: 50px; font-family: Arial, sans-serif;">
                <h2>Clock Error</h2>
                <p>Failed to initialize clock: ${error.message}</p>
                <button onclick="location.reload()" style="padding: 10px 20px; margin-top: 20px; background: #2196f3; color: white; border: none; border-radius: 5px; cursor: pointer;">
                    Reload Page
                </button>
            </div>
        `;
    }
}

// Start the clock
initializeClock();