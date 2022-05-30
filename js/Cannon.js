class Cannon{

    constructor(x, y, w, h, angle){

        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.angle = angle;

        
        this.cannon_base = loadImage("/assets/cannonBase.png");
        this.cannon_img = loadImage("/assets/canon.png");

    }

    display(){

        if (keyIsDown(LEFT_ARROW) && this.angle > -30){
            this.angle -= 1;
        }
        if (keyIsDown(RIGHT_ARROW) && this.angle < 70){
            this.angle += 1;
        }

        push();
        translate(this.x, this.y);
        rotate(this.angle);
        imageMode(CENTER);
        image(this.cannon_img,0,0, this.w, this.h);
        pop();


        image(this.cannon_base, 50,20,200,200);
        

    }



}