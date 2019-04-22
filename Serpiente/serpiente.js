$(document).ready(function() {
	
	// Creamos un contexto 2d de nuestro canvas
	var canvas = $("#snake")[0];
	var context = canvas.getContext("2d");
	var width = $("#snake").width();
	var height = $("#snake").height();

	var cellWidth = 10;
	var d;
	var food;
	var score;
	var level = 1; // 1 El nivel más lento, 10 el nivel más rápido.
	// contiene el listado de celdas por donde pasa la serpiente
	var snake;
	
	// El juego tiene la dirección "right" por defecto y se ejecuta la función paint
	// dependiendo el nivel que hayas configurado arriba
	function init()
	{
		d = "right"; 
		createSnake();
		createFood();
		score = 0;

		if(typeof gameLoop != "undefined") {
			clearInterval(gameLoop);
		}
 
		gameLoop = setInterval(paint, 500 / level);
	}
 
	init();

	// Creamos la serpiente
	function createSnake()
	{
		var length = 5;
		snake = []; 
 
		for(var i = length - 1; i >= 0; i--)
		{
			snake.push({ x: i, y: 0 });
		}
	}

	//Creamos el recuado que tiene que comerse la serpiente
	function createFood()
	{
		food = {
			x: Math.round(Math.random() * (width - cellWidth) / cellWidth), 
			y: Math.round(Math.random() * (height - cellWidth) / cellWidth), 
		};
	}

	//Dibujamos la serpiente
	function paint()
	{
		context.fillStyle = "#ccc";
		context.fillRect(0, 0, width, height);
		context.strokeStyle = 'black';
		context.strokeRect(0, 0, width, height);
		
		var nx = snake[0].x;
		var ny = snake[0].y;
		
		if (d == "right") {
			nx++;
		} else if (d == "left") {
			nx--;
		} else if (d == "up") {
			ny--;
		} else if (d == "down") {
			ny++;
		}
		
		if (nx == -1 || nx == width / cellWidth || ny == -1 || ny == height / cellWidth || checkCollision(nx, ny, snake)) {			
			init();
 			return;
		}
		
		if(nx == food.x && ny == food.y) {
			var tail = {
				x: nx, 
				y: ny
			};
			score++;
			createFood();
		} else {
			var tail = snake.pop(); 
 
			tail.x = nx;
			tail.y = ny;
		}
		
		snake.unshift(tail); 
		
		for(var i = 0; i < snake.length; i++) {
			var c = snake[i];
			paintCell(c.x, c.y);
		}

		paintCell(food.x, food.y);
		
		var scoreText = "Score: " + score;
		
		context.fillText(scoreText, 5, height - 5);
	}
	
	//Pintamos la celda	
	function paintCell(x, y)
	{
		context.fillStyle = "blue";
		context.fillRect(x * cellWidth, y * cellWidth, cellWidth, cellWidth);
		context.strokeStyle = 'white';
		context.strokeRect(x * cellWidth, y * cellWidth, cellWidth, cellWidth);
	}
	
	//Verificiamos si hubo alguna colisión (si la hubo el juego se reinicia)
	function checkCollision(x, y, array)
	{
		for(var i = 0; i < array.length; i++)
		{
			if(array[i].x == x && array[i].y == y) {
				return true;
			}
		}
 		return false;
	}
		
	// Capturamos la pulsación de las teclas
	$(document).keydown(function(e) {
		var key = e.which;
		
		if (key == "37" && d != "right") {
			d = "left";
		} else if (key == "38" && d != "down") {
			d = "up";
		} else if (key == "39" && d != "left") {
			d = "right";
		} else if (key == "40" && d != "up") {
			d = "down";
		}
	});
});
