import { Component } from '@angular/core';
import { JivaService } from './jiva.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Jiva Angular Example';

  constructor(private jivaService: JivaService) {

  }
}
