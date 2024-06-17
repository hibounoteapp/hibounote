import { TemplateBoard } from "../../models/types/template-board";

const sprintRetro: TemplateBoard = {
  name: "Sprint retrospective",
  connetions: [
    {
      anchor: "Continuous",
      connector: "Bezier",
      sourceId: "jsplumb-2-1",
      targetId: "jsplumb-2-3",
      paintStyle: {
        strokeWidth: 2,
        stroke: "#000000"
      },
      hoverPaintStyle: {
        strokeWidth: 2,
        stroke: "#000000"
      },
      endpointStyle: {
        fill: "#030303",
        stroke: "#030303",
        strokeWidth: 1
      },
      overlays: []
    },
    {
      anchor: "Continuous",
      connector: "Bezier",
      sourceId: "jsplumb-2-3",
      targetId: "jsplumb-2-4",
      paintStyle: {
        strokeWidth: 2,
        stroke: "#000000"
      },
      hoverPaintStyle: {
        strokeWidth: 2,
        stroke: "#000000"
      },
      endpointStyle: {
        fill: "#030303",
        stroke: "#030303",
        strokeWidth: 1
      },
      overlays: []
    }
  ],
  elements: [
    {
      x: 163,
      y: 118,
      width: 307,
      height: 393,
      innerText: "Start",
      color: "rgb(255, 173, 5)",
      type: "group",
      id: "jsplumb-2-1"
    },
    {
      x: 541,
      y: 90,
      width: 329,
      height: 392,
      innerText: "Stop",
      color: "rgb(254, 95, 85)",
      type: "group",
      id: "jsplumb-2-3"
    },
    {
      x: 952,
      y: 55,
      width: 330,
      height: 401,
      innerText: "Continue",
      color: "rgb(0, 129, 72)",
      type: "group",
      id: "jsplumb-2-4"
    },
    {
      x: 10,
      y: 55,
      width: 200,
      height: 100,
      innerText: "Task to improve",
      color: "rgb(255, 253, 246)",
      type: "node",
      id: "8358184a-37a0-40b5-9f67-6eb7266b3f91"
    },
    {
      x: 10,
      y: 57,
      width: 200,
      height: 100,
      innerText: "What is holding us back",
      color: "",
      type: "node",
      id: "4a3aa839-715f-4c8e-9483-bf5d7762fcef"
    },
    {
      x: 9,
      y: 55,
      width: 200,
      height: 100,
      innerText: "What helped to produce",
      color: "",
      type: "node",
      id: "6bc0c32b-d55c-460d-99c5-a4eb6f29b85e"
    }
  ],
  groups: [
    {
      groupId: "jsplumb-2-1",
      children: [
        {
          id: "8358184a-37a0-40b5-9f67-6eb7266b3f91"
        }
      ]
    },
    {
      groupId: "jsplumb-2-3",
      children: [
        {
          id: "4a3aa839-715f-4c8e-9483-bf5d7762fcef"
        }
      ]
    },
    {
      groupId: "jsplumb-2-4",
      children: [
        {
          id: "6bc0c32b-d55c-460d-99c5-a4eb6f29b85e"
        }
      ]
    }
  ],
  zoomScale: 1
}


export default sprintRetro;
