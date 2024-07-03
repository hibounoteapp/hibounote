
import { SavedNode } from "./saved-node";
import { SavedConnection } from "./saved-connection";
import { Tag } from "./tag";

export interface Board {
  id: string,
  dateCreated: Date,
  connetions: SavedConnection[],
  name: string,
  elements: SavedNode[] ,
  groups: {
    groupId: string | null,
    children: {
      id: string | null
    }[]
  }[],
  zoomScale: number,
  tag?: Tag[],
  favorite?: boolean,
}
