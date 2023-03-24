interface OCRResult {
  data: Record<string, any>
  bbox: [number, number, number, number]
}

export class OCRClient {
  URL: string

  constructor(URL = 'http://localhost:8001') {
    this.URL = URL
  }

  async test(time = 3000): Promise<boolean> {
    try {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), time)
      const response = await fetch(`${this.URL}`, {
        method: 'GET',
        redirect: 'follow',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      clearTimeout(timeout)
      return response.status === 200
    }
    catch (error) {
      console.error(error)
      return false
    }
  }

  async recognize(imageBase64: string): Promise<OCRResult | null> {
    const result = await fetch(`${this.URL}/api`, {
      method: 'POST',
      redirect: 'follow',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ base64str: imageBase64 }),
    })
    if (result.ok)
      return result.json()
    else
      return null
  }
}
