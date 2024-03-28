let room;
let height, width;
let connectorCounts = {"4way": 0, "cornerTop": 0, "cornerBottom":0, "sideTop":0, "sideBottom":0};
let wallCounts = {};
const natImages = {"default": [99, 144], "doorway": [1821, 2048], "panel": [1821, 2048], "calibration": [450, 450]}

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
                setImage(room[i][j].floor, y, x, y+size, x+size)
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
                    setImage(room[i][j].walls[0], y-(size*0.3), Math.max(corner1x, x), y, Math.min(corner2x, x+size))
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
                    setImage(room[i][j].walls[1], Math.max(corner1y, y), x+size, Math.min(corner2y, y+size), x+(size*1.3))
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
                    setImage(room[i][j].walls[2], y+size, Math.max(corner1x, x), y+(size*1.3), Math.min(corner2x, x+size))
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
                    setImage(room[i][j].walls[3], Math.max(corner1y, y), x-(size*0.3), Math.min(corner2y, y+size), x)
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

function setImage(name, top, left, bottom, right){
    if(name !== "wall" && name !== "floor"){
        if(!(name in natImages)){
            name = "default"
        }
        let container = document.getElementById("canvasDiv")
        let image = document.createElement("img")
        image.src = "/static/img/"+name+".png"
        if(bottom-top<=right-left){
            image.style.height = (bottom-top)+"px"
            image.style.left = ((right+left)/2)-((bottom-top)/natImages[name][1]*natImages[name][0]/2)+"px"
            image.style.top = top+"px"
        }else{
            image.style.width = (right-left)+"px"
            image.style.left = left+"px"
            image.style.top = ((bottom+top)/2)-((right-left)/natImages[name][0]*natImages[name][1]/2)+"px"
        }
        container.append(image)
    }
}

function downloadPDF(){

}

var initValues = {"Motor":"1,0", "Servo":"0,0"}

function generatePyFileString(){  //TODO switch cases for room device names and message values
    var stringProgression = sessionStorage.getItem("puzzleProgression");
    if(stringProgression === null){
        console.log("no puzzle progression");
        return;
    }
    var jsonProg = JSON.parse(stringProgression);
    var pythonOutput = "from time import sleep\n"+"Client = None\n"+"\n"+"class Response(object):\n"+"\tcompleted = False\n"+
    "\ttopic = \"\"\t  #string\n"+"\ttrigger = []\t#list of strings\n"+
    "\tresponses = []   # [string type, list(string)/string values (see responseChoice)]\n"+"\n"+
    "\tdef __init__(self, topic, trigger, responses):\n"+"\t\tself.topic = topic\n"+
    "\t\tself.trigger = trigger\n"+"\t\tself.responses = responses\n"+"\t\n"+"\tdef respond(self, value):\n"+
    "\t\tif(value in self.trigger):\n"+"\t\t\tself.trigger[self.trigger.index(value)] = True\n"+
    "\t\t\tfor trigger in self.trigger:\n"+"\t\t\t\tif(not(trigger == True)):\n"+"\t\t\t\t\treturn\n"+
    "\t\t\tfor response in self.responses:\n"+"\t\t\t\tresponseChoice(response[0], response[1])\n"+
    "\t\t\tself.completed = True\n"+"\n"+"def makeResponse(topic, trigger, responses):\n"+
    "\tresponse = Response(topic, trigger, responses)\n"+"\treturn response\n"+"\n"+"def responseChoice(type, value):\n"+
    "\tmatch type:\n"+"\t\tcase \"publish\":\t # value = [topic, value]\n"+"\t\t\tClient.publish(value[0], payload=value[1])\n"+
    "\t\t\treturn\n"+"\t\tcase \"log\":\t\t # value: string\n"+"\t\t\tprint(value)\n"+"\t\t\treturn\n"+
    "\t\tcase \"unsubscribe\": # value: string\n"+"\t\t\tClient.unsubscribe(value)\n"+"\t\t\treturn\n"+"\t\tcase _:\n"+
    "\t\t\tprint('bad response')\n"+"\t\t\treturn\n"+"puzzleList = [ makeResponse(\"setup\", \"start\", [";
    //generate setup step
    var setupList = []
    for(var i = 0; i<jsonProg.length; i++){
        if(jsonProg[i].RoomInput !== null){
            setupList.push("[\"publish\", [\""+jsonProg[i].RoomInput+"\", \""+initValues[jsonProg[i].RoomInput.replace(/[0-9]/g, '')]+"\"]]")
        }
        if(jsonProg[i].RoomOutput !== null){
            setupList.push("[\"publish\", [\""+jsonProg[i].RoomOutput+"\", \""+initValues[jsonProg[i].RoomOutput.replace(/[0-9]/g, '')]+"\"]]")
        }
    }
    pythonOutput += setupList.join() + "]), \n    ";

    //generate actual steps
    for(var i = 0; i<jsonProg.length; i++){
        console.log(jsonProg[i])
        pythonOutput += "makeResponse(\""+jsonProg[i].id+"\", ["

        var inputs = jsonProg[i].Inputs;
        for(var j = 0; j<inputs.length; j++){
            pythonOutput +="\""+inputs[j]+"\""
            if(j<inputs.length-1 || jsonProg[i].RoomInput !== null){
                pythonOutput += ", "
            }
        }
        if(jsonProg[i].RoomInput !== null){
            pythonOutput += "\""+jsonProg[i].RoomInput+"\""
        }


        pythonOutput+="], ["

        var outputs = jsonProg[i].Outputs;
        for(var j = 0; j<outputs.length; j++){
            pythonOutput += "[\"publish\", [\""+outputs[j]+"\", \""+jsonProg[i].id+"\"]]";
            if(j<outputs.length-1 || jsonProg[i].RoomOutput !== null){
                pythonOutput += ", ";
            }
        }
        if(jsonProg[i].RoomOutput !== null){
            ///SUBJECT TO CHANGE
            pythonOutput += "[\"publish\", [\"room/"+jsonProg[i].RoomOutput+"\", \"Some value\"]]"
            //TODO create a table of commands for each room type
        }
        pythonOutput+="])"

        if(jsonProg[i].RoomInput !== null){
            pythonOutput += ",\n    makeResponse(\"room/"+jsonProg[i].RoomInput+"\", [\"True\"], [\"publish\" [\""+jsonProg[i].id
                    +"\", \""+jsonProg[i].RoomInput+"\"]])"
        }

        if(i<jsonProg.length-1){
            pythonOutput+=",\n    "
        }
    }
    pythonOutput += "]"+"def processSubscriptions(client, userdata, msg):\n"+"\tprint(\"recieved message | topic: \"+msg.topic +\n"+
    "\t\t  \" \\tmsg: \"+str(msg.payload.decode(\"utf-8\")))\n"+"\tfor response in puzzleList:\n"+
    "\t\tif(not(response.completed) and response.topic == msg.topic):\n"+"\t\t\tresponse.respond(str(msg.payload.decode(\"utf-8\")))\n"+
    "\treturn\n"+"\n"+"def runMQTT(client):\n"+"\tglobal Client\n"+"\tClient = client\n"+"\tClient.on_message = processSubscriptions\n"+
    "\ttopics = []\n"+"\tfor response in puzzleList:\n"+"\t\tif not(response.topic in topics):\n"+"\t\t\ttopics.append(response.topic)\n"+
    "\tfor topic in topics:\n"+"\t\tsub = Client.subscribe(topic)\n"+"\t\tif(sub[1]==128):\n"+"\t\t\tprint('Failed to subscribe to topics')\n"+
    "\tClient.publish(\"setup\", payload = \"start\")\n"+"\tsleep(1.0)\n"
    return pythonOutput;
}

