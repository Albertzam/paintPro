import { AfterViewInit, Component, HostListener, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {

  title = 'paintPro';
  isAvailable: boolean;
  isDrawin: boolean;
  @ViewChild('canvas', { static: false }) canvas: any;
  public width = 800;
  public height = 800;
  imageData;
  private cx: CanvasRenderingContext2D;
  private points: any[] = [];
  private x: any;
  private y: any;
  private fx: any;
  private fy: any;
  bounds;

  @HostListener('document:mousedown', ['$event'])
  onMouseDown = (e: any) => {
    if (!this.isDrawin && e.target.id == "canvasId") {
      this.x = e.clientX - this.bounds.left;
      this.y = e.clientY - this.bounds.left;
      this.isAvailable = true;
      this.isDrawin = true;
    }
    this.drawLine();
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove = (e: any) => {

    if ((e.target.id == "canvasId")) {
      this.fx = e.clientX - this.bounds.left;
      this.fy = e.clientY - this.bounds.top;
      if (this.isDrawin)
        this.drawLine();
    }
  }


  @HostListener('document:mouseup', ['$event'])
  onMouseUp = (e: any) => {
    if (e.target.id == "canvasId" && (this.isAvailable)) {
      if (this.isDrawin) {
        this.points.push({
          startX: this.x,
          startY: this.y,
          endX: this.fx,
          endY: this.fy
        });
        console.log(this.points);
        this.isDrawin = false;
        this.isAvailable = false;
      }
      this.drawLine();
    }
  }

  private drawLine() {
    this.cx.fillStyle = "white";
    this.cx.fillRect(0, 0, this.width, this.height);
    /* 
      for (var i = 0; i < this.points.length; ++i) {
        this.cx.beginPath();
        this.cx.moveTo(this.points[i].startX, this.points[i].startY);
        this.cx.lineTo(this.points[i].endX,this.points[i].endY);
        this.cx.stroke();
      }
      
      if (this.isDrawin) {
        this.cx.beginPath();
        this.cx.moveTo(this.x, this.y);
        this.cx.lineTo(this.fx, this.fy);
        this.cx.stroke();
      }  */
    for (var i = 0; i < this.points.length; ++i) {
      this.pintar(this.points[i].startX, this.points[i].startY, this.points[i].endX, this.points[i].endY);
    }

    if (this.isDrawin) {
      this.pintar(this.x, this.y, this.fx, this.fy);
    }

  }
  private setPixel(x, y) {
    var p = this.cx.createImageData(1, 1);
    p.data[0] = 0;
    p.data[1] = 0;
    p.data[2] = 0;
    p.data[3] = 255;
    this.cx.putImageData(p, x, y);
  }

  private pintar(s1, h1, s2, h2) {
    this.cx.fillStyle = "black";
    var x1 = Math.round(s1);
    var y1 = Math.round(h1);
    var x2 = Math.round(s2);
    var y2 = Math.round(h2);
    const dx = Math.abs(x2 - x1);
    const sx = x1 < x2 ? 1 : -1;
    const dy = Math.abs(y2 - y1);
    const sy = y1 < y2 ? 1 : -1;
    var error, len, rev, count = dx;
    this.cx.beginPath();

    if (dx > dy) {
      error = dx / 2;
      rev = x1 > x2 ? 1 : 0;
      if (dy > 1) {
        error = 0;
        count = dy - 1;
        do {
          len = error / dy + 2 | 0;
          this.cx.rect(x1 - len * rev, y1, len, 1);
          x1 += len * sx;
          y1 += sy;
          error -= len * dy - dx;
        } while (count--);
      }
      if (error > 0) { this.cx.rect(x1, y2, x2 - x1, 1) }
    } else if (dx < dy) {
      error = dy / 2;
      rev = y1 > y2 ? 1 : 0;
      if (dx > 1) {
        error = 0;
        count--;
        do {
          len = error / dx + 2 | 0;
          this.cx.rect(x1, y1 - len * rev, 1, len);
          y1 += len * sy;
          x1 += sx;
          error -= len * dx - dy;
        } while (count--);
      }
      if (error > 0) { this.cx.rect(x2, y1, 1, y2 - y1) }
    } else {
      do {
        this.cx.rect(x1, y1, 1, 1);
        x1 += sx;
        y1 += sy;
      } while (count--);
    }
    this.cx.fill();

  }


  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.render();
  }

  private render(): any {
    const canvasEl = this.canvas.nativeElement;
    this.bounds = canvasEl.getBoundingClientRect();

    this.cx = canvasEl.getContext('2d');

    canvasEl.width = this.width;
    canvasEl.height = this.height;

    this.canvas.lineWidth = 3;
    this.cx.lineCap = 'round';
    this.cx.strokeStyle = "#000";
    this.drawLine();
  }

  public clearCanvas() {
    this.points = [];
    this.cx.clearRect(0, 0, this.width, this.height);
  }
}
