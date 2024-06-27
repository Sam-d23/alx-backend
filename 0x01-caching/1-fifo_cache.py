#!/usr/bin/env python3
"""Module for First-In First-Out caching.
"""
from collections import OrderedDict

from base_caching import BaseCaching


class FIFOCache(BaseCaching):
    """An object that allows storing and
    retrieving items is represented."""
    def __init__(self):
        """Cache is initialized.
        """
        super().__init__()
        self.cache_data = OrderedDict()

    def put(self, key, item):
        """Item is added to the cache.
        """
        if key is None or item is None:
            return
        self.cache_data[key] = item
        if len(self.cache_data) > BaseCaching.MAX_ITEMS:
            first_key, _ = self.cache_data.popitem(False)
            print("DISCARD:", first_key)

    def get(self, key):
        """Item is retrieved by key.
        """
        return self.cache_data.get(key, None)
