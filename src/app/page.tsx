import React from "react";
import type { Metadata } from "next";
import { getPublishedSkills, getAllCategories } from "@/server/services/skills";
import { OnePageDirectory } from "@/components/skills/one-page-directory";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "AgenticSkills — AI Agent Skills Directory",
  description: "Discover, inspect, and install verified AI agent skills.",
  alternates: {
    canonical: "/"
  }
};

export default async function HomePage() {
  const [publishedSkills, categories] = await Promise.all([
    getPublishedSkills({ limit: 50 }),
    getAllCategories()
  ]);

  return (
    <OnePageDirectory
      initialSkills={publishedSkills as any}
      initialCategories={categories}
    />
  );
}
