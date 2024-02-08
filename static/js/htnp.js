let container = null;

const diagrams = [];

function addDiagram() {
    const containerId = `diagram${diagrams.length + 1}`;
    container = d3.select(`#${containerId}`)
        .append("svg")
        .attr("class", "line-svg") 
        .attr("width", "49%")
        .attr("height", "49%")
        .attr("viewBox", "-25 0 250 150")
        .attr("preserveAspectRatio", "xMidYMid meet")
        .append("g")
        .attr("transform", (d, i) => {
            const col = i % 2;
            const row = Math.floor(i / 2);
            return `translate(${col * 200}, ${row * 150})`;
        });

        const data = {
            name: `Root Task ${diagrams.length + 1}`,
            children: [
                {
                    name: `Subtask ${diagrams.length + 1}.1`,
                    children: [
                        { name: `Subtask ${diagrams.length + 1}.1.1` },
                        { name: `Subtask ${diagrams.length + 1}.1.2` }
                    ]
                },
                {
                    name: `Subtask ${diagrams.length + 1}.2`,
                    children: [
                        { name: `Subtask ${diagrams.length + 1}.2.1` },
                        { name: `Subtask ${diagrams.length + 1}.2.2` }
                    ]
                }
            ]
        };
    
    container.on("click", () => removeDiagram(diagrams.length));

    const treeLayout = d3.tree().size([150, 150]);

    const root = d3.hierarchy(data);

    treeLayout(root);

    const link = container.selectAll(".link")
        .data(root.links())
        .enter()
        .append("path")
        .attr("class", "link")
        .attr("d", d3.linkHorizontal()
            .x(d => d.y)
            .y(d => d.x)
        );

    const nodes = container.selectAll(".node")
        .data(root.descendants())
        .enter()
        .append("g")
        .attr("class", "node")
        .attr("transform", d => `translate(${d.y},${d.x})`)
        .on("dblclick", editNode);

    nodes.append("rect")
        .attr("width", 60)
        .attr("height", 15)
        .attr("x", -15)
        .attr("y", -7.5)
        //.attr("rx", 3)
        //.attr("ry", 3)
        .attr("stroke", "#333")
        .attr("fill", "#fff");

    const textElements = nodes.append("text")
        .attr("dy", 3)
        .attr("dx", 15)
        .style("font-size", "8px")
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle")
        .text(d => d.data.name)
        .on("dblclick", editNode);

    diagrams.push({
        containerId,
        treeLayout,
        root,
        link,
        nodes,
        textElements,
        links: []
    });

    update();

    container.on("mousedown", startDragLine);
    container.on("mousemove", handleMouseMove);
    container.on("mouseup", stopDragLine);
}

// Create marker definition (Arrowhead)
const svg = d3.select("#diagram1").select("svg");
svg.append("defs").append("marker")
    .attr("id", "arrowhead")
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 8)
    .attr("refY", 0)
    .attr("markerWidth", 6)
    .attr("markerHeight", 6)
    .attr("orient", "auto")
    .append("path")
    .attr("d", "M0,-5L10,0L0,5")
    .attr("class", "arrowhead");

// Connect nodes between diagrams
diagrams.forEach((sourceDiagram, sourceIndex) => {
    diagrams.forEach((targetDiagram, targetIndex) => {
        if (sourceIndex !== targetIndex) {
            const sourceNode = sourceDiagram.root.descendants()[0];
            const targetNode = targetDiagram.root.descendants()[0];

            const link = sourceDiagram.container.append("path")
                .datum({ source: { x: sourceNode.y, y: sourceNode.x }, target: { x: targetNode.y, y: targetNode.x } })
                .attr("class", "link")
                .attr("d", d3.linkHorizontal()
                    .x(d => d.y)
                    .y(d => d.x)
                )
                .attr("marker-end", "url(#arrowhead)");

            // Save the link in the source diagram for later reference
            sourceDiagram.links.push(link);

            // If the target is the diagram below, add another arrow going downwards
            if (targetIndex === sourceIndex + 1 && (sourceIndex + 1) % 2 === 0) {
                const arrowDown = sourceDiagram.container.append("path")
                    .datum({ source: { x: sourceNode.y, y: sourceNode.x }, target: { x: targetNode.y, y: targetNode.x + 30 } })
                    .attr("class", "link")
                    .attr("d", d3.linkVertical()
                        .x(d => d.y)
                        .y(d => d.x)
                    )
                    .attr("marker-end", "url(#arrowhead)");
            }
        }
    });
});

function removeDiagram() {
    if (diagrams.length > 0) {
        const lastDiagram = diagrams.pop();
        d3.select(`#${lastDiagram.containerId}`).remove(); 
        update();
}}

document.getElementById('addDiagramButton').addEventListener('click', addDiagram);
document.getElementById('removeDiagramButton').addEventListener('click', removeDiagram);


function update() {
    diagrams.forEach(diagram => {
        diagram.treeLayout(diagram.root);
        diagram.link.attr("d", d3.linkHorizontal().x(d => d.y).y(d => d.x));
        diagram.nodes.attr("transform", d => `translate(${d.y},${d.x})`);
    });
}

function editNode(event, d) {
    const newText = prompt("Enter new task name:", d.data.name);
    if (newText !== null) {
        d.data.name = newText;

        // Update the text in all diagrams
        diagrams.forEach(diagram => {
            diagram.textElements.text(d => d.data.name);
        });

        // Update the links
        diagrams.forEach(diagram => {
            diagram.links.forEach(link => {
                const sourceNode = link.datum().source;
                const targetNode = link.datum().target;

                link.attr("d", d3.linkHorizontal()
                    .x(d => d.y)
                    .y(d => d.x)({ source: { x: sourceNode.y, y: sourceNode.x }, target: { x: targetNode.y, y: targetNode.x } })
                );
            });
        });
    }
}

//Line drawing code
let isDrawing = false;
let startX, startY, endX, endY;
let tempLine;

function startDragLine(event) {
    isDrawing = true;
    [startX, startY] = d3.pointer(event);
    tempLine = container.select(".line-svg")
        .append("line")
        .attr("x1", startX)
        .attr("y1", startY)
        .attr("x2", startX)
        .attr("y2", startY)
        .attr("stroke", "black");
}


function stopDragLine(event) {
    if (isDrawing) {
        isDrawing = false;
        tempLine.remove();

        // Create the final line
        container.append("line")
            .attr("x1", startX)
            .attr("y1", startY)
            .attr("x2", endX)
            .attr("y2", endY)
            .attr("stroke", "black");
    }
}

// Function to handle mouse move event
function handleMouseMove(event) {
    if (isDrawing) {
        [endX, endY] = d3.pointer(event); // Update end position while dragging
        tempLine.attr("x2", endX).attr("y2", endY);
    }
}

