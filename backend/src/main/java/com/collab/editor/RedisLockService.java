package com.collab.editor;

import java.util.Set;

import redis.clients.jedis.Jedis;

public class RedisLockService {

    private Jedis jedis = new Jedis("localhost", 6379);
    private static final int LOCK_EXPIRE = 60; // 60 seconds auto-expire

    // Try to acquire lock; returns true if first-click user
    public boolean tryLock(String docId, String paraId, String userId) {
        String key = "lock:" + docId + ":" + paraId;
        long locked = jedis.setnx(key, userId); // atomic set if not exists
        if (locked == 1) { 
            jedis.expire(key, LOCK_EXPIRE); // optional: auto-unlock after timeout
            return true;
        }
        return false; // already locked
    }

    // Unlock only if owner
    public boolean unlock(String docId, String paraId, String userId) {
        String key = "lock:" + docId + ":" + paraId;
        String owner = jedis.get(key);
        if (userId.equals(owner)) {
            jedis.del(key);
            return true;
        }
        return false;
    }

    // Get current owner of lock
    public String getOwner(String docId, String paraId) {
        return jedis.get("lock:" + docId + ":" + paraId);
    }
    
 // Get all locks owned by a user
    public Set<String> getLocksByUser(String userId) {
        Set<String> keys = jedis.keys("lock:*");
        Set<String> userLocks = new java.util.HashSet<>();
        for (String key : keys) {
            String owner = jedis.get(key);
            if (userId.equals(owner)) {
                userLocks.add(key);
            }
        }
        return userLocks;
    }

    // Force unlock by Redis key
    public void forceUnlockByKey(String key) {
        jedis.del(key);
    }

    
}
