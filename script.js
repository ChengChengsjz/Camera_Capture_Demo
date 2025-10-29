const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const startBtn = document.getElementById('start');
const captureBtn = document.getElementById('capture');
const nextCameraBtn = document.getElementById('nextCamera');

let currentStream = null; // 当前视频流
let devices = [];         // 摄像头列表
let currentIndex = 0;     // 当前使用摄像头索引

// ==================== 抓拍功能：canvas 自适应 video 原始大小 ====================
captureBtn.addEventListener('click', () => {
  // 将 canvas 尺寸设置为视频原始分辨率
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
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
