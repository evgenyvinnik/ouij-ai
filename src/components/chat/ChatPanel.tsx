import { useOuijaStore } from '../../state/useOuijaStore';
import { Button } from '../ui/Button';

export function ChatPanel() {
  const { conversationHistory, resetSession, turn } = useOuijaStore();

  return (
    <div className="mx-auto mt-8 max-w-2xl rounded-lg bg-ouija-dark bg-opacity-80 p-6 backdrop-blur-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-spooky text-xl text-ouija-gold">
          Conversation History
        </h3>
        <Button variant="ghost" size="sm" onClick={resetSession}>
          Reset Session
        </Button>
      </div>

      <div className="max-h-64 space-y-3 overflow-y-auto">
        {conversationHistory.length === 0 ? (
          <p className="text-center text-ouija-gold opacity-50">
            No messages yet. Ask the spirits a question...
          </p>
        ) : (
          conversationHistory.map((msg, index) => (
            <div
              key={index}
              className={`rounded-lg p-3 ${
                msg.role === 'user'
                  ? 'bg-ouija-wood bg-opacity-30 text-right'
                  : 'bg-black bg-opacity-30 text-left'
              }`}
            >
              <span className="text-xs uppercase text-ouija-gold opacity-70">
                {msg.role === 'user' ? 'You' : 'Spirit'}
              </span>
              <p className="mt-1 font-vintage text-ouija-gold">
                {msg.content}
              </p>
            </div>
          ))
        )}
      </div>

      <div className="mt-4 text-center text-sm text-ouija-gold opacity-70">
        {turn === 'user' && 'Type your question and press Enter'}
        {turn === 'spirit' && 'The spirits are contemplating...'}
        {turn === 'animating' && 'The spirits are speaking...'}
      </div>
    </div>
  );
}
