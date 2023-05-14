const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
const baseSize = 25;

document.addEventListener("DOMContentLoaded", function () {

	let view;
	if (window.location.href.includes('view=tiles')) {
		view = 'tiles';
	} else {
		view = 'normal';
	}

	if (view !== 'tiles') {
		dragToScrollEnable();
	}

	const videos = document.querySelectorAll('.searchVid');
	let centerVideo = null

	const observer = new IntersectionObserver(entries => {
		entries.forEach(entry => {
			if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
				centerVideo = entry.target;
			}
		});
	}, { threshold: 0.5 });

	videos.forEach((video) => {
		observer.observe(video);

		video.addEventListener('play', () => {
			// Stop other videos from playing
			videos.forEach((v) => {
				if (v !== video) {
					v.pause();
				}
			});
		});

		// Pause video if clicked while playing
		video.addEventListener('click', () => {
			if (!video.paused) {
				video.pause();
			}
		});

		// Maximize video on double click
		video.addEventListener('dblclick', () => {
			if (video.requestFullscreen) {
				video.requestFullscreen();
			}
		});
	});

	window.addEventListener('scroll', () => {
		const windowHeight = window.innerHeight;
		const center = windowHeight / 2;

		videos.forEach(video => {
			const rect = video.getBoundingClientRect();
			const videoTop = rect.top;
			const videoBottom = rect.bottom;
			const videoHeight = rect.height;

			if (videoTop < center && videoBottom > center && videoHeight < windowHeight) {
				centerVideo = video;
			}
		});

		if (centerVideo && centerVideo.paused) {
			centerVideo.play();
		}
	});

	function stopMainScroll() {
		// check if screen layout is landscape
		if (window.matchMedia("(orientation: landscape)").matches) {
			window.addEventListener('wheel', preventDefault, { passive: false });
		}
	}

	function allowMainScroll() {
		window.removeEventListener('wheel', preventDefault);
	}

	function preventDefault(e) {
		e.preventDefault();
	}

	document.addEventListener('keydown', function (event) {
		const focusedElement = document.activeElement;
		if (focusedElement.nodeName === 'INPUT') {
			// console.log('Currently focused element is an input field');
			return
		}

		if (event.key === 'f') {
			goFullscreen()
		}
		if (event.key === '1') {
			showAllImagesAtActualSize();
		}
		if (event.key === '2') {
			showAllImagesStreched();
		}
		if (event.key === '3') {
			showAllImagesAtDefaultScale();
		}
		if (event.key === 's') {
			const shuffleCheckbox = document.getElementById("shuffle");
			shuffleCheckbox.checked = !shuffleCheckbox.checked;
			shuffleToggle();
		}
	});

});

function goFullscreen() {
	const toggleButton = document.getElementById('fullscreenButton');

	const header = document.querySelector('.header');
	const pageButtons = document.querySelector('.pageButtons');

	if (header.style.display === 'none') {
		toggleButton.innerText = '◹'
		header.style.display = 'flex';

		if (pageButtons) {
			pageButtons.style.display = 'block';
		}
		if (isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
			document.documentElement.style.fontSize = "6.15%";
		}
		document.exitFullscreen();

	} else {
		toggleButton.innerText = '◺'
		header.style.display = 'none';

		if (pageButtons) {
			pageButtons.style.display = 'none';
		}
		if (isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
			document.documentElement.style.fontSize = "2.5%";
		}
		document.documentElement.requestFullscreen();
	}
}

function showAtActualScale(index) {
	// window.alert(index);
	let imageid = 'image' + index;
	let image = document.getElementById(imageid);

	let headingDiv = document.querySelector('.headingDiv');

	if (image.style.maxHeight !== 'fit-content') {
		image.style.maxHeight = 'fit-content'
	} else {
		image.style.maxHeight = '99%'
	}
}

function showAllImagesAtActualSize() {
	let resultFiles = document.querySelectorAll('.resultFile');
	// console.log(resultFiles.length);
	resultFiles.forEach(resultFile => {
		resultFile.style.minHeight = '0';
		resultFile.style.maxHeight = 'fit-content';
	});
}

function showAllImagesStreched() {
	let resultFiles = document.querySelectorAll('.resultFile');
	// console.log(resultFiles.length);
	resultFiles.forEach(resultFile => {
		resultFile.style.minHeight = '99%';
		resultFile.style.maxHeight = '99%';
	});
}

function showAllImagesAtDefaultScale() {
	let resultFiles = document.querySelectorAll('.resultFile');
	// console.log(resultFiles.length);
	resultFiles.forEach(resultFile => {
		resultFile.style.minHeight = '75%';
		resultFile.style.maxHeight = '99%';
	});
}

