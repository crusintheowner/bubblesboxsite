document.addEventListener('DOMContentLoaded', function() {
    // Theme Switcher
    const themeToggle = document.getElementById('theme-toggle');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Function to set theme
    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        
        // Update toggle button icon
        if (themeToggle) {
            themeToggle.innerHTML = theme === 'dark' 
                ? '<i class="fas fa-sun"></i>' 
                : '<i class="fas fa-moon"></i>';
        }
    }
    
    // Check for saved theme preference or use OS preference
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme) {
        setTheme(savedTheme);
    } else if (prefersDarkScheme.matches) {
        setTheme('dark');
    } else {
        setTheme('light');
    }
    
    // Theme toggle click handler
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            
            setTheme(newTheme);
        });
    }
    
    // Mobile Navigation
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
    
    // Copy Server IP
    const copyIpBtn = document.getElementById('copy-ip');
    const copyIpFooterBtn = document.getElementById('copy-ip-footer');
    const serverAddress = document.getElementById('server-address');
    
    function copyServerIp(button) {
        if (!serverAddress) return;
        
        navigator.clipboard.writeText(serverAddress.textContent)
            .then(() => {
                const originalText = button.innerHTML;
                button.innerHTML = '<i class="fas fa-check"></i> Copied!';
                setTimeout(() => {
                    button.innerHTML = originalText;
                }, 2000);
            })
            .catch(err => {
                console.error('Could not copy text: ', err);
            });
    }
    
    if (copyIpBtn) {
        copyIpBtn.addEventListener('click', () => copyServerIp(copyIpBtn));
    }
    
    if (copyIpFooterBtn) {
        copyIpFooterBtn.addEventListener('click', () => copyServerIp(copyIpFooterBtn));
    }
    
    // Smooth Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            if (this.getAttribute('href') === '#') return;
            
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Fetch Minecraft server status
    async function fetchServerStatus() {
        const onlinePlayers = document.getElementById('online-players');
        if (!onlinePlayers) return;
        
        try {
            // IMPORTANT: In a real implementation, replace this with your actual server API
            // Example API endpoint: https://api.mcsrvstat.us/2/play.bubblesbox.org
            
            // For demonstration purposes, we'll use a more consistent simulation
            // that mimics real server behavior instead of completely random numbers
            
            // Check if we have a base player count stored
            let basePlayerCount = localStorage.getItem('basePlayerCount');
            
            // If no base count exists or it's older than 1 hour, generate a new one
            const lastUpdate = localStorage.getItem('basePlayerCountTime');
            const now = new Date().getTime();
            
            if (!basePlayerCount || !lastUpdate || (now - lastUpdate > 60 * 60 * 1000)) {
                // Generate a realistic base player count (25-45 players)
                basePlayerCount = Math.floor(Math.random() * 21) + 25;
                localStorage.setItem('basePlayerCount', basePlayerCount);
                localStorage.setItem('basePlayerCountTime', now);
            } else {
                basePlayerCount = parseInt(basePlayerCount);
            }
            
            // Simulate small fluctuations to mimic players joining/leaving
            // This creates a more realistic pattern than completely random numbers
            const fluctuation = Math.floor(Math.random() * 7) - 3; // -3 to +3 players
            let currentPlayers = basePlayerCount + fluctuation;
            
            // Ensure we don't go below 1 player
            if (currentPlayers < 1) currentPlayers = 1;
            
            // Update the display
            onlinePlayers.textContent = currentPlayers;
            
            // Store the current count
            localStorage.setItem('lastPlayerCount', currentPlayers);
            localStorage.setItem('lastPlayerCountUpdate', now);
            
            // Update status indicator to show online
            const statusDot = document.querySelector('.status-dot');
            if (statusDot) {
                statusDot.classList.remove('offline');
                statusDot.classList.add('online');
            }
            
            /* 
            // REAL SERVER IMPLEMENTATION (uncomment and modify for your server)
            const response = await fetch('https://api.mcsrvstat.us/2/play.bubblesbox.org');
            const data = await response.json();
            
            if (data.online) {
                onlinePlayers.textContent = data.players.online;
                
                // Update status indicator
                const statusDot = document.querySelector('.status-dot');
                if (statusDot) {
                    statusDot.classList.remove('offline');
                    statusDot.classList.add('online');
                }
            } else {
                onlinePlayers.textContent = '0';
                
                // Update status indicator
                const statusDot = document.querySelector('.status-dot');
                if (statusDot) {
                    statusDot.classList.remove('online');
                    statusDot.classList.add('offline');
                }
            }
            */
            
        } catch (error) {
            console.error('Error fetching server status:', error);
            
            // If there's an error, try to use the last known player count
            const lastPlayerCount = localStorage.getItem('lastPlayerCount');
            if (lastPlayerCount) {
                onlinePlayers.textContent = lastPlayerCount;
            } else {
                onlinePlayers.textContent = '0';
            }
            
            // Update status indicator to show offline
            const statusDot = document.querySelector('.status-dot');
            if (statusDot) {
                statusDot.classList.remove('online');
                statusDot.classList.add('offline');
            }
        }
    }
    
    // Fetch server status on page load
    fetchServerStatus();
    
    // Update server status every 2 minutes (more frequent updates for demo)
    setInterval(fetchServerStatus, 2 * 60 * 1000);
    
    // Animate elements on scroll
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.feature-card, .gallery-item, .step-card');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;
            
            if (elementPosition < screenPosition) {
                element.style.opacity = 1;
                element.style.transform = 'translateY(0)';
            }
        });
    };
    
    // Set initial state for animated elements
    document.querySelectorAll('.feature-card, .gallery-item, .step-card').forEach(element => {
        element.style.opacity = 0;
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    
    // Run animation on scroll
    window.addEventListener('scroll', animateOnScroll);
    
    // Run once on page load
    animateOnScroll();
});