import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import Jiva from '@jiva/jiva-tracking';
import { environment } from '../environments/environment';

@Injectable()
export class JivaService {
  private client: Jiva;

  constructor( public router: Router ) {
    this.initJiva();
    this.recordRouterMavigationEvents();
  }

  private initJiva() {
    const { projectId, writeKey } = environment;
    
    this.client = new Jiva({
      projectId,
      writeKey
    });

    if (!environment.production) {
      Jiva.enabled = false;
      Jiva.debug = true;
  
      this.client.on('recordEvent', (event, data) => {
        console.log('event:', event);
        console.log('data:', data);
      });
    }

    const timer = Jiva.utils.timer();
    timer.start();
    
    // Batch-record events every 5s
    this.client.queueInterval(5);

    this.client.extendEvents(() => {
      return {
        geo: {
          info: { /* Enriched */ },
          ip_address: '${jiva.ip}',
        },
        page: {
          info: { /* Enriched */ },
          title: document.title,
          url: document.location.href
        },
        referrer: {
          info: { /* Enriched */ },
          url: document.referrer
        },
        tech: {
          browser: Jiva.helpers.getBrowserProfile(),
          info: { /* Enriched */ },
          user_agent: '${jiva.user_agent}'
        },
        time: Jiva.helpers.getDatetimeIndex(),
        visitor: {
          time_on_page: timer.value()
          /* Include additional visitor info here */
        },
        jiva: {
          addons: [
            {
              name: 'jiva:ip_to_geo',
              input: {
                ip: 'geo.ip_address'
              },
              output : 'geo.info'
            },
            {
              name: 'jiva:ua_parser',
              input: {
                ua_string: 'tech.user_agent'
              },
              output: 'tech.info'
            },
            {
              name: 'jiva:url_parser',
              input: {
                url: 'page.url'
              },
              output: 'page.info'
            },
            {
              name: 'jiva:referrer_parser',
              input: {
                referrer_url: 'referrer.url',
                page_url: 'page.url'
              },
              output: 'referrer.info'
            }
          ]
        }
      };
    });
  }
 
  private recordRouterMavigationEvents() {
    this.router.events.subscribe( event => {
      if (event instanceof NavigationEnd) {
        this.client.recordEvent('pageView', {
          title: document.title
        });
      }
    });
  }

  public recordValueSelectedEvent( formName: string, field: string, newValue: string ) {
    this.client.recordEvent('valueSelected', {
      formName,
      field,
      newValue
    });
  }

  public recordOnFocusEvent( formName: string, field: string ) {
    this.client.recordEvent('onFormFieldFocus', {
      formName,
      field
    });
  }
}
