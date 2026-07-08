import asyncio
import edge_tts
import base64

async def test_tts():
    print("Generating audio...")
    communicate = edge_tts.Communicate("Hello, I am Neerja, your AI interviewer from India.", "en-IN-NeerjaNeural")
    audio_data = bytearray()
    async for chunk in communicate.stream():
        if chunk["type"] == "audio":
            audio_data.extend(chunk["data"])
    
    b64 = base64.b64encode(audio_data).decode('utf-8')
    print("Base64 string length:", len(b64))

asyncio.run(test_tts())
