/**
 * Renders Notion API block objects as React elements.
 * Handles the most common block types with Tailwind prose styling.
 */

interface RichText {
  type: string;
  plain_text: string;
  href?: string | null;
  annotations?: {
    bold?: boolean;
    italic?: boolean;
    strikethrough?: boolean;
    underline?: boolean;
    code?: boolean;
    color?: string;
  };
}

interface NotionBlock {
  id: string;
  type: string;
  [key: string]: any;
}

/** Convert a Notion rich_text array into React inline elements */
function renderRichText(richTexts: RichText[]) {
  if (!richTexts || richTexts.length === 0) return null;

  return richTexts.map((rt, i) => {
    let node: React.ReactNode = rt.plain_text;
    const a = rt.annotations;

    if (a?.code) {
      node = (
        <code key={i} className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-1.5 py-0.5 rounded text-sm">
          {node}
        </code>
      );
    }
    if (a?.bold) node = <strong key={`b-${i}`}>{node}</strong>;
    if (a?.italic) node = <em key={`i-${i}`}>{node}</em>;
    if (a?.strikethrough) node = <s key={`s-${i}`}>{node}</s>;
    if (a?.underline) node = <u key={`u-${i}`}>{node}</u>;

    if (rt.href) {
      node = (
        <a
          key={`a-${i}`}
          href={rt.href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary font-medium hover:underline"
        >
          {node}
        </a>
      );
    }

    return <span key={i}>{node}</span>;
  });
}

function ParagraphBlock({ block }: { block: NotionBlock }) {
  const texts = block.paragraph?.rich_text;
  if (!texts || texts.length === 0) return <br />;
  return (
    <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
      {renderRichText(texts)}
    </p>
  );
}

function HeadingBlock({ block, level }: { block: NotionBlock; level: 1 | 2 | 3 }) {
  const key = `heading_${level}` as const;
  const texts = block[key]?.rich_text;
  if (!texts) return null;

  const Tag = `h${level}` as keyof JSX.IntrinsicElements;
  const classes: Record<number, string> = {
    1: "text-3xl md:text-4xl font-bold mt-12 mb-6 text-gray-900 dark:text-white",
    2: "text-2xl md:text-3xl font-bold mt-12 mb-6 text-gray-900 dark:text-white",
    3: "text-xl md:text-2xl font-bold mt-10 mb-4 text-gray-900 dark:text-white",
  };

  return <Tag className={classes[level]}>{renderRichText(texts)}</Tag>;
}

function BulletedListItemBlock({ block }: { block: NotionBlock }) {
  return (
    <li className="text-gray-700 dark:text-gray-300 my-1">
      {renderRichText(block.bulleted_list_item?.rich_text)}
    </li>
  );
}

function NumberedListItemBlock({ block }: { block: NotionBlock }) {
  return (
    <li className="text-gray-700 dark:text-gray-300 my-1">
      {renderRichText(block.numbered_list_item?.rich_text)}
    </li>
  );
}

function QuoteBlock({ block }: { block: NotionBlock }) {
  return (
    <blockquote className="border-l-4 border-teal-500 pl-4 my-6 italic text-gray-600 dark:text-gray-400">
      {renderRichText(block.quote?.rich_text)}
    </blockquote>
  );
}

function CalloutBlock({ block }: { block: NotionBlock }) {
  const icon = block.callout?.icon?.emoji || "💡";
  return (
    <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-4 my-6 flex gap-3">
      <span className="text-xl flex-shrink-0">{icon}</span>
      <div className="text-gray-700 dark:text-gray-300">
        {renderRichText(block.callout?.rich_text)}
      </div>
    </div>
  );
}

function ImageBlock({ block }: { block: NotionBlock }) {
  const img = block.image;
  const url = img?.type === "external" ? img.external?.url : img?.file?.url;
  const caption = img?.caption;

  if (!url) return null;

  return (
    <figure className="my-8">
      <img
        src={url}
        alt={caption?.[0]?.plain_text || ""}
        className="w-full rounded-lg"
        loading="lazy"
      />
      {caption && caption.length > 0 && (
        <figcaption className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2">
          {renderRichText(caption)}
        </figcaption>
      )}
    </figure>
  );
}

function DividerBlock() {
  return <hr className="my-10 border-gray-200 dark:border-gray-700" />;
}

function CodeBlock({ block }: { block: NotionBlock }) {
  const code = block.code?.rich_text?.map((rt: RichText) => rt.plain_text).join("") || "";
  const language = block.code?.language || "";

  return (
    <pre className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 my-6 overflow-x-auto">
      <code className="text-sm text-gray-800 dark:text-gray-200" data-language={language}>
        {code}
      </code>
    </pre>
  );
}

function ToggleBlock({ block }: { block: NotionBlock }) {
  return (
    <details className="my-4 group">
      <summary className="cursor-pointer font-medium text-gray-800 dark:text-gray-200 hover:text-teal-600 transition-colors">
        {renderRichText(block.toggle?.rich_text)}
      </summary>
      {block.toggle?.children && (
        <div className="pl-4 mt-2 border-l-2 border-gray-200 dark:border-gray-700">
          <NotionRenderer blocks={block.toggle.children} />
        </div>
      )}
    </details>
  );
}

/**
 * Groups consecutive list items into <ul> / <ol> wrappers,
 * then renders every block to the correct component.
 */
export function NotionRenderer({ blocks }: { blocks: NotionBlock[] }) {
  if (!blocks || blocks.length === 0) return null;

  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < blocks.length) {
    const block = blocks[i];

    // Group consecutive bulleted list items
    if (block.type === "bulleted_list_item") {
      const items: NotionBlock[] = [];
      while (i < blocks.length && blocks[i].type === "bulleted_list_item") {
        items.push(blocks[i]);
        i++;
      }
      elements.push(
        <ul key={`ul-${items[0].id}`} className="pl-6 my-4 list-disc">
          {items.map((item) => (
            <BulletedListItemBlock key={item.id} block={item} />
          ))}
        </ul>,
      );
      continue;
    }

    // Group consecutive numbered list items
    if (block.type === "numbered_list_item") {
      const items: NotionBlock[] = [];
      while (i < blocks.length && blocks[i].type === "numbered_list_item") {
        items.push(blocks[i]);
        i++;
      }
      elements.push(
        <ol key={`ol-${items[0].id}`} className="pl-6 my-4 list-decimal">
          {items.map((item) => (
            <NumberedListItemBlock key={item.id} block={item} />
          ))}
        </ol>,
      );
      continue;
    }

    // Single blocks
    switch (block.type) {
      case "paragraph":
        elements.push(<ParagraphBlock key={block.id} block={block} />);
        break;
      case "heading_1":
        elements.push(<HeadingBlock key={block.id} block={block} level={1} />);
        break;
      case "heading_2":
        elements.push(<HeadingBlock key={block.id} block={block} level={2} />);
        break;
      case "heading_3":
        elements.push(<HeadingBlock key={block.id} block={block} level={3} />);
        break;
      case "quote":
        elements.push(<QuoteBlock key={block.id} block={block} />);
        break;
      case "callout":
        elements.push(<CalloutBlock key={block.id} block={block} />);
        break;
      case "image":
        elements.push(<ImageBlock key={block.id} block={block} />);
        break;
      case "divider":
        elements.push(<DividerBlock key={block.id} />);
        break;
      case "code":
        elements.push(<CodeBlock key={block.id} block={block} />);
        break;
      case "toggle":
        elements.push(<ToggleBlock key={block.id} block={block} />);
        break;
      default:
        // Unsupported block type — skip silently
        break;
    }

    i++;
  }

  return <>{elements}</>;
}
