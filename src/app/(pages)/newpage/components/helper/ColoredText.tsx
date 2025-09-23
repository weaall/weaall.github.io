interface Props {
  color?: string;
  children: React.ReactNode;
}

function ColoredText({ color, children }: Props) {
  return <span style={{ color }}>{children}</span>;
}
