#!/usr/bin/env python3
"""Module for Most Recently Used caching.
"""
from collections import OrderedDict

from base_caching import BaseCaching


class MRUCache(BaseCaching):
    """An object that allows storing and
    retrieving items from a dictionary, with an MRU
    removal mechanism when the limit is reached, is represented.
    """
    def __init__(self):
        """Cache is initialized.
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
                mru_key, _ = self.cache_data.popitem(False)
                print("DISCARD:", mru_key)
            self.cache_data[key] = item
            self.cache_data.move_to_end(key, last=False)
        else:
            self.cache_data[key] = item

    def get(self, key):
        """Item retrieved by key.
        """
        if key is not None and key in self.cache_data:
            self.cache_data.move_to_end(key, last=False)
        return self.cache_data.get(key, None)
