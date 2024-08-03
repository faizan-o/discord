import { Member, MemberRole } from "@prisma/client";
import { MemberWithProfile } from "../../..";
import Image from "next/image";
import ActionToolTip from "../action-tooltip";
import { MemberRoleIconMap } from "@/lib/map";
import { Edit, File, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import z from "zod";
import { EditMessageSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import qs from "query-string";
import axios from "axios";
import { useModal } from "@/hooks/use-modal-store";

interface ChatItemProps {
  id: string;
  content: string;
  member: MemberWithProfile;
  timestamp: string;
  fileUrl: string | null;
  deleted: boolean;
  currentMember: Member;
  updated: boolean;
  socketUrl: string;
  socketQuery: Record<string, string>;
}

const ChatItem = ({
  id,
  content,
  member,
  timestamp,
  fileUrl,
  deleted,
  currentMember,
  updated,
  socketUrl,
  socketQuery,
}: ChatItemProps) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  useEffect(() => {
    const handleKeyDown = (event: any) => {
      if (event.key === "Escape" || event.keyCode === 27) {
        setIsEditing(false);
      }
    };

    addEventListener("keydown", handleKeyDown);
    () => removeEventListener("keydown", handleKeyDown);
  }, []);

  const editMessageForm = useForm<z.infer<typeof EditMessageSchema>>({
    resolver: zodResolver(EditMessageSchema),
    defaultValues: {
      content: "",
    },
  });

  useEffect(() => {
    editMessageForm.reset({
      content,
    });
  }, [content]);

  const fileType = fileUrl && fileUrl.split(".").pop();

  const isAdmin = member.role === MemberRole.ADMIN;
  const isModerator = member.role === MemberRole.MODERATOR;
  const isOwner = member.id === currentMember.id;
  const canDelete = !deleted && (isAdmin || isModerator || isOwner);
  const canEdit = !deleted && isOwner;

  const isFile = !!fileUrl;
  const isPDF = isFile && fileType === "pdf";
  const isImage = isFile && !isPDF;

  const { onOpen } = useModal();

  const onEditFormSubmit = async (
    values: z.infer<typeof EditMessageSchema>
  ) => {
    try {
      const url = qs.stringifyUrl({
        url: `${socketUrl}/${id}`,
        query: socketQuery,
      });

      await axios.patch(url, values);
      editMessageForm.reset();
      setIsEditing(false);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="relative group flex items-center hover:bg-black/5 p-4 transition w-full rounded-md">
      <div className="group flex gap-x-2 items-start w-full">
        <div className="cursor-pointer hover:drop-shadow-md transition">
          <Image
            src={member.profile.imageUrl}
            alt="User Avatar"
            width={1920}
            height={1080}
            className="rounded-full w-8 h-8"
          />
        </div>
        <div className="flex flex-col w-full">
          <div className="flex items-center gap-x-2">
            <div className="flex items-center">
              <p className="font-semibold text-sm hover:underline cursor-pointer">
                {member.profile.name}
              </p>
              <ActionToolTip side="top" label={member.role}>
                {MemberRoleIconMap[member.role]}
              </ActionToolTip>
              <span className="text-xs ml-2 text-zinc-500 dark:text-zinc-400">
                {timestamp}
              </span>
            </div>
          </div>
          {isImage && (
            <div className="w-full flex flex-col items-center justify-center my-5">
              <a
                href={fileUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="w-full h-80 md:w-1/2 relative rounded-md mt-2 overflow-hidden border flex items-center"
              >
                <Image
                  src={fileUrl}
                  fill
                  alt={content}
                  className="object-cover"
                />
              </a>
              <span className="text-sm py-5 font-semibold">{content}</span>
            </div>
          )}
          {isPDF && (
            <div className="relative rounded-md mt-2 flex items-center">
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex justify-start items-center"
              >
                <File className="text-indigo-500" width={60} height={40} />
                <span className="text-sm hover:underline">{content}</span>
              </a>
            </div>
          )}
          {!isFile && !isEditing && (
            <p
              className={cn("text-sm text-zinc-600 dark:text-zinc-300", {
                "italic text-zinc-500 dark:text-zinc-400 text-xs mt-1": deleted,
              })}
            >
              {content}
              {updated && !deleted && (
                <span className="text-[10px] py-1 my-5 mx-2 text-zinc-500 dark:text-zinc-400">
                  (edited)
                </span>
              )}
            </p>
          )}
          {!isFile && isEditing && (
            <Form {...editMessageForm}>
              <form
                className="flex items-center w-full gap-x-2 pt-2"
                onSubmit={editMessageForm.handleSubmit(onEditFormSubmit)}
              >
                <FormField
                  control={editMessageForm.control}
                  name="content"
                  disabled={editMessageForm.formState.isSubmitting}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input
                          className="p-2 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 text-zinc-600 dark:text-zinc-200"
                          placeholder="Edited Message"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button
                  size="sm"
                  variant="indigo"
                  disabled={editMessageForm.formState.isSubmitting}
                >
                  Save
                </Button>
              </form>
              <span className="text-[10px] ml-2 text-zinc-400">
                Press Esc To Cancel And Enter To Save
              </span>
            </Form>
          )}
        </div>
      </div>
      {canDelete && (
        <div className="hidden group-hover:flex items-center gap-x-2 absolute p-1 top-2 right-5 bg-white dark:bg-zinc-800 border rounded-sm">
          {canEdit && (
            <ActionToolTip side="top" label="Edit">
              <Edit
                onClick={() => setIsEditing((prev) => !prev)}
                className="cursor-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
              />
            </ActionToolTip>
          )}

          <ActionToolTip side="top" label="Edit">
            <Trash
              onClick={() =>
                onOpen("DeleteMessage", {
                  apiUrl: `${socketUrl}/${id}`,
                  query: socketQuery,
                })
              }
              className="cursor-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
            />
          </ActionToolTip>
        </div>
      )}
    </div>
  );
};

export default ChatItem;
