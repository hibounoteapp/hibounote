import { Injectable } from '@angular/core';

interface TutorialCard {
  title: string,
  description: string,
  imageDemoURL: string,
}

@Injectable({
  providedIn: 'root'
})

export class TutorialService {

  tutorials: TutorialCard[] = [
    {
      title: 'Panning and Zooming',
      description: 'You can use your mouse to pan and zoom. Use the scroll to zoom and click in the board or click anywhere with the scroll button.',
      imageDemoURL: 'https://placehold.co/600x400?text=GIFDEMO'
    },
    {
      title: 'Delete nodes',
      description: `You can delete a node by clicking with the right mouse button in it and selecting 'Delete note' or by pressing 'Delete' in your keyboard.`,
      imageDemoURL: 'https://placehold.co/600x400?text=GIFDEMO'
    },
    {
      title: 'Edit nodes',
      description: 'You can edit a node by clicking in it and selecting it color in the toolbox (sidebar at left). You can also edit connections by clicking in the endpoints.',
      imageDemoURL: 'https://placehold.co/600x400?text=GIFDEMO'
    },
  ]


  constructor() { }
}
