class Space{
    constructor(){
        this.floor = null;
        this.walls = [null, null, null, null]
    }
}

let room;
let width = 5;
let height = 4;
let size = 100;
const canvas = document.getElementById("roomCanvas");
const context = canvas.getContext("2d");

window.addEventListener('DOMContentLoaded', ()=>{
    newRoom();
});

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
                    interactableQuad(map, j, i, "top", corner1x, y-(size*0.3), x, y, x+size, y, corner2x, y-(size*0.3))
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
                    interactableQuad(map, j, i, "right", x+size, y+size, x+size, y, x+(size*1.3), corner1y, x+(size*1.3), corner2y)
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
                    interactableQuad(map, j, i, "bottom", corner1x, y+(size*1.3), x, y+size, x+size, y+size, corner2x, y+(size*1.3))
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
                    interactableQuad(map, j, i, "left", x, y+size, x, y, x-(size*0.3), corner1y, x-(size*0.3), corner2y)
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

function interactableQuad(map, parentX, parentY, side, x1, y1, x2, y2, x3, y3, x4, y4){
    wall = document.createElement("area")
    wall.shape = "poly"
    wall.coords = x1+","+y1+","+x2+","+y2+","+x3+","+y3+","+x4+","+y4
    wall.addEventListener("click", ()=>{alert("Square "+parentX+", "+parentY+"'s "+side+" side clicked")})
    map.append(wall)
}

function updateRoom(){
    checks = document.getElementsByClassName("floorCheckbox")
    for(let i=0; i<height; i++){
        for(let j = 0; j<width; j++){
            if(checks[i*width+j].checked){
                room[i][j].floor = "floor"
            }else{
                room[i][j].floor = null
            }
        }
    }
    drawRoom()
}

//=================floor modifications=====================
//do a series of buttons in the center of the tile just for adding and removing floor space
let area = document.getElementById("floorEdit")
//add a bunch of buttons
for(let i = 0; i<height; i++){
    for (let j=0; j<width; j++){
        floorCheck = document.createElement("input")
        floorCheck.type = "checkbox"
        floorCheck.classList.toggle("floorCheckbox")
        floorCheck.style.width = size/5+"px"
        floorCheck.style.height = size/5+"px"
        floorCheck.style.top = ((1.5+i)*size-size/10)+"px"
        floorCheck.style.left = ((1.5+j)*size- size/10)+"px"
        floorCheck.addEventListener("click", updateRoom)
        area.appendChild(floorCheck)
    }
}

function selectAll(){
    checks = document.getElementsByClassName("floorCheckbox")
    for(let i = 0; i<checks.length; i++){
        checks[i].checked = true;
    }
    updateRoom()
}