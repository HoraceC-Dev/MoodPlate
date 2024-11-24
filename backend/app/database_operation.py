import os
from dotenv import load_dotenv
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

class DB():

    def __init__(self):
        self.client = self._get_client()
    
    def _get_client(self):
        load_dotenv()

        MONGODB_CONNECTION_STRING_URL= os.getenv("MONGODB_CONNECTION_STRING_URL")

        client = MongoClient(MONGODB_CONNECTION_STRING_URL, server_api=ServerApi('1'))

        return client

    def delete_journal(self, journal_id):
        db = self.client["MoodPlate"]
        collection = db.JournalStore
        query_filter = { "_id":journal_id}

        collection.delete_one(query_filter)
    
    def create_journal(self, journal):
        db = self.client["MoodPlate"]

        collection = db.JournalStore
        
        collection.insert_one({
            "_id": journal["id"],
            "content": journal["content"],
            "name": journal["name"],
            "recommendation": journal["recommendation"]
        })

    def update_journal(self, journal):
        db = self.client["MoodPlate"]

        collection = db.JournalStore
        query_filter = {'_id':journal["id"]}

        update_operation = { '$set' : 
            { 
                'name' : journal["name"],
                'content': journal["content"],
                'recommendation': journal["recommendation"]
            }
        }
        collection.update_one(query_filter,update_operation)        

    def get_recipe(self,journal_id):
        db = self.client["MoodPlate"]

        collection = db.JournalStore
        query_filter = {"_id":journal_id}

        recipes = collection.find(query_filter)
        return recipes
