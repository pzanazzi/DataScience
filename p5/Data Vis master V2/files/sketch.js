var columns = []; //column objects
var padding = 100; // padding arund screen edge
var maxHeight = []; //array for height that column[] needs to be draw to
var startHeight = 0; //inital size of columns[]
var colWidth; // width of columns
var table; // table object thing
var yAxisHeight; //calc for scale on y-axis
var numberColumns; //this is borked but meant to store number of columns for keypress
var numberRows; // the number of Rows in the csv file
var colNum = 1; //column zero, is index of x-axis currently un used except for title in (0,0)
var maxY; //this should be dynamic so as to find max value in array and be set to next significant value
var display = 0; //flag for menu or main loop
var maxArray = [];
var maxRow = [];
var maxtest; //max value form data
var index = 0; //flag for while loop in set up
var bert = 10;//multiplyer to find size of maxtest  CHANGE BERT
var newthing; //im running out of variable names!
var output;
var monthArray = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
var autoLoop = -1;

function preload() {
//  table = loadTable("assets/P01 & V08 Rec.csv", "csv");
//	table = loadTable("assets/P01 & V08 Rev.csv", "csv");
//	table = loadTable("assets/P01 Rec times.csv", "csv");
//	table = loadTable("assets/P01 Rev times.csv", "csv");
//	table = loadTable("assets/V08 monthly rec.csv", "csv");
//	table = loadTable("assets/V08 time to Rec.csv", "csv");
//	table = loadTable("assets/V08 time to Rev.csv", "csv");
//	table = loadTable("assets/E01 REC per year.csv", "csv");
//	table = loadTable("assets/3 Year Review Licences.csv", "csv");
    table = loadTable("assets/3 Year D01 Only.csv", "csv");
}

function setup() {
	
    numberColumns = table.getColumnCount();
    numberRows = table.getRowCount();
    
    createCanvas(innerWidth, innerHeight - 10); 
    yAxisHeight = innerHeight - (padding*2); 
    colWidth = (innerWidth - (padding * 2)) / (numberRows +1) - 1;
    
    //create column objects for drawing
    for (let i = 0; i < numberRows; i++) {
        columns[i] = new column((colWidth +1) * i + padding, height - padding - startHeight,colWidth, startHeight);
    }
	//these loops work out the largest value in the data ignoring zero row and zero column
	for(let i = 1; i <numberColumns; i++){
		for(let j = 1; j<numberRows;j++){
			maxRow[j-1] = table.getString(j,i);
		}
		maxArray[i - 1]= max(maxRow);
	}
	
	maxtest = max(maxArray);
	
	//loop to find size of largest number in array and set maxY to next largest round number
	while(index==0){
	 output = maxtest / bert;				//BERT HERE
		//print(output); 
		if(output >1){
			bert = bert * 10;
		}else{
			newthing = ceil(output *10);
			maxY = newthing * (bert/10);
			index = 1;
		}

		
	}
	
//debugging
	//typeof(maxY);
	//print(maxY);
	//print(maxtest);
	//print(numberRows);
    //print(numberColumns);
    //print(typeof(numberColumns));
	//print(table.getRowCount);


}

function draw() {
//start screen for input select
 if(display == 0){
        background(50);
        fill(80,100,250);
        ellipse(width / 2, height / 2, 100, 100);
        textSize(28);
        fill(250);
        text("Start", (width /2)-28, (height / 2)-15, 100, 100);
	 
	 if(autoLoop > 0){
		 fill('GREEN');
	 }else{
		 fill('RED');
	 }
	 	
	 ellipse(50,50,50,50);
	 fill(255);
	 text('Auto Loop', 80, 35 , 200, 100);
 }

//main loop for drawing graphs
 if(display == 1){
    //set max height to table entry and map the value to the scale of y-axis, except for zero element as this is sudo header for year display
    for (var i = 0; i < numberRows; i++){
        if(i==0){
            maxHeight[i]=table.getNum(i,colNum);
        }else{
        maxHeight[i] = map(table.getNum(i, colNum),0 , maxY , 0 ,yAxisHeight);
        }
    }
	 
    //draw stuff and update new positions in table
    background(50);
    for(var i=0; i< columns.length; i++){
        columns[i].display();
        columns[i].move(maxHeight[i+1]);
    }
    
    //draw UI
    stroke(255);
    line(padding, height - padding, padding, padding); // y-axis
    line(padding, height - padding, width -padding, height - padding); //x-axis
    for (var i= 1; i< columns.length; i++){
        line((colWidth +1) *i + (padding - colWidth/2), height - padding, (colWidth +1) * i + (padding - colWidth/2), height - (padding - 5));
    }
    
    // chart title
    textSize(32); 
    noStroke();
    fill(255);
        text(table.getString(0,0), width /4, 10, 1000, 100);
    
    //text for x-axis scale 
    if(numberRows == 13){// unique draw for months
		for (var i= 1; i< columns.length; i++){
			line((colWidth +1) *i + (padding - colWidth/2), height - padding, (colWidth +1) * i + (padding - colWidth/2), height - (padding - 5));
			textSize(32); 
			noStroke();
			fill(255);
			text(monthArray[i-1],(colWidth +1) *i + (padding - colWidth/2), height - padding, (colWidth +1) * i + (padding - colWidth/2), height - (padding - 5));
    	}//Draw if 20 cat values for liscence types
	}else if(numberRows == 21){
		    for(let i=1; i < numberRows; i++){
            	text(table.getString(i,0), (colWidth +1) *i + (padding/2), height - padding, (colWidth +1) * i + (padding - colWidth/2), height - (padding - 5));
        	}//draw for all else
	}else{
		for(let i = 0; i< 6; i++){
			textSize(20);
			text(floor(i* ((numberRows-1)/5)), (((innerWidth - (padding*2)) /5) * i) + padding-10, height - (padding/2) -30, 100, 100); 
		}
	}
    //text for y axis scale
    for(let i =0;i< 6; i++){
        text(maxY - (i*(maxY/5)),2 , (((height- (padding*2)) / 5) * i) + padding -10, 100, 100);
    }
    
    //text for which year is being displayed
    textSize(50);
    fill(200);
    text(maxHeight[0], width - (padding * 4), padding, padding, padding); //parse headers from zero row
 }
}//end of draw()

function column(x, y, w, h){
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.speed = 10;
    
    this.display = function(){
        fill(80, 150, 250);
        noStroke();
        rect(this.x, this.y, this.w, this.h);
    }
    
    //update positions of hight and length of columns
    this.move = function(limit){
        this.limit = limit;
        
        if(this.limit > this.h){
            this.h += 1;
            this.y -= 1;
        }
        if(this.limit < this.h){
            this.h -= 1;
            this.y += 1;
        }
    }
}

//add up for auto looping and down to cancel auto loop
function keyPressed(){
    if(keyCode === RIGHT_ARROW){
        colNum++
            if(colNum > numberColumns -1){
                colNum =1;
            }
    }
    if(keyCode === LEFT_ARROW){
        colNum--
            if(colNum < 1){
                colNum = numberColumns -1;
            }
    }
}

function mousePressed() {
    var d= dist(mouseX, mouseY, width /2, height /2);
    if(d<50){
        display =1;
    }
	
	var d2 = dist(mouseX,mouseY,50,50);
	if(d2 < 25){
	   autoLoop = autoLoop * -1
	   }
}