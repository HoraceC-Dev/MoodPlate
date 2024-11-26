from langchain_aws import ChatBedrock
from dotenv import load_dotenv
import boto3
import os

def llm_mistral():

    load_dotenv()
    AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
    AWS_ACCESS_KEY= os.getenv("AWS_ACCESS_KEY_ID")

    client = boto3.client('bedrock-runtime', region_name='us-west-2', aws_access_key_id=AWS_ACCESS_KEY, aws_secret_access_key=AWS_SECRET_ACCESS_KEY,)

    return ChatBedrock(
        client=client,
        model_id="mistral.mistral-large-2402-v1:0",
        model_kwargs={"temperature": 0},
        region="us-west-2"
    )
