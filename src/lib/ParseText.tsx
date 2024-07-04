const parseText = (text: string) => {
  const urlPattern = /(https?:\/\/[^\s)]+)/g;
  const parts = text.split(urlPattern);

  return parts.map((part, index) => {
    if (urlPattern.test(part)) {
      return (
        <a onClick={(e) => { e.stopPropagation(); }} className="text-blue-600 hover:underline underline-offset-4" key={index} href={part} target="_blank" rel="noopener noreferrer">
          {part}
        </a>
      );
    }
    return part;
  });
};

export default parseText;