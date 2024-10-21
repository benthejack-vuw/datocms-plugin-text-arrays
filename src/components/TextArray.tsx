import { RenderFieldExtensionCtx, RenderManualFieldExtensionConfigScreenCtx } from "datocms-plugin-sdk";
import { Canvas, CreatableSelectField, Form, SelectField, TextField } from "datocms-react-ui";
import { get } from "lodash";
import { useCallback, useEffect, useState } from "react";

type TextArrayProps = {
  ctx: RenderFieldExtensionCtx;
  linkedTextInput?: string | null;
  placeholder?: string | null;
};

type TextArrayConfigProps = {
 ctx: RenderManualFieldExtensionConfigScreenCtx;
}

export const TextArray = ({ctx, linkedTextInput, placeholder}: TextArrayProps) => {
  const [words, setWords] = useState<{label: string, value: string}[]>([]);

  let options = [] as {label: string, value: string}[];
  if(linkedTextInput) {
    const linkedPath = [...ctx.fieldPath.split(".").slice(0, -1), linkedTextInput].join(".")
    options = (get(ctx.formValues, linkedPath) as string).split(" ").map(value => ( {value, label: value} ));
  }

  useEffect(() => {
    ctx.setFieldValue(ctx.fieldPath, JSON.stringify(words.map((w) => w.value)))
  },[words]);

  return (
    <Canvas ctx={ctx}>
      <CreatableSelectField
        name={ctx.fieldPath}
        id={ctx.fieldPath}
        value={words}
        label=""
        placeholder={placeholder ?? ""}
        selectInputProps={{
          isMulti: true,
          options
        }}
        onChange={(newValue) => setWords(newValue as any)}
      />
  </Canvas>
  )
};

type TextArrayConfigParameters = {
  linkedTextInput: {label: string, value: string} | null;
  placeholder: string;
};


export const TextArrayConfig = ({ctx}: TextArrayConfigProps) => {
   const [formValues, setFormValues] = useState<Partial<TextArrayConfigParameters>>(
    ctx.parameters,
  );

  const [linkable, setLinkable] = useState<{label: string, value: string}[]>([]);

  useEffect(() => {
    ctx.loadItemTypeFields(ctx.itemType.id).then(
      (fields) => fields
        .filter(field => field.id !== ctx.pendingField.id)
        .map(field => ({ label: field.attributes.api_key, value: field.attributes.api_key }))
    ).then((fields) => { 
      setLinkable(fields)
    }
    );
  }, []);

  const update = useCallback((field: string, value: any) => {
    const newParameters = { ...formValues, [field]: value };
    setFormValues(newParameters);
    ctx.setParameters(newParameters);
  }, [formValues, setFormValues, ctx.setParameters]);

  return (
    <Canvas ctx={ctx}>
      <Form>
        {
          linkable.length > 0 &&
            <SelectField
              name="linkedTextInput"
              id="linkedTextInput"
              value={formValues.linkedTextInput ?? ""}
              label="Linked Text Input"
              hint="will parse pre-filled options from the linked field"
              selectInputProps={{
                options: linkable,
                isClearable: true,
              }}
              onChange={(value) => {
                update("linkedTextInput", value)
              }}
            />
        }
        <TextField
          name="placeholder"
          id="placeholder"
          label="Placeholder text"
          value={formValues.placeholder ?? ""}
          hint="placeholder for the input"
          onChange={(value) => {
            update("placeholder", value)
          }}
        />
      </Form>
    </Canvas>
  );
}
