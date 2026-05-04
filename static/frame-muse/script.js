let currentIndex = 0;
let uiVisible = true;

const photos = Array.from(document.querySelectorAll('.photo-item'));
const lightbox = document.getElementById('lightbox');
const lightboxCaption = document.querySelector('.lightbox-caption');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxTitle = document.getElementById('lightbox-title');
const lightboxDesc = document.getElementById('lightbox-desc');

function updateLightboxContent() {
  const photo = photos[currentIndex];
  if (!photo) {
    return;
  }

  const img = photo.querySelector('img');
  const title = photo.querySelector('h4');
  const desc = photo.querySelector('p');

  lightboxImg.src = img ? img.src : '';
  lightboxImg.alt = img ? img.alt : '';
  lightboxTitle.innerText = title ? title.innerText : '';
  lightboxDesc.innerText = desc ? desc.innerText : '';
}

function openLightbox(index) {
  if (!lightbox || photos.length === 0) {
    return;
  }

  currentIndex = index;
  updateLightboxContent();
  lightbox.classList.add('active');
  uiVisible = true;
  lightbox.classList.remove('hide-ui');
  if (lightboxCaption) lightboxCaption.removeAttribute('aria-hidden');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  if (!lightbox) {
    return;
  }

  lightbox.classList.remove('active');
  if (lightboxCaption) lightboxCaption.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

function changeImage(direction) {
  if (photos.length === 0) {
    return;
  }

  currentIndex += direction;
  if (currentIndex >= photos.length) {
    currentIndex = 0;
  } else if (currentIndex < 0) {
    currentIndex = photos.length - 1;
  }

  updateLightboxContent();
}

if (photos.length > 0) {
  photos.forEach((photo, index) => {
    photo.addEventListener('click', () => openLightbox(index));
  });
}

if (lightbox) {
  lightbox.addEventListener('click', (e) => {
    if (
      e.target.classList.contains('lightbox-nav') ||
      e.target.classList.contains('lightbox-close') ||
      e.target.closest('.lightbox-nav') ||
      e.target.closest('.lightbox-close')
    ) {
      return;
    }

    if (e.target === lightbox) {
      closeLightbox();
      return;
    }

    uiVisible = !uiVisible;
    if (uiVisible) {
      lightbox.classList.remove('hide-ui');
    } else {
      lightbox.classList.add('hide-ui');
    }
  });

  let touchStartX = 0;
  let touchEndX = 0;

  lightbox.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  });

  lightbox.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const swipeThreshold = 50;
    if (touchEndX < touchStartX - swipeThreshold) {
      changeImage(1);
    }
    if (touchEndX > touchStartX + swipeThreshold) {
      changeImage(-1);
    }
  });
}

document.addEventListener('keydown', (e) => {
  if (!lightbox || !lightbox.classList.contains('active')) {
    return;
  }

  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') changeImage(-1);
  if (e.key === 'ArrowRight') changeImage(1);
});

window.frameMuseLightbox = {
  closeLightbox,
  changeImage,
};

// Caption interactions: swipe to navigate on touch.
if (lightboxCaption) {
  let captionTouchStartX = 0;
  let captionTouchEndX = 0;

  lightboxCaption.addEventListener('touchstart', (e) => {
    captionTouchStartX = e.changedTouches[0].screenX;
  });

  lightboxCaption.addEventListener('touchend', (e) => {
    captionTouchEndX = e.changedTouches[0].screenX;
    const swipeThreshold = 50;
    if (captionTouchEndX < captionTouchStartX - swipeThreshold) {
      changeImage(1);
    }
    if (captionTouchEndX > captionTouchStartX + swipeThreshold) {
      changeImage(-1);
    }
  });
}
