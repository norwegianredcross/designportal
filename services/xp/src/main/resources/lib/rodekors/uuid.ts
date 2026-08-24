export const UUID = Java.type<UUIDConstructor>("java.util.UUID");

export interface UUIDConstructor {
  randomUUID(): UUID;
  fromString(name: string): UUID;
}

export interface UUID {
  toString(): string;
  variant(): number;
  version(): number;
}
