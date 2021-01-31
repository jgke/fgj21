import * as PIXI from 'pixi.js';

export interface SpriteOptions {
  speed?: number
}

export class MovableSprite extends PIXI.Sprite {
  data;
  previous_position;
  offset = {x: 0, y: 0};
  dragging: boolean;

  constructor(texture: PIXI.Texture, options?: SpriteOptions) {
    super(texture);
    this.interactive = true;

    // events for drag start
    this.on('mousedown', this.onDragStart)
    this.on('touchstart', this.onDragStart)
    // events for drag end
    this.on('mouseup', this.onDragEnd)
    this.on('mouseupoutside', this.onDragEnd)
    this.on('touchend', this.onDragEnd)
    this.on('touchendoutside', this.onDragEnd)
    // events for drag move
    this.on('mousemove', this.onDragMove)
    this.on('touchmove', this.onDragMove);
  }

  private onDragStart = (event) => {
    // store a reference to the data
    // the reason for this is because of multitouch
    // we want to track the movement of this particular touch
    this.data = event.data;
    this.dragging = true;

    const appCursorLocation = this.data.getLocalPosition(this.parent);
    // calculate the offset with the app cursor location - sprite location
    this.offset.x = appCursorLocation.x - this.x; 
    this.offset.y = appCursorLocation.y - this.y;
  }
  
  private onDragEnd = () => {
    this.dragging = false;
    
    // set the interaction data to null
    this.data = null;
    this.offset = {x: 0, y: 0};
  }
  
  private onDragMove = (event) => {
    if (this.dragging) {
      const newPosition = event.data.getLocalPosition(this.parent);
      
      this.position.x = (newPosition.x - this.offset.x);
      this.position.y = (newPosition.y - this.offset.y);

    }
  }
}