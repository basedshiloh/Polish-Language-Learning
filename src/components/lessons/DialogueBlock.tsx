import { DialogueLine } from '@/lib/types';

interface DialogueBlockProps {
  lines: DialogueLine[];
}

export default function DialogueBlock({ lines }: DialogueBlockProps) {
  const speakers = [...new Set(lines.map((l) => l.speaker))];

  return (
    <div className="space-y-3">
      {lines.map((line, i) => {
        const isFirst = speakers.indexOf(line.speaker) === 0;
        return (
          <div
            key={i}
            className={`flex flex-col ${isFirst ? 'items-start' : 'items-end'}`}
          >
            <span className="text-xs font-medium text-gray-500 mb-1 px-1">
              {line.speaker}
            </span>
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                isFirst
                  ? 'bg-blue-100 rounded-tl-sm'
                  : 'bg-gray-100 rounded-tr-sm'
              }`}
            >
              <p className="font-semibold text-blue-900 text-sm">{line.polish}</p>
              <p className="text-gray-500 text-xs mt-1">{line.english}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
