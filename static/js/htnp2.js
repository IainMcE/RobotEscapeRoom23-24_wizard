//future plans:
//          click and drag nodes (low)
//          convert to python objects (high: next week)

let main = document.getElementById("main");
let container = d3.select(main).append("svg").attr("width", "100%").attr("height", "100%");
let svgTop = main.getBoundingClientRect().top;
let svgLeft = main.getBoundingClientRect().left;
let id = 0;
let nodes = [];
let outputs = ["panel", "doorway"]
let outputTypes = ["None"]
let inputs = ["pressure plate"]
let inputTypes = ["None"]
let rowWidth = 4

let room;
let height, width;

window.onload = function(){
    setDropdownLists();
}

function setDropdownLists(){
    let stringRoom = sessionStorage.getItem("room")
    if(stringRoom === null){
        return
    }
    room = JSON.parse(stringRoom)
    height = room.length;
    width = room[0].length;
    let wallCounts = {};
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
    delete wallCounts["floor"]
    delete wallCounts["wall"]
    console.log(wallCounts);
    var keys = Object.keys(wallCounts);
    for(var i = 0; i<keys.length; i++){
        var split = keys[i].split(" ");
        var reconstitute = ""
        for(let j = 0; j<split.length; j++){
            reconstitute += split[j].charAt(0).toUpperCase() + split[j].slice(1)+" "
        }
        for(let k = 0; k<wallCounts[keys[i]]; k++){
            if(inputs.includes(keys[i])){
                inputTypes.push(reconstitute+(k+1));    
            }else{
                outputTypes.push(reconstitute+(k+1));
            }
        }

    }
}

function createDropdown(element, list){
    for(i = 0; i<list.length; i++){
        type = list[i]
        option = document.createElement("option")
        option.value = type
        option.innerText = type.charAt(0).toUpperCase()+type.slice(1)
        element.append(option)
    }
}

function createNode(){
    //id acts as reference between node object and node ui

    //UI:
        //dropdown menu
            //default none
        //click & drag?

    //background:
    //object: id, name, room piece, children, outputs
    const node = {
        "id": "node"+id, "name": "Node "+id, "RoomInput": null, "RoomOutput": null, "Inputs": [], "Outputs":[]
    };
    nodes.push(node);
    
    let mainBox = document.createElement("div");
    mainBox.id = "node"+id;
    mainBox.classList.toggle("mainNode", true);
    mainBox.style.left = ((id%rowWidth)*275 +100)+'px';
    mainBox.style.top = (Math.floor(id/rowWidth)*150 + 125 ) + 'px';
    mainBox.appendChild(document.createElement("p"));
    mainBox.getElementsByTagName("p")[0].innerText = node.name;
    main.appendChild(mainBox);

    mainBox.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        removeNode(mainBox.id);
    });

    mainBox.addEventListener("dblclick", ()=>{
        updateNode(mainBox.id);
    })

    //dropdowns
    let dropdownIn = document.createElement("select");
    createDropdown(dropdownIn, inputTypes);
    mainBox.appendChild(dropdownIn);
    dropdownIn.addEventListener("change", ()=>{
        //console.log(dropdownIn.value);
        if(dropdownIn.value !== "None"){
            node.RoomInput = dropdownIn.value.replaceAll(" ", "");
        }else{
            node.RoomInput = null;
        }
    })
    let dropdownOut = document.createElement("select");
    createDropdown(dropdownOut, outputTypes);
    mainBox.appendChild(dropdownOut);
    dropdownOut.addEventListener("change", ()=>{
        //console.log(dropdownOut.value);
        if(dropdownOut.value !== "None"){
            node.RoomOutput = dropdownOut.value.replaceAll(" ", "");
        }else{
            node.RoomOutput = null;
        }
    })

    //in/output boxes
        //onclick line drag (create child/parent links?)
    let inputBox = document.createElement("div");
    inputBox.id = "node"+id+"input";
    inputBox.classList.toggle("ioBox", true);
    inputBox.style.left = ((id%rowWidth)*275 +100-40)+'px';
    inputBox.style.top = (Math.floor(id/rowWidth)*150 + 125+20 ) + 'px';
    main.appendChild(inputBox);

    inputBox.addEventListener("click", (e)=>{
        lineClick(parseInt(inputBox.style.left)+20-svgLeft, parseInt(inputBox.style.top)+20-svgTop, "in", mainBox.id);
    });

    let outputBox = document.createElement("div");
    outputBox.id = "node"+id+"output";
    outputBox.classList.toggle("ioBox", true);
    outputBox.style.left = ((id%rowWidth)*275 +100+152)+'px';
    outputBox.style.top = (Math.floor(id/rowWidth)*150 + 125+20 ) + 'px';
    main.appendChild(outputBox);

    outputBox.addEventListener("click", (e)=>{
        lineClick(parseInt(outputBox.style.left)+20-svgLeft, parseInt(outputBox.style.top)+20-svgTop, "out", mainBox.id);
    });

    id++;
}

