'use client'

import { useState } from 'react'
import { useChat } from 'ai/react'
import { Bot, Send, X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const { messages, input, handleInputChange, handleSubmit } = useChat()

  const toggleChat = () => setIsOpen(!isOpen)

  return (
    <div className="fixed bottom-4 right-4">
      {!isOpen && (
        <Button
          onClick={toggleChat}
          className="rounded-full w-16 h-16 shadow-lg"
        >
          <Bot className="w-8 h-8" />
        </Button>
      )}

      {isOpen && (
        <Card className="w-80 h-[500px] shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <h2 className="text-xl font-bold">Mini Mech</h2>
            <Button variant="ghost" size="icon" onClick={toggleChat}>
              <X className="w-6 h-6" />
            </Button>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[350px] pr-4">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`mb-4 ${
                    m.role === 'user' ? 'text-right' : 'text-left'
                  }`}
                >
                  <div
                    className={`inline-block p-2 rounded-lg ${
                      m.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              ))}
            </ScrollArea>
          </CardContent>
          <CardFooter>
            <form onSubmit={handleSubmit} className="flex w-full gap-2">
              <Input
                value={input}
                onChange={handleInputChange}
                placeholder="Escribe un mensaje..."
                className="flex-grow"
              />
              <Button type="submit" size="icon">
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}