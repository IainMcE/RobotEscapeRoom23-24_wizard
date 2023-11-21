class Space{
    constructor(){
        this.floor = null;
        this.walls = [null, null, null, null]
    }
}

let room;
let width = 4;
let height = 4;
let size = 100;
const canvas = document.getElementById("roomCanvas");
const context = canvas.getContext("2d");

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
                        corner1x = x-(size*0.4);
                    }else if(i>0 && j>0){
                        if(room[i-1][j-1].walls[1]!==null){//top left space has right wall
                            corner1x = x+(size*0.4);
                        }
                    }
                    if(room[i][j].walls[1]!==null){//right wall
                        corner2x = x+(size*1.4);
                    }else if(i>0 && j<width-1){
                        if(room[i-1][j+1].walls[3]!==null){//top right space has left wall
                            corner2x = x+(size*0.6);
                        }
                    }
                    drawQuad(corner1x, y-(size*0.4), x, y, x+size, y, corner2x, y-(size*0.4))
                }
                if(room[i][j].walls[1]!==null){//right wall
                    let corner1y = y, corner2y = y+size;
                    if(room[i][j].walls[0]!==null){//top wall
                        corner1y = y-(size*0.4);
                    }else if(i>0 && j<width-1){
                        if(room[i-1][j+1].walls[2]!==null){//top right space has bottom wall
                            corner1y = y+(size*0.4);
                        }
                    }
                    if(room[i][j].walls[2]!==null){//bottom wall
                        corner2y = y+(size*1.4);
                    }else if(i<width-1 && j<width-1){
                        if(room[i+1][j+1].walls[2]!==null){//bottom right space has top wall
                            corner2y = y+(size*0.6);
                        }
                    }
                    drawQuad(x+size, y+size, x+size, y, x+(size*1.4), corner1y, x+(size*1.4), corner2y)
                }
                if(room[i][j].walls[2]!==null){//bottom wall
                    let corner1x = x, corner2x = x+size;
                    if(room[i][j].walls[3]!==null){//left wall
                        corner1x = x-(size*0.4);
                    }else if(i<width-1 && j>0){
                        if(room[i+1][j-1].walls[1]!==null){//bottom left space has right wall
                            corner1x = x+(size*0.4);
                        }
                    }
                    if(room[i][j].walls[1]!==null){//right wall
                        corner2x = x+(size*1.4);
                    }else if(i<width-1 && j<width-1){
                        if(room[i+1][j+1].walls[3]!==null){//bottom right space has left wall
                            corner2x = x+(size*0.6);
                        }
                    }
                    drawQuad(corner1x, y+(size*1.4), x, y+size, x+size, y+size, corner2x, y+(size*1.4))
                }
                if(room[i][j].walls[3]!==null){//left wall
                    let corner1y = y, corner2y = y+size;
                    if(room[i][j].walls[0]!==null){//top wall
                        corner1y = y-(size*0.4);
                    }else if(i>0 && j>0){
                        if(room[i-1][j-1].walls[2]!==null){//top left space has bottom wall
                            corner1y = y+(size*0.4);
                        }
                    }
                    if(room[i][j].walls[2]!==null){//bottom wall
                        corner2y = y+(size*1.4);
                    }else if(i<width-1 && j>0){
                        if(room[i+1][j-1].walls[2]!==null){//bottom left space has top wall
                            corner2y = y+(size*0.6);
                        }
                    }
                    drawQuad(x, y+size, x, y, x-(size*0.4), corner1y, x-(size*0.4), corner2y)
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

window.addEventListener('DOMContentLoaded', ()=>{
    newRoom();
    setRoom();
    validateWalls();
    drawRoom();
});

function setRoom(){
    room[0][0].floor="floor"
    room[0][1].floor="floor"
    room[0][2].floor="floor"
    room[0][3].floor="floor"
    room[1][2].floor="floor"
    room[1][3].floor="floor"
    room[2][0].floor="floor"
    room[2][1].floor="floor"
    room[3][0].floor="floor"
    room[3][1].floor="floor"
    room[3][2].floor="floor"
    room[3][3].floor="floor"
}