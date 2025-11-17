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

// Background letters for scattered effect
const bgLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

let settings = {
    fontSize: 50,
    letterSpacing: 1,
    rotationRange: 12,
    colorMode: 'mixed'
};

// DOM elements
const textInput = document.getElementById('textInput');
const ransomNote = document.getElementById('ransomNote');
const sendUrlBtn = document.getElementById('sendUrlBtn');
const imageBtn = document.getElementById('imageBtn');
const shareModal = document.getElementById('shareModal');
const shareUrl = document.getElementById('shareUrl');
const copyUrlBtn = document.getElementById('copyUrlBtn');
const imagePreview = document.getElementById('imagePreview');
const backgroundLetters = document.getElementById('backgroundLetters');

// Create background scattered letters
function createBackgroundLetters() {
    for (let i = 0; i < 50; i++) {
        const bgLetter = document.createElement('div');
        bgLetter.className = 'background-letter';
        bgLetter.textContent = bgLetters[Math.floor(Math.random() * bgLetters.length)];
        bgLetter.style.left = `${Math.random() * 100}%`;
        bgLetter.style.top = `${Math.random() * 100}%`;
        bgLetter.style.transform = `rotate(${Math.random() * 360}deg)`;
        bgLetter.style.fontSize = `${20 + Math.random() * 40}px`;
        backgroundLetters.appendChild(bgLetter);
    }
}

