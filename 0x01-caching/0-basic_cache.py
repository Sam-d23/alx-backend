#!/usr/bin/env python3
"""Simple caching module.
"""
from base_caching import BaseCaching


class BasicCache(BaseCaching):
    """An object that allows storing and
    retrieving items from a dictionary is represented.
    """
    def put(self, key, item):
        """Item is added in the cache.
        """
        if key is None or item is None:
            return
        self.cache_data[key] = item

    def get(self, key):
        """Item is retrieved by a key.
        """
        return self.cache_data.get(key, None)
