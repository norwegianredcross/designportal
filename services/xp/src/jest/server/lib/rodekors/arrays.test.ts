import { describe, expect, it } from "@jest/globals";
import { find, forceArray } from "/lib/rodekors/arrays";

describe("forceArray", () => {
  it("returns the same array when given an array", () => {
    const input = [1, 2, 3];
    expect(forceArray(input)).toBe(input);
  });

  it("returns an empty array when given an empty array", () => {
    const input: number[] = [];
    expect(forceArray(input)).toBe(input);
  });

  it("returns an empty array when given undefined", () => {
    expect(forceArray<number>(undefined)).toEqual([]);
  });

  it("returns an empty array when given null", () => {
    expect(forceArray<number>(null)).toEqual([]);
  });

  it("wraps a single non-array value in an array", () => {
    expect(forceArray(42)).toEqual([42]);
    expect(forceArray("hello")).toEqual(["hello"]);
  });

  it("wraps falsy non-null values in an array (does not collapse to [])", () => {
    expect(forceArray(0)).toEqual([0]);
    expect(forceArray("")).toEqual([""]);
    expect(forceArray(false)).toEqual([false]);
  });

  it("wraps an object value in an array without unpacking it", () => {
    const obj = { foo: "bar" };
    expect(forceArray(obj)).toEqual([obj]);
  });

  it("preserves a readonly array (overload)", () => {
    const input: ReadonlyArray<number> = [1, 2, 3];
    expect(forceArray(input)).toBe(input);
  });
});

describe("find", () => {
  it("returns the first element matching the predicate", () => {
    expect(find([1, 2, 3, 4], (n) => n > 2)).toBe(3);
  });

  it("returns undefined when no element matches", () => {
    expect(find([1, 2, 3], (n) => n > 10)).toBeUndefined();
  });

  it("returns undefined for an empty array", () => {
    expect(find<number>([], () => true)).toBeUndefined();
  });

  it("returns the first match, not a later one", () => {
    const arr = [
      { id: 1, name: "a" },
      { id: 2, name: "b" },
      { id: 3, name: "a" },
    ];
    expect(find(arr, (x) => x.name === "a")).toEqual({ id: 1, name: "a" });
  });

  it("narrows the return type when given a type predicate", () => {
    const values: Array<string | number> = ["a", 1, "b", 2];
    const firstString = find(values, (v): v is string => typeof v === "string");
    // Compile-time narrowing: firstString is string | undefined, not (string | number) | undefined.
    expect(firstString?.toUpperCase()).toBe("A");
  });
});
