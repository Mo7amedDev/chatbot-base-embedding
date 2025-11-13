'use client'
import { useEffect, useRef, useState } from 'react'
import Chatbot from '@/components/Chatbot'
import { useSearchParams } from 'next/navigation'

export default function EmbedChatbotPage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const params = useSearchParams()
  const [isChatOpen, setIsChatOpen] = useState(false)

  useEffect(() => {
    const sendSize = () => {
      if (!containerRef.current) return

      const rect = containerRef.current.getBoundingClientRect()
      window.parent.postMessage(
        {
          type: 'chatbot-size',
          width: Math.ceil(rect.width),
          height: Math.ceil(rect.height),
        },
        '*'
      )
    }

    sendSize()

    const observer = new ResizeObserver(sendSize)
    if (containerRef.current) observer.observe(containerRef.current)

    return () => observer.disconnect()
  }, [isChatOpen]) // Re-run when chat opens/closes to update size

  // Listen for close messages from parent window
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'close-chatbot') {
        setIsChatOpen(false)
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [])

  return (
    <div
      ref={containerRef}
      className="relative inline-block"
    >
      <Chatbot 
        chatbotId={params.get('chatbotId') ?? ''} 
        isOpen={isChatOpen}
        onOpenChange={setIsChatOpen}
      />
    </div>
  )
}