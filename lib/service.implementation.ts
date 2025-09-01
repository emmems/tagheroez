import type { DescService } from "@bufbuild/protobuf";
import type { ServiceImpl } from "@connectrpc/connect";

export type ServiceImplementation<T extends DescService> = Partial<
  ServiceImpl<T>
>;
