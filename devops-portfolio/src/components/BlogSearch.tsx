import React, { useState, useMemo } from 'react';
import './BlogSearch.css';

interface PostSummary {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
}

interface Props {
  posts: PostSummary[];
}

export default function BlogSearch({ posts }: Props) {
  const [query, setQuery] = useState('');
  const [activeTag, setActiveTag] = useState('');
  const [activeMonth, setActiveMonth] = useState('');

  const allTags = useMemo(() => {
    const set = new Set<string>();
    posts.forEach(p => p.tags.forEach(t => set.add(t)));
    return Array.from(set).sort();
  }, [posts]);

  const allMonths = useMemo(() => {
    const set = new Set<string>();
    posts.forEach(p => {
      const d = new Date(p.date);
      set.add(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
    });
    return Array.from(set).sort().reverse();
  }, [posts]);

  const filtered = useMemo(() => {
    let result = posts;

    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter(
        p =>
          p.title.toLowerCase().includes(q) ||
          p.excerpt.toLowerCase().includes(q) ||
          p.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    if (activeTag) {
      result = result.filter(p => p.tags.includes(activeTag));
    }

    if (activeMonth) {
      result = result.filter(p => {
        const d = new Date(p.date);
        const m = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        return m === activeMonth;
      });
    }

    return result;
  }, [posts, query, activeTag, activeMonth]);

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'UTC',
    });
  }

  function formatMonth(ym: string) {
    const [year, month] = ym.split('-');
    return new Date(Number(year), Number(month) - 1).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
    });
  }

  return (
    <div className="blog-search">
      <div className="search-controls">
        <input
          className="search-input"
          type="search"
          placeholder="Search posts..."
          value={query}
          onChange={e => setQuery(e.target.value)}
        />

        {allTags.length > 0 && (
          <div className="filter-row">
            <button
              className={`filter-chip ${activeTag === '' ? 'active' : ''}`}
              onClick={() => setActiveTag('')}
            >
              All tags
            </button>
            {allTags.map(tag => (
              <button
                key={tag}
                className={`filter-chip ${activeTag === tag ? 'active' : ''}`}
                onClick={() => setActiveTag(activeTag === tag ? '' : tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        )}

        {allMonths.length > 1 && (
          <div className="filter-row">
            <button
              className={`filter-chip ${activeMonth === '' ? 'active' : ''}`}
              onClick={() => setActiveMonth('')}
            >
              All time
            </button>
            {allMonths.map(ym => (
              <button
                key={ym}
                className={`filter-chip ${activeMonth === ym ? 'active' : ''}`}
                onClick={() => setActiveMonth(activeMonth === ym ? '' : ym)}
              >
                {formatMonth(ym)}
              </button>
            ))}
          </div>
        )}
      </div>

      {filtered.length === 0 ? (
        <p className="no-results">No posts match your search.</p>
      ) : (
        <ul className="post-list">
          {filtered.map(post => (
            <li key={post.slug} className="post-card">
              <a href={`/blog/${post.slug}`} className="post-link">
                <span className="post-title">{post.title}</span>
                <time className="post-date">{formatDate(post.date)}</time>
                <p className="post-excerpt">{post.excerpt}</p>
                {post.tags.length > 0 && (
                  <ul className="tag-list">
                    {post.tags.map(t => <li key={t} className="tag">{t}</li>)}
                  </ul>
                )}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
