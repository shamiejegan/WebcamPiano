class Grid {
  /////////////////////////////////
  constructor(_w, _h,monoSynth) {
    this.gridWidth = _w;
    this.gridHeight = _h;
    this.noteSize =40;
    this.notePos = [];
    this.noteState = [];
    // this.keys=['B','A#','A','G#','G','F#','F','E','D#','D','C#','C'];
    this.keys=['A','G','F','D','C'];
    this.monoSynth=monoSynth;

    // initalise grid structure and state
    for (var x=0;x<_w;x+=this.noteSize){
      var posColumn = [];
      var stateColumn = [];
      for (var y=0;y<_h;y+=this.noteSize){
        posColumn.push(createVector(x+this.noteSize/2,y+this.noteSize/2));
        stateColumn.push(0);
      }
      this.notePos.push(posColumn);
      this.noteState.push(stateColumn);
    }
  }
  /////////////////////////////////
  run(img) {
    img.loadPixels();
    this.findActiveNotes(img);
    this.drawActiveNotes(img);
  }
  /////////////////////////////////
  drawActiveNotes(img){

    // draw active notes
    fill(255);
    noStroke();
    for (var i=0;i<this.notePos.length;i++){
      for (var j=0;j<this.notePos[i].length;j++){
        var x = this.notePos[i][j].x;
        var y = this.notePos[i][j].y;
        if (this.noteState[i][j]>0) {

          //change opacity based on height 
          var alpha = map(j,0,this.notePos[i].length,250, 150);

          //color determined by location on x using rgb 
          var r=map(i,0,this.notePos.length,255,0);
          if(i<this.notePos.length){
            var g=map(i,0,this.notePos.length/2,0,255);
          }
          else{
            var g=map(i,this.notePos.length/2,this.notePos.length/2,255,0);
          }
          var b=map(i,0,this.notePos.length,0,255);
          fill(r,g,b,alpha);

          var s = this.noteState[i][j]; 

          //changed shape based on noteState
          angleMode(DEGREES);
          var theta_start=map(this.noteState[i][j],0,1,90,-90);
          var theta_end=map(this.noteState[i][j],0,1,90,270);;
          arc(x, y, this.noteSize*s, this.noteSize*s, theta_start,theta_end);

          var octave = 8-floor((i+1)/this.keys.length);
          var note = this.keys[(i+1)%this.keys.length]+octave;
          console.log(note);
          // note velocity (volume, from 0 to 1)
          let velocity = random();
          // time from now (in seconds)
          let time = random(0,0.05);
          // note duration (in seconds)
          let dur = this.noteState[i][j]/10;
        
          this.monoSynth.play(note, velocity, time, dur);
        }
        this.noteState[i][j]-=0.1;
        this.noteState[i][j]=constrain(this.noteState[i][j],0,1);
      }
    }
  }
  /////////////////////////////////
  findActiveNotes(img){
    for (var x = 0; x < img.width; x += 1) {
        for (var y = 0; y < img.height; y += 1) {
            var index = (x + (y * img.width)) * 4;
            var state = img.pixels[index + 0];
            if (state==0){ // if pixel is black (ie there is movement)
              // find which note to activate
              var screenX = map(x, 0, img.width, 0, this.gridWidth);
              var screenY = map(y, 0, img.height, 0, this.gridHeight);
              var i = int(screenX/this.noteSize);
              var j = int(screenY/this.noteSize);
              this.noteState[i][j] = 1;
            }
        }
    }
  }
}
