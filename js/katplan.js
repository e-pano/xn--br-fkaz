const imageBase = "https://börü.pages.dev/img/"; // URL'yi burada tanımladık
const images = [
    { src: imageBase + "kp1.gif", title: "Zemin Kat Planı" },
    { src: imageBase + "kp2.gif", title: "Normal Kat Planı" },
    { src: imageBase + "kp3.gif", title: "Detaylı Kat Planı" }
];
let currentIndex = 0;
let scale = 1;
let isDragging = false;
let startX, startY, scrollLeft, scrollTop;
let isZoomingIn = true;

function changeImage(src, title) {
    document.getElementById("main-image").src = src;
    currentIndex = images.findIndex(img => img.src === src);
    updateThumbnails();
}
function updateThumbnails() {
    const thumbnails = document.querySelectorAll('.thumbnail');
    thumbnails.forEach((thumb, index) => {
        thumb.classList.remove('selected');
        if (index === currentIndex) {
            thumb.classList.add('selected');
        }
    });
}
document.getElementById('prev').addEventListener('click', () => {
    currentIndex = (currentIndex > 0) ? currentIndex - 1 : images.length - 1;
    changeImage(images[currentIndex].src, images[currentIndex].title);
});
document.getElementById('next').addEventListener('click', () => {
    currentIndex = (currentIndex < images.length - 1) ? currentIndex + 1 : 0;
    changeImage(images[currentIndex].src, images[currentIndex].title);
});
updateThumbnails();
const mainImage = document.getElementById('main-image');
const imageWrapper = document.getElementById('imageWrapper');
let lastScale = 1;
let currentTouchDistance = 0;
mainImage.addEventListener('click', (e) => {
    const rect = mainImage.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;
    if (scale < 4) {
        scale += 0.25;
    } else {
        scale = 1;
    }
    mainImage.style.transformOrigin = `${(offsetX / rect.width) * 100}% ${(offsetY / rect.height) * 100}%`;
    mainImage.style.transform = `scale(${scale})`;
    checkBounds();
});
imageWrapper.addEventListener('wheel', (e) => {
    e.preventDefault();
    if (e.deltaY < 0 && scale < 4) {
        scale += 0.1;
    } else if (e.deltaY > 0 && scale > 1) {
        scale -= 0.1;
    }
    mainImage.style.transform = `scale(${scale})`;
    checkBounds();
});
imageWrapper.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.pageX - imageWrapper.offsetLeft;
    startY = e.pageY - imageWrapper.offsetTop;
    scrollLeft = imageWrapper.scrollLeft;
    scrollTop = imageWrapper.scrollTop;
    imageWrapper.style.cursor = 'pointer';
});
imageWrapper.addEventListener('mouseleave', () => {
    isDragging = false;
    imageWrapper.style.cursor = 'pointer';
});
imageWrapper.addEventListener('mouseup', () => {
    isDragging = false;
    imageWrapper.style.cursor = 'pointer';
});
imageWrapper.addEventListener('touchstart', (e) => {
    if (e.touches.length === 2) {
        currentTouchDistance = getTouchDistance(e.touches);
    } else {
        isDragging = true;
        startX = e.touches[0].pageX - imageWrapper.offsetLeft;
        startY = e.touches[0].pageY - imageWrapper.offsetTop;
        scrollLeft = imageWrapper.scrollLeft;
        scrollTop = imageWrapper.scrollTop;
        imageWrapper.style.cursor = 'pointer';
    }
});
imageWrapper.addEventListener('touchmove', (e) => {
    if (e.touches.length === 2) {
        const newDistance = getTouchDistance(e.touches);
        const distanceDifference = newDistance - currentTouchDistance;
        if (Math.abs(newDistance) > 300) {
            if (distanceDifference > 0 && scale < 4) {
                scale += 0.1;
            } else if (distanceDifference < 0) {
                scale = 1;
            }
            mainImage.style.transform = `scale(${scale}`;
            currentTouchDistance = newDistance;
        }
    } else {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.touches[0].pageX - imageWrapper.offsetLeft;
        const y = e.touches[0].pageY - imageWrapper.offsetTop;
        const walkX = (x - startX) * 2;
        const walkY = (y - startY) * 2;
        imageWrapper.scrollLeft = scrollLeft - walkX;
        imageWrapper.scrollTop = scrollTop - walkY;
    }
});
imageWrapper.addEventListener('touchend', () => {
    isDragging = false;
    imageWrapper.style.cursor = 'pointer';
});
function getTouchDistance(touches) {
    const dx = touches[0].pageX - touches[1].pageX;
    const dy = touches[0].pageY - touches[1].pageY;
    return Math.sqrt(dx * dx + dy * dy);
}
function checkBounds() {
    const rect = mainImage.getBoundingClientRect();
    const imageWidth = rect.width * scale;
    const imageHeight = rect.height * scale;
    if (imageWidth < window.innerWidth) {
        mainImage.style.left = `${(window.innerWidth - imageWidth) / 2}px`;
    } else {
        mainImage.style.left = '0';
    }
    if (imageHeight < window.innerHeight) {
        mainImage.style.top = `${(window.innerHeight - imageHeight) / 2}px`;
    } else {
        mainImage.style.top = '0';
    }
}