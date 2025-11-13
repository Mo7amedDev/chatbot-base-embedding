'use client'

import { useState } from 'react'
import { Button } from './ui/button'
import { motion, AnimatePresence } from 'framer-motion'

export default function Chatbot({ chatbotId,isOpen }: { chatbotId: string,isOpen:boolean }) {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([])
  const [input, setInput] = useState('')
  //const [isOpen, setIsOpen] = useState(true);
  const [isFixed,setIsFixed] = useState(true);

  const sendMessage = async () => {
    const userMsg = { role: 'user', content: input }
    setMessages((prev) => [...prev, userMsg])
    setInput('')

    const res = await fetch(`/api/chat?chatbotId=${chatbotId}`, {
      method: 'POST',
      body: JSON.stringify({ message: input }),
    })
    const data = await res.json()
    setMessages((prev) => [...prev, { role: 'bot', content: data.reply }])
  }

  return (
    <div className="flex flex-col items-end z-[9999] min-w-14 min-h-14  ">
      {/* Animated chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="chat-window"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="mb-2 rounded-xl shadow-lg border border-gray-300 bg-white p-3 w-full"
          >
            <div className="h-[250px] overflow-y-auto mb-2">
              {messages.map((m, i) => (
                <div key={i} className="text-sm mb-1">
                  <b>{m.role}:</b> {m.content}
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message"
                className="flex-1 border border-gray-300 rounded-md px-2 py-1 text-sm"
              />
              <button
                onClick={sendMessage}
                className="bg-blue-500 text-white px-3 rounded-md text-sm"
              >
                Send
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      
    </div>
  )
}
