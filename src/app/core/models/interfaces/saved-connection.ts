import { AnchorSpec, ConnectorSpec, EndpointStyle, PaintStyle } from "@jsplumb/browser-ui";

export interface SavedConnection {
  targetId:string,
  sourceId:string,
  endpointStyle: EndpointStyle,
  hoverPaintStyle:  PaintStyle,
  paintStyle: PaintStyle,
  connector: ConnectorSpec,
  anchor: AnchorSpec,
  overlays:{
    label:{
      inputValue:string ,
    }
  }[]
}
