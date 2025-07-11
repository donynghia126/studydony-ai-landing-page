// netlify/functions/gemini.js

exports.handler = async function (event, context) {
  // Lấy API key từ biến môi trường của Netlify (sẽ thiết lập ở Bước 3)
  const apiKey = process.env.GEMINI_API_KEY;
  // Đảm bảo dòng này chính xác tuyệt đối, không sai một ký tự nào
  const googleApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "API key không được thiết lập trên máy chủ.",
      }),
    };
  }

  try {
    // Lấy prompt được gửi từ script.js
    const { prompt } = JSON.parse(event.body);

    // Tạo payload hoàn chỉnh để gửi đến Google
    const payload = {
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    };

    // Gọi đến API của Google từ máy chủ của Netlify
    const response = await fetch(googleApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Google API Error:", errorData);
      return {
        statusCode: response.status,
        body: JSON.stringify(errorData),
      };
    }

    const data = await response.json();

    // Trả kết quả về lại cho script.js
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Lỗi khi gọi đến function." }),
    };
  }
};
