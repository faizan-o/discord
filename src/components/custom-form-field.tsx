import type { Control, ControllerRenderProps, Field } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { FormFieldTypes } from "@/types";
import { Input } from "./ui/input";
import { UploadDropzone } from "@/lib/uploadthing";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from "./ui/select";
import { SelectLabel, SelectValue } from "@radix-ui/react-select";
import { ClientUploadedFileData } from "uploadthing/types";

interface CustomFormFieldProps {
  control: Control<any>;
  name: string;
  label: string;
  placeholder?: string;
  options?: { [key: string]: string };
  endpoint?: "serverImageUploader" | "messageImageUploader";
  setFileData?: (file: ClientUploadedFileData<null>) => void;
  fieldType: FormFieldTypes;
  disabled?: boolean;
}

const RenderField = ({
  props,
  field,
}: {
  props: CustomFormFieldProps;
  field: ControllerRenderProps;
}) => {
  switch (props.fieldType) {
    case FormFieldTypes.TEXT_INPUT:
      return <Input {...field} />;
    case FormFieldTypes.FILE_UPLOADER:
      return (
        <UploadDropzone
          endpoint={props.endpoint!}
          skipPolling
          disabled={props.disabled}
          config={{
            mode: "auto",
          }}
          className="cursor-pointer"
          onClientUploadComplete={(data) => {
            if (props.setFileData) {
              props.setFileData(data[0]);
            }
            field.onChange(data[0].url);
          }}
          onUploadError={() => field.onChange("")}
        />
      );
    case FormFieldTypes.SELECT:
      return (
        <Select
          defaultValue={field.value}
          value={field.value}
          onValueChange={field.onChange}
        >
          <SelectTrigger className="dark:bg-zinc-800">
            <SelectValue placeholder="Select Type..." />
          </SelectTrigger>
          <SelectContent className="dark:bg-zinc-900">
            <SelectGroup>
              <SelectLabel>{props.label}</SelectLabel>
              {props.options &&
                Object.entries(props.options).map((option, idx) => (
                  <SelectItem
                    className="focus-within:bg-white cursor-pointer"
                    key={idx}
                    value={option[1]}
                  >
                    {option[0]}
                  </SelectItem>
                ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      );
  }
};

const CustomFormField = (props: CustomFormFieldProps) => {
  return (
    <FormField
      control={props.control}
      name={props.name}
      disabled={props.disabled}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{props.label}</FormLabel>
          <FormControl>
            <RenderField props={props} field={field} />
          </FormControl>
          <FormMessage className="shad-error" />
        </FormItem>
      )}
    />
  );
};

export default CustomFormField;
