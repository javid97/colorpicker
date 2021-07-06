let canvas = document.getElementById('canvas');
let canvas2 = document.getElementById('canvas2');
let canvas3 = document.getElementById('canvas3');
let rgbValue = document.querySelector('.rgb');
let hexValue = document.querySelector('.hex');
let hslValue = document.querySelector('.hsl');
let imgFile = document.getElementById('file');
let pickFromPaletteBtn = document.querySelector('.pick-from-palette-btn');
canvas3.width = 30;
canvas3.height = 250;
canvas.width = 250;
canvas.height = 250;
canvas2.width = 120;
canvas2.height = 250;
const ctx = canvas.getContext('2d');
const ctx2 = canvas2.getContext('2d');
const ctx3 = canvas3.getContext('2d');
let mouseDown = false;
let colorHistoryX = 5;
let colorHistoryY = 5;
let mouseDown2 = false;
let copyMode = true;

//Setting picked color palette to canvas
const customizedColor = (color) => {
    let angle = 0 * Math.PI / 180;
    let x1 = 250 * Math.cos(angle);
    let y1 = 250 * Math.sin(angle);
    let angle2 = 90 * Math.PI / 180;
    let x2 = 250 * Math.cos(angle2);
    let y2 = 250 * Math.sin(angle2);
    let blackColor = ctx.createLinearGradient(0, 0, x2, y2);
    let customizedColor = ctx.createLinearGradient(0, 0, x1, y1);
    //setting white and desired gradient
    customizedColor.addColorStop(0, 'rgb(255, 255, 255)');
    customizedColor.addColorStop(0.1, 'rgb(255, 255, 255)');
    customizedColor.addColorStop(0.8, color);
    customizedColor.addColorStop(1, color);
    //Setting Black Color
    blackColor.addColorStop(0, 'rgba(255, 255, 255, 0');
    blackColor.addColorStop(0.98, 'rgb(0,0,0)');
    blackColor.addColorStop(1, 'rgb(0,0,0)');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = customizedColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = blackColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}
