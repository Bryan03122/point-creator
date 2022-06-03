var arreglo = {};
var actualX, actualY;
var arrServices = [
  "hallway",
  "bathroom",
  "stairs",
  "stairsUp",
  "stairsDown",
  "elevator",
  "exit",
  "entrance",
  "entranceAndExit",
];

var colors = {
  hallway: "#eb4034",
  bathroom: "#7734eb",
  stairs: "#34c6eb",
  stairsUp: "#34ebdc",
  stairsDown: "#3489eb",
  elevator: "#34eb7d",
  exit: "#eb8634",
  entrance: "#eb3474",
  entranceAndExit: "#eb34d0",
};

var index = 0;
var lastIndex = 0;

var images = [
  "./blueprints/P-01.jpg",
  "./blueprints/P-02.jpg",
  "./blueprints/P-03.jpg",
  "./blueprints/P-04.jpg",
  "./blueprints/P-05.jpg",
  "./blueprints/P-06.jpg",
  "./blueprints/P01.jpg",
  "./blueprints/P02.jpg",
  "./blueprints/P03.jpg",
  "./blueprints/P04.jpg",
  "./blueprints/P05.jpg",
  "./blueprints/P06.jpg",
  "./blueprints/P07.jpg",
  "./blueprints/PB.jpg",
];

function nextImages() {
  index++;
  if (index >= images.length) index = 0;
  document.getElementById("img").src = images[index];
}
function prevImages() {
  index--;
  if (index < 0) index = images.length - 1;
  document.getElementById("img").src = images[index];
}

function FindPosition(oElement) {
  if (typeof oElement.offsetParent != "undefined") {
    for (var posX = 0, posY = 0; oElement; oElement = oElement.offsetParent) {
      posX += oElement.offsetLeft;
      posY += oElement.offsetTop;
    }
    return [posX, posY];
  } else {
    return [oElement.x, oElement.y];
  }
}

function onclickimg(e) {
  actualX = e.clientX;
  actualY = e.clientY;
  var PosX = 0;
  var PosY = 0;
  var ImgPos;
  ImgPos = FindPosition(document.getElementById("img"));
  if (!e) var e = window.event;
  if (e.pageX || e.pageY) {
    PosX = e.pageX;
    PosY = e.pageY;
  } else if (e.clientX || e.clientY) {
    PosX =
      e.clientX +
      document.body.scrollLeft +
      document.documentElement.scrollLeft;
    PosY =
      e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
  }
  PosX = PosX - ImgPos[0];
  PosY = PosY - ImgPos[1];
  document.getElementById("posX").value = PosX;
  document.getElementById("posY").value = PosY;
}

function onSubmit() {
  var floor = document.getElementById("floor").value;
  if (!arreglo[floor]) {
    arreglo[floor] = [];
  }
  lastIndex++;
  let name = floor + "_" + lastIndex;
  var select = document.getElementById("type");
  var value = select.options[select.selectedIndex].value;
  var val = document.getElementById("service").value;
  var nodes = document.getElementById("id_nodes").value;
  var isEdit = document.getElementById("id_node").value;
  if (isEdit.length > 0) {
    arreglo[floor].forEach((item) => {
      if (item.name === isEdit) {
        (item.x = parseInt(document.getElementById("posX").value)),
          (item.y = parseInt(document.getElementById("posY").value)),
          (item.type = value),
          (item.service = val.length > 0 ? val : null),
          (item.nodes = nodes.length > 0 ? nodes : null);

        var divTag = document.getElementById("point_" + item.name);
        divTag.style.left = document.getElementById("posX").value - 20 + "px";
        divTag.style.top = document.getElementById("posY").value - 20 + "px";
        var color = Object.keys(colors).find((color) => color === value);
        divTag.style.backgroundColor = colors[color];
      }
    });
  } else {
    arreglo[floor].push({
      name: name,
      x: parseInt(document.getElementById("posX").value),
      y: parseInt(document.getElementById("posY").value),
      type: value,
      service: val.length > 0 ? val : null,
      nodes: nodes.length > 0 ? nodes : null,
    });
    var liTag = document.createElement("li");
    liTag.id = name;

    liTag.innerHTML =
      name +
      `<button onclick='edit("` +
      name +
      `","` +
      floor +
      `")'>Editar</button> <button onclick='remove("` +
      name +
      `","` +
      floor +
      `")'>Remove</button>`;

    document.getElementById("list").appendChild(liTag);
    var divTag = document.createElement("div");
    divTag.className = "pointOnMap";
    divTag.style.left = document.getElementById("posX").value - 20 + "px";
    divTag.style.top = document.getElementById("posY").value - 20 + "px";
    divTag.onclick = function () {
      var isEdit = document.getElementById("id_node").value;
      var floor = document.getElementById("floor").value;      
      if (isEdit != 0) {
        appendNode(name);
      } else {
        edit(divTag.id.split("point_")[1], floor);
      }
    };

    var color = Object.keys(colors).find((color) => color === value);
    divTag.style.backgroundColor = colors[color];
    divTag.id = "point_" + name;
    var text = document.createElement("p");
    text.className = "text";
    text.innerHTML = name;
    divTag.appendChild(text);
    document.getElementsByTagName("body")[0].appendChild(divTag);
  }

  document.getElementById("service").value = "";
  document.getElementById("id_nodes").value = "";
  document.getElementById("id_node").value = "";
  document.getElementById("posX").value = "";
  document.getElementById("posY").value = "";
  document.getElementById("type").selectedIndex = 0;
}

