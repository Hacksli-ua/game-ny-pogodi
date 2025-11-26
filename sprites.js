// Sprite generation functions
function createRabbitSprite() {
    const canvas = document.createElement('canvas');
    canvas.width = 200;
    canvas.height = 50;
    const ctx = canvas.getContext('2d');
    
    // Create 4 frames of rabbit running animation
    for (let frame = 0; frame < 4; frame++) {
        const x = frame * 50;
        const y = 0;
        
        ctx.save();
        ctx.translate(x + 25, y + 25);
        
        // Body
        ctx.fillStyle = '#808080';
        ctx.beginPath();
        ctx.ellipse(0, 0, 15, 12, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Head
        ctx.fillStyle = '#A0A0A0';
        ctx.beginPath();
        ctx.ellipse(10, -5, 10, 10, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Ears - animated
        const earAngle = Math.sin(frame * Math.PI / 2) * 0.3;
        ctx.fillStyle = '#808080';
        ctx.save();
        ctx.rotate(earAngle);
        ctx.beginPath();
        ctx.ellipse(8, -15, 3, 10, -0.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(12, -15, 3, 10, 0.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        
        // Inner ears
        ctx.fillStyle = '#D0D0D0';
        ctx.save();
        ctx.rotate(earAngle);
        ctx.beginPath();
        ctx.ellipse(8, -15, 1.5, 6, -0.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(12, -15, 1.5, 6, 0.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        
        // Eye
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc(15, -5, 2, 0, Math.PI * 2);
        ctx.fill();
        
        // White eye shine
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(15.5, -5.5, 0.8, 0, Math.PI * 2);
        ctx.fill();
        
        // Nose
        ctx.fillStyle = '#606060';
        ctx.beginPath();
        ctx.arc(20, -3, 1.5, 0, Math.PI * 2);
        ctx.fill();
        
        // Tail
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(-15, 0, 5, 0, Math.PI * 2);
        ctx.fill();
        
        // Legs - animated running
        ctx.strokeStyle = '#808080';
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        
        // Front legs
        const frontLegAngle = Math.sin(frame * Math.PI / 2) * 0.8;
        ctx.beginPath();
        ctx.moveTo(5, 8);
        ctx.lineTo(5 + Math.sin(frontLegAngle) * 8, 20);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(0, 8);
        ctx.lineTo(0 + Math.sin(frontLegAngle + Math.PI) * 8, 20);
        ctx.stroke();
        
        // Back legs
        const backLegAngle = Math.sin(frame * Math.PI / 2 + Math.PI) * 0.8;
        ctx.beginPath();
        ctx.moveTo(-8, 8);
        ctx.lineTo(-8 + Math.sin(backLegAngle) * 8, 20);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(-12, 8);
        ctx.lineTo(-12 + Math.sin(backLegAngle + Math.PI) * 8, 20);
        ctx.stroke();
        
        ctx.restore();
    }
    
    return canvas;
}

function createWolfSprite() {
    const canvas = document.createElement('canvas');
    canvas.width = 280;
    canvas.height = 50;
    const ctx = canvas.getContext('2d');
    
    // Create 4 frames of wolf running animation
    for (let frame = 0; frame < 4; frame++) {
        const x = frame * 70;
        const y = 0;
        
        ctx.save();
        ctx.translate(x + 35, y + 25);
        
        // Body
        ctx.fillStyle = '#2A2A2A';
        ctx.beginPath();
        ctx.ellipse(0, 0, 18, 14, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Chest
        ctx.fillStyle = '#404040';
        ctx.beginPath();
        ctx.ellipse(8, 2, 12, 10, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Head
        ctx.fillStyle = '#2A2A2A';
        ctx.beginPath();
        ctx.moveTo(10, -5);
        ctx.lineTo(25, -3);
        ctx.lineTo(25, 3);
        ctx.lineTo(15, 5);
        ctx.lineTo(8, 2);
        ctx.lineTo(8, -8);
        ctx.closePath();
        ctx.fill();
        
        // Snout
        ctx.fillStyle = '#1A1A1A';
        ctx.beginPath();
        ctx.moveTo(20, -3);
        ctx.lineTo(28, -1);
        ctx.lineTo(28, 2);
        ctx.lineTo(20, 3);
        ctx.closePath();
        ctx.fill();
        
        // Ears - animated
        const earAngle = Math.sin(frame * Math.PI / 2) * 0.2;
        ctx.fillStyle = '#2A2A2A';
        ctx.save();
        ctx.rotate(earAngle);
        ctx.beginPath();
        ctx.moveTo(8, -8);
        ctx.lineTo(6, -15);
        ctx.lineTo(10, -13);
        ctx.closePath();
        ctx.fill();
        
        ctx.beginPath();
        ctx.moveTo(12, -8);
        ctx.lineTo(10, -15);
        ctx.lineTo(14, -13);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
        
        // Eye
        ctx.fillStyle = '#FF4444';
        ctx.beginPath();
        ctx.arc(15, -3, 2.5, 0, Math.PI * 2);
        ctx.fill();
        
        // Pupil
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.ellipse(16, -3, 1, 2, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Nose
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc(27, 0, 1.5, 0, Math.PI * 2);
        ctx.fill();
        
        // Tail - animated
        const tailAngle = Math.sin(frame * Math.PI / 2) * 0.3;
        ctx.save();
        ctx.rotate(tailAngle);
        ctx.fillStyle = '#2A2A2A';
        ctx.beginPath();
        ctx.ellipse(-20, 0, 12, 3, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        
        // Legs - animated running
        ctx.strokeStyle = '#2A2A2A';
        ctx.lineWidth = 5;
        ctx.lineCap = 'round';
        
        // Front legs - animated running
        const frontLegAngle = Math.sin(frame * Math.PI / 2) * 0.8;
        ctx.beginPath();
        ctx.moveTo(10, 10);
        ctx.lineTo(10 + Math.sin(frontLegAngle) * 8, 22);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(5, 10);
        ctx.lineTo(5 + Math.sin(frontLegAngle + Math.PI) * 8, 22);
        ctx.stroke();
        
        // Back legs - animated running
        const backLegAngle = Math.sin(frame * Math.PI / 2 + Math.PI) * 0.8;
        ctx.beginPath();
        ctx.moveTo(-8, 10);
        ctx.lineTo(-8 + Math.sin(backLegAngle) * 8, 22);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(-13, 10);
        ctx.lineTo(-13 + Math.sin(backLegAngle + Math.PI) * 8, 22);
        ctx.stroke();
        
        // Paws - animated
        ctx.fillStyle = '#1A1A1A';
        ctx.beginPath();
        ctx.arc(10 + Math.sin(frontLegAngle) * 8, 22, 2, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(5 + Math.sin(frontLegAngle + Math.PI) * 8, 22, 2, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(-8 + Math.sin(backLegAngle) * 8, 22, 2, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(-13 + Math.sin(backLegAngle + Math.PI) * 8, 22, 2, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }
    
    return canvas;
}

function createStoneSprites() {
    const canvas = document.createElement('canvas');
    canvas.width = 375;
    canvas.height = 75;
    const ctx = canvas.getContext('2d');
    
    // Create 5 different stone variations
    for (let variant = 0; variant < 5; variant++) {
        const x = variant * 75;
        const y = 0;
        const size = 60;
        
        ctx.save();
        ctx.translate(x + 37.5, y + 37.5);
        
        // Random seed for this stone variant
        const seed = variant * 137;
        
        // Main stone body with irregular shape - gray tones only
        const grayTones = ['#7A7A7A', '#6B6B6B', '#8A8A8A', '#5A5A5A', '#909090'];
        ctx.fillStyle = grayTones[variant];
        ctx.strokeStyle = '#3A3A3A';
        ctx.lineWidth = 1.5;
        
        ctx.beginPath();
        
        // Create irregular stone shape using bezier curves
        const points = [];
        const numPoints = 6 + (seed % 3);
        
        for (let i = 0; i < numPoints; i++) {
            const angle = (i / numPoints) * Math.PI * 2;
            const radiusVariation = 0.7 + (Math.sin(seed + i * 2) * 0.3);
            const radius = (size / 2) * radiusVariation;
            
            const px = Math.cos(angle) * radius;
            const py = Math.sin(angle) * radius * 0.8; // Flatten vertically
            
            points.push({ x: px, y: py });
        }
        
        // Draw the stone shape
        ctx.moveTo(points[0].x, points[0].y);
        
        for (let i = 0; i < points.length; i++) {
            const next = points[(i + 1) % points.length];
            const mid = points[(i + 2) % points.length];
            
            ctx.quadraticCurveTo(
                next.x, next.y,
                (next.x + mid.x) / 2, (next.y + mid.y) / 2
            );
        }
        
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        // Add texture and details
        ctx.globalAlpha = 0.3;
        
        // Add some darker spots
        for (let j = 0; j < 3; j++) {
            const spotX = (Math.sin(seed + j * 3) * size * 0.3);
            const spotY = (Math.cos(seed + j * 2) * size * 0.2);
            const spotSize = 3 + (seed + j) % 4;
            
            ctx.fillStyle = '#3A3A3A';
            ctx.beginPath();
            ctx.arc(spotX, spotY, spotSize, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Add highlights
        ctx.globalAlpha = 0.4;
        ctx.fillStyle = '#B0B0B0';
        
        for (let j = 0; j < 2; j++) {
            const hlX = (Math.cos(seed + j * 5) * size * 0.2);
            const hlY = (Math.sin(seed + j * 4) * size * 0.2) - 5;
            const hlSize = 2 + (seed + j) % 3;
            
            ctx.beginPath();
            ctx.arc(hlX, hlY, hlSize, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Add cracks
        ctx.globalAlpha = 0.5;
        ctx.strokeStyle = '#1A1A1A';
        ctx.lineWidth = 0.5;
        
        if (variant % 3 === 0) {
            ctx.beginPath();
            ctx.moveTo(-size * 0.2, -size * 0.1);
            ctx.lineTo(0, 0);
            ctx.lineTo(size * 0.15, size * 0.1);
            ctx.stroke();
        }
        
        if (variant % 2 === 1) {
            ctx.beginPath();
            ctx.moveTo(size * 0.1, -size * 0.2);
            ctx.lineTo(0, 0);
            ctx.lineTo(-size * 0.1, size * 0.15);
            ctx.stroke();
        }
        
        // Add moss/vegetation on some stones
        if (variant === 2 || variant === 4) {
            ctx.globalAlpha = 0.3;
            ctx.fillStyle = '#6B8E23';
            
            ctx.beginPath();
            ctx.arc(-size * 0.2, -size * 0.15, 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(-size * 0.1, -size * 0.2, 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(size * 0.15, -size * 0.18, 3.5, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.restore();
    }
    
    return canvas;
}

function createGroundTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 1600; // Make texture wider to reduce visible seams
    canvas.height = 100;
    const ctx = canvas.getContext('2d');
    
    // Base rock layer with gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, 100);
    gradient.addColorStop(0, '#4A4A4A'); // Dark gray
    gradient.addColorStop(0.3, '#696969'); // Dim gray
    gradient.addColorStop(0.7, '#2F2F2F'); // Dark gray
    gradient.addColorStop(1, '#1C1C1C'); // Very dark gray
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1600, 100);
    
    // Add rock layers and stratification
    for (let i = 0; i < 8; i++) {
        const y = 15 + i * 12;
        const alpha = 0.2 + Math.random() * 0.3;
        
        ctx.globalAlpha = alpha;
        ctx.fillStyle = i % 2 === 0 ? '#5A5A5A' : '#3A3A3A';
        
        // Create wavy rock layers that seamlessly tile
        ctx.beginPath();
        ctx.moveTo(0, y);
        for (let x = 0; x <= 1600; x += 20) {
            // Use a repeating pattern that starts and ends at the same height
            const waveY = y + Math.sin(x * 0.005 + i) * 3;
            ctx.lineTo(x, waveY);
        }
        ctx.lineTo(1600, y + 5);
        ctx.lineTo(0, y + 5);
        ctx.closePath();
        ctx.fill();
    }
    
    ctx.globalAlpha = 1;
    
    // Add individual rocks and pebbles
    for (let i = 0; i < 80; i++) {
        const x = Math.random() * 1600;
        const y = Math.random() * 90 + 10;
        const size = 2 + Math.random() * 8;
        
        // Random rock color
        const rockColors = ['#6B6B6B', '#5A5A5A', '#4F4F4F', '#3E3E3E', '#565656'];
        ctx.fillStyle = rockColors[Math.floor(Math.random() * rockColors.length)];
        
        // Draw irregular rock shape
        ctx.beginPath();
        const sides = 5 + Math.floor(Math.random() * 3);
        for (let j = 0; j < sides; j++) {
            const angle = (j / sides) * Math.PI * 2;
            const radius = size * (0.7 + Math.random() * 0.6);
            const px = x + Math.cos(angle) * radius;
            const py = y + Math.sin(angle) * radius * 0.8;
            
            if (j === 0) {
                ctx.moveTo(px, py);
            } else {
                ctx.lineTo(px, py);
            }
        }
        ctx.closePath();
        ctx.fill();
        
        // Add highlight
        ctx.globalAlpha = 0.4;
        ctx.fillStyle = '#8A8A8A';
        ctx.beginPath();
        ctx.arc(x - size * 0.3, y - size * 0.3, size * 0.4, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
    }
    
    // Add rock cracks and fissures
    for (let i = 0; i < 30; i++) {
        const startX = Math.random() * 1600;
        const startY = Math.random() * 100;
        const length = 20 + Math.random() * 60;
        const angle = Math.random() * Math.PI * 2;
        
        ctx.strokeStyle = '#1A1A1A';
        ctx.lineWidth = 1 + Math.random() * 2;
        ctx.globalAlpha = 0.6;
        
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        
        // Create jagged crack
        let currentX = startX;
        let currentY = startY;
        const segments = 5 + Math.floor(Math.random() * 8);
        
        for (let j = 1; j <= segments; j++) {
            const segmentLength = length / segments;
            const deviation = (Math.random() - 0.5) * 20;
            
            currentX += Math.cos(angle) * segmentLength + deviation;
            currentY += Math.sin(angle) * segmentLength + (Math.random() - 0.5) * 10;
            
            ctx.lineTo(currentX, currentY);
        }
        ctx.stroke();
        ctx.globalAlpha = 1;
    }
    
    // Add mineral veins
    for (let i = 0; i < 16; i++) {
        const startX = Math.random() * 1600;
        const startY = Math.random() * 100;
        const endX = startX + (Math.random() - 0.5) * 100;
        const endY = startY + (Math.random() - 0.5) * 30;
        
        ctx.strokeStyle = '#7A7A7A';
        ctx.lineWidth = 0.5 + Math.random();
        ctx.globalAlpha = 0.5;
        
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.quadraticCurveTo(
            (startX + endX) / 2 + (Math.random() - 0.5) * 20,
            (startY + endY) / 2,
            endX, endY
        );
        ctx.stroke();
        ctx.globalAlpha = 1;
    }
    
    // Add surface roughness with small details
    for (let i = 0; i < 400; i++) {
        const x = Math.random() * 1600;
        const y = Math.random() * 100;
        const size = Math.random() * 2;
        
        ctx.globalAlpha = Math.random() * 0.4;
        ctx.fillStyle = Math.random() > 0.5 ? '#555555' : '#333333';
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
    }
    
    ctx.globalAlpha = 1;
    
    return canvas;
}

function createRabbitDeadSprite() {
    const canvas = document.createElement('canvas');
    canvas.width = 200;
    canvas.height = 50;
    const ctx = canvas.getContext('2d');
    
    // Create 4 frames of rabbit running animation - red version
    for (let frame = 0; frame < 4; frame++) {
        const x = frame * 50;
        const y = 0;
        
        ctx.save();
        ctx.translate(x + 25, y + 25);
        
        // Body - red tinted
        ctx.fillStyle = '#B83030';
        ctx.beginPath();
        ctx.ellipse(0, 0, 15, 12, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Head - red tinted
        ctx.fillStyle = '#C04040';
        ctx.beginPath();
        ctx.ellipse(10, -5, 10, 10, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Ears - animated, red tinted
        const earAngle = Math.sin(frame * Math.PI / 2) * 0.3;
        ctx.fillStyle = '#B83030';
        ctx.save();
        ctx.rotate(earAngle);
        ctx.beginPath();
        ctx.ellipse(8, -15, 3, 10, -0.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(12, -15, 3, 10, 0.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        
        // Inner ears - red tinted
        ctx.fillStyle = '#E06060';
        ctx.save();
        ctx.rotate(earAngle);
        ctx.beginPath();
        ctx.ellipse(8, -15, 1.5, 6, -0.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(12, -15, 1.5, 6, 0.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        
        // Eye
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc(15, -5, 2, 0, Math.PI * 2);
        ctx.fill();
        
        // White eye shine
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(15.5, -5.5, 0.8, 0, Math.PI * 2);
        ctx.fill();
        
        // Nose - red tinted
        ctx.fillStyle = '#903030';
        ctx.beginPath();
        ctx.arc(20, -3, 1.5, 0, Math.PI * 2);
        ctx.fill();
        
        // Tail - red tinted
        ctx.fillStyle = '#FF8080';
        ctx.beginPath();
        ctx.arc(-15, 0, 5, 0, Math.PI * 2);
        ctx.fill();
        
        // Legs - animated running, red tinted
        ctx.strokeStyle = '#B83030';
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        
        // Front legs
        const frontLegAngle = Math.sin(frame * Math.PI / 2) * 0.8;
        ctx.beginPath();
        ctx.moveTo(5, 8);
        ctx.lineTo(5 + Math.sin(frontLegAngle) * 8, 20);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(0, 8);
        ctx.lineTo(0 + Math.sin(frontLegAngle + Math.PI) * 8, 20);
        ctx.stroke();
        
        // Back legs
        const backLegAngle = Math.sin(frame * Math.PI / 2 + Math.PI) * 0.8;
        ctx.beginPath();
        ctx.moveTo(-8, 8);
        ctx.lineTo(-8 + Math.sin(backLegAngle) * 8, 20);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(-12, 8);
        ctx.lineTo(-12 + Math.sin(backLegAngle + Math.PI) * 8, 20);
        ctx.stroke();
        
        ctx.restore();
    }
    
    return canvas;
}

function createWolfDeadSprite() {
    const canvas = document.createElement('canvas');
    canvas.width = 280;
    canvas.height = 50;
    const ctx = canvas.getContext('2d');
    
    // Create 4 frames of wolf running animation - red version
    for (let frame = 0; frame < 4; frame++) {
        const x = frame * 70;
        const y = 0;
        
        ctx.save();
        ctx.translate(x + 35, y + 25);
        
        // Body - red tinted
        ctx.fillStyle = '#803030';
        ctx.beginPath();
        ctx.ellipse(0, 0, 18, 14, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Chest - red tinted
        ctx.fillStyle = '#A04040';
        ctx.beginPath();
        ctx.ellipse(8, 2, 12, 10, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Head - red tinted
        ctx.fillStyle = '#803030';
        ctx.beginPath();
        ctx.moveTo(10, -5);
        ctx.lineTo(25, -3);
        ctx.lineTo(25, 3);
        ctx.lineTo(15, 5);
        ctx.lineTo(8, 2);
        ctx.lineTo(8, -8);
        ctx.closePath();
        ctx.fill();
        
        // Snout - red tinted
        ctx.fillStyle = '#601818';
        ctx.beginPath();
        ctx.moveTo(20, -3);
        ctx.lineTo(28, -1);
        ctx.lineTo(28, 2);
        ctx.lineTo(20, 3);
        ctx.closePath();
        ctx.fill();
        
        // Ears - animated, red tinted
        const earAngle = Math.sin(frame * Math.PI / 2) * 0.2;
        ctx.fillStyle = '#803030';
        ctx.save();
        ctx.rotate(earAngle);
        ctx.beginPath();
        ctx.moveTo(8, -8);
        ctx.lineTo(6, -15);
        ctx.lineTo(10, -13);
        ctx.closePath();
        ctx.fill();
        
        ctx.beginPath();
        ctx.moveTo(12, -8);
        ctx.lineTo(10, -15);
        ctx.lineTo(14, -13);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
        
        // Eye - red
        ctx.fillStyle = '#FF6666';
        ctx.beginPath();
        ctx.arc(15, -3, 2.5, 0, Math.PI * 2);
        ctx.fill();
        
        // Pupil
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.ellipse(16, -3, 1, 2, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Nose
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc(27, 0, 1.5, 0, Math.PI * 2);
        ctx.fill();
        
        // Tail - animated, red tinted
        const tailAngle = Math.sin(frame * Math.PI / 2) * 0.3;
        ctx.save();
        ctx.rotate(tailAngle);
        ctx.fillStyle = '#803030';
        ctx.beginPath();
        ctx.ellipse(-20, 0, 12, 3, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        
        // Legs - animated running, red tinted
        ctx.strokeStyle = '#803030';
        ctx.lineWidth = 5;
        ctx.lineCap = 'round';
        
        // Front legs - animated running
        const frontLegAngle = Math.sin(frame * Math.PI / 2) * 0.8;
        ctx.beginPath();
        ctx.moveTo(10, 10);
        ctx.lineTo(10 + Math.sin(frontLegAngle) * 8, 22);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(5, 10);
        ctx.lineTo(5 + Math.sin(frontLegAngle + Math.PI) * 8, 22);
        ctx.stroke();
        
        // Back legs - animated running
        const backLegAngle = Math.sin(frame * Math.PI / 2 + Math.PI) * 0.8;
        ctx.beginPath();
        ctx.moveTo(-8, 10);
        ctx.lineTo(-8 + Math.sin(backLegAngle) * 8, 22);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(-13, 10);
        ctx.lineTo(-13 + Math.sin(backLegAngle + Math.PI) * 8, 22);
        ctx.stroke();
        
        // Paws - red tinted, animated
        ctx.fillStyle = '#601818';
        ctx.beginPath();
        ctx.arc(10 + Math.sin(frontLegAngle) * 8, 22, 2, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(5 + Math.sin(frontLegAngle + Math.PI) * 8, 22, 2, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(-8 + Math.sin(backLegAngle) * 8, 22, 2, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(-13 + Math.sin(backLegAngle + Math.PI) * 8, 22, 2, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }
    
    return canvas;
}

// Export sprite creation functions
window.createRabbitSprite = createRabbitSprite;
window.createWolfSprite = createWolfSprite;
window.createRabbitDeadSprite = createRabbitDeadSprite;
window.createWolfDeadSprite = createWolfDeadSprite;
window.createStoneSprites = createStoneSprites;
window.createGroundTexture = createGroundTexture;