//creating Gradient
const gradient = () => {
    let gradient = ctx3.createLinearGradient(0, 0, 0, 250);
    gradient.addColorStop(0.16, 'rgb(255,0,0)');
    gradient.addColorStop(0.32, 'rgb(255,0,255)');
    gradient.addColorStop(0.48, 'rgb(0,0,255)');
    gradient.addColorStop(0.64, 'rgb(0,255,255)');
    gradient.addColorStop(0.80, 'rgb(0,255,0)');
    gradient.addColorStop(0.9, 'rgb(255,255,0)');
    gradient.addColorStop(1, 'rgb(0, 255, 0)');
    ctx3.clearRect(0, 0, canvas3.width, canvas3.height);
    ctx3.beginPath();
    ctx3.fillStyle = gradient;
    ctx3.fillRect(0, 0, canvas3.width, canvas3.height);
    ctx.closePath();
}
//setting events to the color palette
canvas3.addEventListener('mousedown', (e) => {
    mouseDown2 = true;
});
canvas3.addEventListener('mousemove', (e) => {
    if (mouseDown2) {
        gradient();
        let data = getRGB(e.offsetX, e.offsetY, ctx3);
        let rgb = `rgb(${data[0]}, ${data[1]}, ${data[2]})`
        customizedColor(rgb);
        createPosition(e.offsetX, e.offsetY);
    }
});
canvas3.addEventListener('mouseup', (e) => {
    gradient();
    let data = getRGB(e.offsetX, e.offsetY, ctx3);
    let rgb = `rgb(${data[0]}, ${data[1]}, ${data[2]})`
    customizedColor(rgb);
    createPosition(e.offsetX, e.offsetY);
    mouseDown2 = false;
})
const createPosition = (x, y) => {
    ctx3.beginPath();
    ctx3.lineWidth = 2;
    ctx3.moveTo(0, y);
    ctx3.lineTo(canvas3.width, y);
    ctx3.strokeStyle = '#000000';
    ctx3.stroke();
    ctx3.beginPath();
    ctx3.moveTo(0, y + 5);
    ctx3.lineTo(0, y - 5);
    ctx3.lineTo(5, y);
    ctx3.fillStyle = '#000000';
    ctx3.fill();
    ctx3.closePath();
    ctx3.beginPath();
    ctx3.moveTo(canvas3.width, y + 5);
    ctx3.lineTo(canvas3.width, y - 5);
    ctx3.lineTo(canvas3.width - 5, y);
    ctx3.fillStyle = '#000000';
    ctx3.fill();
    ctx3.closePath();
}
//setting picked color to background and their values in their respective fields
canvas.addEventListener('mousedown', (e) => {
    mouseDown = true;
});
canvas.addEventListener('mousemove', e => {
    if (mouseDown) {
        //setting the value to their respective fields
        setColorValues(e.offsetX, e.offsetY, ctx);
    }
})
canvas.addEventListener('mouseup', (e) => {
    mouseDown = false;
    //setting picked color in color History
    setColorHistory(colorHistoryX, colorHistoryY, e.offsetX, e.offsetY);
    setColorValues(e.offsetX, e.offsetY, ctx);
});
//Converting the RGB value to Hexadecimal
const RGBtoHex = (rgb) => {
    let r = (rgb[0]).toString(16);
    let g = (rgb[1]).toString(16);
    let b = (rgb[2]).toString(16);
    if (r.length == 1) r = "0" + r;
    if (g.length == 1) g = "0" + g;
    if (b.length == 1) b = "0" + b;
    return "#" + r + g + b;
}
//Converting the RGB value to HSL
const rgbToHsl = (rgb) => {
    let r = rgb[0] /= 255;
    let g = rgb[1] /= 255;
    let b = rgb[2] /= 255;
    let max = Math.max(r, g, b);
    let min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    if (max == min) {
        h = s = 0; // achromatic
    } else {
        let d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
        h *= 360;
    }

    return `hsl(${Math.round(h)}, ${s.toFixed(1) * 100}%, ${l.toFixed(1) * 100}%)`;
}
//Getting the RGB value
const getRGB = (x, y, context) => {
    let rgb = context.getImageData(x, y, 1, 1).data;
    return rgb;
}
imgFile.addEventListener('change', (e) => {
    const fileReader = new FileReader();
    let image = new Image();
    let selectedFile = file.files[0];
    if (selectedFile) {
        fileReader.onerror = () => { }
        fileReader.onload = () => {
            image.onload = () => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
            }
            image.src = fileReader.result;
        }
        fileReader.readAsDataURL(imgFile.files[0]);
        canvas3.style.display = 'none';
        document.querySelector('.labelForFile').style.display = 'none';
        pickFromPaletteBtn.style.display = 'block';
    }

});
//Setting color values in their respective fields
const setColorValues = (x, y, context) => {
    let rgb = getRGB(x, y, context);
    if (!(rgb[0] == 0 && rgb[1] == 0 && rgb[2] == 0)) {
        document.body.style.background = `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
        document.querySelector('.rgb').innerHTML = `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
        document.querySelector('.hex').innerHTML = RGBtoHex(rgb);
        document.querySelector('.hsl').innerHTML = rgbToHsl(rgb);
    }
}
//setting the color in color History
const setColorHistory = (x, y, x1, y1) => {
    let rgb = getRGB(x1, y1, ctx);
    ctx2.beginPath();
    ctx2.fillStyle = `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
    ctx2.fillRect(x, y, 20, 20);
    ctx2.closePath();
    colorHistoryX += 22;
    if (colorHistoryX > 110) {
        colorHistoryY += 22;
        colorHistoryX = 5;
    }
    if (colorHistoryY > 230) {
        colorHistoryY = 5;
        ctx2.clearRect(colorHistoryX, colorHistoryY, 20, 20);
    }
}
//setting color values when clicked on color History
canvas2.addEventListener('click', (e) => {
    setColorValues(e.offsetX, e.offsetY, ctx2);
})
//copying RGB value
rgbValue.addEventListener('click', () => {
    if(copyMode){
        copyToClipBoard(rgbValue);
        copyMode = false;
        getPreviousValue(rgbValue);
    }
})
//copying HEX value
hexValue.addEventListener('click', () => {
    if(copyMode){
        copyToClipBoard(hexValue);
        copyMode = false;
        getPreviousValue(hexValue);
    }
})
//copying HSL value
hslValue.addEventListener('click', () => {
    if(copyMode){
        copyToClipBoard(hslValue);
        copyMode = false;
        getPreviousValue(hslValue);
    }
})
//Copying color value to Clip board
const copyToClipBoard = (selectedText) => {
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(selectedText);
    selection.removeAllRanges();
    selection.addRange(range);
    document.execCommand('Copy');
    selection.removeAllRanges();
}
//Getting previous value
const getPreviousValue = (element) => {
    let prevValue = element.innerHTML;
    element.innerHTML = 'Copied!';
    setTimeout(() => {
        element.innerHTML = prevValue;
        copyMode = true;
    }, 500);
}
//display image button back
pickFromPaletteBtn.addEventListener('click', () => {
    canvas3.style.display = '';
    document.querySelector('.labelForFile').style.display = 'block';
    pickFromPaletteBtn.style.display = 'none';
    customizedColor('rgb(255, 0, 0)');
    gradient();
    createPosition(5, 5);
});
//initializing
const init = () => {
    customizedColor('rgb(255, 0, 0)');
    gradient();
    createPosition(5, 5);
}
init();