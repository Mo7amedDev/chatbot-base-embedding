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
      iframe.style.backgroundColor = 'transparent';
      iframe.style.zIndex = '9999';
      iframe.style.overflow = 'hidden';
      iframe.setAttribute('scrolling', 'no');
      iframe.setAttribute('allowtransparency', 'true');
      iframe.setAttribute('frameborder', '0');

      // Set initial size - make it exactly button size when closed
      iframe.style.width = '56px'; // w-14 = 56px
      iframe.style.height = '56px'; // h-14 = 56px

      document.body.appendChild(iframe);

      // Listen for resize messages from iframe content
      window.addEventListener('message', function(event) {
        if (event.data?.type === 'chatbot-size') {
          // Only update if we have reasonable dimensions
          if (event.data.width > 0 && event.data.height > 0) {
            iframe.style.width = event.data.width + 'px';
            iframe.style.height = event.data.height + 'px';
          }
        }
      });

      // Close chatbot when clicking outside the iframe
      document.addEventListener('click', function(event) {
        if (!iframe.contains(event.target)) {
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