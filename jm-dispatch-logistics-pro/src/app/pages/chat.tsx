import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface Message {
  id: string;
  sender: string;
  receiver: string;
  content: string;
  timestamp: string;
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const receiverEmail = "driver-001@email.com"; // à remplacer dynamiquement plus tard

  const fetchMessages = async () => {
    const { data } = await supabase
      .from("messages")
      .select("*")
      .or(`sender.eq.${user.email},receiver.eq.${user.email}`)
      .order("timestamp", { ascending: true });

    if (data) setMessages(data);
  };

  const sendMessage = async () => {
    if (!input) return;
    await supabase.from("messages").insert([
      {
        sender: user.email,
        receiver: receiverEmail,
        content: input,
      },
    ]);
    setInput("");
  };

  useEffect(() => {
    fetchMessages();

    const channel = supabase
      .channel("realtime:messages")
      .on("postgres_changes", {
        event: "*",
        schema: "public",
        table: "messages",
      }, fetchMessages)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Messagerie privée</h1>
      <div className="border p-4 h-[400px] overflow-y-scroll bg-gray-50 rounded mb-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`mb-2 ${msg.sender === user.email ? 'text-right' : 'text-left'}`}>
            <p className="bg-white inline-block p-2 rounded shadow">{msg.content}</p>
            <div className="text-xs text-gray-500">{msg.timestamp}</div>
          </div>
        ))}
      </div>

      <div className="flex space-x-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="border w-full p-2 rounded"
          placeholder="Votre message..."
        />
        <button onClick={sendMessage} className="bg-blue-600 text-white px-4 rounded">Envoyer</button>
      </div>
    </div>
  );
}
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ChatPage() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [receiver, setReceiver] = useState("");

  useEffect(() => {
    fetchMessages();
    const channel = supabase
      .channel("chat")
      .on("postgres_changes", { event: "*", schema: "public", table: "messages" }, fetchMessages)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchMessages = async () => {
    const { data } = await supabase
      .from("messages")
      .select("*")
      .or(`receiver_email.eq.${user.email},receiver_email.eq.all`)
      .order("timestamp", { ascending: true });
    setMessages(data || []);
  };

  const sendMessage = async () => {
    await supabase.from("messages").insert({
      sender_email: user.email,
      receiver_email: receiver || "all",
      content: text,
    });
    setText("");
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">💬 Chat Interne JM Dispatch</h1>

      <input
        type="email"
        placeholder="Envoyer à (email ou 'all')"
        value={receiver}
        onChange={(e) => setReceiver(e.target.value)}
        className="border p-2 mb-2 block w-full"
      />
      <textarea
        placeholder="Votre message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="border p-2 mb-2 block w-full"
      />
      <button onClick={sendMessage} className="bg-blue-600 text-white px-4 py-2 rounded mb-4">
        Envoyer
      </button>

      <div className="bg-gray-100 p-4 rounded max-h-[500px] overflow-y-scroll">
        {messages.map((msg) => (
          <div key={msg.id} className="mb-2">
            <strong>{msg.sender_email}</strong> → {msg.receiver_email}: <br />
            {msg.content}
            <hr className="my-1" />
          </div>
        ))}
      </div>
    </div>
  );
}
