import { describe, it, expect } from "vitest";
import {
  findVenueInDirectory,
  normaliseName,
  searchDirectory,
  similarity,
  venueLabel,
} from "@/lib/venues";
import type { Venue } from "@/content/venues";

const directory: Venue[] = [
  {
    name: "Avianto",
    town: "Muldersdrift",
    province: "Gauteng",
    address: "Avianto Estate, Muldersdrift",
    lat: -26.0333,
    lng: 27.8167,
    source: "test",
    precision: "town",
    verified: true,
  },
  {
    name: "The Plantation Venue",
    town: "Lovemore Park",
    province: "Eastern Cape",
    address: "The Plantation, Lovemore Park",
    lat: -34.0233,
    lng: 25.5623,
    source: "test",
    precision: "town",
    verified: false,
  },
];

describe("venues — normalisation", () => {
  it("lower-cases, strips punctuation and drops stop-words", () => {
    expect(normaliseName("The Plantation Wedding Venue")).toBe("plantation");
    expect(normaliseName("Avianto & Estate")).toBe("avianto");
    expect(normaliseName("Shepstone Gardens Conference Centre")).toBe("shepstone gardens");
  });
});

describe("venues — similarity", () => {
  it("is 1 for identical names and high for near matches", () => {
    expect(similarity("Avianto", "Avianto")).toBe(1);
    expect(similarity("Avianto Estate", "Avianto")).toBe(1);
    expect(similarity("Avianto", "Aviantoo")).toBeGreaterThan(0.8);
    expect(similarity("Avianto", "Plantation")).toBeLessThan(0.5);
  });
});

describe("venues — matching", () => {
  it("finds a directory venue once stop-words are stripped", () => {
    expect(findVenueInDirectory("Avianto Estate", directory)?.venue.name).toBe("Avianto");
    expect(findVenueInDirectory("The Plantation Wedding Venue", directory)?.venue.name).toBe(
      "The Plantation Venue",
    );
  });

  it("returns null when nothing clears the threshold", () => {
    expect(findVenueInDirectory("Somewhere Else Entirely", directory)).toBeNull();
    expect(findVenueInDirectory("av", directory)).toBeNull();
  });

  it("ranks suggestions and prefers verified entries", () => {
    const results = searchDirectory("avianto", 5, directory);
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].venue.name).toBe("Avianto");
  });

  it("labels a venue with its town", () => {
    expect(venueLabel(directory[0])).toBe("Avianto, Muldersdrift");
  });
});