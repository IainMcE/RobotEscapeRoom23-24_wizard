class Space{
    constructor(){
        this.floor = null;
        this.walls = [null, null, null, null]
    }
}

let selected = [-1, -1, -1] // x, y, side; -1 for none
let room;
let width = 5;
let height = 5;
let size = 100;
let wallSelect = document.getElementById("wallSelect");
let wallTypes = ["pressure plate", "panel", "doorway"]
let floorSelect = document.getElementById("floorSelect")
let floorTypes = ["calibration"]
const canvas = document.getElementById("roomCanvas");
const context = canvas.getContext("2d");

window.addEventListener('DOMContentLoaded', ()=>{
    wallSelect.addEventListener("change", ()=>{changeSelected("wall")})
    floorSelect.addEventListener("change", ()=>{changeSelected("floor")})
    setDropdowns();
    newRoom();
    drawRoom();
});

function setDropdowns(){
    floorDrop = floorSelect
    for(i = 0; i<floorTypes.length; i++){
        type = floorTypes[i]
        option = document.createElement("option")
        option.value = type
        option.innerText = type.charAt(0).toUpperCase()+type.slice(1)
        floorDrop.append(option)
    }
    wallDrop = wallSelect
    for(i = 0; i<wallTypes.length; i++){
        type = wallTypes[i]
        option = document.createElement("option")
        option.value = type
        option.innerText = type.charAt(0).toUpperCase()+type.slice(1)
        wallDrop.append(option)
    }
}

function newRoom(){
    room = []
    for(let i = 0; i<height; i++){
        room[i] = []
        for(let j = 0; j<width; j++){
            room[i][j] = new Space();
        }
    }
}

function validateWalls(){
    for(let i = 0; i<height; i++){
        for(let j = 0; j<width; j++){
            if(room[i][j].floor===null){
                room[i][j].walls = [null, null, null, null];
            }else{
                if(i>0){//there is a row north
                    if(room[i-1][j].floor!==null){//if floor to north, no wall
                        room[i][j].walls[0] = null;
                    }else if(room[i][j].walls[0] === null){//if no floor to north, establish as wall
                        room[i][j].walls[0] = "wall"
                    }
                }else if(room[i][j].walls[0] === null){//establish as wall if not already
                    room[i][j].walls[0] = "wall"
                }
                if(i<height-1){//there is a row south
                    if(room[i+1][j].floor!=null){//if floor to south, no wall
                        room[i][j].walls[2] = null;
                    }else if(room[i][j].walls[2]===null){//if no floor to east, establish as wall
                        room[i][j].walls[2] = "wall"
                    }
                }else if(room[i][j].walls[2]===null){//establish as wall if not already
                    room[i][j].walls[2] = "wall"
                }

                if(j>0){//there is a column west
                    if(room[i][j-1].floor!==null){//if floor to west, no wall
                        room[i][j].walls[3] = null;
                    }else if(room[i][j].walls[3] === null){//if no floor to west, establish as wall
                        room[i][j].walls[3] = "wall"
                    }
                }else if(room[i][j].walls[3] === null){//establish as wall if not already
                    room[i][j].walls[3] = "wall"
                }

                if(j<width-1){//there is a column east
                    if(room[i][j+1].floor!==null){//if floor to east, no wall
                        room[i][j].walls[1] = null;
                    }else if(room[i][j].walls[1] === null){//if no floor to east, establish as wall
                        room[i][j].walls[1] = "wall"
                    }
                }else if(room[i][j].walls[1] === null){//establish as wall if not already
                    room[i][j].walls[1] = "wall"
                }
            }   
        }
    }
}

