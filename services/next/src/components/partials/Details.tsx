// This wrapper is LOAD-BEARING, unlike the removed Header/Footer ones.
// Our views render in server components, and a client component's
// dot-notation subcomponents (Details.Summary) resolve to undefined across
// the server/client boundary. Inside this 'use client' module the dot
// access works, so it re-exports the subcomponents as flat names that
// server components can import safely.
"use client";
import { Details as DetailsBase } from "rk-designsystem";

export const Details = DetailsBase;
export const DetailsSummary = DetailsBase.Summary;
export const DetailsContent = DetailsBase.Content;
