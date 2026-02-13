import { useState, useEffect, useRef } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, MessageSquare } from "lucide-react";

export default function Messaging() {
  const { data: currentUser } = trpc.auth.me.useQuery();
  const [selectedConversationId, setSelectedConversationId] = useState<number | null>(null);
  const [messageText, setMessageText] = useState("");

  // Mock conversations - in production, fetch from backend
  const mockConversations = [
    { id: 1, user: { id: 2, name: "Marco Rossi", avatar: "👤" }, lastMessage: "Ciao, quando possiamo vederci?", unread: 2 },
    { id: 2, user: { id: 3, name: "Giulia Bianchi", avatar: "👤" }, lastMessage: "Mi piace molto la proprietà!", unread: 0 },
    { id: 3, user: { id: 4, name: "Luca Ferrari", avatar: "👤" }, lastMessage: "Perfetto, ci vediamo domani", unread: 1 },
  ];

  const mockMessages = {
    1: [
      { id: 1, senderId: 2, text: "Ciao! Sono interessato alla proprietà", timestamp: new Date(Date.now() - 3600000) },
      { id: 2, senderId: currentUser?.id || 1, text: "Ciao Marco! Sì, è ancora disponibile", timestamp: new Date(Date.now() - 3000000) },
      { id: 3, senderId: 2, text: "Quando possiamo vederci?", timestamp: new Date(Date.now() - 1800000) },
    ],
    2: [
      { id: 1, senderId: 3, text: "Ho visto il tuo annuncio", timestamp: new Date(Date.now() - 7200000) },
      { id: 2, senderId: 3, text: "Mi piace molto la proprietà!", timestamp: new Date(Date.now() - 7000000) },
    ],
    3: [
      { id: 1, senderId: 4, text: "Possiamo vederci domani?", timestamp: new Date(Date.now() - 10800000) },
      { id: 2, senderId: currentUser?.id || 1, text: "Certo! Che ora ti va?", timestamp: new Date(Date.now() - 10600000) },
      { id: 3, senderId: 4, text: "Perfetto, ci vediamo domani", timestamp: new Date(Date.now() - 10400000) },
    ],
  };

  const handleSendMessage = () => {
    if (messageText.trim() && selectedConversationId) {
      // TODO: Call sendMessage mutation
      setMessageText("");
    }
  };

  const selectedConversation = mockConversations.find((c) => c.id === selectedConversationId);
  const messages = selectedConversationId ? (mockMessages as any)[selectedConversationId] || [] : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Messaggi</h1>
          <p className="text-slate-600">Comunica con landlord e roommate</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
          {/* Conversations List */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg">Conversazioni</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[500px]">
                <div className="space-y-2 p-4">
                  {mockConversations.map((conversation) => (
                    <button
                      key={conversation.id}
                      onClick={() => setSelectedConversationId(conversation.id)}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        selectedConversationId === conversation.id
                          ? "bg-blue-100 border border-blue-300"
                          : "hover:bg-slate-100"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="text-2xl">{conversation.user.avatar}</div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-slate-900 truncate">{conversation.user.name}</p>
                          <p className="text-sm text-slate-600 truncate">{conversation.lastMessage}</p>
                        </div>
                        {conversation.unread > 0 && (
                          <div className="bg-blue-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">
                            {conversation.unread}
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Chat Area */}
          <Card className="lg:col-span-2">
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <CardHeader className="border-b border-slate-200">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{selectedConversation.user.avatar}</div>
                    <div>
                      <CardTitle className="text-lg">{selectedConversation.user.name}</CardTitle>
                      <p className="text-sm text-slate-600">Online</p>
                    </div>
                  </div>
                </CardHeader>

                {/* Messages */}
                <CardContent className="p-0 flex flex-col h-[500px]">
                  <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4">
                      {messages.map((message: any) => (
                        <div
                          key={message.id}
                          className={`flex ${message.senderId === currentUser?.id ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-xs px-4 py-2 rounded-lg ${
                              message.senderId === currentUser?.id
                                ? "bg-blue-600 text-white rounded-br-none"
                                : "bg-slate-200 text-slate-900 rounded-bl-none"
                            }`}
                          >
                            <p className="text-sm">{message.text}</p>
                            <p className={`text-xs mt-1 ${message.senderId === currentUser?.id ? "text-blue-100" : "text-slate-600"}`}>
                              {message.timestamp.toLocaleTimeString("it-IT", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>

                  {/* Input */}
                  <div className="border-t border-slate-200 p-4 flex gap-2">
                    <Input
                      placeholder="Scrivi un messaggio..."
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                      className="flex-1"
                    />
                    <Button onClick={handleSendMessage} size="icon" className="bg-blue-600 hover:bg-blue-700">
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </>
            ) : (
              <CardContent className="flex items-center justify-center h-[500px]">
                <div className="text-center">
                  <MessageSquare className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-600">Seleziona una conversazione per iniziare</p>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
