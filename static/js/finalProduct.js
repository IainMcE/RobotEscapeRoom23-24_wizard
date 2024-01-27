let room;
let height, width;
let connectorCounts = {"4way": 0, "cornerTop": 0, "cornerBottom":0, "sideTop":0, "sideBottom":0};
let wallCounts = {};

window.addEventListener('DOMContentLoaded', ()=>{
    loadRoom();
});

function loadRoom(){
    let stringRoom = sessionStorage.getItem("room")
    if(stringRoom !== null){
        room = JSON.parse(stringRoom)
        height = room.length;
        width = room[0].length;
        drawRoom();
        pieceCounts();
        console.log(connectorCounts);
        console.log(wallCounts);
    }else{
        //throw error?
    }
}

function pieceCounts(){
    for(let i = 0; i<height-1; i++){
        for(let j = 0; j<width-1; j++){
            let set = [room[i][j].floor!=null, room[i][j+1].floor!=null, room[i+1][j].floor!=null, room[i+1][j+1].floor!=null];
            let setString = JSON.stringify(set);
            //middle
            if(setString == "[true,true,true,true]"){
                connectorCounts["4way"]++;
            }else if(setString == "[true,true,true,false]" || setString == "[true,true,false,true]"
                || setString == "[true,false,true,true]" || setString == "[false,true,true,true]"){
                connectorCounts["4way"]++;
                connectorCounts["cornerTop"]++;
            }else if(setString == "[true,true,false,false]" || setString == "[true,false,true,false]" 
                || setString == "[false,true,false,true]" || setString == "[false,false,true,true]"){
                connectorCounts["sideTop"]++;
                connectorCounts["sideBottom"]++;
            }else if(setString == "[true,false,false,false]" || setString == "[false,true,false,false]" 
                || setString == "[false,false,true,false]" || setString == "[false,false,false,true]"){
                connectorCounts["cornerTop"]++;
                connectorCounts["cornerBottom"]++;
            }
            //edges
            if(j == 0){ //leftmost column
                if(i == 0 && set[0]){//corners
                    connectorCounts["cornerTop"]++;
                    connectorCounts["cornerBottom"]++;
                }else if(i == height-2 && set[2]){
                    connectorCounts["cornerTop"]++;
                    connectorCounts["cornerBottom"]++;
                }
                if(set[0] && set[2]){//edges
                    connectorCounts["sideTop"]++;
                    connectorCounts["sideBottom"]++;
                }else if(set[0] || set[2]){
                    connectorCounts["cornerTop"]++;
                    connectorCounts["cornerBottom"]++;
                }
            }else if(j == width-2){ //rightmost column
                if(i == 0 && set[1]){//corner
                    connectorCounts["cornerTop"]++;
                    connectorCounts["cornerBottom"]++;
                }else if(i == height-2 && set[3]){
                    connectorCounts["cornerTop"]++;
                    connectorCounts["cornerBottom"]++;
                }
                if(set[1] && set[3]){//edges
                    connectorCounts["sideTop"]++;
                    connectorCounts["sideBottom"]++;
                }else if(set[1] || set[3]){
                    connectorCounts["cornerTop"]++;
                    connectorCounts["cornerBottom"]++;
                }
            }
            if(i == 0){ //top row edges
                if(set[0] && set[1]){
                    connectorCounts["sideTop"]++;
                    connectorCounts["sideBottom"]++;
                }else if(set[0] || set[1]){
                    connectorCounts["cornerTop"]++;
                    connectorCounts["cornerBottom"]++;
                }
            }
            if(i == height-2){ //bottom row edges
                if(set[2] && set[3]){
                    connectorCounts["sideTop"]++;
                    connectorCounts["sideBottom"]++;
                }else if(set[2] || set[3]){
                    connectorCounts["cornerTop"]++;
                    connectorCounts["cornerBottom"]++;
                }
            }
        }
    }
    for(let i = 0; i<height; i++){
        for(let j = 0; j<width; j++){
            if(room[i][j].floor!=null){
                //floors
                if(room[i][j].floor in wallCounts){
                    wallCounts[room[i][j].floor]++;
                }else{
                    wallCounts[room[i][j].floor] = 1;
                }
                //walls
                for(let k=0; k<4; k++){
                    if(room[i][j].walls[k] != null){
                        if(room[i][j].walls[k] in wallCounts){
                            wallCounts[room[i][j].walls[k]]++;
                        }else{
                            wallCounts[room[i][j].walls[k]] = 1;
                        }
                    }
                }
            }
        }
    }
}

let size = 100;
const canvas = document.getElementById("roomCanvas");
const context = canvas.getContext("2d");
function drawRoom(){
    context.clearRect(0,0, canvas.width, canvas.height)
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