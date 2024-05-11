const slide0 = document.getElementById('slide0');
const slide1 = document.getElementById('slide1');
const prev = document.getElementById('prev');
const next = document.getElementById('next');
const indicator = document.getElementById('indicator');
const lists = document.querySelectorAll('.list');
const totalSlides = lists.length;
let count = 0;
let autoPlayInterval;

function updateListBackground() {
  //if count > 2   count - 2
  for (let i = 0; i < lists.length; i++) {
    lists[i].style.backgroundColor = i === count % totalSlides ? '#000' : '#fff';
  }
}

function nextClick() {
  slide0.classList.remove(`slide0${count % (totalSlides * 2) + 1}`);
  slide1.classList.remove(`slide1${count % (totalSlides * 2) + 1}`);
  count++;
  slide0.classList.add(`slide0${count % (totalSlides * 2) + 1}`);
  slide1.classList.add(`slide1${count % (totalSlides * 2) + 1}`);
  updateListBackground();
}
function prevClick() {
  slide0.classList.remove(`slide0${count % (totalSlides * 2) + 1}`);
  slide1.classList.remove(`slide1${count % (totalSlides * 2) + 1}`);
  count--;
  if (count < 0) count = totalSlides * 2 - 1;
  slide0.classList.add(`slide0${count % (totalSlides * 2) + 1}`);
  slide1.classList.add(`slide1${count % (totalSlides * 2) + 1}`);
  updateListBackground();
}

function startAutoPlay() {
  autoPlayInterval = setInterval(nextClick, 3000);
}

function resetAutoPlayInterval() {
  clearInterval(autoPlayInterval);
  startAutoPlay();
}

next.addEventListener('click', () => {
  nextClick();
  resetAutoPlayInterval();
});
prev.addEventListener('click', () => {
  prevClick();
  resetAutoPlayInterval();
});



startAutoPlay();
