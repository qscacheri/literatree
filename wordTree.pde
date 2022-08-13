import controlP5.*;
ControlP5 cp5;
String [] treeArray;
int branchNum;
int counter=-1;
PFont f;
int wordCounter=0;
int currentLength=0;
float []currentVal=new float[3];
float []lastVal=new float[3];
int redVal=0;
int greenVal=0;
int blueVal=0;
boolean hid=false;
boolean isWhite=false;
int [] redArray={#660000, #cc0000, #e60000};
int [] greenArray={#006600, #00b300, #00ff00};
int [] blueArray={#002966, #0047b3, #0066ff};
int saveCounter=0;
String saveName;
int fileSelected=0;
String fileName;
int minSize=2;

void setup() {
  //PImage icon = loadImage("treeIcon.png");
  //  surface.setIcon(icon);
  //surface.setTitle("Word Tree");
  //fullScreen();
  size(displayWidth, displayHeight);
  background(0);
  cp5=new ControlP5(this);
  f = createFont("helvetica neue", 16, true);
  textFont(f, 20);
  selectScreen();
}

void draw() {
  if (fileSelected==1) {
    stringSetup();
    cp5.getController("open").setColorBackground(0);
    cp5.getController("open").setColorLabel(0);
    cp5.getController("open").setColorValue(0); 
    cp5.getController("open").setColorActive(0); 
    cp5.getController("open").setColorForeground(0); 
    fileSelected++;
  } else if (fileSelected==2) {
    cp5.getController("open").hide();
    updateSliders();
  }
}

void mouseClicked() {
}

String breakArray(String []a) {
  String s="";
  for (int i=0; i<a.length; i++) {
    s+=a[i];
  }
  return s;
}  

void textAtAngle(String s, float x, float y, float l, float a) {
  textFont(f, l);
  float angle=radians(a);
  float xSlope=cos(angle)*l;
  float ySlope=sin(angle)*l;
  currentLength=s.length();
  for (int i=0; i<s.length(); i++) {
    textAlign(CENTER);
    text(s.charAt(i), x+(i*xSlope), y-(i*ySlope));
  }
}



void drawTree3(float x, float y, int l, int a) {

  if (l>minSize) {
    wordCounter++;
    //println(wordCounter);
    counter++;
    strokeWeight(2);
    if (isWhite==false)
      fill(random(redVal), random(greenVal), random(blueVal)) ;   
    else
      fill(#ffffff) ; 
    float [] newXY=new float[2];
    newXY[0]=getNewXY(treeArray[counter], x, y, l, a)[0];
    newXY[1]=getNewXY(treeArray[counter], x, y, l, a)[1];
    strokeWeight(3);
    if (a>90) {
      textAtAngle(flipString(treeArray[counter]), x+getSlope(20, a)[0], y+getSlope(20, a)[1], l, a);
    } else
      textAtAngle(treeArray[counter], x+getSlope(20, a)[0], y+getSlope(20, a)[1], l, a);



    drawTree3(newXY[0], newXY[1], l-2, a+30);
    drawTree3(newXY[0], newXY[1], l-2, a-30);
  }
}


float[] lineAngle(float x, float y, int l, int a) {
  float [] array=new float[2];
  float angle=radians(a);
  float xSlope=cos(angle)*l;
  float ySlope=sin(angle)*l;
  line(x, y, x+xSlope, y-ySlope);
  array[0]=x+xSlope;
  array[1]=y-ySlope;
  return array;
}

float [] getSlope(float l, float a) {
  float []slope=new float[2];
  float angle=radians(a);
  float xSlope=cos(angle)*l;
  float ySlope=sin(angle)*l;
  slope[0]=xSlope;
  slope[1]=ySlope;
  return slope;
}

float [] getNewXY(String s, float x, float y, float l, float a) {
  float []newXY=new float[2];
  float angle=radians(a);
  float xSlope=cos(angle)*l;
  float ySlope=sin(angle)*l;
  currentLength=s.length();
  for (int i=0; i<s.length(); i++) {
    newXY[0]=x+(i*xSlope);
    newXY[1]=y-(i*ySlope);
  }
  return newXY;
}

String flipString(String s) {
  String flipped="";
  for (int i=s.length()-1; i>=0; i--) {
    flipped+=s.charAt(i);
  }
  return flipped;
}

void keyPressed() {
  if (key=='r'||key=='R')
    newTree();
  if (key=='h'||key=='H') {
    hid=!hid;
    if (hid)
      fakeHide();
    else
      fakeShow();
  }
  if (key=='s'||key=='S') {
    saveCounter++;
    saveName=("tree("+redVal+","+greenVal+","+blueVal+"#"+saveCounter);
    save(saveName);
  }
}


void drawSlider() {
  cp5.addSlider("Slider1").
    setPosition(1200, 100)
    .setSize(200, 20)
    .setLabel("Red")
    .setColorBackground(#660000)  
    .setColorForeground(#cc0000)
    .setColorActive(#e60000)
    .setMax(255)
    ;
  cp5.addSlider("Slider2").
    setPosition(1200, 150)
    .setSize(200, 20)
    .setLabel("Green")
    .setMax(255)
    .setColorBackground(#006600)  
    .setColorForeground(#00b300)
    .setColorActive(#00ff00);
  cp5.addSlider("Slider3").
    setPosition(1200, 200)
    .setLabel("Blue")
    .setSize(200, 20)
    .setColorBackground(#002966)   
    .setColorForeground(#0047b3)
    .setColorActive(#0066ff)
    .setMax(255);

  cp5.addButton("button")
    .setPosition(1200, 240)
    .setLabel("White")
    .setColorBackground(#f2f2f2)
    .setColorActive((#bfbfbf))
    .setColorForeground(#ffffff)
    .setColorLabel(0);
}

void newTree() {
  background(0);
  counter=-1;
  drawTree3(displayWidth/2, displayHeight-24, 24, 90);
}

void updateSliders() {


  currentVal[0]=cp5.getController("Slider1").getValue();
  currentVal[1]=cp5.getController("Slider2").getValue();
  currentVal[2]=cp5.getController("Slider3").getValue();

  if (currentVal[0]!=lastVal[0]) {
    newTree();
    lastVal[0]=currentVal[0];
  }
  if (currentVal[1]!=lastVal[1]) {
    newTree();
    lastVal[1]=currentVal[1];
  }
  if (currentVal[2]!=lastVal[2]) {
    newTree();
    lastVal[2]=currentVal[2];
  }

  redVal=(int)cp5.getController("Slider1").getValue();
  greenVal=(int)cp5.getController("Slider2").getValue();
  blueVal=(int)cp5.getController("Slider3").getValue();
}

public void button(int theValue) {
  isWhite=!isWhite;
  newTree();
  if (isWhite) {
    cp5.getController("Slider1").hide();
    cp5.getController("Slider2").hide();
    cp5.getController("Slider3").hide();
  } else {
    cp5.getController("Slider1").show();
    cp5.getController("Slider2").show();
    cp5.getController("Slider3").show();
  }
}

void fakeHide() {
  cp5.getController("Slider1").setColorBackground(0);
  cp5.getController("Slider1").setColorLabel(0);
  cp5.getController("Slider1").setColorValue(0); 
  cp5.getController("Slider1").setColorActive(0); 
  cp5.getController("Slider1").setColorForeground(0); 

  cp5.getController("Slider2").setColorBackground(0);
  cp5.getController("Slider2").setColorLabel(0);
  cp5.getController("Slider2").setColorValue(0); 
  cp5.getController("Slider2").setColorActive(0); 
  cp5.getController("Slider2").setColorForeground(0); 

  cp5.getController("Slider3").setColorBackground(0);
  cp5.getController("Slider3").setColorLabel(0);
  cp5.getController("Slider3").setColorValue(0);
  cp5.getController("Slider3").setColorActive(0); 
  cp5.getController("Slider3").setColorForeground(0); 

  cp5.getController("button").setColorBackground(0);
  cp5.getController("button").setColorLabel(0);
}

void fakeShow() {
  cp5.getController("Slider1").setColorBackground(redArray[0]);
  cp5.getController("Slider1").setColorLabel(#ffffff);
  cp5.getController("Slider1").setColorValue(#ffffff); 
  cp5.getController("Slider1").setColorActive(redArray[2]); 
  cp5.getController("Slider1").setColorForeground(redArray[1]); 

  cp5.getController("Slider2").setColorBackground(greenArray[0]);
  cp5.getController("Slider2").setColorLabel(#ffffff);
  cp5.getController("Slider2").setColorValue(#ffffff); 
  cp5.getController("Slider2").setColorActive(greenArray[2]); 
  cp5.getController("Slider2").setColorForeground(greenArray[1]); 

  cp5.getController("Slider3").setColorBackground(blueArray[0]);
  cp5.getController("Slider3").setColorLabel(#ffffff);
  cp5.getController("Slider3").setColorValue(#ffffff);
  cp5.getController("Slider3").setColorActive(blueArray[2]); 
  cp5.getController("Slider3").setColorForeground(blueArray[1]); 


  cp5.getController("button").setColorBackground(#f2f2f2);
  cp5.getController("button").setColorActive((#bfbfbf));
  cp5.getController("button").setColorForeground(#ffffff);
  cp5.getController("button").setColorLabel(0);
}



void fileSelected(File selection) {
  if (selection == null) {
    println("Window was closed or the user hit cancel.");
  } else {
    fileName=selection.getAbsolutePath();
    fileSelected=1;
  }
}


void selectScreen() {
  //textAlign(LEFT);
  text("•Press H to hide menu", displayWidth/2-100, (displayHeight/12)*8);
  text("•Press S to to save", displayWidth/2-100, (displayHeight/12)*9);
  text("•Press R to generate a new tree", displayWidth/2-100, (displayHeight/12)*10);
  cp5.addButton("open").
    setPosition(displayWidth/2-200, displayHeight/2)
    .setSize(400, 40)
    .setLabel("open")
    .setColorLabel(#000000)
    .setColorBackground(#660000)  
    .setColorForeground(#A8F7F8)
    .setColorActive(#A8F7F8)
    .setMax(255)
    ;
  cp5.getController("open").setColorBackground(#ffffff);
}

void open(int theValue) {
  selectInput("Select a file to process:", "fileSelected");
}

void stringSetup() {
  background(0);
  String[] lines = loadStrings(fileName);
  String toTree=breakArray(lines);
  toTree=toTree.replaceAll(",", "");
  toTree=toTree.replaceAll("\"", "");
  treeArray=toTree.split(" ");
  counter=-1;
  branchNum=(int)(log(treeArray.length)/log(2));
  println("length is "+treeArray.length);
  minSize=(int)(log(treeArray.length)/log(2));
  minSize=abs(24-(minSize*2));
  if (minSize<1) minSize=1;
  println("min size = "+minSize);
  drawTree3(720, 875, 24, 90);
  //save("treeP.tif");
  drawSlider();
}
