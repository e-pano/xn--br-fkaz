let isDayTime = null;
let lastIsDayTime = null;
let audio = new Audio();

function getWeekOfYear(date) {
    const startOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date - startOfYear) / 86400000;
    return Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7);
}

function setBackgroundImage() {
    const now = modifiedTime;
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const currentMinutes = hours * 60 + minutes;
    const weekOfYear = getWeekOfYear(now);
    const weekIndex = (weekOfYear - 1) % daylightHours.length;
    const { start, end } = daylightHours[weekIndex];

    isDayTime = currentMinutes >= start && currentMinutes <= end;

    if (lastIsDayTime !== isDayTime) {
        updateMusic();
        lastIsDayTime = isDayTime;
    }
    updateBackground();
    updateIcon();
}

setInterval(function() {
    modifiedTime.setMinutes(modifiedTime.getMinutes() + 1);
    setBackgroundImage();
}, 60000);

function updateBackground() {


    const isLandscape = $(window).width() > $(window).height();
    const imgPath = "https://xn--br-fkaz.pages.dev/börü/img/";
    const backgroundImageUrl = isDayTime


        ? (isLandscape ? imgPath + "BGlandscapeDay.jpg" : imgPath + "BGportraitDay.jpg")
        : (isLandscape ? imgPath + "BGlandscapeNight.jpg" : imgPath + "BGportraitNight.jpg");

    $('body').css('background-image', `url(${backgroundImageUrl})`);

    $('.login-header').css('background-color', isDayTime ? 'rgba(67, 74, 80, 0.70)' : 'rgba(254, 254, 248, 0.85)');
    $('.login-container').css('background-color', isDayTime ? 'rgba(255, 255, 255, 0.70)' : 'rgba(76, 99, 114, 0.70)');

    $('.header-title').css('color', isDayTime ? 'rgba(255, 255, 255, 0.95)' : 'rgba(69, 81, 91, 0.95)');
    $('.header-subtitle').css('color', isDayTime ? 'rgba(255, 255, 255, 0.95)' : 'rgba(69, 81, 91, 0.95)');

    $('.login-container input').css('border', isDayTime ? '1.5px solid #bcc4ca' : '1.5px solid #778189');
    $('.login-container input').css('color', isDayTime ? 'rgba(57, 64, 70, 1)' : 'rgba(251, 251, 244, 1)');
    $('.login-container input').css('background-color', isDayTime ? 'rgba(231, 238, 243, 0.65)' : 'rgba(77, 92, 104, 0.75)');

    if (isDayTime) {

        $('.login-container input').addClass('placeholder-day').removeClass('placeholder-night');
    } else {
        $('.login-container input').addClass('placeholder-night').removeClass('placeholder-day');
    }

    $('.toggle-text').css('color', isDayTime ? 'rgba(88, 89, 92, 0.90)' : 'rgba(254, 254, 248, 0.80)');
    $('.toggle-password').css('color', isDayTime ? 'rgba(87, 91, 94, 0.4)' : 'rgba(37, 46, 55, 0.5)');

    $('.day-icon').toggle(isDayTime);
    $('.night-icon').toggle(!isDayTime);
    updateToggleVisibility();
}

function updateToggleVisibility() {
    $('.toggle-text .day-mode').toggle(!isDayTime);
    $('.toggle-text .night-mode').toggle(isDayTime);
}

$(document).ready(function() {
    setBackgroundImage();
		$('.icon1, .icon2').on('click', function(event) {
		if (!$(event.target).closest('.tooltip').length) {
			isDayTime = !isDayTime;
			updateBackground();
			updateIcon();
			if (lastIsDayTime !== isDayTime) {
				updateMusic();
				lastIsDayTime = isDayTime;
			}
		}
	});
});

$(window).on('resize', setBackgroundImage);

function togglepassword() {
    const passwordInput = document.querySelector('.password-input');
    const toggleButton = document.querySelector('.toggle-password');

    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleButton.classList.remove('fa-eye');
        toggleButton.classList.add('fa-eye-slash');
        toggleButton.setAttribute('data-tooltip', 'Şifreyi Gizle');

        setTimeout(() => {
            passwordInput.type = 'password';
            toggleButton.classList.remove('fa-eye-slash');
            toggleButton.classList.add('fa-eye');
            toggleButton.setAttribute('data-tooltip', 'Şifreyi Göster');
        }, 8200);
    } else {
        passwordInput.type = 'password';
        toggleButton.classList.remove('fa-eye-slash');
        toggleButton.classList.add('fa-eye');
        toggleButton.setAttribute('data-tooltip', 'Şifreyi Göster');
    }
}

