import { describe, expect, it } from "vitest";
import { isCacheFresh } from "../../../server/ai/relationshipCache";
import { deterministicRelationship } from "../../../server/relationship/deterministic";
import type { RelationshipMember } from "../../../server/relationship/types";

const member = (
  overrides: Partial<RelationshipMember> & Pick<RelationshipMember, "id" | "fullName" | "gender">,
): RelationshipMember => ({
  displayName: null,
  fatherId: null,
  motherId: null,
  spouseIds: [],
  formerSpouseIds: [],
  childrenIds: [],
  siblingIds: [],
  ...overrides,
});

const members: RelationshipMember[] = [
  member({
    id: "siti",
    fullName: "Siti Rahmah",
    displayName: "Siti Rahmah",
    gender: "female",
    childrenIds: ["fahri"],
  }),
  member({
    id: "fahri",
    fullName: "Fahri Rahman",
    displayName: "Fahri",
    gender: "male",
    motherId: "siti",
    spouseIds: ["nadia"],
  }),
  member({
    id: "nadia",
    fullName: "Nadia Rahman",
    displayName: "Nadia",
    gender: "female",
    spouseIds: ["fahri"],
  }),
];

describe("deterministicRelationship", () => {
  it("names a spouse's mother as mother-in-law", () => {
    const result = deterministicRelationship(members, "siti", "nadia");

    expect(result?.relationshipLabel).toBe("mother-in-law");
    expect(result?.explanation).toContain("Siti Rahmah is Nadia's mother-in-law.");
    expect(result?.explanation).not.toContain("connected as related family member");
  });

  it("names a child's spouse as daughter-in-law", () => {
    const result = deterministicRelationship(members, "nadia", "siti");

    expect(result?.relationshipLabel).toBe("daughter-in-law");
    expect(result?.explanation).toContain("Nadia is Siti Rahmah's daughter-in-law.");
    expect(result?.explanation).not.toContain("connected as related family member");
  });
});

describe("isCacheFresh", () => {
  it("invalidates old generic relationship wording when a specific label is now available", () => {
    const fresh = isCacheFresh(
      {
        fromMemberId: "siti",
        toMemberId: "nadia",
        pathMemberIds: ["siti", "fahri", "nadia"],
        relationshipLabel: "related family member",
        explanation: "Siti Rahmah and Nadia are connected as related family member.",
      },
      members,
    );

    expect(fresh).toBe(false);
  });
});
