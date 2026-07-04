'use client';

import { useMemo } from 'react';
import { lessons } from '@/data/lessons';
import { grammarTopics } from '@/data/grammar';
import { quizzes } from '@/data/quizzes';

export interface SearchEntry {
  title: string;
  category: 'lesson' | 'grammar' | 'quiz' | 'blog';
  href: string;
  snippet: string;
}

function buildIndex(): SearchEntry[] {
  const entries: SearchEntry[] = [];

  for (const lesson of lessons) {
    const parts: string[] = [lesson.title, lesson.description];
    for (const block of lesson.content) {
      parts.push(block.title);
      if (block.vocabulary) {
        for (const v of block.vocabulary) {
          parts.push(v.polish, v.english);
          if (v.example) parts.push(v.example);
        }
      }
      if (block.grammar) {
        for (const g of block.grammar) {
          parts.push(g.title, g.explanation);
          for (const ex of g.examples) parts.push(ex.polish, ex.english);
          if (g.tip) parts.push(g.tip);
        }
      }
      if (block.dialogue) {
        for (const d of block.dialogue) parts.push(d.polish, d.english);
      }
      if (block.phrases) {
        for (const p of block.phrases) parts.push(p.polish, p.english);
      }
      if (block.culturalNote) parts.push(block.culturalNote);
    }
    entries.push({
      title: lesson.title,
      category: 'lesson',
      href: `/lessons/${lesson.id}`,
      snippet: parts.join(' '),
    });
  }

  for (const topic of grammarTopics) {
    const parts: string[] = [topic.title, topic.polishTitle || '', topic.description];
    for (const section of topic.sections) {
      if (section.title) parts.push(section.title);
      if (section.text) parts.push(section.text);
      if (section.note) parts.push(section.note);
      if (section.table) {
        for (const row of section.table.rows) parts.push(...row);
        if (section.table.caption) parts.push(section.table.caption);
        if (section.table.footnote) parts.push(section.table.footnote);
      }
      if (section.examples) {
        for (const ex of section.examples) {
          parts.push(ex.polish, ex.english);
          if (ex.note) parts.push(ex.note);
        }
      }
      if (section.comparison) {
        for (const c of section.comparison) {
          parts.push(c.title, c.subtitle, c.usage);
          for (const ex of c.examples) parts.push(ex.polish, ex.english);
        }
      }
      if (section.frequency) {
        for (const f of section.frequency) parts.push(f.polish, f.english);
      }
    }
    entries.push({
      title: topic.title,
      category: 'grammar',
      href: `/grammar/${topic.id}`,
      snippet: parts.join(' '),
    });
  }

  for (const quiz of quizzes) {
    const parts: string[] = [quiz.title, quiz.description];
    for (const q of quiz.questions) {
      parts.push(q.prompt);
      if (q.type === 'multiple-choice') parts.push(...q.options);
      if (q.type === 'fill-in-blank') parts.push(q.correctAnswer);
      if (q.type === 'matching') {
        for (const p of q.pairs) parts.push(p.left, p.right);
      }
      if ('explanation' in q && q.explanation) parts.push(q.explanation);
    }
    entries.push({
      title: quiz.title,
      category: 'quiz',
      href: `/quizzes/${quiz.id}`,
      snippet: parts.join(' '),
    });
  }

  return entries;
}

export interface SearchResult {
  entry: SearchEntry;
  matchedText: string;
}

export function useSearch(extraEntries: SearchEntry[] = []) {
  const index = useMemo(() => [...buildIndex(), ...extraEntries], [extraEntries]);

  function search(query: string): SearchResult[] {
    if (!query || query.length < 2) return [];

    const q = query.toLowerCase();
    const results: SearchResult[] = [];

    for (const entry of index) {
      const lowerSnippet = entry.snippet.toLowerCase();
      const matchIdx = lowerSnippet.indexOf(q);
      if (matchIdx === -1) continue;

      // Extract a context window around the match
      const start = Math.max(0, matchIdx - 30);
      const end = Math.min(entry.snippet.length, matchIdx + q.length + 50);
      let matched = entry.snippet.slice(start, end).trim();
      if (start > 0) matched = '…' + matched;
      if (end < entry.snippet.length) matched = matched + '…';

      results.push({ entry, matchedText: matched });
    }

    return results;
  }

  return { search };
}
