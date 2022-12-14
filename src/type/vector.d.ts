type VectorInputConfigType = {
  type: VectorInputComponentType;
  config: {
    name: string;
    help: string;
    required: boolean;
    options: string[];
  };
};

type VectorInputComponentType = "Input" | "TextArea" | "Select" | "Int" | "Radio" | "Checkbox" | "Upload";
