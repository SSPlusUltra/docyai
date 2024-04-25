from openai import OpenAI
from decouple import config

url = config("OPENAI_URL")
key = config("OPENAI_KEY")

openAIClient = OpenAI(api_key=url, base_url=key)

