addEventListener("fetch", (event) => {
  event.respondWith(
    handleRequest(event.request).catch(
      (err) => new Response(err.stack, { status: 500 })
    )
  );
});

async function handleRequest(request) {
  const { host, pathname } = new URL(request.url)

  // 替换成你实际使用的域名
  const expectedHost = "pypi.guoyuancode.dpdns.org"; 
  if (host !== expectedHost) {
    return new Response("您需要修改Workers中的域名才能正常使用！", { status: 400 });
  }

  if (pathname.startsWith("/simple")) {
    const resp = await fetch(`https://pypi.org${pathname}`)
    const text = await resp.text()
    const replace_re = /:\/\/files.pythonhosted.org\//g
    const replace_target = `://${host}/`
    return new Response(
      text.replace(replace_re, replace_target),
      {
        headers: resp.headers,
      }
    )
  }

  if (pathname.startsWith("/packages")) {
    let response = await fetch(`https://files.pythonhosted.org${pathname}`)
    let { readable, writable } = new TransformStream()
    response.body.pipeTo(writable)
    return new Response(readable, response)
  }

  return new Response(
    `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <link rel="shortcut icon" href="https://guoyuancode.dpdns.org/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>喵~我的PyPI小仓库在这里哟！</title>
    <style>
        body {
            background: #000;
            background-size: cover;
            background-image: url('https://t.alcy.cc/pc');
            color: #FFB6C1;
            font-family: 'MS Gothic', 'Meiryo', cursive;
            line-height: 1.8;
            padding: 2em;
            margin: 0;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            text-align: center;
        }
        h1 {
            font-size: 3.5em;
            text-shadow: 0 0 15px #FF69B4, 0 0 30px #FF1493;
            border-bottom: 3px dotted #FFB6C1;
            padding-bottom: 0.5em;
            margin: 1em 0;
        }
        .neko {
            font-size: 2.2em;
            text-shadow: 0 0 10px #FFFFFF;
            margin: 1.5em 0;
        }
        .command-box {
            background: rgba(255, 255, 255, 0.1);
            border: 2px dashed #FF69B4;
            border-radius: 20px;
            padding: 2em;
            margin: 2em auto;
            max-width: 600px;
            text-align: left;
        }
        code {
            font-family: 'Consolas', 'Courier New', monospace;
            background: #333;
            padding: 0.3em 0.8em;
            border-radius: 5px;
            display: block;
            margin: 1em 0;
            white-space: pre-wrap;
        }
        .warning {
            color: #FF69B4;
            font-size: 1.2em;
            margin: 1.5em 0;
        }
        @media (max-width: 768px) {
            body {
                background-image: url('https://t.alcy.cc/mp');
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>喵喵~我的PyPI仓库启动成功啦☆*:・ヽ(＾∀＾)ﾉ・:*☆</h1>
        
        <div class="neko">（ฅ´ω`ฅ）主人不要慌张～这里有超~详细的指引哟！</div>

        <div class="command-box">
            <p>下载包的时候要这样写：</p>
            <code>pip install 包名 -i https://pypi.guoyuancode.dpdns.org/simple</code>
            
            <p>设置默认源的方法：</p>
            <code>pip config set global.index-url https://pypi.guoyuancode.dpdns.org/simple</code>
            
            <p>如果报错需要更新pip：</p>
            <code>python -m pip install -U -i https://pypi.guoyuancode.dpdns.org/simple pip</code>

            <p>如果仍然报错需要设置信任：</p>
            <code>pip config set global.trusted-host pypi.guoyuancode.dpdns.org</code>
        </div>

        <div class="warning">
            （≧▽≦）主人一定要记得设置默认源哦！这样以后安装包就会快很多啦~☆
        </div>
    </div>
</body>
</html>
    `,
    {
      headers: { "Content-Type": "text/html" },
      status: 404,
    }
  )
}
