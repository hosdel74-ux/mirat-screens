interface PagesContext {
  request: Request;
}

function isPrivateOrBlockedHost(hostname: string): boolean {
  const lower = hostname.toLowerCase();
  if (
    lower === 'localhost' ||
    lower === '0.0.0.0' ||
    lower === '::1' ||
    lower === '[::1]' ||
    lower.endsWith('.local') ||
    lower.endsWith('.internal')
  ) {
    return true;
  }

  const ipv4Match = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/.exec(lower);
  if (ipv4Match) {
    const a = Number(ipv4Match[1]);
    const b = Number(ipv4Match[2]);
    if (
      a === 10 ||
      a === 127 ||
      a === 0 ||
      (a === 169 && b === 254) ||
      (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && b === 168)
    ) {
      return true;
    }
  }
  return false;
}

function buildBridgeScript(deviceId: string, currentUrl: string): string {
  const safeDeviceId = JSON.stringify(deviceId);
  const safeUrl = JSON.stringify(currentUrl);

  return `
<script data-mirror-bridge="true">
(function() {
  var DEVICE_ID = ${safeDeviceId};
  var CURRENT_URL = ${safeUrl};
  var isSyncingScroll = false;
  var scrollTimer = null;

  function getScrollRatios() {
    var doc = document.documentElement;
    var body = document.body;
    var maxY = Math.max(1, (doc.scrollHeight || body.scrollHeight) - window.innerHeight);
    var maxX = Math.max(1, (doc.scrollWidth || body.scrollWidth) - window.innerWidth);
    return {
      ratioY: Math.min(1, Math.max(0, window.scrollY / maxY)),
      ratioX: Math.min(1, Math.max(0, window.scrollX / maxX))
    };
  }

  window.addEventListener('scroll', function() {
    if (isSyncingScroll) return;
    var ratios = getScrollRatios();
    try {
      window.parent.postMessage({
        type: 'mirror-scroll',
        deviceId: DEVICE_ID,
        ratioY: ratios.ratioY,
        ratioX: ratios.ratioX
      }, '*');
    } catch (e) {}
  }, { passive: true });

  window.addEventListener('message', function(event) {
    var data = event.data;
    if (!data || typeof data !== 'object') return;
    if (data.type === 'mirror-sync-scroll' && data.sourceDeviceId !== DEVICE_ID) {
      isSyncingScroll = true;
      var doc = document.documentElement;
      var body = document.body;
      var maxY = Math.max(0, (doc.scrollHeight || body.scrollHeight) - window.innerHeight);
      var maxX = Math.max(0, (doc.scrollWidth || body.scrollWidth) - window.innerWidth);
      window.scrollTo({
        top: Math.round((data.ratioY || 0) * maxY),
        left: Math.round((data.ratioX || 0) * maxX),
        behavior: 'auto'
      });
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(function() {
        isSyncingScroll = false;
      }, 60);
    }
  });

  document.addEventListener('click', function(e) {
    var anchor = e.target && e.target.closest ? e.target.closest('a[href]') : null;
    if (!anchor) return;
    var href = anchor.getAttribute('href') || '';
    if (!href || href.startsWith('#') || href.startsWith('javascript:') || href.startsWith('mailto:') || href.startsWith('tel:')) {
      return;
    }
    if (anchor.getAttribute('target') === '_blank') return;
    try {
      var resolved = new URL(href, CURRENT_URL).toString();
      if (resolved.startsWith('http://') || resolved.startsWith('https://')) {
        e.preventDefault();
        window.parent.postMessage({
          type: 'mirror-navigate',
          deviceId: DEVICE_ID,
          url: resolved
        }, '*');
      }
    } catch (err) {}
  }, true);
})();
</script>`;
}

function renderProxyErrorHtml(targetUrl: string, reason: string): string {
  const escapedUrl = targetUrl.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const escapedReason = reason.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return `<!doctype html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    body { margin: 0; min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #f8fafc; color: #0f172a; font-family: system-ui, sans-serif; padding: 24px; }
    .card { max-width: 440px; background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; text-align: right; }
    h2 { margin: 0 0 8px; font-size: 16px; }
    p { margin: 0 0 12px; font-size: 13px; color: #475569; line-height: 1.6; }
    .url { font-family: monospace; font-size: 12px; background: #f1f5f9; padding: 8px 10px; border-radius: 6px; word-break: break-all; direction: ltr; text-align: left; }
  </style>
</head>
<body>
  <div class="card">
    <h2>تعذر جلب الصفحة عبر الوكيل</h2>
    <p>${escapedReason}</p>
    <div class="url">${escapedUrl}</div>
  </div>
</body>
</html>`;
}

