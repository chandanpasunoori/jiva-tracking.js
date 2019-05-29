import { Component, OnInit } from '@angular/core';
import { JivaService } from '../jiva.service';

@Component({
  selector: 'app-first-page',
  templateUrl: './first-page.component.html',
  styleUrls: ['./first-page.component.css']
})
export class FirstPageComponent implements OnInit {
  private uiStack = 'Angular 2+';
  private name = '';
  private submitMessage = '';

  constructor( private jivaService: JivaService ) { }

  ngOnInit() {
  }

  private uiStackValueChanged() {
    this.jivaService.recordValueSelectedEvent( 'uiStackSurvey', 'uiStack', this.uiStack);
  }

  private onSubmit() {
    this.submitMessage = `Thank you for taking the survey! You (${this.name}) seem to like ${this.uiStack}.`;

    setTimeout(() => {
      this.submitMessage = '';
    }, 5000);
  }

  private onFocus(formField: string) {
    this.jivaService.recordOnFocusEvent('uiStackSurvey', formField);
  }
}
