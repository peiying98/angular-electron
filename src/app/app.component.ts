import * as $ from 'jquery';
import { Component, OnInit } from '@angular/core';
import { ElectronService } from './core/services';
import { TranslateService } from '@ngx-translate/core';
import { AppConfig } from '../environments/environment';

import {SeoService} from './service/seo/seo.service';
import { filter, map, mergeMap } from 'rxjs/operators';
import {Router, ActivatedRoute,  NavigationEnd} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'app';
  mobile: Boolean = false;

  constructor(
    public electronService: ElectronService,
    private translate: TranslateService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public _seoService: SeoService
  ) {
    translate.setDefaultLang('en');
    console.log('AppConfig', AppConfig);

    if (electronService.isElectron) {
      console.log(process.env);
      console.log('Mode electron');
      console.log('Electron ipcRenderer', electronService.ipcRenderer);
      console.log('NodeJS childProcess', electronService.childProcess);
    } else {
      console.log('Mode web');
    }
  }

  ngOnInit() {

    //   this.router.events.pipe(
    //   filter((event) => event instanceof NavigationEnd),
    //   map(() => this.activatedRoute),
    //   map((route) => {
    //     while (route.firstChild){
    //       route = route.firstChild;
    //     } 
    //     return route;
    //   }),
    //   filter((route) => route.outlet === 'primary'),
    //   mergeMap((route) => route.data)
    //  )
    //  .subscribe((event) => {
    //   // // this._seoService.addTag(event['title'],event['description'],event['ogUrl'])
    //   //  this._seoService.updateTitle(event['title']);
    //   //  this._seoService.updateOgUrl(event['ogUrl']);
    //   //  // Updating Description tag dynamically with title
    //   //  this._seoService.updateDescription(event['description'])
    //   this._seoService.generateTags({
    //     title: event.title, 
    //     description: event.description, 
    //     image: event.image,
    //     url: event.ogUrl,
    //     slug: 'homepage'
    //   });
      
    //  }); 

    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map(() => this.activatedRoute),
      map((route) => {
       
        while (route.firstChild){
          route = route.firstChild;
        } 
        
        return route;
      }),
      filter((route) => route.outlet === 'primary'),
      mergeMap((route) => route.url)
     ).map(data=> {
       let route =[];
       data.forEach(ele=>{
         route = route.concat(ele.path)
       })
       return route;
     })
     .pipe()
     .subscribe((event) => {
      if(event[0] === 'canvas'){
        this._seoService.getMeta(`${event[0]}/${event[2]}`).pipe().subscribe(data=>{
          this._seoService.generateTags({
            title: `${data['Title']} | Pitchspot`, 
            description: data['ProblemStatement'], 
            url: `${window.location.href}`,
            image: `${window.location.origin}/assets/images/meta_image.png`
          });
        });
      
      }else if((event[0] === 'user')){

        this._seoService.getMeta(`users/${event[1]}`).pipe().subscribe(data=>{
          this._seoService.generateTags({
            title: `${data['firstName']} | Pitchspot`, 
            description: `View ${data['firstName']}'s innovation portfolio on Pitchspot`, 
            url: `${window.location.href}`,
            image: data['profileImg']
          });
        });

      }else if((event[0] === 'toolkit')){
        this._seoService.generateTags({
          title: `Pitchspot | Your global launchpad for ideas`, 
          description: `Pitchspot is the world’s smartest innovation platform. We empower innovators to kickstart ideas, and enterprises to build an exclusive ecosystem through technology.`, 
          url: `${window.location.href}`,
          image: `${window.location.origin}/assets/images/meta_image.png`
        });
      }
      
     }); 

    const sWidth = $( window ).width();
    if (sWidth < 500) {
      this.mobile = true;
    }

  $('.ais-Pagination-link').ready(
    function(){
      $('.ais-Pagination-link').click(function() {
        $('html, body').animate({ scrollTop: 0 }, 600);
      });
    }
  );

  $('.ais-Pagination-item--page').click(function() {
    $('html, body').animate({ scrollTop: 0 }, 600);
  });

  $(document).ready(function() {

    $(document).on('click', '.ais-Pagination-link', function(e){
      e.preventDefault();

      $('html, body').animate({ scrollTop: 0 }, 600);
    });
  });
  // (function(d, s, id){
  //   var js, fjs = d.getElementsByTagName(s)[0];
  //   if (d.getElementById(id)) {return;}
  //   js = d.createElement(s); js.id = id;
  //   js.src = 'https://connect.facebook.net/en_US/sdk.js';
  //   fjs.parentNode.insertBefore(js, fjs);
  //   }(document, 'script', 'facebook-jssdk'));

  // (function(d){
  //   var js, id = 'facebook-jssdk'; if (d.getElementById(id)) {return;}
  //   js = d.createElement('script'); js.id = id; js.async = true;
  //   js.src = 'https://connect.facebook.net/es_LA/all.js';
  //   d.getElementsByTagName('head')[0].appendChild(js);
  // }(document));

  // (function(d, s, id) {
  //   var js, fjs = d.getElementsByTagName(s)[0];
  //   if (d.getElementById(id)) return;
  //   js = d.createElement(s); js.id = id;
  //   js.src = 'https://connect.facebook.net/en_US/sdk/xfbml.customerchat.js#xfbml=1&version=v2.12&autoLogAppEvents=1';
  //   fjs.parentNode.insertBefore(js, fjs);
  //   }(document, 'script', 'facebook-jssdk'));

  }

}
