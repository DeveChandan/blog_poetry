import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const fileUrl = searchParams.get('url')
  const filename = searchParams.get('filename') || 'document'

  if (!fileUrl) {
    return NextResponse.json({ error: 'File URL is required' }, { status: 400 })
  }

  // Return HTML page that can handle various document types
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${filename} - Document Viewer</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px;
        }
        .container {
          background: white;
          border-radius: 20px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.3);
          overflow: hidden;
          width: 100%;
          max-width: 1200px;
          height: 90vh;
          display: flex;
          flex-direction: column;
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .title {
          font-size: 1.5rem;
          font-weight: 600;
        }
        .actions {
          display: flex;
          gap: 12px;
        }
        .btn {
          padding: 10px 20px;
          border: 2px solid white;
          background: transparent;
          color: white;
          border-radius: 50px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.3s;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }
        .btn:hover {
          background: white;
          color: #667eea;
        }
        .btn.primary {
          background: white;
          color: #667eea;
          border-color: white;
        }
        .btn.primary:hover {
          background: transparent;
          color: white;
        }
        .viewer-container {
          flex: 1;
          background: #f5f5f5;
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
        }
        .iframe-wrapper {
          width: 100%;
          height: 100%;
          position: relative;
        }
        iframe {
          width: 100%;
          height: 100%;
          border: none;
          background: white;
        }
        .loading {
          text-align: center;
          padding: 40px;
        }
        .error {
          text-align: center;
          padding: 40px;
          max-width: 600px;
        }
        .error h2 {
          color: #d32f2f;
          margin-bottom: 20px;
        }
        .file-info {
          background: #f8f9fa;
          padding: 16px 24px;
          border-top: 1px solid #e0e0e0;
          font-size: 14px;
          color: #666;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .status {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 500;
        }
        .status.online {
          background: #e8f5e9;
          color: #2e7d32;
        }
        .status.offline {
          background: #ffebee;
          color: #d32f2f;
        }
        
        @media (max-width: 768px) {
          .container {
            height: 100vh;
            border-radius: 0;
          }
          .header {
            flex-direction: column;
            gap: 16px;
            text-align: center;
          }
          .actions {
            width: 100%;
            justify-content: center;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="title">📄 ${filename}</div>
          <div class="actions">
            <a href="${fileUrl}" download="${filename}" class="btn primary">
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
                <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/>
              </svg>
              Download
            </a>
            <button onclick="window.close()" class="btn">
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
              </svg>
              Close
            </button>
          </div>
        </div>
        
        <div class="viewer-container" id="viewerContainer">
          <div class="loading">
            <div style="font-size: 48px; margin-bottom: 20px;">📄</div>
            <h3>Loading Document Viewer...</h3>
            <p>Preparing to display your document</p>
          </div>
        </div>
        
        <div class="file-info">
          <div>Viewing: <strong>${filename}</strong></div>
          <div class="status online" id="statusIndicator">
            <div style="width: 8px; height: 8px; background: #4caf50; border-radius: 50%;"></div>
            Online Viewer
          </div>
        </div>
      </div>

      <script>
        document.addEventListener('DOMContentLoaded', function() {
          const viewerContainer = document.getElementById('viewerContainer');
          const statusIndicator = document.getElementById('statusIndicator');
          const fileUrl = "${fileUrl}";
          const filename = "${filename}";
          
          // Determine file type
          const fileExt = fileUrl.split('.').pop().toLowerCase();
          
          function loadViewer() {
            if (fileExt === 'pdf') {
              // PDF viewer using browser's native PDF viewer
              viewerContainer.innerHTML = \`
                <div class="iframe-wrapper">
                  <iframe src="\${fileUrl}#toolbar=0&navpanes=0" title="PDF Viewer"></iframe>
                </div>
              \`;
            } else if (['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'].includes(fileExt)) {
              // Try Microsoft Office Online Viewer first
              const microsoftUrl = \`https://view.officeapps.live.com/op/embed.aspx?src=\${encodeURIComponent(fileUrl)}\`;
              
              viewerContainer.innerHTML = \`
                <div class="iframe-wrapper">
                  <iframe 
                    src="\${microsoftUrl}" 
                    sandbox="allow-scripts allow-same-origin allow-forms"
                    title="Office Document Viewer"
                  ></iframe>
                </div>
              \`;
              
              // Fallback to Google Viewer if Microsoft fails
              const iframe = viewerContainer.querySelector('iframe');
              iframe.onerror = function() {
                const googleUrl = \`https://docs.google.com/viewer?url=\${encodeURIComponent(fileUrl)}&embedded=true\`;
                iframe.src = googleUrl;
                statusIndicator.innerHTML = \`
                  <div style="width: 8px; height: 8px; background: #ff9800; border-radius: 50%;"></div>
                  Using Google Viewer
                \`;
              };
              
            } else if (['jpg', 'jpeg', 'png', 'gif', 'bmp'].includes(fileExt)) {
              // Image viewer
              viewerContainer.innerHTML = \`
                <div style="width: 100%; height: 100%; display: flex; justify-content: center; align-items: center; background: #333;">
                  <img src="\${fileUrl}" alt="\${filename}" style="max-width: 100%; max-height: 100%; object-fit: contain;">
                </div>
              \`;
            } else if (['txt', 'md', 'csv'].includes(fileExt)) {
              // Text file viewer
              fetch(fileUrl)
                .then(response => response.text())
                .then(text => {
                  viewerContainer.innerHTML = \`
                    <div style="width: 100%; height: 100%; padding: 20px; overflow: auto; background: white;">
                      <pre style="white-space: pre-wrap; font-family: 'Courier New', monospace; line-height: 1.5;">\${escapeHtml(text)}</pre>
                    </div>
                  \`;
                })
                .catch(error => {
                  showError('Failed to load text file: ' + error.message);
                });
            } else {
              // Unsupported format - offer download
              showError('This file format cannot be previewed. Please download the file to view it.');
            }
          }
          
          function showError(message) {
            viewerContainer.innerHTML = \`
              <div class="error">
                <h2>Unable to Preview Document</h2>
                <p>\${message}</p>
                <div style="margin-top: 30px; display: flex; gap: 12px; justify-content: center;">
                  <a href="\${fileUrl}" download="\${filename}" class="btn primary" style="text-decoration: none;">
                    Download File
                  </a>
                  <button onclick="window.close()" class="btn">
                    Close Window
                  </button>
                </div>
              </div>
            \`;
            statusIndicator.className = 'status offline';
            statusIndicator.innerHTML = \`
              <div style="width: 8px; height: 8px; background: #d32f2f; border-radius: 50%;"></div>
              Offline
            \`;
          }
          
          function escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
          }
          
          // Start loading viewer
          loadViewer();
          
          // Handle window close
          window.addEventListener('beforeunload', function() {
            return 'Are you sure you want to close the document viewer?';
          });
        });
      </script>
    </body>
    </html>
  `

  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html',
      'X-Frame-Options': 'DENY', // Prevent embedding
      'Content-Security-Policy': "default-src 'self' https:; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';",
    },
  })
}
