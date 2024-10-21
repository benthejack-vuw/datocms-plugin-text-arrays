import { connect, RenderFieldExtensionCtx,RenderManualFieldExtensionConfigScreenCtx } from "datocms-plugin-sdk";
import "datocms-react-ui/styles.css";
import ConfigScreen from "./entrypoints/ConfigScreen";
import { render } from "./utils/render";
import { TextArray, TextArrayConfig } from "./components/TextArray";

connect({
  manualFieldExtensions() {
    return [
      {
        id: "textArray",
        name: "Text Array" ,
        type: 'editor',
        fieldTypes: ['json'],
        configurable: true,
      }
    ]
  },
   renderManualFieldExtensionConfigScreen(
    _configId: string,
    ctx: RenderManualFieldExtensionConfigScreenCtx,
  ) {
      render(
        <TextArrayConfig ctx={ctx}  />
      )
  },
  renderFieldExtension(_extId: string, ctx: RenderFieldExtensionCtx) {
    return render(<TextArray 
      ctx={ctx}
      linkedTextInput={(ctx.parameters.linkedTextInput as {value: string} | null | undefined)?.value}
      placeholder={ctx.parameters.placeholder as string}
    />);
  },
	renderConfigScreen(ctx) {
		return render(<ConfigScreen ctx={ctx} />);
	},
});
