import { Connection, ManagedElement } from "@jsplumb/browser-ui";

export interface Board {
  id: string,
  connetions: Record<string, Connection> | Array<Connection> | null,
  elements: {
    element: HTMLElement,
    id: string | null,
  }[] ,
  groups: {
    groupId: string | null,
    children: {id: string | null}[]
  }[],
  zoomScale: number,
}
