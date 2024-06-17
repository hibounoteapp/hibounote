import { TemplateBoard } from "../../models/types/template-board"


const kanban: TemplateBoard ={
  name: "Kanban",
  connetions: [],
  elements: [
    {
      x: 176,
      y: 100,
      width: 257,
      height: 335,
      innerText: "To-do",
      color: "",
      type: "group",
      id: "jsplumb-7-1"
    },
    {
      x: 446,
      y: 97,
      width: 257,
      height: 332,
      innerText: "In progress",
      color: "",
      type: "group",
      id: "jsplumb-7-3"
    },
    {
      x: 717,
      y: 95,
      width: 255,
      height: 335,
      innerText: "Done",
      color: "",
      type: "group",
      id: "jsplumb-7-4"
    },
    {
      x: 8,
      y: 54,
      width: 197,
      height: 38,
      innerText: "Task 1",
      color: "",
      type: "node",
      id: "33d4b1fd-8bb2-4d14-8d54-988e8da892dd"
    },
    {
      x: 6,
      y: 109,
      width: 204,
      height: 48,
      innerText: "Important task 1",
      color: "rgb(255, 173, 5)",
      type: "node",
      id: "5197670e-ade1-48ac-8e66-6da5fdd23a77"
    },
    {
      x: 8,
      y: 164,
      width: 198,
      height: 45,
      innerText: "Urgent task 1",
      color: "rgb(254, 95, 85)",
      type: "node",
      id: "f8e4d71d-fcef-40f5-885b-162cbde28987"
    },
    {
      x: 13,
      y: 54,
      width: 238,
      height: 28,
      innerText: "Task 2",
      color: "rgb(0, 129, 72)",
      type: "node",
      id: "7f24d284-739b-4e1b-b12b-d7661ed339f2"
    },
    {
      x: 12,
      y: 57,
      width: 271,
      height: 25,
      innerText: "Task 3",
      color: "",
      type: "node",
      id: "4952fb09-5e98-4c5c-8494-925734971891"
    },
    {
      x: 7,
      y: 108,
      width: 250,
      height: 28,
      innerText: "Task 4",
      color: "",
      type: "node",
      id: "669f7b24-614c-44ea-8200-efaf276bcad1"
    }
  ],
  groups: [
    {
      groupId: "jsplumb-7-1",
      children: [
        {
          id: "33d4b1fd-8bb2-4d14-8d54-988e8da892dd"
        },
        {
          id: "5197670e-ade1-48ac-8e66-6da5fdd23a77"
        },
        {
          id: "f8e4d71d-fcef-40f5-885b-162cbde28987"
        }
      ]
    },
    {
      groupId: "jsplumb-7-3",
      children: [
        {
          id: "7f24d284-739b-4e1b-b12b-d7661ed339f2"
        }
      ]
    },
    {
      groupId: "jsplumb-7-4",
      children: [
        {
          id: "4952fb09-5e98-4c5c-8494-925734971891"
        },
        {
          id: "669f7b24-614c-44ea-8200-efaf276bcad1"
        }
      ]
    }
  ],
  zoomScale: 1
}

export default kanban
