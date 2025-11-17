// Font families for ransom note effect
const fonts = [
    'font-anton', 'font-bebas', 'font-caveat', 'font-courier', 
    'font-creepster', 'font-fjalla', 'font-impact', 'font-lobster',
    'font-oswald', 'font-passion', 'font-marker', 'font-playfair',
    'font-righteous', 'font-roboto', 'font-rubik', 'font-special',
    'font-staatliches', 'font-ultra'
];

// Colors for ransom note letters - vibrant magazine colors
const colors = [
    '#FFD700', // Yellow/Gold
    '#FF0000', // Red
    '#0000FF', // Blue
    '#000000', // Black
    '#008000', // Green
    '#FF4500', // Orange Red
    '#8B0000', // Dark Red
    '#000080', // Navy
    '#FF1493'  // Deep Pink
];

let settings = {
    fontSize: 28,
    letterSpacing: 1,
    rotationRange: 8,
    colorMode: 'mixed'
};

// DOM elements
const envelopeContainer = document.getElementById('envelopeContainer');
const ransomNote = document.getElementById('ransomNote');
const tapButton = document.getElementById('tapButton');

// Decode message from URL
function getMessageFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const encodedMessage = params.get('m');
    
    if (!encodedMessage) {
        return null;
    }
    
    try {
        // Decode base64 and handle UTF-8 encoding properly
        const decoded = decodeURIComponent(escape(atob(encodedMessage)));
        return decoded;
    } catch (e) {
        console.error('Error decoding message:', e);
        return null;
    }
}

// Generate ransom note
function generateRansomNote(text) {
    if (!text || !text.trim()) {
        ransomNote.innerHTML = '<p class="placeholder">No message found...</p>';
        return;
    }

    ransomNote.innerHTML = '';
    
    // Split by lines first to handle newlines
    const lines = text.split('\n');
    
    lines.forEach((line, lineIndex) => {
        if (lineIndex > 0) {
            const newline = document.createElement('div');
            newline.className = 'newline';
            ransomNote.appendChild(newline);
        }
        
        const words = line.split(' ');

        words.forEach((word, wordIndex) => {
            // Add space before word (except first word)
            if (wordIndex > 0) {
                const space = document.createElement('span');
                space.className = 'space';
                space.textContent = ' ';
                ransomNote.appendChild(space);
            }

            // Process each letter in the word
            for (let i = 0; i < word.length; i++) {
                const char = word[i];
                
                // Skip if empty or not alphanumeric
                if (!char || char === ' ') continue;

                const letter = document.createElement('span');
                letter.className = 'letter';
                letter.textContent = char.toUpperCase();

                // Random font
                const randomFont = fonts[Math.floor(Math.random() * fonts.length)];
                letter.classList.add(randomFont);

                // Random pattern (some letters have patterns, some don't)
                if (Math.random() > 0.4) {
                    const pattern = `pattern-${Math.floor(Math.random() * 4) + 1}`;
                    letter.classList.add(pattern);
                }

                // Random rotation
                const rotation = (Math.random() - 0.5) * 2 * settings.rotationRange;
                letter.style.transform = `rotate(${rotation}deg)`;

                // Font size with variation
                const sizeVariation = (Math.random() - 0.5) * 15;
                const finalSize = settings.fontSize + sizeVariation;
                letter.style.fontSize = `${finalSize}px`;
                letter.style.lineHeight = `${finalSize}px`;

                // Letter spacing
                letter.style.letterSpacing = `${settings.letterSpacing}px`;

                // Color - vibrant magazine colors
                const color = colors[Math.floor(Math.random() * colors.length)];
                letter.style.color = color;
                
                // Add text shadow for depth - magazine cutout effect
                if (color === '#000000') {
                    letter.style.textShadow = 
                        '1px 1px 0px rgba(255,255,255,0.4), ' +
                        '-1px -1px 0px rgba(0,0,0,0.2)';
                } else {
                    // Colored letters with white outline effect
                    letter.style.textShadow = 
                        '2px 2px 0px rgba(0,0,0,0.4), ' +
                        '-1px -1px 0px rgba(255,255,255,0.5), ' +
                        '1px -1px 0px rgba(255,255,255,0.3), ' +
                        '-1px 1px 0px rgba(255,255,255,0.3)';
                    letter.style.webkitTextStroke = '0.3px rgba(255,255,255,0.6)';
                    letter.style.webkitTextFillColor = color;
                }
                
                // Slight brightness variation for realism
                const brightness = 0.9 + Math.random() * 0.2;
                letter.style.filter = `brightness(${brightness}) contrast(1.1)`;

                ransomNote.appendChild(letter);
            }
        });
    });
}

// Open envelope
function openEnvelope() {
    if (envelopeContainer.classList.contains('opened')) {
        return; // Already opened
    }
    
    envelopeContainer.classList.add('opened');
}

// Open on container click
envelopeContainer.addEventListener('click', openEnvelope);

// Open on button click
tapButton.addEventListener('click', (e) => {
    e.stopPropagation();
    openEnvelope();
});

// Initialize
const message = getMessageFromUrl();
if (message) {
    generateRansomNote(message);
} else {
    ransomNote.innerHTML = '<p class="placeholder">Invalid or missing message...</p>';
}