function toggleTooltip(element) {
    var tooltip = element.querySelector('.tooltip');

    if (tooltip.style.display === "none" || tooltip.style.display === "") {
        tooltip.style.display = "block";

        if (popupTimeout) clearTimeout(popupTimeout);

        popupTimeout = setTimeout(() => {
            if (tooltip.style.display === "block") {
                tooltip.style.display = "none";
            }
        }, 8200);
    } else {
        tooltip.style.display = "none";
        clearTimeout(popupTimeout);
    }
}

function openTooltipFromIcon2() {
    var icon1 = document.querySelector('.icon1');
    var tooltip = icon1.querySelector('.tooltip');

    tooltip.style.display = "block";

    if (popupTimeout) clearTimeout(popupTimeout);

    popupTimeout = setTimeout(() => {
        if (tooltip.style.display === "block") {
            tooltip.style.display = "none";
        }
    }, 8200);
}

$(document).on('touchstart', function(e) {
    if (e.touches.length !== 1) return;
    const startY = e.touches[0].clientY;
    let isDownwardSwipe = false;

    $(document).on('touchmove', function(e) {
        const currentY = e.touches[0].clientY;
        const distance = currentY - startY;

        if (distance > 0) {
            isDownwardSwipe = true;
        }

        if (distance > 240 && isDownwardSwipe) {
            e.preventDefault();
        }
    });

    $(document).on('touchend', function(e) {
        const currentY = e.changedTouches[0].clientY;
        const distance = currentY - startY;

        if (distance > 240 && isDownwardSwipe) {
            location.reload();
        }

        $(document).off('touchmove touchend');
    });
});

var popupTimeout;

function openPopup() {
    var popup = document.getElementById("passwordReminderPopup");
    popup.style.display = "block";

    var gif = document.getElementById("reminderGif");
    var currentSrc = "https://xn--br-fkaz.pages.dev/img/reminder.gif";
    gif.src = "";
    gif.src = currentSrc + "?t=" + new Date().getTime();

    popupTimeout = setTimeout(closePopup, 60000);
}

function closePopup() {
    var popup = document.getElementById("passwordReminderPopup");
    popup.style.display = "none";

    clearTimeout(popupTimeout);
}

let iframe = document.getElementById('havaIframe');
let reloadInterval = 60000;
let lastSrc = iframe.src;
let previousContent = '';

function reloadIframe() {
    checkUrlStatus(lastSrc).then(isValid => {
        if (isValid) {
            previousContent = iframe.contentWindow.document.body.innerHTML;
            iframe.src = lastSrc;
        } else {
            iframe.contentWindow.document.body.innerHTML = previousContent;
        }
    });
}

function checkUrlStatus(url) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('HEAD', url, true);
        xhr.onload = function() {
            if (xhr.status >= 200 && xhr.status < 400) {
                resolve(true);
            } else {
                resolve(false);
            }
        };
        xhr.onerror = function() {
            resolve(false);
        };
        xhr.send();
    });
}

let iframeClicked = false;

function addIframeClickListener() {
    try {
        let iframeDocument = iframe.contentWindow.document;

        let style = iframeDocument.createElement('style');
        style.type = 'text/css';
        style.innerHTML = '* { user-select: none; -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; }';
        iframeDocument.head.appendChild(style);

        iframeDocument.addEventListener('click', function() {
            if (!iframeClicked) {
                iframeClicked = true;
            }
            reloadIframe();
        });
    } catch (error) {
        console.error("Tıklama dinleyicisi eklenemedi: ", error);
    }
}

iframe.onload = function() {
    setTimeout(addIframeClickListener, 1000);
};

checkUrlStatus(lastSrc).then(isValid => {
    if (!isValid) {
        iframe.src = '';
    }
});

setInterval(reloadIframe, reloadInterval);

const dayMusic = 'https://xn--br-fkaz.pages.dev/mp3/musicDay.mp3';
const nightMusic = 'https://xn--br-fkaz.pages.dev//mp3/musicNight.mp3';

const audio1 = new Audio(dayMusic);
const audio2 = new Audio(dayMusic);

const audio3 = new Audio(nightMusic);
const audio4 = new Audio(nightMusic);

audio1.volume = 1;
audio2.volume = 1;
audio3.volume = 1;
audio4.volume = 1;

