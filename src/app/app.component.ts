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
        this.isDrawin = false;
        this.isAvailable = false;
      }
      this.drawLine();
    }
  }


  private drawLine() {
    this.cx.fillRect(0, 0, this.width, this.height);
    this.cx.lineWidth = 2;
  
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
    }
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
    this.cx.strokeStyle = "#fff";
    this.drawLine();
  }
  
  public clearCanvas() {
    this.points = [];
    this.cx.clearRect(0, 0, this.width, this.height);
  }
}
