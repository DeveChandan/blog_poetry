import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const fileUrl = searchParams.get('url')
  const type = searchParams.get('type') || 'google'

  if (!fileUrl) {
    return NextResponse.json({ error: 'File URL is required' }, { status: 400 })
  }

  // Generate viewer URL
  let viewerUrl: string
  if (type === 'microsoft') {
    viewerUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(fileUrl)}`
  } else {
    // Use Google Viewer as default
    viewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(fileUrl)}&embedded=true`
  }

  // Return HTML with proper headers to avoid iframe blocking
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Document Viewer</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: #f5f5f5; }
        .container { width: 100%; height: 100vh; display: flex; flex-direction: column; }
        .header { background: white; padding: 16px; border-bottom: 1px solid #e0e0e0; display: flex; justify-content: space-between; align-items: center; }
        .viewer-container { flex: 1; background: white; }
        iframe { width: 100%; height: 100%; border: none; }
        .error { padding: 40px; text-align: center; }
        .error h2 { color: #d32f2f; margin-bottom: 16px; }
        .actions { display: flex; gap: 12px; margin-top: 20px; justify-content: center; }
        .actions button { padding: 8px 16px; border: 1px solid #1976d2; background: white; color: #1976d2; border-radius: 4px; cursor: pointer; }
        .actions button.primary { background: #1976d2; color: white; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div>
            <h3>Document Viewer</h3>
            <small>Viewing via ${type === 'microsoft' ? 'Microsoft Office Online' : 'Google Docs Viewer'}</small>
          </div>
          <div class="actions">
            <button onclick="window.close()">Close</button>
          </div>
        </div>
        <div class="viewer-container">
          <iframe 
            src="${viewerUrl}" 
            sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-modals"
            allow="fullscreen"
            title="Document Viewer"
          ></iframe>
        </div>
      </div>
      <script>
        // Handle iframe errors
        const iframe = document.querySelector('iframe');
        iframe.onload = function() {
          try {
            // Try to access iframe content
            const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
            if (iframeDoc?.body?.innerText?.includes('error') || 
                iframeDoc?.body?.innerText?.includes('cannot') ||
                iframeDoc?.body?.innerText?.includes('unable')) {
              showError('Viewer error: ' + iframeDoc.body.innerText.substring(0, 200));
            }
          } catch (e) {
            // Cross-origin error, which is expected
            console.log('Iframe loaded successfully');
          }
        };
        
        iframe.onerror = function() {
          showError('Failed to load viewer. Please try downloading the document.');
        };
        
        function showError(message) {
          document.querySelector('.viewer-container').innerHTML = \`
            <div class="error">
              <h2>Unable to Load Document</h2>
              <p>\${message}</p>
              <div class="actions">
                <button onclick="window.location.href='${fileUrl}'" class="primary">Download Document</button>
                <button onclick="window.history.back()">Go Back</button>
              </div>
            </div>
          \`;
        }
      </script>
    </body>
    </html>
  `

  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html',
      'X-Frame-Options': 'SAMEORIGIN',
      'Content-Security-Policy': "frame-ancestors 'self'",
    },
  })
}