function shuffleToggle() {
	let shuffleCheckbox = document.getElementById('shuffle');
	const currentUrl = window.location.href;

	if (shuffleCheckbox.checked) {
		const newUrl = `${currentUrl}&shuffle=true`;
		window.location.href = newUrl;
	} else {
		const newUrl = currentUrl.replace("&shuffle=true", "").replace("&shuffle=on", "");
		window.location.href = newUrl;
	}
}

function removeImageLinksAndSave() {
	// Get all the img elements on the page
	const images = document.querySelectorAll('.contentLink');

	// Loop through each img element and store its href attribute value in a data attribute
	for (const image of images) {
		if (image.hasAttribute('href')) {
			image.setAttribute('data-original-href', image.getAttribute('href'));
			image.removeAttribute('href');
		}
	}
}

// Return a function to restore the original href attribute values
function restoreImageLinks() {
	const images = document.querySelectorAll('.contentLink');
	// Loop through each img element and restore its href attribute value from the data attribute
	for (const image of images) {
		const originalHref = image.getAttribute('data-original-href');
		if (originalHref) {
			image.setAttribute('href', originalHref);
			image.removeAttribute('data-original-href');
		}
	}
}


function dragToScrollEnable() {
	// console.log('enabling drag to scroll');

	let scrollable = document.querySelector('.results');
	let isDown = false;
	let startX;
	let startY;
	let scrollLeft;
	let scrollTop;

	scrollable.addEventListener('mousedown', function (e) {
		isDown = true;
		startX = e.pageX - scrollable.offsetLeft;
		startY = e.pageY - scrollable.offsetTop;
		scrollLeft = scrollable.scrollLeft;
		scrollTop = scrollable.scrollTop;
	});

	scrollable.addEventListener('mouseleave', function () {
		isDown = false;
	});

	scrollable.addEventListener('mouseup', function () {
		isDown = false;
	});

	scrollable.addEventListener('mousemove', function (e) {
		if (!isDown) return;
		e.preventDefault();
		let x = e.pageX - scrollable.offsetLeft;
		let y = e.pageY - scrollable.offsetTop;
		let walkX = (x - startX) * 2;
		let walkY = (y - startY) * 2;
		scrollable.scrollLeft = scrollLeft - walkX;
		scrollable.scrollTop = scrollTop - walkY;
	});
}

function refreshDB() {

	const refreshDBButton = document.getElementById('refreshDBButton');
	refreshDBButton.classList.add('processing');

	fetch('/refreshDB')
		.then(response => {
			if (response.ok) {
				console.log('Database refreshed successfully');
				refreshDBButton.classList.add('success');
				refreshDBButton.classList.remove('processing');
				refreshDBButton.classList.remove('default');
				setTimeout(() => {
					refreshDBButton.classList.remove('success');
					refreshDBButton.classList.add('default');
				}, 3000);
			} else {
				refreshDBButton.classList.add('error');
				refreshDBButton.classList.remove('default');
				refreshDBButton.classList.remove('processing');
				setTimeout(() => {
					refreshDBButton.classList.remove('error');
					refreshDBButton.classList.add('default');
				}, 3000);
				throw new Error('Error refreshing database');
			}
		})
		.catch(error => {
			console.error(error);
		});
}

function switchToTileView() {
	// this code used to preserve the set of random images that were being viewed
	// now it will reload a new set from server because this was slow due to client js processing

	// const switchToTileViewButton = document.getElementById('switchToTileViewButton');
	// switchToTileViewButton.classList.add('processing')

	// const stylesheet = document.getElementById("stylesheet");
	// stylesheet.href = "/css/search-results-tiles.css";

	// const ielements = document.querySelectorAll('i');
	// const resultDivs = document.querySelectorAll('.result');

	// resultDivs.forEach(result => {
	// 	const width = parseFloat(result.getAttribute('data-width'));

	// 	result.style.width = `${width}rem`;
	// 	result.style.flexGrow = width;
	// });

	// ielements.forEach(ielement => {
	// 	const padding = parseFloat(ielement.getAttribute('data-padding'));
	// 	ielement.style.paddingBottom = `${padding}%`;
	// });

	const currenturl = document.location.href;
	if (!currenturl.includes('view=tiles')) {
		window.location.href += '&view=tiles'
	}
}

function changeTileSize() {
	const slider = document.getElementById('slider');
	const results = document.querySelectorAll('.result');

	// Get the current slider value
	// 'this' refers to the calling element
	const multiplier = parseFloat(slider.value);

	// Loop over all the result elements
	results.forEach(result => {
		// Get the current width and flex-grow values
		const defaultWidth = parseFloat(result.getAttribute('data-width'));

		// Calculate the new width and flex-grow values based on the multiplier
		const newWidth = defaultWidth * multiplier;

		// Set the new values on the element's style
		result.style.width = `${newWidth}rem`;
		result.style.flexGrow = newWidth;
	});
}

