import { DialogueLine } from '@/lib/types';
import SpeakButton from '@/components/shared/SpeakButton';

interface DialogueBlockProps {
  lines: DialogueLine[];
}

export default function DialogueBlock({ lines }: DialogueBlockProps) {
  const speakers = [...new Set(lines.map((l) => l.speaker))];

  return (
    <div className="space-y-4">
      {lines.map((line, i) => {
        const isFirst = speakers.indexOf(line.speaker) === 0;
        return (
          <div
            key={i}
            className={`flex items-start gap-2.5 ${isFirst ? '' : 'flex-row-reverse'}`}
          >
            {/* Speaker avatar */}
            <span
              className={`mt-6 flex items-center justify-center w-9 h-9 rounded-full shrink-0 font-display text-sm font-bold text-white ${
                isFirst ? 'bg-cobalt' : 'bg-teal'
              }`}
              aria-hidden="true"
            >
              {line.speaker.charAt(0).toUpperCase()}
            </span>

            <div className={`flex flex-col min-w-0 max-w-[85%] ${isFirst ? 'items-start' : 'items-end'}`}>
              <span className="text-xs font-extrabold text-muted mb-1 px-1">
                {line.speaker}
              </span>
              <div
                className={`rounded-[20px] px-4 py-3 ${
                  isFirst
                    ? 'bg-cobalt-soft rounded-tl-md'
                    : 'bg-teal-soft rounded-tr-md'
                }`}
              >
                <div className="flex items-start gap-2">
                  <p className="polish-text text-base leading-snug flex-1 pt-1">{line.polish}</p>
                  <SpeakButton text={line.polish} />
                </div>
                <p className="text-sm text-muted mt-1">{line.english}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
