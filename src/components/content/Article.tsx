export interface ArticleSection {
  heading?: string;
  paragraphs: string[];
  list?: string[];
}

/** Shared renderer for guide and journal article bodies. */
export function Article({ sections }: { sections: ArticleSection[] }) {
  return (
    <div className="prose">
      {sections.map((section, i) => (
        <div key={i}>
          {section.heading ? <h2>{section.heading}</h2> : null}
          {section.paragraphs.map((paragraph, j) => (
            <p key={j}>{paragraph}</p>
          ))}
          {section.list ? (
            <ul>
              {section.list.map((item, k) => (
                <li key={k}>{item}</li>
              ))}
            </ul>
          ) : null}
        </div>
      ))}
    </div>
  );
}