function drawRoom(){
    validateWalls()
    context.clearRect(0,0, canvas.width, canvas.height)
    map = document.getElementById("floorMap")
    wallList = map.children
    while(wallList.length>0){
        wallList[0].remove()
    }
    for(let i = 0; i<height; i++){
        for(let j = 0; j<width; j++){
            x = size*(j+1);
            y = size*(i+1);
            interactableFloor(map, j, i)
            if(room[i][j].floor!==null){
                context.beginPath()
                context.rect(x, y, size, size)
                context.stroke();
                if(room[i][j].walls[0]!==null){//top wall
                    let corner1x = x, corner2x = x+size;
                    if(room[i][j].walls[3]!==null){//left wall
                        corner1x = x-(size*0.3);
                    }else if(i>0 && j>0){
                        if(room[i-1][j-1].walls[1]!==null){//top left space has right wall
                            corner1x = x+(size*0.3);
                        }
                    }
                    if(room[i][j].walls[1]!==null){//right wall
                        corner2x = x+(size*1.3);
                    }else if(i>0 && j<width-1){
                        if(room[i-1][j+1].walls[3]!==null){//top right space has left wall
                            corner2x = x+(size*0.7);
                        }
                    }
                    drawQuad(corner1x, y-(size*0.3), x, y, x+size, y, corner2x, y-(size*0.3))
                    interactableQuad(map, j, i, 0, corner1x, y-(size*0.3), x, y, x+size, y, corner2x, y-(size*0.3))
                }
                if(room[i][j].walls[1]!==null){//right wall
                    let corner1y = y, corner2y = y+size;
                    if(room[i][j].walls[0]!==null){//top wall
                        corner1y = y-(size*0.3);
                    }else if(i>0 && j<width-1){
                        if(room[i-1][j+1].walls[2]!==null){//top right space has bottom wall
                            corner1y = y+(size*0.3);
                        }
                    }
                    if(room[i][j].walls[2]!==null){//bottom wall
                        corner2y = y+(size*1.3);
                    }else if(i<height-1 && j<width-1){
                        if(room[i+1][j+1].walls[0]!==null){//bottom right space has top wall
                            corner2y = y+(size*0.7);
                        }
                    }
                    drawQuad(x+size, y+size, x+size, y, x+(size*1.3), corner1y, x+(size*1.3), corner2y)
                    interactableQuad(map, j, i, 1, x+size, y+size, x+size, y, x+(size*1.3), corner1y, x+(size*1.3), corner2y)
                }
                if(room[i][j].walls[2]!==null){//bottom wall
                    let corner1x = x, corner2x = x+size;
                    if(room[i][j].walls[3]!==null){//left wall
                        corner1x = x-(size*0.3);
                    }else if(i<height-1 && j>0){
                        if(room[i+1][j-1].walls[1]!==null){//bottom left space has right wall
                            corner1x = x+(size*0.3);
                        }
                    }
                    if(room[i][j].walls[1]!==null){//right wall
                        corner2x = x+(size*1.3);
                    }else if(i<height-1 && j<width-1){
                        if(room[i+1][j+1].walls[3]!==null){//bottom right space has left wall
                            corner2x = x+(size*0.7);
                        }
                    }
                    drawQuad(corner1x, y+(size*1.3), x, y+size, x+size, y+size, corner2x, y+(size*1.3))
                    interactableQuad(map, j, i, 2, corner1x, y+(size*1.3), x, y+size, x+size, y+size, corner2x, y+(size*1.3))
                }
                if(room[i][j].walls[3]!==null){//left wall
                    let corner1y = y, corner2y = y+size;
                    if(room[i][j].walls[0]!==null){//top wall
                        corner1y = y-(size*0.3);
                    }else if(i>0 && j>0){
                        if(room[i-1][j-1].walls[2]!==null){//top left space has bottom wall
                            corner1y = y+(size*0.3);
                        }
                    }
                    if(room[i][j].walls[2]!==null){//bottom wall
                        corner2y = y+(size*1.3);
                    }else if(i<height-1 && j>0){
                        if(room[i+1][j-1].walls[0]!==null){//bottom left space has top wall
                            corner2y = y+(size*0.7);
                        }
                    }
                    drawQuad(x, y+size, x, y, x-(size*0.3), corner1y, x-(size*0.3), corner2y)
                    interactableQuad(map, j, i, 3, x, y+size, x, y, x-(size*0.3), corner1y, x-(size*0.3), corner2y)
                }
            }
        }
    }
}

function drawQuad(x1, y1, x2, y2, x3, y3, x4, y4){
    context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.lineTo(x3, y3);
    context.lineTo(x4, y4);
    context.lineTo(x1, y1);
    context.stroke();
}

