from openai import OpenAI
from decouple import config

url = config("OPENAI_URL")
key = config("OPENAI_KEY")

openAIClient = OpenAI(api_key=key, base_url=url)

