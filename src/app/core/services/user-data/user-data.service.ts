import { Injectable } from '@angular/core';
import { uuid } from '@jsplumb/browser-ui';
import { db } from '../../../../../db';


interface Tag {
  id: string,
  name: string
}

@Injectable({
  providedIn: 'root'
})

export class UserDataService {
  tags: Tag[]=[{
    id:'22',
    name:'Games'
  }];

  constructor(){
    this.loadTags();
  }

  loadTags() {
    this.getTags().then((res)=>{
      this.tags = res;
    });
  }

  async getTags():Promise<Tag[]> {
    return await db.tags.toArray()
  }

  async createTag(value: string) {
    const id = (uuid()).substring(0,4)

    this.tags.push({
      id,
      name: value
    })

    const tag = {
      id,
      name: value
    }

    await db.tags.add(tag)
  }

  async deleteTag(id:string) {
    let tags: Tag[] = this.tags.filter((tag: Tag)=>{
      if(tag.id === id) {
        return false;
      }
      return true;
    })
    this.tags = tags;

    await db.tags.delete(id)
  }

  changeName(id:string,newValue:string) {
    let tag = this.tags.find(e=>e.id === id)

    if(tag) {
      tag.name = newValue;
    }
  }

  saveChanged(id:string) {
    const selectedTag = this.tags.find(e=>e.id===id);
    if(selectedTag)
      db.tags.update(id,selectedTag)
  }
}
