import {Injectable} from '@angular/core'; 
import { Meta, Title } from '@angular/platform-browser';
import { AngularFirestore, AngularFirestoreDocument , AngularFirestoreCollection} from 'angularfire2/firestore';

@Injectable()
export class SeoService {

  constructor(
    private title: Title, 
    private meta: Meta,
    private afs: AngularFirestore) { }


  updateTitle(title: string) {
    this.title.setTitle(title);
  }

  updateOgUrl(url: string) {
    this.meta.updateTag({content: url } , 'name="og:url"' );
  }

  updateDescription(desc: string) {
    this.meta.updateTag({content: desc} , 'name="description"' );

  }

  generateTags(tags) {
  
    // default values
    // tags = { 
    //   title: 'Pitchspot | Your global launchpad for ideas',
    //   description: 'Pitchspot is the world’s smartest innovation platform. We empower innovators to kickstart ideas, and enterprises to build an exclusive ecosystem through technology.',
    //   image: '../../../assets/images/meta_image.jpg',

    // }

    // Set a title
    this.title.setTitle(tags.title);

    // Set meta tags
    // basic
    this.meta.updateTag({ name: 'title', content: tags.title });
    this.meta.updateTag({ name: 'description', content: tags.description });
    
    // twitter
    this.meta.updateTag({ property: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ property: 'twitter:site', content: '@pitchspot' });
    this.meta.updateTag({ property: 'twitter:title', content: tags.title });
    this.meta.updateTag({ property: 'twitter:description', content: tags.description });
    this.meta.updateTag({ property: 'twitter:image', content: tags.image });
    this.meta.updateTag({ property: 'twitter:url', content: tags.url });

    // facebook
    this.meta.updateTag({ property: 'og:site_name', content: 'Pitchspot' });
    this.meta.updateTag({ property: 'og:title', content: tags.title });
    this.meta.updateTag({ property: 'og:description', content: tags.description });
    this.meta.updateTag({ property: 'og:image', content: tags.image });
    this.meta.updateTag({ property: 'og:url', content: tags.url });
    
  }

  addTag(title: string, desc: string, url: string){
    this.meta.addTags([
      {name: 'title', content: title},
      {name: 'description', content: desc},
      {name: 'og:url', content: url}
    ]);
  }

  getMeta(url: string){
    return this.afs.doc(url).valueChanges();

  }


}