function appendNode(name) {
  if (document.getElementById("id_nodes").value.length > 0) {
    document.getElementById("id_nodes").value =
      document.getElementById("id_nodes").value + "," + name;
  } else {
    document.getElementById("id_nodes").value = name;
  }
}

function remove(id, floor) {
  arreglo[floor].forEach((item, index, arr) => {
    if (item.name === id) {
      arr.splice(index, 1);
    }
  });
  document.getElementById(id).remove();
  document.getElementById("point_" + id).remove();
}

function edit(id, floor) {  
  arreglo[floor].forEach((item) => {
    if (item.name === id) {
      document.getElementById("id_node").value = id;
      document.getElementById("floor").value = floor;
      document.getElementById("posX").value = item.x;
      document.getElementById("posY").value = item.y;
      document.getElementById("type").selectedIndex = arrServices.indexOf(
        item.type
      );
      document.getElementById("service").value = item.service;
      document.getElementById("id_nodes").value = item.nodes;
    }
  });
}

function cancel() {
  document.getElementById("service").value = "";
  document.getElementById("id_nodes").value = "";
  document.getElementById("id_node").value = "";
  document.getElementById("type").selectedIndex = 0;
}

function showArrOnConsole() {
  console.log(arreglo);
}

function saveOnLocalStorage() {
  localStorage.setItem("arrayStore", JSON.stringify(arreglo));
  alert("saved");
}

function loadFromLocalStorage() {
  arreglo = JSON.parse(localStorage.getItem("arrayStore"));
  Object.keys(arreglo).forEach((key) => {
    arreglo[key].forEach((item) => {
      var liTag = document.createElement("li");
      liTag.id = item.name;
      liTag.innerHTML =
        item.name +
        `<button onclick='edit("` +
        item.name +
        `","` +
        key +
        `")'>Editar</button> <button onclick='remove("` +
        item.name +
        `","` +
        key +
        `")'>Remove</button>`;

      document.getElementById("list").appendChild(liTag);
      var divTag = document.createElement("div");
      divTag.className = "pointOnMap";
      divTag.style.left = item.x - 20 + "px";
      divTag.style.top = item.y - 20 + "px";
      divTag.onclick = function () {
        var isEdit = document.getElementById("id_node").value;
      var floor = document.getElementById("floor").value;      
      if (isEdit != 0) {
        appendNode(name);
      } else {
        edit(divTag.id.split("point_")[1], floor);
      }
      };

      var color = Object.keys(colors).find((color) => color === item.type);
      divTag.style.backgroundColor = colors[color];      
      divTag.id = "point_" + item.name;
      var text = document.createElement("p");
      text.className = "text";
      text.innerHTML = item.name;
      divTag.appendChild(text);
      document.getElementsByTagName("body")[0].appendChild(divTag);
    });
  });
}
