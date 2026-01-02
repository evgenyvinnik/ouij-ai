import { useOuijaStore } from '../../state/useOuijaStore';
import { Button } from '../ui/Button';

export function ChatPanel() {
  const { conversationHistory, resetSession, turn } = useOuijaStore();

  // Simplified chat panel - hidden by default, can be toggled
  if (conversationHistory.length === 0) {
    return null;
  }

  return (
    <div
      className="rounded-lg p-4 backdrop-blur-sm"
      style={{
        backgroundColor: 'rgba(251, 237, 200, 0.85)',
        fontFamily: 'Carnivalee Freakshow, cursive',
        color: 'black',
        maxHeight: '200px',
      }}
    >
      <div className="mb-2 flex items-center justify-between">
        <h3
          style={{
            fontSize: '1.5vw',
            color: 'black',
          }}
        >
          Conversation History
        </h3>
        <Button variant="ghost" size="sm" onClick={resetSession}>
          Reset Session
        </Button>
      </div>

      <div className="max-h-32 space-y-2 overflow-y-auto">
        {conversationHistory.map((msg, index) => (
          <div
            key={index}
            className={`rounded p-2 ${
              msg.role === 'user' ? 'text-right' : 'text-left'
            }`}
            style={{
              backgroundColor:
                msg.role === 'user'
                  ? 'rgba(61, 40, 23, 0.2)'
                  : 'rgba(0, 0, 0, 0.2)',
            }}
          >
            <span
              className="text-xs uppercase opacity-70"
              style={{
                fontFamily: 'Kingthings Trypewriter 2, monospace',
              }}
            >
              {msg.role === 'user' ? 'You' : 'Spirit'}
            </span>
            <p
              className="mt-1"
              style={{
                fontFamily: 'Kingthings Trypewriter 2, monospace',
                fontSize: '1vw',
              }}
            >
              {msg.content}
            </p>
          </div>
        ))}
      </div>

      <div
        className="mt-2 text-center text-xs opacity-70"
        style={{
          fontFamily: 'Kingthings Trypewriter 2, monospace',
        }}
      >
        {turn === 'user' && 'Type your question and press Enter'}
        {turn === 'spirit' && 'The spirits are contemplating...'}
        {turn === 'animating' && 'The spirits are speaking...'}
      </div>
    </div>
  );
}
