"use client";

import React, { useState } from "react";
import { Check, Github, X } from "lucide-react";

interface SubmitSkillModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SubmitSkillModal({ isOpen, onClose }: SubmitSkillModalProps) {
  const [url, setUrl] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setUrl("");
      setName("");
      setDescription("");
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/60 backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="submit-skill-title"
        className="w-full max-w-lg rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-xl select-none"
      >
        <div className="flex items-center justify-between pb-4 border-b border-neutral-100 dark:border-neutral-800">
          <div>
            <h2 id="submit-skill-title" className="text-base font-bold text-neutral-900 dark:text-neutral-100">
              Submit a Skill
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              Publish your verified skill into the open-source index.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="h-8 w-8 flex items-center justify-center rounded-[3px] text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {submitted ? (
          <div className="py-10 text-center space-y-3">
            <div className="mx-auto h-10 w-10 flex items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
              <Check className="h-5 w-5" />
            </div>
            <p className="font-semibold text-sm text-neutral-900 dark:text-neutral-100">
              Skill submitted for verification
            </p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-xs mx-auto">
              Our automated linter and curator suite will inspect the repository structure and add it to the live index.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div>
              <label htmlFor="repo-url" className="block text-xs font-mono uppercase text-neutral-600 dark:text-neutral-400 mb-1">
                GitHub Repository or SKILL.md URL
              </label>
              <div className="relative">
                <Github className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <input
                  id="repo-url"
                  type="url"
                  required
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://github.com/owner/repo/tree/main/skills/your-skill"
                  className="h-10 w-full rounded-[4px] border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 pl-9 pr-3 text-xs text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 outline-none focus:border-neutral-900 dark:focus:border-neutral-200"
                />
              </div>
            </div>

            <div>
              <label htmlFor="skill-name" className="block text-xs font-mono uppercase text-neutral-600 dark:text-neutral-400 mb-1">
                Skill Name (Optional)
              </label>
              <input
                id="skill-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Frontend Design"
                className="h-10 w-full rounded-[4px] border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 px-3 text-xs text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 outline-none focus:border-neutral-900 dark:focus:border-neutral-200"
              />
            </div>

            <div>
              <label htmlFor="skill-desc" className="block text-xs font-mono uppercase text-neutral-600 dark:text-neutral-400 mb-1">
                Short Description
              </label>
              <textarea
                id="skill-desc"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Instructs agents to..."
                className="w-full rounded-[4px] border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 p-3 text-xs text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 outline-none focus:border-neutral-900 dark:focus:border-neutral-200 resize-none"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="h-9 px-4 rounded-[4px] border border-neutral-200 dark:border-neutral-800 text-xs font-medium text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="h-9 px-5 rounded-[4px] bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 hover:bg-neutral-800 dark:hover:bg-neutral-200 text-xs font-semibold uppercase tracking-wider transition-colors active:scale-[0.98]"
              >
                Submit Skill
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
