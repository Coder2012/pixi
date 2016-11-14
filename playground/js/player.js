class Player {
    constructor(container, x, y, ax) {
        this.container = container;
        // this.container.scale.set(0.5, 0.5);
        this.x = x;
        this.y = y;
 
        this.container.x = this.x;
        this.container.y = this.y;
    }
 
    animate(ax) {
        this.x += ax;

        if (this.x > window.innerWidth) {
            this.x = 0;
        }
 
        this.container.x = this.x;
        this.container.y = this.y;
    }
}

export default Player;