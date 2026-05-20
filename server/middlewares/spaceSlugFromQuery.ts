import type { RequestHandler } from "express";

const SLUG_PATTERN = /^[a-z0-9](?:[a-z0-9-]{0,78}[a-z0-9])?$/;

export const spaceSlugFromQuery: RequestHandler = (req, _res, next) => {
  const querySlug = req.query.spaceSlug;
  if (!req.params.spaceSlug && querySlug) {
    if (typeof querySlug === "string" && SLUG_PATTERN.test(querySlug)) {
      req.params.spaceSlug = querySlug;
    } else if (Array.isArray(querySlug) && typeof querySlug[0] === "string" && SLUG_PATTERN.test(querySlug[0])) {
      req.params.spaceSlug = querySlug[0];
    }
  }
  next();
};
