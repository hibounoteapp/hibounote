import { Board } from "@custom-interfaces/board";

export type TemplateBoard = Omit<Board, "id" | "dateCreated">
