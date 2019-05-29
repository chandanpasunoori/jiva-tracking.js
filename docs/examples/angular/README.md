# Jiva Angular example

This is a full working example that demostrates how to track Jiva events in an Angular (4.x) application.

## Running the application

From the ```jiva-angular-example``` folder, execute

```sh
$ npm install
$ npm start
```

Point your browser to http://localhost:4200/

## The application structure

There are 3 Angular components:
* App - the main component
* FirstPage - A form
* SecondPage - A dummy page simply to demonstrate tracking Jiva events on router changes

## Jiva tracking integration

An instance of JivaService is created when the application starts up and Jiva is initialized as described in the documentation.

There are 3 methods for recording Jiva events.

### Router navigation

```TypeScript
private recordRouterMavigationEvents() {
    this.router.events.subscribe( event => {
      if (event instanceof NavigationEnd) {
        this.client.recordEvent('pageView', {
          title: document.title
        });
      }
    });
  }
```

This method is called automatically when JivaService is created. Clicking "First Page" and "Second Page" will trigger Router events and pass them on to the "pageView" Jiva stream.

### Value selected in the dropdown

```TypeScript
public recordValueSelectedEvent( formName: string, field: string, newValue: string ) {
    this.client.recordEvent('valueSelected', {
      formName,
      field,
      newValue
    });
  }
```

* Stream: valueSelected
* formName - The name of the form, in the example it's always "uiStackSurvey"
* field - The name of the form field, in the example it's always "uiStack"
* newValue - The value, for example "Angular 2+"

### Form field focus

```TypeScript
public recordOnFocusEvent( formName: string, field: string ) {
    this.client.recordEvent('onFormFieldFocus', {
      formName,
      field
    });
  }
```

* Stream: onFormFieldFocus
* formName - The name of the form, in the example it's always "uiStackSurvey"
* field - The name of the form field, in the example it's either the input field, the dropdown or the submit button

The dropdown on FirstPage shows both how to record an event on focus and when the value has been changed:

```HTML
<mat-select placeholder="Favorite UI stack" 
            (change)=uiStackValueChanged() 
            (focus)="onFocus('uiStack')">
```

## Environments

When running ```$ npm start```, events are not sent to Jiva but just logged in the broswer console instead.

To actually track events:

* Set your projectId and writeKey in ```src/environments/environment.prod.ts```
* Run ```$ npm run start.prod```
