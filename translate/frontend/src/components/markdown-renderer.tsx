import Markdown from "react-markdown";

const MarkdownRenderer = ({ children }: { children: string }) => {
  return (
    <Markdown
      components={{
        a: ({ ...props }) => (
          <a
            className="text-soniox underline underline-offset-1"
            {...props}
            target="_blank"
            rel="noreferrer"
          />
        ),
      }}
    >
      {children}
    </Markdown>
  );
};

export default MarkdownRenderer;
