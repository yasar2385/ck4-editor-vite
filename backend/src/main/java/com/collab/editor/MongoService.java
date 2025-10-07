package com.collab.editor;

import com.mongodb.MongoClient;
import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.BasicDBObject;
import com.mongodb.DBObject;

public class MongoService {
    private MongoClient client;
    private DB db;
    private DBCollection collection;

    public MongoService() {
        client = new MongoClient("localhost", 27017);
        db = client.getDB("collab_db");
        collection = db.getCollection("documents");
    }

    public DBObject getParagraph(String docId, String paraId) {
        BasicDBObject query = new BasicDBObject("docId", docId).append("paraId", paraId);
        return collection.findOne(query);
    }

    public void saveParagraph(String docId, String paraId, String content) {
        BasicDBObject query = new BasicDBObject("docId", docId).append("paraId", paraId);
        BasicDBObject update = new BasicDBObject("$set", new BasicDBObject("content", content));
        collection.update(query, update);
    }
}