function removeNode(id){
    for(let i = 0; i<nodes.length; i++){
        if(nodes[i].id == id){ //remove node itself
            nodes.splice(i, 1);
            document.getElementById(id).remove();
            document.getElementById(id+"input").remove();
            document.getElementById(id+"output").remove();
        }else{
            if(nodes[i].Inputs.includes(id)){
                nodes[i].Inputs.splice(nodes[i].Inputs.indexOf(id), 1);
            }
            if(nodes[i].Outputs.includes(id)){
                nodes[i].Outputs.splice(nodes[i].Outputs.indexOf(id), 1);
            }
        }
    }
    let lines = main.getElementsByTagName("line")
    for(let j = lines.length-1; j>=0; j--){
        if(lines[j].getAttribute("connections").includes(id)){
            lines[j].remove();
        }
    }
}

function updateNode(id){
    let newName = prompt("Enter a new Name:");
    for(let i = 0; i<nodes.length; i++){
        if(nodes[i].id == id){
            nodes[i].name = newName;
            document.getElementById(id).getElementsByTagName("p")[0].innerHTML = newName;
            break;
        }
    }
}

document.getElementById('addDiagramButton').addEventListener('click', createNode);

//Line drawing code
let isDrawing = false;
let startX, startY, endX, endY;
let tempLine;
let startType, inId, outId;

function lineClick(x, y, from, id){
    if(from == "in"){
        inId = id;
    }else{
        outId = id;
    }

    if(isDrawing){
        stopDragLine(x, y, from);
    }else{
        start = from;
        startDragLine(x, y);
    }
}

function startDragLine(x, y) {
    isDrawing = true;
    startX = x;
    startY = y;
    tempLine = container.select(".line-svg")
        .append("line")
        .attr("x1", startX)
        .attr("y1", startY)
        .attr("x2", startX)
        .attr("y2", startY)
        .attr("stroke", "black");
}

function stopDragLine(x, y, from) {
    isDrawing = false;
    tempLine.remove();

    if(from === start || inId === outId){
        return;
    }

    endX = x;
    endY = y;
    // Create the final line
    container.append("line")
        .attr("x1", startX)
        .attr("y1", startY)
        .attr("x2", endX)
        .attr("y2", endY)
        .attr("connections", [outId, inId])
        .attr("stroke", "black")
        .attr("stroke-width", "5px");

    let lines = main.getElementsByTagName("line");
    const line = lines[lines.length-1];
    line.addEventListener("contextmenu", (e)=>{e.preventDefault(); removeLine(line.getAttribute("connections"))});

    //tell inID node append(outId) to inputs
    //tell outID node append(inId) to outpus
    for(let i = 0; i<nodes.length; i++){
        if(nodes[i].id === inId){
            nodes[i].Inputs.push(outId);
        }
        if(nodes[i].id === outId){
            nodes[i].Outputs.push(inId);
        }
    }
}

// Function to handle mouse move event
function handleMouseMove(event) {
    if (isDrawing) {
        [endX, endY] = d3.pointer(event); // Update end position while dragging
        tempLine.attr("x2", endX).attr("y2", endY);
    }
}

function removeLine(connections){
    outId = connections.substring(0, connections.indexOf(","))
    inId = connections.substring(connections.indexOf(",")+1)
    let skip1 = false, skip2 = false;
    for(let i = 0; i<nodes.length; i++){
        if(nodes[i].id === inId){
            nodes[i].Inputs.splice(nodes[i].Inputs.indexOf(outId), 1);
            skip1 = true;
        }
        if(nodes[i].id === outId){
            nodes[i].Outputs.splice(nodes[i].Outputs.indexOf(inId), 1);
            skip2 = true;
        }
        if(skip1 && skip2){
            break;
        }
    }
    let lines = main.getElementsByTagName("line")
    for(let j = lines.length-1; j>=0; j--){
        if(lines[j].getAttribute("connections") === outId+","+inId){
            lines[j].remove();
            break;
        }
    }
}

//TODO send to flask server on page leave (yknow, call before the redirect call on the nav buttons)
function saveProgression(){
    var stringProgression = JSON.stringify(nodes);
    sessionStorage.setItem("puzzleProgression", stringProgression);
}