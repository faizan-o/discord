import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import z from "zod";
import { MessageSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Plus, Router, Send, SendHorizonal, Smile } from "lucide-react";
import qs from "query-string";
import axios from "axios";
import { useModal } from "@/hooks/use-modal-store";
import EmojiPicker from "./emoji-picker";
import { useRouter } from "next/navigation";

interface ChatInputProps {
  apiUrl: string;
  query: Record<string, any>;
  name: string;
  type: "Channel" | "Conversation";
}

const ChatInput = ({ apiUrl, query, name, type }: ChatInputProps) => {
  const { onOpen, onClose } = useModal();

  const form = useForm<z.infer<typeof MessageSchema>>({
    resolver: zodResolver(MessageSchema),
    defaultValues: {
      content: "",
      fileUrl: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof MessageSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url: apiUrl,
        query,
      });
      await axios.post(url, values);
      form.reset();
      router.refresh();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative p-4 pb-6">
                  <Button
                    type="button"
                    onClick={() => onOpen("SendFileMessage", { apiUrl, query })}
                    className="absolute top-[2.20rem] left-8 h-[24px] w-[24px] bg-zinc-500 dark:bg-zinc-400 hover:bg-zinc-600 dark:hover:bg-zinc-300 transition rounded-full p-1 flex items-center"
                  >
                    <Plus className="text-white dark:text-[#313338]" />
                  </Button>
                  <Input
                    className="px-14 py-8 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 text-zinc-600 dark:text-zinc-200"
                    placeholder={`Message ${
                      type === "Conversation" ? name : `#${name}`
                    }`}
                    disabled={isLoading}
                    {...field}
                  />
                  <div className="absolute top-[2.20rem] right-16">
                    <EmojiPicker
                      onChange={(emoji: string) => {
                        field.onChange(`${field.value} ${emoji}`);
                      }}
                    />
                  </div>
                  <Button
                    type="submit"
                    variant="ghost"
                    className="text-indigo-500 absolute top-[1.75rem] right-4 hover:bg-transparent"
                  >
                    <SendHorizonal strokeWidth={2} />
                  </Button>
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

export default ChatInput;
