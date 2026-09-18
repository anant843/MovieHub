import { useRef, useState, useEffect } from "react";
import { generateWithFallback } from "../utils/openai";
import { FaPaperPlane, FaTrashAlt, FaRobot, FaUser } from "react-icons/fa";

const MovieChatBot = ({ title, description }) => {
  const userQues = useRef(null);
  const chatBottomRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: `👋 Hey! I'm your AI Companion for "${title}". Ask me anything about the cast, storyline, hidden details, or whether it's worth watching!`,
    },
  ]);

  const quickPrompts = [
    "📖 Quick plot summary",
    "🎬 Who directed this?",
    "🍿 Is it worth watching?",
    "⏳ Any post-credit scenes?",
  ];

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleAsk = async (customQuestion) => {
    const question = (customQuestion || userQues.current?.value)?.trim();
    if (!question || loading) return;

    if (userQues.current) {
      userQues.current.value = "";
    }

    // Add user message to state
    const newMessages = [...messages, { role: "user", text: question }];
    setMessages(newMessages);
    setLoading(true);

    const prompt = `You are a knowledgeable movie companion. Always answer specifically about the following movie:

Movie Title: ${title}
Movie Description: ${description}

User's Question: ${question}

Guidelines:
- Give an engaging, direct answer (within 60 to 90 words).
- Avoid generic filler.
- Mention notable actors, characters, or context if relevant.`;

    try {
      const text = await generateWithFallback(prompt);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: text || "No response received from AI." },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text:
            "Sorry, could not answer right now: " +
            (err.message || "AI is temporarily busy. Please try again in a moment."),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        role: "assistant",
        text: `Chat cleared. What else would you like to know about "${title}"?`,
      },
    ]);
  };

  return (
    <div className="w-full md:w-1/3 bg-neutral-900/95 border-l border-neutral-800 flex flex-col h-[650px] max-h-[85vh] rounded-xl overflow-hidden shadow-2xl m-2 md:m-4">
      {/* Chatbot Header */}
      <div className="p-4 bg-neutral-950 border-b border-neutral-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-purple-600/30 flex items-center justify-center text-purple-400">
            <FaRobot className="text-base" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
              AI Movie Companion
            </h3>
            <p className="text-[11px] text-gray-400 truncate max-w-[180px]">
              Chatting about: {title}
            </p>
          </div>
        </div>
        <button
          onClick={clearChat}
          title="Clear Chat"
          className="text-gray-400 hover:text-red-400 p-2 text-xs transition-colors cursor-pointer rounded-lg hover:bg-neutral-800"
        >
          <FaTrashAlt />
        </button>
      </div>

      {/* Quick Prompt Chips */}
      <div className="p-2.5 bg-neutral-950/60 border-b border-neutral-800/80 flex gap-2 overflow-x-auto scrollbar-hide">
        {quickPrompts.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => handleAsk(chip.slice(2).trim())}
            disabled={loading}
            className="text-[11px] whitespace-nowrap bg-neutral-800 hover:bg-purple-900/40 text-gray-300 hover:text-purple-300 px-2.5 py-1 rounded-full border border-neutral-700/60 transition-colors cursor-pointer shrink-0 disabled:opacity-50"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 scrollbar-thin scrollbar-thumb-neutral-700">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex items-start gap-2 ${
              msg.role === "user" ? "flex-row-reverse" : "flex-row"
            }`}
          >
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] shrink-0 mt-1 ${
                msg.role === "user"
                  ? "bg-purple-600 text-white"
                  : "bg-neutral-800 text-purple-400 border border-neutral-700"
              }`}
            >
              {msg.role === "user" ? <FaUser /> : <FaRobot />}
            </div>

            <div
              className={`max-w-[80%] p-3 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-purple-600 text-white rounded-tr-none shadow-md"
                  : "bg-neutral-800/90 text-gray-200 rounded-tl-none border border-neutral-750 shadow"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-gray-400 text-xs italic animate-pulse pl-8">
            <FaRobot className="text-purple-400" />
            <span>Companion is thinking...</span>
          </div>
        )}
        <div ref={chatBottomRef} />
      </div>

      {/* Input Form */}
      <div className="p-3 bg-neutral-950 border-t border-neutral-800">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAsk();
          }}
          className="flex items-center gap-2"
        >
          <input
            ref={userQues}
            type="text"
            placeholder={`Ask about ${title}...`}
            disabled={loading}
            className="flex-1 bg-neutral-900 border border-neutral-800 text-white text-xs sm:text-sm px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-purple-500 placeholder-gray-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white p-2.5 rounded-xl transition-colors cursor-pointer flex items-center justify-center shadow-md"
          >
            <FaPaperPlane className="text-xs" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default MovieChatBot;