// Generate ransom note
function generateRansomNote(text) {
    if (!text.trim()) {
        ransomNote.innerHTML = '<p class="placeholder">Your ransom note will appear here...</p>';
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

// Event listeners
textInput.addEventListener('input', (e) => {
    generateRansomNote(e.target.value);
    updateUrl();
});

// Share URL functionality - encode message in base64
function updateUrl() {
    const message = textInput.value;
    if (!message.trim()) {
        if (shareUrl) {
            shareUrl.value = '';
        }
        return;
    }
    
    // Encode message in base64
    try {
        const encodedMessage = btoa(unescape(encodeURIComponent(message)));
        
        // Create URL with note.html and encoded message
        let basePath = window.location.pathname;
        // Remove index.html if present, or just use current directory
        basePath = basePath.replace(/index\.html$/, '').replace(/\/$/, '');
        if (!basePath.endsWith('/') && basePath !== '') {
            basePath += '/';
        }
        const url = `${window.location.origin}${basePath}note.html?m=${encodedMessage}`;
        if (shareUrl) {
            shareUrl.value = url;
        }
    } catch (e) {
        console.error('Error encoding message:', e);
        if (shareUrl) {
            shareUrl.value = 'Error encoding message';
        }
    }
}

function loadFromUrl() {
    // Check if we're on the main page and have a text parameter (legacy support)
    const params = new URLSearchParams(window.location.search);
    const text = params.get('text');
    if (text) {
        textInput.value = text;
        generateRansomNote(text);
    }
}

sendUrlBtn.addEventListener('click', () => {
    updateUrl();
    shareModal.classList.add('active');
});

imageBtn.addEventListener('click', () => {
    generateImage();
});

copyUrlBtn.addEventListener('click', () => {
    shareUrl.select();
    document.execCommand('copy');
    copyUrlBtn.textContent = 'Copied!';
    setTimeout(() => {
        copyUrlBtn.textContent = 'Copy URL';
    }, 2000);
});

// Close modal
document.querySelector('.close').addEventListener('click', () => {
    shareModal.classList.remove('active');
});

window.addEventListener('click', (e) => {
    if (e.target === shareModal) {
        shareModal.classList.remove('active');
    }
});

// Generate image
function generateImage() {
    if (!textInput.value.trim()) {
        alert('Please enter some text first!');
        return;
    }

    const noteElement = ransomNote;
    
    // Use html2canvas if available
    if (typeof html2canvas !== 'undefined') {
        html2canvas(noteElement, {
            backgroundColor: '#ffffff',
            scale: 2,
            logging: false
        }).then(canvas => {
            const dataUrl = canvas.toDataURL('image/png');
            displayImagePreview(dataUrl);
        }).catch(err => {
            console.error('Error generating image:', err);
            alert('Error generating image. Please try again.');
        });
    } else {
        // Fallback: create canvas manually
        createImageFallback(noteElement);
    }
}

function displayImagePreview(dataUrl) {
    const img = document.createElement('img');
    img.src = dataUrl;
    img.style.maxWidth = '100%';
    imagePreview.innerHTML = '';
    imagePreview.appendChild(img);
    
    // Create download link
    const downloadLink = document.createElement('a');
    downloadLink.href = dataUrl;
    downloadLink.download = 'ransom-note.png';
    downloadLink.textContent = 'Download Image';
    downloadLink.className = 'btn';
    downloadLink.style.display = 'inline-block';
    downloadLink.style.marginTop = '10px';
    downloadLink.onclick = (e) => {
        e.preventDefault();
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = 'ransom-note.png';
        link.click();
    };
    imagePreview.appendChild(downloadLink);
    
    // Create a shareable note link (base64 encoded message) so others can open the note page
    // The link format mimics: https://ransom-note.vercel.app/note?m=dXJs
    const SHARE_HOST = 'https://randommessage-generation.vercel.app'; // your deployed host

    if (shareUrl) {
        try {
            // Encode the current message to base64 in a URL-safe way
            const message = textInput.value || '';
            const encodedMessage = btoa(unescape(encodeURIComponent(message)));

            // Generate the shareable link using the deployed host
            const hostToUse = SHARE_HOST || window.location.origin;
            const shareLink = `${hostToUse.replace(/\/$/, '')}/note?m=${encodedMessage}`;

            shareUrl.value = shareLink;

            // Add an "Open Link" button that opens the share link in a new tab
            const openShareLink = document.createElement('a');
            openShareLink.href = shareLink;
            openShareLink.target = '_blank';
            openShareLink.rel = 'noopener noreferrer';
            openShareLink.textContent = 'Open Share Link';
            openShareLink.className = 'btn';
            openShareLink.style.display = 'inline-block';
            openShareLink.style.marginTop = '10px';
            openShareLink.style.marginLeft = '10px';
            imagePreview.appendChild(openShareLink);
        } catch (e) {
            console.error('Could not set shareUrl value:', e);
        }
    }

    // Also provide the actual image download/open action (data URL)
    const openImageLink = document.createElement('a');
    openImageLink.href = dataUrl;
    openImageLink.target = '_blank';
    openImageLink.rel = 'noopener noreferrer';
    openImageLink.textContent = 'Open Image';
    openImageLink.className = 'btn';
    openImageLink.style.display = 'inline-block';
    openImageLink.style.marginTop = '10px';
    openImageLink.style.marginLeft = '10px';
    imagePreview.appendChild(openImageLink);

    shareModal.classList.add('active');
}

function createImageFallback(element) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const rect = element.getBoundingClientRect();
    const padding = 40;
    
    canvas.width = Math.max(rect.width, 400) + padding * 2;
    canvas.height = Math.max(rect.height, 200) + padding * 2;
    
    // White background
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw letters
    const letters = element.querySelectorAll('.letter');
    let x = padding;
    let y = padding + settings.fontSize;
    const lineHeight = settings.fontSize * 1.8;
    const maxWidth = canvas.width - padding * 2;
    
    letters.forEach((letter) => {
        const styles = window.getComputedStyle(letter);
        const fontFamily = styles.fontFamily.split(',')[0].replace(/['"]/g, '');
        const fontSize = parseInt(styles.fontSize) || settings.fontSize;
        const color = styles.color || '#000';
        const transform = styles.transform;
        const rotation = transform ? parseFloat(transform.match(/-?\d+\.?\d*/)?.[0] || 0) : 0;
        
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.font = `bold ${fontSize}px ${fontFamily}`;
        ctx.fillStyle = color;
        ctx.textBaseline = 'middle';
        ctx.fillText(letter.textContent, 0, 0);
        ctx.restore();
        
        const letterWidth = ctx.measureText(letter.textContent).width + settings.letterSpacing;
        x += letterWidth;
        
        if (x > maxWidth) {
            x = padding;
            y += lineHeight;
        }
    });
    
    const dataUrl = canvas.toDataURL('image/png');
    displayImagePreview(dataUrl);
}

// Initialize
createBackgroundLetters();
loadFromUrl();
updateUrl();