export async function onRequestGet(context: PagesContext): Promise<Response> {
  const reqUrl = new URL(context.request.url);
  const rawUrl = (reqUrl.searchParams.get('url') || '').trim();
  const deviceId = reqUrl.searchParams.get('deviceId') || 'proxy';

  const baseHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Cache-Control': 'no-store',
  };

  if (!rawUrl) {
    return new Response(renderProxyErrorHtml('', 'يرجى إدخال رابط موقع صالح للمعاينة.'), {
      status: 400,
      headers: { ...baseHeaders, 'Content-Type': 'text/html; charset=utf-8' },
    });
  }

  let parsed: URL;
  try {
    parsed = new URL(rawUrl);
  } catch {
    return new Response(renderProxyErrorHtml(rawUrl, 'صيغة الرابط غير صالحة. تأكد من البدء بـ https:// أو http://'), {
      status: 400,
      headers: { ...baseHeaders, 'Content-Type': 'text/html; charset=utf-8' },
    });
  }

  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    return new Response(renderProxyErrorHtml(rawUrl, 'يُسمح فقط بروابط HTTP و HTTPS.'), {
      status: 400,
      headers: { ...baseHeaders, 'Content-Type': 'text/html; charset=utf-8' },
    });
  }

  if (isPrivateOrBlockedHost(parsed.hostname)) {
    return new Response(renderProxyErrorHtml(rawUrl, 'لا يمكن معاينة عناوين الشبكة الداخلية عبر الوكيل السحابي.'), {
      status: 403,
      headers: { ...baseHeaders, 'Content-Type': 'text/html; charset=utf-8' },
    });
  }

  try {
    const upstream = await fetch(parsed.toString(), {
      method: 'GET',
      redirect: 'follow',
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'ar,en-US;q=0.9,en;q=0.8',
      },
    });

    const contentType = upstream.headers.get('content-type') || 'text/html; charset=utf-8';
    const finalUrl = upstream.url || parsed.toString();

    if (contentType.includes('text/html') || contentType.includes('application/xhtml+xml')) {
      let html = await upstream.text();
      html = html.replace(/<meta[^>]+http-equiv=["']?(?:Content-Security-Policy|X-Frame-Options)["']?[^>]*>/gi, '');

      const baseTag = `<base href="${finalUrl.replace(/"/g, '&quot;')}" />`;
      const headTokenRegex = /<!--[\s\S]*?-->|<head\b[^>]*>/gi;
      let headInsertPos = -1;
      let headToken: RegExpExecArray | null;
      while ((headToken = headTokenRegex.exec(html)) !== null) {
        if (!headToken[0].startsWith('<!--')) {
          headInsertPos = headToken.index + headToken[0].length;
          break;
        }
      }
      if (headInsertPos !== -1) {
        html = `${html.slice(0, headInsertPos)}\n  ${baseTag}${html.slice(headInsertPos)}`;
      } else {
        html = `<head>${baseTag}</head>\n` + html;
      }

      const bridgeScript = buildBridgeScript(deviceId, finalUrl);
      const tokenRegex = /<!--[\s\S]*?-->|<(script|style)\b[^>]*>[\s\S]*?<\/\1\s*>|<\/body\b[^>]*>/gi;
      let lastRealBodyIdx = -1;
      let match: RegExpExecArray | null;
      while ((match = tokenRegex.exec(html)) !== null) {
        if (match[0].toLowerCase().startsWith('</body')) {
          lastRealBodyIdx = match.index;
        }
      }

      if (lastRealBodyIdx !== -1) {
        html = `${html.slice(0, lastRealBodyIdx)}${bridgeScript}\n${html.slice(lastRealBodyIdx)}`;
      } else {
        const lastHtmlIdx = html.toLowerCase().lastIndexOf('</html>');
        if (lastHtmlIdx !== -1) {
          html = `${html.slice(0, lastHtmlIdx)}${bridgeScript}\n${html.slice(lastHtmlIdx)}`;
        } else {
          html += `\n${bridgeScript}`;
        }
      }

      return new Response(html, {
        status: upstream.status,
        headers: { ...baseHeaders, 'Content-Type': 'text/html; charset=utf-8' },
      });
    }

    const body = await upstream.arrayBuffer();
    return new Response(body, {
      status: upstream.status,
      headers: { ...baseHeaders, 'Content-Type': contentType },
    });
  } catch (err) {
    const message =
      err instanceof Error
        ? `تعذر الاتصال بالخادم المستهدف (${err.message}).`
        : 'حدث خطأ غير متوقع أثناء جلب الصفحة.';
    return new Response(renderProxyErrorHtml(rawUrl, message), {
      status: 200,
      headers: { ...baseHeaders, 'Content-Type': 'text/html; charset=utf-8' },
    });
  }
}
