import { NextResponse } from 'next/server'

export async function GET(
  _: Request,
  { params }: { params: Promise<{ chatbotId: string }> }
) {
  const { chatbotId } = await params

  const js = `
    (function() {
      const iframe = document.createElement('iframe');
      iframe.src = '${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/embed/${chatbotId}';
      iframe.style.position = 'fixed';
      iframe.style.bottom = '20px';
      iframe.style.right = '20px';
      iframe.style.border = 'none';
      iframe.style.borderRadius = '10px';
      iframe.style.backgroundColor = 'white';
      iframe.style.zIndex = '9999';
      iframe.style.overflow = 'hidden';
      iframe.setAttribute('scrolling', 'no');

      // Set initial size
      iframe.style.width = '80px';
      iframe.style.height = '60px';

      document.body.appendChild(iframe);

      // Listen for resize messages from iframe content
      window.addEventListener('message', function(event) {
        if (event.data?.type === 'chatbot-size') {
          iframe.style.width = event.data.width + 'px';
          iframe.style.height = event.data.height + 'px';
        }
      });

      // Close chatbot when clicking outside the iframe
      let isMouseDownOnIframe = false;

      // Track when mouse is pressed on iframe
      iframe.addEventListener('mousedown', function() {
        isMouseDownOnIframe = true;
      });

      // Track when mouse is released
      document.addEventListener('mouseup', function() {
        isMouseDownOnIframe = false;
      });

      // Close when clicking outside iframe
      document.addEventListener('mousedown', function(event) {
        // Check if click is outside the iframe and not on the iframe itself
        const isClickOutside = !iframe.contains(event.target) && !isMouseDownOnIframe;
        
        if (isClickOutside) {
          // Send close message to iframe
          iframe.contentWindow?.postMessage({ type: 'close-chatbot' }, '*');
        }
      });

      // Alternative simpler approach: Close on any click outside iframe
      document.addEventListener('click', function(event) {
        if (!iframe.contains(event.target)) {
          // Small delay to ensure the click wasn't on the iframe button
          setTimeout(() => {
            iframe.contentWindow?.postMessage({ type: 'close-chatbot' }, '*');
          }, 10);
        }
      });

      // Also close when pressing Escape key
      document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
          iframe.contentWindow?.postMessage({ type: 'close-chatbot' }, '*');
        }
      });

    })();
  `

  return new NextResponse(js, {
    headers: { 'Content-Type': 'application/javascript' },
  })
}