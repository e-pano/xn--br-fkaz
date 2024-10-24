var encodedUrl = document.getElementById('ePano').getAttribute('PDF');
if (encodedUrl) {
    var URL = "https://docs.google.com/viewer?url=" + decodeURIComponent(atob(encodedUrl)) + "&embedded=true";
}

const modifiedTime = new Date();
var count = 0;
var interval;
var percentageInterval;
var hideTimeout;
var backgroundImageUrl;
var lastProgress = 0;

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
    var isPortrait = window.innerHeight > window.innerWidth;
    const imgPath = "img/";
    const weekOfYear = getWeekOfYear(now);
    const weekIndex = (weekOfYear - 1) % daylightHours.length;
    const { start, end } = daylightHours[weekIndex];

    if (currentMinutes >= start && currentMinutes < end) {
        backgroundImageUrl = isPortrait ? imgPath + "BGportraitDay.jpg" : imgPath + "BGlandscapeDay.jpg";
    } else {
        backgroundImageUrl = isPortrait ? imgPath + "BGportraitNight.jpg" : imgPath + "BGlandscapeNight.jpg";
    }

    $('body').css('background-image', `url(${backgroundImageUrl})`);
    $('body').css('background-size', 'cover');
    $('body').css('background-position', 'bottom');
}

	function updateProgress() {
		var progressText = document.getElementById('progressText');
		var progress;

		if (count === 0) {
			progress = 0;
		} else if (count === 1) {
			progress = Math.floor(Math.random() * (50 - 30 + 1)) + 30;
		} else if (count === 2) {
			progress = Math.floor(Math.random() * (60 - 51 + 1)) + 51;
		} else if (count === 3) {
			progress = Math.floor(Math.random() * (70 - 61 + 1)) + 61;
		} else if (count === 4) {
			progress = Math.floor(Math.random() * (80 - 71 + 1)) + 71;
		} else if (count === 5) {
			progress = Math.floor(Math.random() * (85 - 81 + 1)) + 81;
		} else if (count === 6) {
			progress = Math.floor(Math.random() * (90 - 86 + 1)) + 86;
		} else if (count === 7) {
			progress = Math.floor(Math.random() * (93 - 91 + 1)) + 91;
		} else if (count === 8) {
			progress = 94;
		} else if (count === 9) {
			progress = 95;
		} else if (count === 10) {
			progress = 96;
		} else if (count === 11) {
			progress = 97;
		} else if (count === 12) {
			progress = 98;
		} else {
			progress = 99;
		}

		if (progress < lastProgress) {
			progress = lastProgress;
		} else {
			lastProgress = progress;
		}

		progressText.innerHTML = `
			<div style="font-size: 30px; line-height: 1.2;">
				<span style="cursor: default; font-weight: 900; text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);">BÖRÜ</span>
				<span style="cursor: default; font-weight: 300; text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);"> APARTMANI</span>
			</div>
			<div style="cursor: default; font-size: 21px; font-weight: 500; line-height: 1.2; text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);">e-Pano Yükleniyor...</div>
			<div style="cursor: default; font-size: 60px; font-weight: 300; line-height: 1; text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5); display: inline-flex; align-items: center;"><span style="font-size: 25px; margin-right: 4px;">%</span>${progress}</div>
		`;

		if (progress === 100) {
			clearInterval(interval);
			clearInterval(percentageInterval);
			$('#preloader').hide();
			$('#menuIcon').css({
				'opacity': 1,
				'pointer-events': 'auto' 
			});
			setTimeout(() => {
				if (!$('#dropdownMenu').hasClass('active') && !$('#feedbackDiv').is(':visible')) {
					$('#menuIcon').css('opacity', 0.12);
				}
			}, 4100); 
		}
	}

	function showPreloader() {
		$('#preloader').show(); 
		$('#iframeContainer').append(`<iframe id="myIframe" src="${URL}" style="width:100%; height:100%;" frameborder="0" allowfullscreen=""></iframe>`);
		$('#myIframe').on('load', function() { 
			clearInterval(interval);
			clearInterval(percentageInterval);
			updateProgress();
			$('#preloader').hide();
			$('#myIframe').show();
			$('#menuIcon').show();
			$('#menuIcon').css({
				'opacity': 1,
				'pointer-events': 'auto'
			});

			$('body').css('background-image', 'none');

			var delay = 8200;
			setTimeout(() => {
				if (!$('#dropdownMenu').hasClass('active') && !$('#feedbackDiv').is(':visible')) {
					$('#menuIcon').css('opacity', 0.12);
				}
			}, delay);
		});
	}

	function startProgress() {
		percentageInterval = setInterval(updateProgress, 750);
		interval = setInterval(function() {
			count++;
			if ($('#myIframe').length) {
				$('#myIframe').remove();
				showPreloader();
			} else {
				showPreloader();
			}
		}, 3000);
		updateProgress();
	}

	$(document).ready(function() {
		$('#menuIcon').css('opacity', 0);
		setBackgroundImage();
		showPreloader();
		startProgress();

		$(window).on('load', function() {
		});

		$(window).on('resize', function() {
			setBackgroundImage();
		});

		let fadeOutTimeout;
		$('#menuIcon').on('mouseenter', function() {
			clearTimeout(fadeOutTimeout);
			$('#menuIcon').css('opacity', 1);
		}).on('mouseleave', function() {
			if (!$('#dropdownMenu').hasClass('active')) {
				const fixedDelay = 4100;
				fadeOutTimeout = setTimeout(function() {
					$('#menuIcon').css('opacity', 0.12);
				}, fixedDelay);
			}
		});

		let opacityTimeout;

		$('#menuIcon').on('click', function() {
			$('#dropdownMenu').toggle();
			$('#dropdownMenu').toggleClass('active');
			$(this).toggleClass('active');

			if ($('#dropdownMenu').hasClass('active')) {
				$('#menuIcon').css('opacity', 1);
				$('#dropdownMenu').css('pointer-events', 'auto');

				clearTimeout(opacityTimeout);
			} else {
				$('#menuIcon').css('opacity', 1);
				$('#dropdownMenu').css('pointer-events', 'none');
				$('#feedbackDiv').hide();
				$('#aidatDiv').hide();

				opacityTimeout = setTimeout(function() {
					$('#menuIcon').css('opacity', 0.12);
				}, 4100);
			}
		});

		$('#aidatItem').on('click', function() {
			$('#dropdownMenu').hide();
			$('#aidatDiv').show();
			$('#menuIcon').css('opacity', 1);
			$('#dropdownMenu').css('pointer-events', 'none');
		});

		$('#feedbackItem').on('click', function() {
			$('#dropdownMenu').hide();
			$('#feedbackDiv').show();
			$('#menuIcon').css('opacity', 1);
			$('#dropdownMenu').css('pointer-events', 'none');
		});

		$('#menuIcon').on('click', function() {
			if ($('#dropdownMenu').is(':hidden')) {
				$('#dropdownMenu').show();
			}
		});
	});

	document.addEventListener('DOMContentLoaded', function() {
		const submitButton = document.querySelector('input[type="submit"]');

		submitButton.addEventListener('click', function() {
			this.classList.add('clicked');

			setTimeout(() => {
				this.classList.remove('clicked');
			}, 500);
		});
	});

	document.addEventListener('DOMContentLoaded', function() {
		const subjectSelect = document.getElementById('subjectSelect');
		const selected = subjectSelect.querySelector('.select-selected');
		const options = subjectSelect.querySelector('.select-items');
		const message = document.getElementById('message');
		const nameInput = document.getElementById('name');
		const form = document.getElementById('feedbackForm');
		const subjectWarning = document.getElementById('subjectWarning');
		const messageWarning = document.getElementById('messageWarning');
		const shortMessageWarning = document.getElementById('shortMessageWarning');
		const nameWarning = document.getElementById('nameWarning');
		const successMessage = document.getElementById('successMessage');
		const submitButton = form.querySelector('button[type="submit"]');

		function hideSuccessMessage() {
			successMessage.style.display = 'none';
		}

		const elementsToMonitor = [nameInput, message, selected];
		elementsToMonitor.forEach(element => {
			element.addEventListener('input', hideSuccessMessage);
			element.addEventListener('click', hideSuccessMessage);
		});

		selected.addEventListener('click', function(e) {
			e.stopPropagation();
			options.style.display = options.style.display === 'block' ? 'none' : 'block';
		});

		options.querySelectorAll('div').forEach(option => {
			option.addEventListener('click', function() {
				selected.querySelector('span').textContent = this.textContent;
				selected.dataset.value = this.dataset.value;
				options.style.display = 'none';
				subjectWarning.style.display = 'none';
			});
		});

		document.addEventListener('click', function(e) {
			if (!subjectSelect.contains(e.target)) {
				options.style.display = 'none';
			}
		});

		function setupPlaceholder(input, placeholder) {
			input.addEventListener('focus', function() {
				if (input.value === placeholder) {
					input.value = '';
				}
			});

			input.addEventListener('blur', function() {
				if (input.value.trim() === '') {
					input.value = placeholder;
				}
			});
		}

		setupPlaceholder(message, 'Mesajınız');
		setupPlaceholder(nameInput, 'Adınız Soyadınız');

		form.addEventListener('submit', function(e) {
			let valid = true;

			if (!selected.dataset.value) {
				subjectWarning.style.display = 'block';
				valid = false;
			}

			const nameValue = nameInput.value.trim();
			const namePattern = /^[A-Za-zÜĞIÖÇŞüğıöçş\s.]+$/;

			nameWarning.style.display = 'none';

			if (nameValue === '' || nameValue === 'Adınız Soyadınız') {
				nameWarning.textContent = '* Ad soyad alanı boş olamaz!';
				nameWarning.style.display = 'block';
				valid = false;
			} else if (nameValue.length < 6 || (nameValue.match(/\s/g) || []).length < 1 || (nameValue.match(/\s/g) || []).length > 3 || !namePattern.test(nameValue)) {
				nameWarning.textContent = '* Lütfen adınızı soyadınızı yazınız!';
				nameWarning.style.display = 'block';
				valid = false;
			}

			if (!message.value.trim() || message.value === 'Mesajınız') {
				messageWarning.style.display = 'block';
				shortMessageWarning.style.display = 'none';
				valid = false;
			} else if (message.value.length < 10 || message.value.length > 4096) {
				shortMessageWarning.style.display = 'block';
				messageWarning.style.display = 'none';
				valid = false;
			} else {
				messageWarning.style.display = 'none';
				shortMessageWarning.style.display = 'none';
			}

			if (valid) {
				const subject = selected.dataset.value;
				const email = `emrekaramannn@gmail.com`;
				const body = `${message.value}\n\n${nameValue}`;
				window.location.href = `mailto:${email}?subject=Börü Apartmanı (${subject})&body=${encodeURIComponent(body)}`;
				e.preventDefault();
				
				successMessage.style.display = 'block';

				nameInput.value = '';
				message.value = '';
				selected.querySelector('span').textContent = 'Konu Seçiniz';
				selected.dataset.value = '';
				subjectWarning.style.display = 'none';
				nameWarning.style.display = 'none';
				messageWarning.style.display = 'none';
				shortMessageWarning.style.display = 'none';
				
			} else {
				e.preventDefault();
				showErrorMessages();
			}
		});

		function showErrorMessages() {
			if (!selected.dataset.value) {
				subjectWarning.style.display = 'block';
			}
			if (nameInput.value.trim() === '' || nameInput.value === 'Adınız Soyadınız') {
				nameWarning.textContent = '* Ad soyad alanı boş olamaz!';
				nameWarning.style.display = 'block';
			}
			if (!message.value.trim() || message.value === 'Mesajınız') {
				messageWarning.style.display = 'block';
			} else if (message.value.length < 10 || message.value.length > 4096) {
				shortMessageWarning.style.display = 'block';
			}
		}

		[nameInput, message, selected].forEach(input => {
			input.addEventListener('input', function() {
				subjectWarning.style.display = 'none';
				nameWarning.style.display = 'none';
				messageWarning.style.display = 'none';
				shortMessageWarning.style.display = 'none';
			});
		});

		if (message.value.trim() === '') {
			message.value = 'Mesajınız';
		}
		if (nameInput.value.trim() === '') {
			nameInput.value = 'Adınız Soyadınız';
		}
	});

		document.getElementById("katItem").onclick = function() {
			document.getElementById("katModal").style.display = "block";
		};

		function close2Modal() {
			document.getElementById("katModal").style.display = "none";
		}

		document.getElementById("eczaneItem").onclick = function() {
			document.getElementById("eczaneModal").style.display = "block";
		};

		function closeModal() {
			document.getElementById("eczaneModal").style.display = "none";
		}

	const daireSelect = document.getElementById("daireSelect");
	const selectItems = document.querySelector(".daire-select-items");
	const daire = document.getElementById("daire");
	const daireWarning = document.getElementById("daireWarning");
	const daireForm = document.getElementById("aidatForm");
	const messageContainer = document.getElementById("messageContainer");
	const sorgulaButton = document.getElementById("sorgula");

	document.getElementById("messageContainer").style.display = "block";

	daireSelect.addEventListener("change", function() {
		messageContainer.innerHTML = "";
		messageContainer.style.display = "none";
		daireWarning.style.display = "none";
	});

	daireSelect.addEventListener("click", function(event) {
		event.stopPropagation();
		selectItems.style.display = selectItems.style.display === "none" || selectItems.style.display === "" ? "block" : "none";
	});

	selectItems.addEventListener("click", function(event) {
		const target = event.target;
		if (target.getAttribute("data-value")) {
			daire.textContent = target.getAttribute("data-value");
			daireWarning.style.display = "none"; 
			messageContainer.innerHTML = "";
			messageContainer.style.display = "none";
		}
	});

	document.addEventListener("click", function(event) {
		if (!daireSelect.contains(event.target)) {
			selectItems.style.display = "none";
		}
	});

	daireForm.addEventListener("submit", function(event) {
		sorgulaButton.classList.add('clicked');
		setTimeout(() => {
			sorgulaButton.classList.remove('clicked');
		}, 500);

		let denemeSayisi = localStorage.getItem('denemeSayisi') || 0;
		let sonDenemeZamani = localStorage.getItem('sonDenemeZamani') || 0;
		let simdikiZaman = new Date().getTime();

		if (denemeSayisi >= 3 && simdikiZaman - sonDenemeZamani < 30000) {
			event.preventDefault();
			messageContainer.innerHTML = "<span style='color: #ff4c4c;'>Kısa sürede çok fazla sorgulama yaptınız!<br>Lütfen 1 dakika sonra tekrar deneyiniz.</span>";
			messageContainer.style.display = "block";
			return;
		}

		if (denemeSayisi >= 3 && simdikiZaman - sonDenemeZamani < 60000) {
			event.preventDefault();
			messageContainer.innerHTML = "<span style='color: #ff4c4c;'>Kısa sürede çok fazla sorgulama yaptınız!<br>Lütfen 1 dakika sonra tekrar deneyiniz.</span>";
			messageContainer.style.display = "block";
			return;
		}

		if (simdikiZaman - sonDenemeZamani >= 60000) {
			denemeSayisi = 0;
		}

		if (daire.textContent === "Daire Seçiniz") {
			event.preventDefault();
			daireWarning.style.display = "block";
		} else {
			event.preventDefault();

			denemeSayisi++;
			localStorage.setItem('denemeSayisi', denemeSayisi);
			localStorage.setItem('sonDenemeZamani', simdikiZaman);

			const selectedDaire = daire.textContent;
			let dotCount = 0;
			const loadingMessage = "<span style='color: #c4c7c5;'>Veriler tablodan alınıyor, lütfen bekleyiniz</span>";
			messageContainer.innerHTML = loadingMessage + "...";
			messageContainer.style.display = "block";
			const dotsInterval = setInterval(() => {
				dotCount = (dotCount + 1) % 4;
				messageContainer.innerHTML = loadingMessage + ".".repeat(dotCount);
			}, 500);

			fetch('login/aidat.php', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ daire: selectedDaire }),
			})
			.then(response => {
				if (!response.ok) throw new Error("Sunucudan yanıt alınamıyor! Lütfen daha sonra tekrar deneyiniz.");
				return response.text();
			})
			.then(data => {
				clearInterval(dotsInterval);
				messageContainer.innerHTML = data;
				messageContainer.style.display = "block";
				daireWarning.style.display = "none";
				selectItems.style.display = "none";
			})
			.catch(error => {
				clearInterval(dotsInterval);
				console.error('Error:', error);
				messageContainer.innerHTML = "<span style='color: #ff4c4c;'>Lütfen internet bağlantısınızı kontrol ediniz!</span>";
				messageContainer.style.display = "block";
			});
		}
	});

        let logoutClicked = false;
    
        function logout() {
            if (!logoutClicked) {
                logoutClicked = true;
                window.location.href = 'index.php?logout=true';
            }
        }

		function ePano(PDF) {
			fetch('login/encode.php?url=' + encodeURIComponent(PDF))
				.then(response => response.text())
				.then(openPDF => {
					window.open(openPDF, '_blank');
				})
				.catch(error => console.error('Hata:', error));
		}