// set page to 1 on every page load
let currentPage = 1;
const results = document.querySelector('.results')
let isLoading = false;

window.addEventListener('scroll', () => {
	const scrollPosition = window.scrollY;
	const documentHeight = document.documentElement.scrollHeight;
	const viewportHeight = window.innerHeight;
	if (!isLoading && window.location.href.includes('view=tiles') && scrollPosition >= documentHeight - (viewportHeight * 2)) {
		isLoading = true;
		currentPage++;
		// console.log('getting next results, page: ' + currentPage);
		fetch(`/getNextResults?page=${currentPage}`)
			.then(response => response.json())
			.then(data => {
				appendResults(data.images);
				if (currentPage > data.totalPages) {
					// console.log('no more results');
				}
			})
			.catch(error => {
				console.error(`Error loading more results: ${error}`);
				// handle the error appropriately
			})
			.finally(() => {
				isLoading = false;
			});

	}
});

// function to append image data to the result container
function appendResults(images) {
	for (const image of images) {
		const resultElement = createResultElement(image);
		// console.log(image);
		results.appendChild(resultElement);
	}
}

// function to create an image element from the image data
function createResultElement(image) {
	const baseName = image.baseName;
	const path = image.path;
	const directory = image.directory;
	const trueWidth = parseFloat(image.width);
	const trueHeight = parseFloat(image.height);
	const type = image.type;

	const width = trueWidth * baseSize / trueHeight;

	const imageLinkEscaped = encodeURIComponent(path);
	const view = 'tiles';

	const containerDiv = document.createElement("div");
	containerDiv.classList.add("result");
	containerDiv.title = `${baseName}\n${directory}`;
	containerDiv.setAttribute("data-width", width);
	containerDiv.style.width = `${width}rem`;
	containerDiv.style.flexGrow = width;

	const padding = trueHeight / trueWidth * 100;

	const imageDiv = document.createElement("i");
	imageDiv.setAttribute("data-padding", padding);
	imageDiv.style.paddingBottom = `${padding}%`;
	containerDiv.appendChild(imageDiv);

	const imageSidebarDiv = document.createElement("div");
	imageSidebarDiv.classList.add("imageSidebar");
	containerDiv.appendChild(imageSidebarDiv);

	const infoDiv = document.createElement("div");
	infoDiv.classList.add("infoDiv");
	imageSidebarDiv.appendChild(infoDiv);

	const similarImageLink = encodeURIComponent(
		baseName
			.replace(/\.[^/.]+$/, "")
			.replace(/\d+$/, "")
			.replace(/\(\d*\)|\d+$/g, "")
			.trim()
	);
	const imageTitleLink = document.createElement("a");
	imageTitleLink.classList.add("imageTitle");
	imageTitleLink.href = `/search?searchText=${similarImageLink}&view=${view}`;
	imageTitleLink.textContent = baseName;
	infoDiv.appendChild(imageTitleLink);

	const folderlink = encodeURIComponent(directory);
	const subTitleLink = document.createElement("a");
	subTitleLink.classList.add("subTitle");
	subTitleLink.href = `/search?searchText=${folderlink}&view=${view}`;
	subTitleLink.textContent = directory;
	infoDiv.appendChild(subTitleLink);

	const mainContentDiv = document.createElement("div");
	mainContentDiv.classList.add("mainContent");
	containerDiv.appendChild(mainContentDiv);

	const contentLink = document.createElement("a");
	contentLink.setAttribute("data-href", `/?imageBackLink=${imageLinkEscaped}`);
	contentLink.ondblclick = function () {
		location.href = `/singleView?imageBackLink=${imageLinkEscaped}`;
	};
	mainContentDiv.appendChild(contentLink);

	if (type === "image") {
		const imageElement = document.createElement("img");
		imageElement.classList.add("searchImg");
		imageElement.classList.add("resultFile");
		// imageElement.id = `image${index}`;  not getting index from API
		imageElement.src = imageLinkEscaped;
		contentLink.appendChild(imageElement);
	} else {
		const videoElement = document.createElement("video");
		videoElement.classList.add("searchVid");
		videoElement.classList.add("resultFile");
		// videoElement.id = `image${index}`;
		videoElement.src = imageLinkEscaped;
		videoElement.controls = true;
		videoElement.loop = true;
		contentLink.appendChild(videoElement);
	}

	return containerDiv;
}
