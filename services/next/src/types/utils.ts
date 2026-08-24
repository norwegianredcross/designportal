import type { PartData } from "@enonic/nextjs-adapter/types/component";
import type { MetaData } from "@enonic/nextjs-adapter/types/componentProps";

type Unwrap<T> = NonNullable<T> extends ReadonlyArray<infer U>
  ? NonNullable<U>
  : NonNullable<T>;

export type Get<T, P extends string> = NonNullable<
  P extends `${infer K}.${infer Rest}`
    ? K extends keyof Unwrap<T>
      ? Get<Unwrap<T>[K], Rest>
      : never
    : P extends keyof Unwrap<T>
      ? Unwrap<Unwrap<T>[P]>
      : never
>;

export interface PartProps<Data = any> {
  part: PartData;
  path: string;
  data?: Data;
  common?: any;
  meta: MetaData;
}
