"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Image from "next/image";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({ content, className = "" }: MarkdownRendererProps) {
  return (
    <div className={`markdown-content ${className} [&>*:first-child]:mt-0 [&>*:last-child]:mb-0`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Headings
          h1: ({ node, ...props }) => (
            <h1 className="text-2xl font-semibold mt-6 mb-4 text-foreground-bright first:mt-0" {...props} />
          ),
          h2: ({ node, ...props }) => (
            <h2 className="text-xl font-semibold mt-5 mb-3 text-foreground-bright first:mt-0" {...props} />
          ),
          h3: ({ node, ...props }) => (
            <h3 className="text-lg font-semibold mt-4 mb-2 text-foreground-bright first:mt-0" {...props} />
          ),
          h4: ({ node, ...props }) => (
            <h4 className="text-base font-semibold mt-3 mb-2 text-foreground-bright first:mt-0" {...props} />
          ),
          h5: ({ node, ...props }) => (
            <h5 className="text-sm font-semibold mt-2 mb-1 text-foreground-bright first:mt-0" {...props} />
          ),
          h6: ({ node, ...props }) => (
            <h6 className="text-sm font-medium mt-2 mb-1 text-foreground-secondary first:mt-0" {...props} />
          ),
          
          // Paragraphs
          p: ({ node, ...props }) => (
            <p className="mb-3 text-foreground leading-relaxed last:mb-0" {...props} />
          ),
          
          // Lists
          ul: ({ node, ...props }) => (
            <ul className="list-disc list-inside mb-4 space-y-1 ml-4 text-foreground last:mb-0" {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol className="list-decimal list-inside mb-4 space-y-1 ml-4 text-foreground last:mb-0" {...props} />
          ),
          li: ({ node, ...props }) => (
            <li className="mb-1 text-foreground last:mb-0" {...props} />
          ),
          
          // Links
          a: ({ node, ...props }) => (
            <a
              className="text-accent-primary hover:text-accent-info underline break-words"
              target="_blank"
              rel="noopener noreferrer"
              {...props}
            />
          ),
          
          // Code blocks
          code: ({ node, className, children, ...props }: any) => {
            const isInline = !className;
            return isInline ? (
              <code
                className="bg-background-deep px-1.5 py-0.5 rounded text-accent-info text-sm font-mono"
                {...props}
              >
                {children}
              </code>
            ) : (
              <code className={`${className} text-foreground`} {...props}>
                {children}
              </code>
            );
          },
          pre: ({ node, ...props }) => (
            <pre
              className="bg-background-deep border border-divider rounded-lg p-4 mb-4 overflow-x-auto [&>code]:text-foreground [&>code]:block [&>code]:p-0"
              {...props}
            />
          ),
          
          // Blockquotes
          blockquote: ({ node, ...props }) => (
            <blockquote
              className="border-l-4 border-accent-primary pl-4 my-4 italic text-foreground-secondary"
              {...props}
            />
          ),
          
          // Horizontal rule
          hr: ({ node, ...props }) => (
            <hr className="border-divider my-6" {...props} />
          ),
          
          // Tables
          table: ({ node, ...props }) => (
            <div className="overflow-x-auto my-4">
              <table className="min-w-full border-collapse border border-divider" {...props} />
            </div>
          ),
          thead: ({ node, ...props }) => (
            <thead className="bg-background-secondary" {...props} />
          ),
          tbody: ({ node, ...props }) => (
            <tbody {...props} />
          ),
          tr: ({ node, ...props }) => (
            <tr className="border-b border-divider" {...props} />
          ),
          th: ({ node, ...props }) => (
            <th className="border border-divider px-4 py-2 text-left font-semibold text-foreground-bright" {...props} />
          ),
          td: ({ node, ...props }) => (
            <td className="border border-divider px-4 py-2 text-foreground" {...props} />
          ),
          
          // Images
          img: ({ node, src, alt, ...props }: any) => {
            if (!src) return null;
            
            // Check if it's an external URL or relative path
            const isExternal = src.startsWith("http://") || src.startsWith("https://");
            
            return (
              <div className="relative w-full my-4 rounded-lg border border-divider overflow-hidden" style={{ minHeight: '200px' }}>
                <Image
                  src={src}
                  alt={alt || ""}
                  fill
                  className="object-contain rounded-lg"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                  unoptimized={isExternal}
                  {...props}
                />
              </div>
            );
          },
          
          // Task lists (GitHub Flavored Markdown)
          input: ({ node, ...props }: any) => {
            if (props.type === "checkbox") {
              return (
                <input
                  type="checkbox"
                  className="mr-2 accent-accent-primary"
                  disabled
                  {...props}
                />
              );
            }
            return <input {...props} />;
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