function interactableFloor(map, coordX, coordY){
    let top = (coordY+1)*size, bottom = (coordY+2)*size, left = (coordX+1)*size, right = (coordX+2)*size
    floor = document.createElement("area")
    floor.shape = "rect"
    if(coordY>0){
        if(room[coordY-1][coordX].walls[2]!==null){ top+= size*0.3 }
    }
    if(coordY<height-1){
        if(room[coordY+1][coordX].walls[0]!==null){ bottom += size*-0.3 }
    }
    if(coordX>0){
        if(room[coordY][coordX-1].walls[1]!==null){ left += size*0.3 }
    }
    if(coordX<width-1){
        if(room[coordY][coordX+1].walls[3]!==null){ right += size*-0.3 }
    }
    floor.coords = left+","+top+","+right+","+bottom
    floor.addEventListener("click", ()=>{floorClick(coordX, coordY)})
    floor.addEventListener("contextmenu", (e)=>{
        e.preventDefault()
        selected = [coordX, coordY, -1]
        setSelection(floorSelect, room[coordY][coordX].floor)
        menu = document.getElementById("floorDropdown")
        openMenu(menu, e.clientX, e.clientY)
    })
    map.append(floor)
}

function openMenu(menu, x, y){
    if(room[selected[1]][selected[0]].floor !== null){
        containerStyle = window.getComputedStyle(document.getElementById("floorEdit"))
        menu.style.left = (x - trimPX(containerStyle.left))+"px";
        menu.style.top = (y - trimPX(containerStyle.top))+"px";
        if(menu.style.visibility =="hidden" || menu.style.visibility ==""){
            document.body.addEventListener("click", (e) => {clickOff(menu, e)}, {once: true})
            menu.style.visibility = "visible"
        }
    }
}

function clickOff(element, mouse){
    computed = window.getComputedStyle(element)
    containerStyle = window.getComputedStyle(document.getElementById("floorEdit"))
    let top = trimPX(computed.top)+trimPX(containerStyle.top)
    let left = trimPX(computed.left)+trimPX(containerStyle.left)
    if(mouse.clientX<left || mouse.clientX>left+trimPX(computed.width)
        || mouse.clientY<top || mouse.clientY>top+trimPX(computed.height)){
        element.style.visibility = "hidden"
    }else{
        document.body.addEventListener("click", (e) => {clickOff(menu, e)}, {once: true})
    }
}

function trimPX(string){
    return parseInt(string.substring(0, string.length-2))
}

function floorClick(x, y){
    if(room[y][x].floor===null){
        room[y][x].floor = "floor"
    }else{
        selected = [x, y, -1]
        removeSelectedFloor()
    }
    drawRoom()
}

function removeSelectedFloor(){
    room[selected[1]][selected[0]].floor = null
    document.getElementById("floorDropdown").style.visibility = "hidden"
    drawRoom()
}

function changeSelected(type){
    if(type=="wall"){
        room[selected[1]][selected[0]].walls[selected[2]] = wallSelect.value;
    }else{
        room[selected[1]][selected[0]].floor = floorSelect.value;
    }
}

sides =  ["top", "right", "bottom", "left"]
function interactableQuad(map, parentX, parentY, side, x1, y1, x2, y2, x3, y3, x4, y4){
    wall = document.createElement("area")
    wall.shape = "poly"
    wall.coords = x1+","+y1+","+x2+","+y2+","+x3+","+y3+","+x4+","+y4
    wall.addEventListener("contextmenu", (e)=>{
        e.preventDefault();
        wallClick(parentX, parentY, side, e)
    })
    map.append(wall)
}

function wallClick(x, y, side, event){
    selected = [x, y, side]
    setSelection(wallSelect, room[y][x].walls[side])
    menu = document.getElementById("wallDropdown")
    openMenu(menu, event.clientX, event.clientY)
}

function setSelection(dropdown, value){
    if(value==null){ return; }
    for(var i, j= 0; i = dropdown.options[j]; j++){
        if(i.value == value){
            dropdown.selectedIndex = j;
            return;
        }
    }
}