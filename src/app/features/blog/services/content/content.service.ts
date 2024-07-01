import { Injectable } from '@angular/core';
import { Post } from '@custom-interfaces/post';

@Injectable({
  providedIn: 'root'
})
export class ContentService {

  posts: Post[] = [
    {
      id:1,
      title: 'Open test available now!',
      shortDesc: 'Hibounote is finally live for everyone to test it.',
      date: new Date('June 26, 2024 16:54:30'),
      desc: `


      # Main features:
      - Add note;
      - Edit note;
      - Create blank and template boards;
      - Data storage in user device;
      - Basic board control (panning, zooming);
      - ...

      <br>

      ## Planned features for the MVP

      _Since Hibounote is a open source project and our budget is not very high :( Some features probably won't work as the best possible, unfortunately_

      <br>

      The main feature that would be awesome to have is cloud sync and accessing your data from any device. Because of the budget limitations, the database, at least for now, will have low storage space, but we will work to mantain it the best way we can!

      <br>

      The desktop version is also planned for the MVP and will be, at least in the start, the best option to choose, since all your data is stored in your device (soon we will write it explaining in the docs) and you can manipulate it with basically no limits. The only limit is your storage.

      <br>

      If you can, consider support the project on patreon or even contributing to it! Every action helps the project to be alive and running!

      `
      ,
      tag: 'Release Notes',
      imageURL: '../../../../../assets/images/landing-page-screenshot.png'
    },
    {
      id:2,
      title: 'Follow the project',
      shortDesc: 'Stay up to date with all updates',
      date: new Date('June 26, 2024 16:54:30'),
      desc: `

      You can follow us in instagram, twitter and github, where all updates will be notified. Waiting for the MVP launch? Just follow us in one of them (or all of them!) to stay up with the updates.

      <br>

      [Github](https://github.com/hibounoteapp/hibounote) <br>
      [Twitter](https://x.com/hibounote) <br>
      [Instagram](https://www.instagram.com/hibounote/) <br>

      `
      ,
      tag: 'Community',
      imageURL: '../../../../../assets/images/post-banners/twitter-screenshot.png'
    },
    {
      id:3,
      title: 'Starter guide',
      shortDesc: 'Know the basics to start using',
      date: new Date('June 26, 2024 16:54:30'),
      desc: `

      Hibounote aims to have a good and minimalist interface to be intuitive for all users. If you have any problems understanding how to access some features, continue to read:

      <br>

      ## Accessing boards

      You can access all your boards by clicking in 'Get Started' button, accessing your account page. You can create a board or create from template. Besides that, you can also edit your board's name and delete it.

      <br>

      ## Data storage

      All your board data is saved in your device every time you exit. The data is automatically saved.

      <br>

      ## Basic functions

      To access the basic functionalty and board usage, access the [tutorials page](/tutorial).

      <br>

      If you still have doubts, access the [support page](/support) to proceed. The best way to have an answer is by github.

      `
      ,
      tag: 'User Guide',
      imageURL: '../../../../../assets/gifs/tutorials/edit-nodes.gif'
    },
  ]

  constructor() { }
}
