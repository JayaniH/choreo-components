import os

OPENAI_API_TYPE = "azure"
AZURE_OPENAI_API_VERSION = "2023-05-15"

CHAT_MODEL = os.getenv("OPENAI_CHAT_MODEL")
EMBEDDING_MODEL = os.getenv("OPENAI_EMBEDDING_MODEL")

PINECONE_INDEX_NAME = os.getenv("PINECONE_INDEX_NAME")

MAX_SECTION_LEN = 1500
SEPARATOR = "\n* "
ENCODING = "cl100k_base"  # encoding for text-embedding-ada-002

GS_CREDENTIALS_PATH = "/config/gs_credentials.json"
