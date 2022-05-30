class CannonBall{

    constructor(x, y){

        this.r = 30;
        this.body = Bodies.circle(x, y, this.r, {isStatic: true});
        this.image = loadImage("./assets/cannonball.png");
        
        this.trajectory = [];
        
        this.speed = 0.05
        this.animation = [this.image];

        World.add(world, this.body);

    }

    animate(){
        this.speed += 0.05
    }

    display(){

        

        var pos = this.body.position;
        var index = floor(this.speed % this.animation.length);

        push();
        imageMode(CENTER);
        image(this.animation[index], pos.x, pos.y, this.r, this.r);
        pop();

        if(this.body.velocity.x > 0 && this.body.position.x > 200){
            var position = [this.body.position.x, this.body.position.y]
            this.trajectory.push(position);
        }

        for (var i= 0; i < this.trajectory.length; i++)
            image(this.image, this.trajectory[i][0], this.trajectory[i][1], 5,5)
        }
        
    shoot(){

        var newAngle = cannon.angle - 28;
        newAngle = newAngle *(3.14/180)

        var velocity = p5.Vector.fromAngle(newAngle);
        velocity.mult(0.5);
        
        Body.setStatic(this.body, false)

        Body.setVelocity(this.body, {
            x: velocity.x *(180/3.14), 
            y: velocity.y *(180/3.14)
        });




    }

    remove(index){

        Body.setVelocity(this.body, {x:0, y:0})

        this.animation = waterSplashAnimation;
        this.speed = 0.05;
        this.r = 150;

        setTimeout(() => {

            World.remove(world, this.body)
            delete balls[index];

        }, 1000);
    }

    removeImediate(index){
        World.remove(world, this.body)
        delete balls[index];
    }
}