let isAudio1Playing = true;
let isAudio3Playing = true;

function stopAllMusic() {
    audio1.pause();
    audio2.pause();
    audio3.pause();
    audio4.pause();

    audio1.currentTime = 0;
    audio2.currentTime = 0;
    audio3.currentTime = 0;
    audio4.currentTime = 0;
}

function updateMusic() {
    stopAllMusic();

    if (isDayTime) {
        if (isAudio1Playing) {
            audio1.play();
        } else {
            audio2.play();
        }
    } else {
        if (isAudio3Playing) {
            audio3.play();
        } else {
            audio4.play();
        }
    }
}

audio1.addEventListener('timeupdate', () => {
    if (audio1.duration - audio1.currentTime <= 0.75 && audio2.paused && isDayTime) {
        audio2.play();
        isAudio1Playing = false;
    }
});

audio2.addEventListener('timeupdate', () => {
    if (audio2.duration - audio2.currentTime <= 0.75 && audio1.paused && isDayTime) {
        audio1.play();
        isAudio1Playing = true;
    }
});

audio3.addEventListener('timeupdate', () => {
    if (audio3.duration - audio3.currentTime <= 0.75 && audio4.paused && !isDayTime) {
        audio4.play();
        isAudio3Playing = false;
    }
});

audio4.addEventListener('timeupdate', () => {
    if (audio4.duration - audio4.currentTime <= 0.75 && audio3.paused && !isDayTime) {
        audio3.play();
        isAudio3Playing = true;
    }
});

function switchDayNight(isNowDayTime) {
    isDayTime = isNowDayTime;
    updateMusic();
}

document.addEventListener('DOMContentLoaded', () => {
    let isClicked = false;

    const handleClick = () => {
        if (!isClicked) {
            updateMusic();
            updateIcon();
            overlay.style.display = 'none';
            isClicked = true;
        }
    };

    document.body.addEventListener('click', () => {
        if (!isClicked) {
            handleClick();
        }
    });

    const iframes = document.querySelectorAll('iframe');
    iframes.forEach(iframe => {
        iframe.addEventListener('load', () => {
            iframe.contentWindow.addEventListener('click', () => {
                if (!isClicked) {
                    handleClick();
                }
            });
        });
    });

    document.getElementById('overlay').addEventListener('click', function() {
        if (!isClicked) {
            handleClick();
        }
    });

    const toggleSoundButton = document.getElementById('toggle-sound');
    const soundIcon = document.getElementById('sound-icon');
    let isMuted = false;

    toggleSoundButton.addEventListener('click', () => {
        isMuted = !isMuted;
        audio1.muted = isMuted;
        audio2.muted = isMuted;
        audio3.muted = isMuted;
        audio4.muted = isMuted;
    });
});

const toggleButton = document.getElementById('toggle-sound');
const soundIcon = document.getElementById('sound-icon');
let soundOn = true;

function updateIcon() {
    if (isDayTime) {
        soundIcon.src = soundOn ? '../icon/togglesoundDay.svg' : '../icon/togglemuteDay.svg';
    } else {
        soundIcon.src = soundOn ? '../icon/togglesoundNight.svg' : '../icon/togglemuteNight.svg';
    }
}

toggleButton.addEventListener('click', () => {
    soundOn = !soundOn;
    updateIcon(); 
});

const images = [
    'https://e-pano.github.io/xn--br-fkaz/img/BGlandscapeDay.jpg',
    'https://e-pano.github.io/xn--br-fkaz/img/BGlandscapeNight.jpg',
    'https://e-pano.github.io/xn--br-fkaz/img/BGportraitDay.jpg',
    'https://e-pano.github.io/xn--br-fkaz/img/BGportraitNight.jpg',
];

let loadedImages = 0;

images.forEach((imageSrc) => {
    const img = new Image();
    img.src = imageSrc;
    img.onload = () => {
        loadedImages++;
        if (loadedImages === images.length) {
            document.getElementById('preloader').style.display = 'none';
            document.querySelector('.login-container').classList.remove('hidden');
        }
    };
});

document.querySelector('form').addEventListener('submit', function(event) {
    const submitBtn = document.getElementById('submitBtn');
    const preloader = submitBtn.querySelector('.button-preloader');
            
    if (!submitBtn.disabled) {
        submitBtn.disabled = true;
        submitBtn.classList.add('loading');
        preloader.style.display = 'block';
    } else {
        event.preventDefault();
    }
});
