import { TemplateBoard } from "../../models/types/template-board";

const sprintRetro2: TemplateBoard = {
  name: "Sprint retrospective",
  connetions: [],
  elements: [
    {
      x: 170,
      y: 121,
      width: 248,
      height: 361,
      innerText: "Start",
      color: "rgb(45, 147, 173)",
      type: "group",
      id: "jsplumb-1-1"
    },
    {
      x: 426,
      y: 120,
      width: 248,
      height: 366,
      innerText: "Stop",
      color: "rgb(254, 95, 85)",
      type: "group",
      id: "jsplumb-1-2"
    },
    {
      x: 680,
      y: 118,
      width: 250,
      height: 371,
      innerText: "Continue",
      color: "rgb(0, 129, 72)",
      type: "group",
      id: "jsplumb-1-3"
    },
    {
      x: 8,
      y: 53,
      width: 395,
      height: 47,
      innerText: "Work from home",
      color: "rgb(45, 147, 173)",
      type: "node",
      id: "48e1a884-05c1-41a0-8617-84c7c3a3f886"
    },
    {
      x: 8,
      y: 57,
      width: 271,
      height: 25,
      innerText: "Make nonsense meetings",
      color: "rgb(254, 95, 85)",
      type: "node",
      id: "61b3cee3-665a-4a85-8bb8-a1237842b39a"
    },
    {
      x: 7,
      y: 57,
      width: 307,
      height: 28,
      innerText: "Use Hibounote!",
      color: "",
      type: "node",
      id: "9d04cf6b-92ff-4196-84ac-78df74c111f3"
    },
    {
      x: 7,
      y: 108,
      width: 255,
      height: 21,
      innerText: "Reestructure project folder",
      color: "rgb(45, 147, 173)",
      type: "node",
      id: "0b7b8e74-a36d-4902-9600-f85dda2d6eb2"
    },
    {
      x: 6,
      y: 114,
      width: 371,
      height: 33,
      innerText: "Rush core features",
      color: "rgb(254, 95, 85)",
      type: "node",
      id: "54125279-2abb-4b4f-81c4-3376ac10386f"
    },
    {
      x: 7,
      y: 170,
      width: 300,
      height: 26,
      innerText: "Deploying without tests",
      color: "rgb(254, 95, 85)",
      type: "node",
      id: "3740339d-5f7c-481e-bca7-831d36a37298"
    }
  ],
  groups: [
    {
      groupId: "jsplumb-1-1",
      children: [
        {
          id: "48e1a884-05c1-41a0-8617-84c7c3a3f886"
        },
        {
          id: "0b7b8e74-a36d-4902-9600-f85dda2d6eb2"
        }
      ]
    },
    {
      groupId: "jsplumb-1-2",
      children: [
        {
          id: "61b3cee3-665a-4a85-8bb8-a1237842b39a"
        },
        {
          id: "54125279-2abb-4b4f-81c4-3376ac10386f"
        },
        {
          id: "3740339d-5f7c-481e-bca7-831d36a37298"
        }
      ]
    },
    {
      groupId: "jsplumb-1-3",
      children: [
        {
          id: "9d04cf6b-92ff-4196-84ac-78df74c111f3"
        }
      ]
    }
  ],
  zoomScale: 1
}

export default sprintRetro2
