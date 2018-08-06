let menu = document.querySelector('.menu');
let menuItems = [...document.querySelectorAll('.menu-item')];
let controlBtn = document.querySelector('.control-btn');
let controlBtnImg = document.querySelector('.control-btn-img');
let audioName = document.querySelector('.audio-name');
let audioPlayer = document.querySelector('#audioPlayer');

menu.addEventListener('dblclick', function (e) {
  let target = e.target;
  let name = target.innerText;
  menuItems.map((item) => {
    item.classList.remove('menu-item-selected');
  });
  target.classList.add('menu-item-selected');
  audioPlayer.src = `audio/${name}.mp3`;
  audioName.innerText = name;
  audioName.title = name;
  reset.click();
  controlBtn.click();
});

controlBtn.addEventListener('click', function (e) {
  if (audioPlayer.paused) {
    audioPlayer.play();
    controlBtnImg.src = 'images/pause.png';
  } else {
    audioPlayer.pause();
    controlBtnImg.src = 'images/play.png';
  }
});

let progressLength = document.querySelector('.progress-length');
let position = document.querySelector('.position');
function formatTime (number) {
  number = Math.round(number);
  let minute = Math.floor(number / 60);
  let second = Math.round(number % 60);
  minute = minute < 10 ? `0${minute}` : minute;
  second = second < 10 ? `0${second}` : second;
  return `${minute}:${second}`;
}
audioPlayer.addEventListener('timeupdate', function (e) {
  position.innerText = formatTime(this.currentTime);
  let length = (this.currentTime / this.duration) * 100 + '%';
  progressLength.style.width = length;
});

let total = document.querySelector('.total');
audioPlayer.addEventListener('durationchange', function (e) {
  total.innerText = formatTime(this.duration);
});

audioPlayer.addEventListener('ended', function (e) {
  controlBtnImg.src = 'images/play.png';
});

let progressBar = document.querySelector('.progress-bar');
let progressBarDefaultStyleWidth = 500;
progressBar.addEventListener('click', function (e) {
  let mouseLeft = e.pageX;
  let barLeft = this.getBoundingClientRect().left;
  let newCurrentTime = ((mouseLeft - barLeft) / progressBarDefaultStyleWidth) * audioPlayer.duration;
  audioPlayer.currentTime = newCurrentTime;
});

let audioSliceArray = [];
let vernier = document.querySelector('vernier');
putFlag.addEventListener('click', function (e) {
  if (audioPlayer.paused) {
    alert("当前没有播放音频，无法插入划分点");
    return;
  }
  insertFlag();
});
function insertFlag () {
  let newFlag = document.createElement('div');
  let currentTime = audioPlayer.currentTime;
  newFlag.className = 'flag';
  newFlag.style.left = progressLength.style.width;
  newFlag.setAttribute('value', `${currentTime}s`);
  let newItem = {
    time: currentTime,
    flag: newFlag
  };
  audioSliceArray.push(newItem);
  progressBar.appendChild(newFlag);
}

let reset = document.querySelector('#reset');
reset.addEventListener('click', function (e) {
  if (audioSliceArray.length === 0) {
    return;
  }
  audioSliceArray.map(item => {
    progressBar.removeChild(item.flag);
  });
  audioSliceArray = [];
  console.log('重置成功');
});

let commit = document.querySelector('#commit');
commit.addEventListener('click', function (e) {
  if (audioSliceArray.length === 0) {
    alert('当前未插入划分点，请插入至少一个划分点后提交');
    return;
  }
  let data = [];
  for (let item of audioSliceArray) {
    data.push(item.time);
  }
  data.sort((x, y) => x - y);
  console.log(data);
  alert('提交成功，请按F12打开操作台查看提交结果');
})
