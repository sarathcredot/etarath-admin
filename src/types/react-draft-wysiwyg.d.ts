declare module "react-draft-wysiwyg" {
  import { ComponentType } from "react";
  import { EditorProps } from "draft-js";

  export const Editor: ComponentType<any>;
  export const EditorState: any;
  export const convertToRaw: any;
  export const convertFromRaw: any;
}
