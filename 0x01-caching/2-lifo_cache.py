#!/usr/bin/env python3
"""Module for LIFO caching.
"""
from collections import OrderedDict

from base_caching import BaseCaching


class LIFOCache(BaseCaching):
    """An object that allows storing and
    retrieving items is represented."""
    def __init__(self):
        """Cache isinitialized.
        """
        super().__init__()
        self.cache_data = OrderedDict()

    def put(self, key, item):
        """Item is added in the cache.
        """
        if key is None or item is None:
            return
        if key not in self.cache_data:
            if len(self.cache_data) + 1 > BaseCaching.MAX_ITEMS:
                last_key, _ = self.cache_data.popitem(True)
                print("DISCARD:", last_key)
        self.cache_data[key] = item
        self.cache_data.move_to_end(key, last=True)

    def get(self, key):
        """An item is retrieved by key.
        """
        return self.cache_data.get(key, None)
