function getLocation(){
  if(!navigator.geolocation){
    alert("Geolocation is not supported");
  }
  navigator.geolocation.getCurrentPosition((position)=>{
      document.getElementById("latitude").innerText = position.coords.latitude;
      document.getElementById("longitude").innerText = position.coords.longitude;
    }, (positionError)=>{
      console.log(positionError);
    },
    {
      enableHighAccuracy: false
    }
  );
}

let map = L.map('map').setView([53.430127, 14.564802], 18);
L.tileLayer.provider('Esri.WorldImagery').addTo(map);
let marker = L.marker([53.430127, 14.564802]).addTo(map);
marker.bindPopup("<strong>Hello!</strong><br>This is a popup.");

document.getElementById("saveButton").addEventListener("click", function() {
  leafletImage(map, function (err, canvas) {
    let rasterMap = document.getElementById("rasterMap");
    let rasterContext = rasterMap.getContext("2d");

    rasterContext.drawImage(canvas, 0, 0, 600, 300);
    initializeMapPuzzle(rasterMap);
  });
});

document.getElementById("getLocation").addEventListener("click", function(event) {
  if (! navigator.geolocation) {
    console.log("No geolocation.");
  }

  navigator.geolocation.getCurrentPosition(position => {
    console.log(position);
    let lat = position.coords.latitude;
    let lon = position.coords.longitude;

    map.setView([lat, lon]);
  }, positionError => {
    console.error(positionError);
  });
});

let items = document.querySelectorAll('.item');
for (let item of items) {
  item.addEventListener("dragstart", function(event) {
    this.style.border = "5px dashed #D8D8FF";
    event.dataTransfer.setData("text", this.id);
  });

  item.addEventListener("dragend", function(event) {
    this.style.borderWidth = "0";
  });
}

let targets = document.querySelectorAll(".drag-target");
for (let target of targets) {
  target.addEventListener("dragenter", function (event) {
    this.style.border = "2px solid #7FE9D9";
  });
  target.addEventListener("dragleave", function (event) {
    this.style.border = "2px dashed #7f7fe9";
  });
  target.addEventListener("dragover", function (event) {
    event.preventDefault();
  });
  target.addEventListener("drop", function (event) {
    let myElement = document.querySelector("#" + event.dataTransfer.getData('text'));
    this.appendChild(myElement)
    this.style.border = "2px dashed #7f7fe9";
  }, false);
}


function initializeMapPuzzle(imageCanvas) {
  const canvas = document.getElementById("puzzleCanvas");
  const context = canvas.getContext("2d");
  const section = document.getElementById("puzzleSection");
  const status = document.getElementById("puzzleStatus");
  const columns = 4;
  const rows = 4;
  const tileWidth = canvas.width / columns;
  const tileHeight = canvas.height / rows;
  const sourceTileWidth = imageCanvas.width / columns;
  const sourceTileHeight = imageCanvas.height / rows;
  let tiles = Array.from({ length: columns * rows }, (_, index) => index);
  let draggedTile = null;
  let notificationSent = false;

  for (let i = tiles.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
  }
  if (tiles.every((tile, index) => tile === index)) {
    [tiles[0], tiles[1]] = [tiles[1], tiles[0]];
  }

  section.hidden = false;

  function notifyPuzzleSolved() {
    if (notificationSent) {
      return;
    }
    notificationSent = true;

    if (!("Notification" in window)) {
      console.warn("System notifications are not supported by this browser.");
      return;
    }

    function showNotification() {
      new Notification("Puzzle solved!", {
        body: "Congratulations, you put the map back together."
      });
    }

    if (Notification.permission === "granted") {
      showNotification();
    } else if (Notification.permission === "default") {
      Notification.requestPermission().then(permission => {
        if (permission === "granted") {
          showNotification();
        }
      }).catch(error => {
        console.error("Could not request notification permission.", error);
      });
    }
  }

  function drawPuzzle() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    tiles.forEach((tile, slot) => {
      if (tile !== null) {
        context.drawImage(
          imageCanvas,
          (tile % columns) * sourceTileWidth,
          Math.floor(tile / columns) * sourceTileHeight,
          sourceTileWidth,
          sourceTileHeight,
          (slot % columns) * tileWidth,
          Math.floor(slot / columns) * tileHeight,
          tileWidth,
          tileHeight
        );
      }

      context.strokeStyle = "#fff";
      context.lineWidth = 2;
      context.strokeRect(
        (slot % columns) * tileWidth,
        Math.floor(slot / columns) * tileHeight,
        tileWidth,
        tileHeight
      );
    });

    if (draggedTile) {
      context.drawImage(
        imageCanvas,
        (draggedTile.tile % columns) * sourceTileWidth,
        Math.floor(draggedTile.tile / columns) * sourceTileHeight,
        sourceTileWidth,
        sourceTileHeight,
        draggedTile.x - tileWidth / 2,
        draggedTile.y - tileHeight / 2,
        tileWidth,
        tileHeight
      );
    }

    const correct = tiles.reduce((count, tile, slot) => count + (tile === slot ? 1 : 0), 0);
    status.textContent = correct === tiles.length
      ? "Puzzle solved!"
      : `Correct tiles: ${correct} / ${tiles.length}. Drag tiles to rearrange them.`;
    if (correct === tiles.length) {
      notifyPuzzleSolved();
    }
  }

  function getPosition(event) {
    const bounds = canvas.getBoundingClientRect();
    return {
      x: (event.clientX - bounds.left) * canvas.width / bounds.width,
      y: (event.clientY - bounds.top) * canvas.height / bounds.height
    };
  }

  canvas.onpointerdown = function(event) {
    const { x, y } = getPosition(event);
    const column = Math.floor(x / tileWidth);
    const row = Math.floor(y / tileHeight);
    const slot = row * columns + column;

    if (column < 0 || column >= columns || row < 0 || row >= rows || tiles[slot] === null) {
      return;
    }

    draggedTile = { tile: tiles[slot], slot, x, y };
    tiles[slot] = null;
    canvas.setPointerCapture(event.pointerId);
    drawPuzzle();
  };

  canvas.onpointermove = function(event) {
    if (!draggedTile) {
      return;
    }

    const position = getPosition(event);
    draggedTile.x = position.x;
    draggedTile.y = position.y;
    drawPuzzle();
  };

  canvas.onpointerup = function(event) {
    if (!draggedTile) {
      return;
    }

    const { x, y } = getPosition(event);
    const column = Math.floor(x / tileWidth);
    const row = Math.floor(y / tileHeight);
    if (column >= 0 && column < columns && row >= 0 && row < rows) {
      const destination = row * columns + column;
      [tiles[draggedTile.slot], tiles[destination]] = [tiles[destination], draggedTile.tile];
    } else {
      tiles[draggedTile.slot] = draggedTile.tile;
    }

    draggedTile = null;
    drawPuzzle();
  };

  canvas.onpointercancel = function() {
    if (draggedTile) {
      tiles[draggedTile.slot] = draggedTile.tile;
      draggedTile = null;
      drawPuzzle();
    }
  };

  drawPuzzle();
}