// Kaelin stuff
function displayCounts(obj, title) {
    let outputDiv = document.getElementById('output');
    let container = document.createElement('div');
    container.classList.add('object-container');
    
    let titleElement = document.createElement('h3');
    titleElement.textContent = title;
    container.appendChild(titleElement);

    // Loop through object properties and create HTML elements
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            let keyElement = document.createElement('div');
            keyElement.classList.add('object-key');
            keyElement.textContent = key + ': ';
            let valueElement = document.createElement('span');
            valueElement.textContent = obj[key];
            let image = document.createElement("img");
            image.src = "/static/img/irl/"+key+".jpg"
            image.style.height = "100px";
            container.appendChild(keyElement);
            keyElement.appendChild(valueElement);
            container.appendChild(image);
            container.appendChild(document.createElement('br'));
        }
    }

    outputDiv.appendChild(container);
}

function generateAndDownloadPythonFile() {

    var pythonCode = generatePyFileString();

    var blob = new Blob([pythonCode], { type: 'text/plain' });

    var a = document.createElement('a');
    a.href = window.URL.createObjectURL(blob);
    a.download = 'puzzle_list.py';
    a.textContent = 'Download Puzzle List';

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

document.getElementById('downloadButton').addEventListener('click', generateAndDownloadPythonFile);

window.addEventListener('DOMContentLoaded', () => {
    displayCounts(connectorCounts, 'Connectors');
    displayCounts(wallCounts, 'Walls');
});


// node -> python
// 	each node is a task
// 		each object input is another task
// 		each child outputs to notify this task

// 	makeResponse(nodeID, [""], []), 

// 	Json objects = {}
// 	python new array = []
// 	array[0] = objects[i].id
// 	array[1] = objects[i].inputs with some modifications?
// 	# array[2] = objects[i].outputs + object[i].roomOutput
// 	for object in outpus:
// 		list += [publish, [object, this.id]]
// 	list += [publish, [roomOutput, open || close || on || ...]]
