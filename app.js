const saveBtn=document.getElementById("save");
const textInput=document.getElementById("text");
const fileInput=document.getElementById("file");
const eraserBtn=document.getElementById("eraser-btn");
const destroyBtn=document.getElementById("destroy-btn");
const modeBtn=document.getElementById("mode-btn")
const colorOptions=Array.from(document.getElementsByClassName("color-option"));
const color=document.getElementById("color");
const lineWidth=document.getElementById("line-width");
const canvas=document.querySelector("canvas");
const ctx=canvas.getContext("2d"); /* 캔버스에 그림 그릴 때 사용 */
const CANVAS_WIDTH=800;
const CANVAS_HEIGHT=800;
canvas.width=CANVAS_WIDTH;
canvas.height=CANVAS_HEIGHT;
ctx.lineCap="round";
ctx.lineWidth=lineWidth.value;
let isPainting=false;
let isFilling=false;

/* ispainting이 false면 연필을 움직이기만 할거고 true면 선을 그리게 */
function onMove(e){
    if(isPainting){
        ctx.lineTo(e.offsetX, e.offsetY); /* 마우스가 클릭한 내부 좌표 */
        ctx.stroke();
        return;
    }
    ctx.beginPath(); /* 이걸 넣어줘야 다같이 선 굵기가 바뀌는게 아니라 각각 주어짐 */
    ctx.moveTo(e.offsetX, e.offsetY);
}
function startPainting(){
    isPainting=true;
}
function calcelPainting(){
    isPainting=false;
}

function onLineWidthChange(event){
    console.log(event.target.value);
    ctx.lineWidth=event.target.value;
}

function onColorChange(event){
   ctx.strokeStyle=event.target.value;
   ctx.fillStyle=event.target.value;
}

function onColorClick(event){
    const colorValue=event.target.dataset.color;
    ctx.strokeStyle=colorValue
    ctx.fillStyle=colorValue
    color.value=colorValue;
}

function onModeClick(){
    if(isFilling){
        isFilling=false;
        modeBtn.innerText="Fill";
    } else {
        isFilling=true;
        modeBtn.innerText="Draw";
    }
}

function onCanvasClick(){
    if(isFilling){
        ctx.fillRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
    }
}

function onDestroyClick(){
    ctx.fillStyle="white";
    ctx.fillRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);

}

function onEraserClick(){
    ctx.strokeStyle="white";
    isFilling=false;
    modeBtn.innerText="Fill";
}

function onFileChange(event){
    const file = event.target.files[0];
    const url = URL.createObjectURL(file);
    const image = new Image()
    image.src = url; /* <img src=""/> 이걸 자바스크립트 버전으로 쓴거임 */
    image.onload = function(){
        ctx.drawImage(image, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        fileInput.value = null;
    }
}

function onDoubleClick(event){
    const text=textInput.value;
    if(text !== ""){ /* text가 비지 않았을 때 실행 */
        ctx.save(); /* 변경되는 코드가 실행되기 전에 현재 상태와 선택들을 저장 */
        ctx.lineWidth=1;
        ctx.font="68px Montserrat"
        ctx.fillText(text, event.offsetX, event.offsetY);  /* 마우스가 클릭한 내부 좌표 */
        ctx.restore(); /* 이전에 저장된 상태로 돌아감. 펜의 굵기가 원래대로 */
    }
}

function onSaveClick(){
    const url = canvas.toDataURL();
    const a = document.createElement("a");
    a.href = url;
    a.download = "myDrawing.png";
    a.click();
}

canvas.addEventListener("dblclick", onDoubleClick); /* mousedown/up이 더블 클릭될 때 나타남 */
canvas.addEventListener("mousemove", onMove);
canvas.addEventListener("mousedown", startPainting);
canvas.addEventListener("mouseup", calcelPainting);
canvas.addEventListener("mouseleave", calcelPainting); /* 더이상 누르지 않음 */

canvas.addEventListener("click", onCanvasClick);
lineWidth.addEventListener("change", onLineWidthChange);
color.addEventListener("change", onColorChange);

colorOptions.forEach(color=>color.addEventListener("click", onColorClick));

modeBtn.addEventListener("click", onModeClick);
destroyBtn.addEventListener("click", onDestroyClick);
eraserBtn.addEventListener("click", onEraserClick);
fileInput.addEventListener("change", onFileChange);
saveBtn.addEventListener("click", onSaveClick);