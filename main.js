const FILE_URL  = "./assets/sample_01.png";
const MODEL_URL = "./weights";

let canvas, context, video;

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));


window.onload = (event)=>{
	console.log("onload!");
	loadModels();
}

async function loadModels(){
	console.log("loadModels");
	Promise.all([
		faceapi.loadSsdMobilenetv1Model(MODEL_URL),
		faceapi.loadFaceLandmarkModel(MODEL_URL),
		faceapi.loadFaceRecognitionModel(MODEL_URL),
    faceapi.loadFaceLandmarkTinyModel(MODEL_URL),
    faceapi.loadTinyFaceDetectorModel(MODEL_URL),
	]).then(loop);
}


async function loop() {
  if(!document.querySelector('video')) {
    await sleep(500);
  }
  await sleep(1000);

  // setup
  video = document.querySelector('video');
  canvas = document.getElementById("myCanvas");
	canvas.width = video.width;
	canvas.height = video.height;
	context = canvas.getContext("2d");
  // context.globalAlpha = 0.5;

  await detectSingleFace();
}

async function detectSingleFace(){
  const detection = await faceapi.detectSingleFace(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks(true)
  console.log(detection);
  if(detection && detection.detection) {
    drawResult(detection);
    setTimeout(async () => {await detectSingleFace()}, 10);
  } else {
    setTimeout(async () => {await detectSingleFace()}, 300);
  }  
}

function drawResult(data){
	const det = data.detection;
	const mrks = data.landmarks.positions;
	const box = det.box;
  context.clearRect(0, 0, canvas.width, canvas.height);

  context.fillStyle = "blue";
	context.fillRect(box.x, box.y - 60, box.width, box.height + 60);

	context.fillStyle = "red";
	context.strokeStyle = "red";
	context.lineWidth = 4;
	context.strokeRect(box.x, box.y, box.width, box.height);

	drawLandmarks(mrks);
	drawNose(mrks);
	// drawGrasses(mrks);
}

function drawLandmarks(mrks){
	for(let i=0; i<mrks.length; i++){
		let x = mrks[i].x;
		let y = mrks[i].y;
		context.fillRect(x, y, 2, 2);
		context.fillText(i, x, y, 18);
	}
}

function drawNose(mrks){
	context.strokeStyle = "red";
	context.lineWidth = 2;
	context.beginPath();
	for(let i=27; i<35; i++){
		let fX = mrks[i].x;
		let fY = mrks[i].y;
		let tX = mrks[i+1].x;
		let tY = mrks[i+1].y;
		context.moveTo(fX, fY);
		context.lineTo(tX, tY);
	}
	context.stroke();
}

function drawGrasses(mrks){
	context.strokeStyle = "white";
	context.lineWidth = 2;
	context.beginPath();
	context.moveTo(mrks[39].x, mrks[39].y);
	context.lineTo(mrks[42].x, mrks[42].y);
	context.stroke();
	// 左
	const lX = (mrks[39].x + mrks[36].x)/2;
	const lY = (mrks[41].y + mrks[38].y)/2;
	const lR = (mrks[39].x - mrks[36].x);
	context.beginPath();
	context.arc(lX, lY, lR, 0, Math.PI*2);
	context.stroke();
	// 右
	const rX = (mrks[45].x + mrks[42].x)/2;
	const rY = (mrks[46].y + mrks[43].y)/2;
	const rR = (mrks[45].x - mrks[42].x);
	context.beginPath();
	context.arc(rX, rY, rR, 0, Math.PI*2);
	context.stroke();
}



(function(){

  // camera 
  const cameraSize = { w: 360, h: 240 };
  const canvasSize = { w: 360, h: 240 };
  const resolution = { w: 360, h: 240 };
  let video;
  let media;
  let canvas;
  let canvasCtx;

  // video要素をつくる
  video          = document.createElement('video');
  video.id       = 'video';
  video.width    = cameraSize.w;
  video.height   = cameraSize.h;
  video.autoplay = true;
  document.getElementById('videoPreview').appendChild(video);

  // video要素にWebカメラの映像を表示させる
  media = navigator.mediaDevices.getUserMedia({
    audio: false,
    video: {
      width: { ideal: resolution.w },
      height: { ideal: resolution.h }
    }
  }).then(function(stream) {
    video.srcObject = stream;
  });

  // canvas要素をつくる
  // canvas        = document.createElement('canvas');
  // canvas.id     = 'canvas';
  // canvas.width  = canvasSize.w;
  // canvas.height = canvasSize.h;
  // document.getElementById('canvasPreview').appendChild(canvas);

  // // コンテキストを取得する
  // canvasCtx = canvas.getContext('2d');

  // // video要素の映像をcanvasに描画する
  // _canvasUpdate();

  // function _canvasUpdate() {
  //   canvasCtx.drawImage(video, 0, 0, canvas.width, canvas.height);
  //   requestAnimationFrame(_canvasUpdate);
  // };
})()

