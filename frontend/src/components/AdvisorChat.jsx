import { useState, useRef, useEffect } from "react";
import { askAdvisor } from "../services/api";

const SUGGESTED_QUESTIONS = [
  "How can I save more money?",
  "Am I overspending this month?",
  "Where should I invest my savings?",
  "How do I pay off debt faster?",
];

const AdvisorChat = () => {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hi! I'm your BudgetWise AI Advisor 👋 Ask me anything about your spending, savings, budgets, or investments.",
      source: "system",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = async (text) => {
    const question = (text ?? input).trim();
    if (!question || loading) return;

    setMessages((prev) => [...prev, { role: "user", text: question }]);
    setInput("");
    setLoading(true);

    try {
      const { data } = await askAdvisor(question);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: data.answer, source: data.source, note: data.note },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Sorry, something went wrong while fetching advice. Please try again.",
          source: "error",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="advisor-chat card">
      <div className="advisor-messages">
        {messages.map((m, i) => (
          <div key={i} className={`chat-bubble-row ${m.role}`}>
            {m.role === "assistant" && (
              <div className="chat-avatar">
                <span className="material-icons-round">auto_awesome</span>
              </div>
            )}
            <div className={`chat-bubble ${m.role}`}>
              <p>{m.text}</p>
              {m.source === "local" && (
                <span className="chat-source-tag">
                  <span className="material-icons-round" style={{ fontSize: "0.85rem" }}>
                    offline_bolt
                  </span>
                  Local Advisor
                </span>
              )}
              {m.source === "ai" && (
                <span className="chat-source-tag ai">
                  <span className="material-icons-round" style={{ fontSize: "0.85rem" }}>
                    auto_awesome
                  </span>
                  AI Advisor
                </span>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="chat-bubble-row assistant">
            <div className="chat-avatar">
              <span className="material-icons-round">auto_awesome</span>
            </div>
            <div className="chat-bubble assistant typing">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
        <div ref={bottomRef}></div>
      </div>

      {messages.length <= 1 && (
        <div className="suggested-questions">
          {SUGGESTED_QUESTIONS.map((q) => (
            <button key={q} className="suggested-chip" onClick={() => send(q)}>
              {q}
            </button>
          ))}
        </div>
      )}

      <form
        className="advisor-input-bar"
        onSubmit={(e) => {
          e.preventDefault();
          send();
        }}
      >
        <input
          type="text"
          className="input"
          placeholder="Ask about savings, budgets, investments..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
        />
        <button type="submit" className="btn btn-primary btn-icon-send" disabled={loading || !input.trim()}>
          <span className="material-icons-round">send</span>
        </button>
      </form>
    </div>
  );
};

export default AdvisorChat;
