import { z } from "zod";
import { OperationType } from "../enums/OperationType";

export const MessageMeta = z.object({
  meta: z.object({
    operation: z.nativeEnum(OperationType),
  }),
  data: z.any().optional(),
});
export type MessageMeta = z.infer<typeof MessageMeta>;

export const ImportMessageTypeDetailsMessage = z.object({
  meta: z.object({
    operation: z.nativeEnum(OperationType),
  }),
  data: z.object({
    userId: z.string(),
    crawlerId: z.string(),
    messageId: z.string(),
  }),
});
export type ImportMessageTypeDetailsMessage = z.infer<
  typeof ImportMessageTypeDetailsMessage
>;

export const ImportMessageAttachmentMessage = z.object({
  meta: z.object({
    operation: z.nativeEnum(OperationType),
  }),
  data: z.object({
    userId: z.string(),
    crawlerId: z.string(),
    messageId: z.string(),
  }),
});
export type ImportMessageAttachmentMessage = z.infer<
  typeof ImportMessageAttachmentMessage
>;

export const ScheduleMessageTypeImportMessage = z.object({
  meta: z.object({
    operation: z.nativeEnum(OperationType),
  }),
  data: z.object({
    crawlerId: z.string(),
  }),
});
export type ScheduleMessageTypeImportMessage = z.infer<
  typeof ScheduleMessageTypeImportMessage
>;
