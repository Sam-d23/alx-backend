#!/usr/bin/env python3
"""Module for Least Recently Used caching.
"""
from collections import OrderedDict

from base_caching import BaseCaching


class LRUCache(BaseCaching):
    """An object that allows storing and
    retrieving items from a dictionary, with a LRU
    removal mechanism when the limit is reached, is represented.
    """
    def __init__(self):
        """Cache is initialized.
        """
        super().__init__()
        self.cache_data = OrderedDict()

    def put(self, key, item):
        """An item is added in the cache.
        """
        if key is None or item is None:
            return
        if key not in self.cache_data:
            if len(self.cache_data) + 1 > BaseCaching.MAX_ITEMS:
                lru_key, _ = self.cache_data.popitem(True)
                print("DISCARD:", lru_key)
            self.cache_data[key] = item
            self.cache_data.move_to_end(key, last=False)
        else:
            self.cache_data[key] = item

    def get(self, key):
        """An item is retrieved by key.
        """
        if key is not None and key in self.cache_data:
            self.cache_data.move_to_end(key, last=False)
        return self.cache_data.get(key, None)
