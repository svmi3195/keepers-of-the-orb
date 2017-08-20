function UI(tilemap, context){
    this.width = 100;
    this.height = 30;
    this.x = tilemap.cols * tilemap.tsize / 2 - this.width / 2;
    this.y = (tilemap.rows - 2) * tilemap.tsize + 5;
	this.buttons = [];

    this.selected = null;	
	
    this.themes = [{id: 0, name: 'black-golden', colors: ['#1a1a00', '#D4AF37']}, 
                   {id: 1, name: 'black-silver', colors: ['#1a1a1a', '#c0c0c0']},
                   {id: 2, name: 'black-purple', colors: ['#1a0033', '#bb33ff']}];
    this.backgroundColor = this.themes[0].colors[0];
    this.mainColor = this.themes[0].colors[1];

    this.select = function(obj){
        if(obj == this.selected){
            this.deselect();
        }else{
            this.selected = obj;
            console.log(this.selected);
        }        
    };

    this.deselect = function(){
        this.selected = null;
		this.buttons = [];
        console.log(this.selected);
    };

    this.render = function(){
        context.fillStyle = this.backgroundColor;   
        context.fillRect(this.x, this.y, this.width, this.height);
        context.strokeStyle = this.mainColor;
        context.lineWidth = 3;
        context.strokeRect(this.x, this.y, this.width, this.height);

        if(this.selected){
            var text = this.selected.name;            
            this.drawText(text);
			
			if(this.selected.name == 'Mage' && this.buttons.length == 0){
				this.createButtons(['shoot', 'go', 'rune']);
			}else if (this.selected.name != 'Mage'){
				this.buttons = [];
			}
        }
		
		if(this.buttons.length != 0){
			this.drawButtons();
		}
    };

    this.drawText = function(text){
        context.fillStyle = this.mainColor;
        context.font = '20px serif';
        context.fillText(text, this.x + 10, this.y + 22);
    };
	
	this.createButtons = function(buttons){
		for(var i = 0; i < buttons.length; i++){
			var btn = new Button(buttons[i], [this.x + this.width + i * 35 + 5, this.y]);
			this.buttons.push(btn);			
		}
	};

	this.drawButtons = function(){
		for(var i = 0; i < this.buttons.length; i++){
			context.drawImage(this.buttons[i].texture, this.buttons[i].x, this.buttons[i].y);
		}
	}
};

function Button(type, spawnPoint){
	this.texture = document.getElementById('button-' + type);
	this.x = spawnPoint[0];
	this.y = spawnPoint[1];
	this.width = this.texture.width;
    this.height = this.texture.height;
	this.type = type;	
}