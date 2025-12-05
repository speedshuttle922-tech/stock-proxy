// 檔案路徑: api/quote.js
export default async function handler(request, response) {
  // 1. 設定 CORS 標頭，允許您的 React 網站連線
  response.setHeader('Access-Control-Allow-Credentials', true);
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  response.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // 處理預檢請求 (Preflight)
  if (request.method === 'OPTIONS') {
    response.status(200).end();
    return;
  }

  // 2. 取得網址參數 (例如 ?symbol=2330)
  const { symbol } = request.query;

  if (!symbol) {
    return response.status(400).json({ error: '請提供股票代號' });
  }

  // 3. 從環境變數取得 API Key (安全性關鍵！)
  const API_KEY = process.env.FUGLE_API_KEY;

  if (!API_KEY) {
    return response.status(500).json({ error: '伺服器未設定 API Key' });
  }

  try {
    // 4. 幫您去跟 Fugle 拿資料
    const targetUrl = `https://api.fugle.tw/marketdata/v1.0/stock/intraday/quote/${symbol}`;
    
    const res = await fetch(targetUrl, {
      headers: { 'X-API-KEY': API_KEY }
    });
    
    const data = await res.json();
    
    // 5. 回傳資料給您的 React 網頁
    response.status(200).json(data);
  } catch (error) {
    response.status(500).json({ error: '抓取失敗', details: error.message });
  }
}
