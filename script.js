const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const startBtn = document.getElementById('start');
const captureBtn = document.getElementById('capture');
const nextCameraBtn = document.getElementById('nextCamera');

let currentStream = null; // 当前视频流
let devices = [];         // 摄像头列表
let currentIndex = 0;     // 当前使用摄像头索引

// ==================== 原来的抓拍功能 ====================
captureBtn.addEventListener('click', () => {
  const ctx = canvas.getContext('2d');

  // 计算缩放保持比例（letterbox方式）
  const vw = video.videoWidth;
  const vh = video.videoHeight;
  const cw = canvas.width;
  const ch = canvas.height;

  const scale = Math.min(cw / vw, ch / vh);
  const w = vw * scale;
  const h = vh * scale;
  const x = (cw - w) / 2;
  const y = (ch - h) / 2;

  ctx.clearRect(0, 0, cw, ch);
  ctx.drawImage(video, x, y, w, h);
});

// ==================== 获取摄像头列表 ====================
async function getCameraDevices() {
  const allDevices = await navigator.mediaDevices.enumerateDevices();
  devices = allDevices.filter(d => d.kind === 'videoinput');
}

// ==================== 打开指定摄像头 ====================
async function openCamera(index) {
  if (currentStream) {
    currentStream.getTracks().forEach(track => track.stop());
  }

  const deviceId = devices[index]?.deviceId;
  if (!deviceId) return alert('没有可用摄像头');

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { deviceId: { exact: deviceId } }
    });
    video.srcObject = stream;
    currentStream = stream;
  } catch (err) {
    console.error('无法访问摄像头', err);
    alert('无法访问摄像头');
  }
}

// ==================== 开启摄像头按钮 ====================
startBtn.addEventListener('click', async () => {
  await getCameraDevices();
  if (devices.length === 0) return alert('没有检测到摄像头');
  currentIndex = 0;
  openCamera(currentIndex);
});

// ==================== 切换下一个摄像头按钮 ====================
nextCameraBtn.addEventListener('click', () => {
  if (devices.length <= 1) return; // 只有一个摄像头无需切换
  currentIndex = (currentIndex + 1) % devices.length;
  openCamera(currentIndex);
});
