import logging
import os

import gspread
import openai
import pinecone
from oauth2client.service_account import ServiceAccountCredentials

from constants import GS_CREDENTIALS_PATH, EMBEDDING_MODEL, SHEET_ID, WORKSHEET_NAME, PINECONE_INDEX_NAME, \
    OPENAI_API_TYPE, AZURE_OPENAI_API_VERSION, PINECONE_ENVIRONMENT

logging.basicConfig(level=logging.INFO)

# Initialize OpenAI client
openai.api_key = os.getenv("OPENAI_API_KEY")
openai.api_base = os.environ.get("AZURE_API_BASE")
openai.api_type = OPENAI_API_TYPE
openai.api_version = AZURE_OPENAI_API_VERSION

# Initialize Pinecone client
pinecone.init(api_key=os.getenv("PINECONE_API_KEY"), environment=PINECONE_ENVIRONMENT)


def get_embedding(text):
    """
    Function to get embeddings using OpenAI
    """
    result = openai.Embedding.create(
        engine=EMBEDDING_MODEL,
        input=text
    )
    return result["data"][0]["embedding"]


def read_data_from_google_sheets(sheet_id, sheet_name):
    """
    Function to read data from Google Sheets
    """
    try:
        # Authorize Google Sheets client
        scope = ['https://www.googleapis.com/auth/spreadsheets',
                 "https://www.googleapis.com/auth/drive"]
        credentials = ServiceAccountCredentials.from_json_keyfile_name(GS_CREDENTIALS_PATH, scope)
        gsclient = gspread.authorize(credentials)

        # Open the Google Sheet and read the data
        sh = gsclient.open_by_key(sheet_id)
        worksheet = sh.worksheet(sheet_name)
        values = worksheet.get_all_values()[1:]  # Skip the header

    except Exception as e:
        logging.error("Error reading data from the google sheet and generating embeddings : " + str(e), exc_info=True)
        return

    try:
        # Generate data arrays to be inserted into Pinecone
        data = []
        for row in values:
            title, content = row
            data.append({
                "id": title,
                "values": get_embedding(content),
                "metadata": {"content": content}
            })

        return data

    except Exception as e:
        logging.error("Error generating data vectors with embeddings : " + str(e), exc_info=True)
        return


def main():
    """
    Main function
    """
    # Read data from Google Sheets
    data = read_data_from_google_sheets(SHEET_ID, WORKSHEET_NAME)

    if data is None:
        return

    if len(data) == 0:
        logging.error("No data found in the Google Sheet.")
        return

    # Insert data into Pinecone index
    index = pinecone.Index(PINECONE_INDEX_NAME)
    index.upsert(data)

    logging.info("Successfully inserted data into Pinecone.")


if __name__ == "__main__":
    main()
