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
      description: 'You can use your mouse to pan and zoom. Use the hold ctrl and scroll to zoom. You can also zoom by clicking "zoom in" or "zoom out" icons in the bottom right side of the screen.',
      imageDemoURL: '../../../../../assets/gifs/tutorials/panning-and-zoom.gif'
    },
    {
      title: 'Delete nodes',
      description: `You can delete a node by clicking with the right mouse button in it and selecting 'Delete note' or by pressing 'Delete' in your keyboard.`,
      imageDemoURL: '../../../../../assets/gifs/tutorials/delete-nodes.gif'
    },
    {
      title: 'Edit nodes',
      description: 'You can edit a node by clicking in it and selecting it color in the toolbox (sidebar at left). You can also edit connections by clicking in the endpoints.',
      imageDemoURL: '../../../../../assets/gifs/tutorials/edit-nodes.gif'
    },
    {
      title: 'Add nodes',
      description: 'You can add a node by dragging it off the toolbox (left side of the screen). You can also add by clicking with the right mouse button and clicking "New node"',
      imageDemoURL: '../../../../../assets/gifs/tutorials/add-nodes.gif'
    },
  ]


  constructor() { }
}
