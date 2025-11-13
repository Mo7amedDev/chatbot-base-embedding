'use client'
import { useEffect, useRef, useState } from 'react'
import Chatbot from '@/components/Chatbot'
import { useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
export default function EmbedChatbotPage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const params = useSearchParams();
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    const sendSize = () => {
      if (!containerRef.current) return

      // measure the full container, including padding/borders
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
  }, [])

  return (
    <div
      ref={containerRef}
      className=" relative justify-between  bg-red-500  " // allows proper width measurement
    >
      <Chatbot chatbotId={params.get('chatbotId') ?? ''} isOpen={isOpen} />

      {/* Fixed round chat button */}
     
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className={`fixed  bottom-0 right-0 z-5333333333333333330 cursor-pointer  rounded-full shadow-lg bg-blue-600 hover:bg-blue-700 text-white w-14 h-14 flex items-center justify-center`}
        >
          💬
        </Button>
      
    </div>
  )
}
