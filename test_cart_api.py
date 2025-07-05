#!/usr/bin/env python3
"""
Simple script to test adding barcodes to cart session
Automatically finds current session from cart number 3
"""

import requests
import json
import sys
import threading
import time
from concurrent.futures import ThreadPoolExecutor, as_completed

# Configuration
API_BASE_URL = "https://api.duckycart.me"
CART_ID = 3
USERNAME = "omar"
PASSWORD = "omarxae"
API_KEY = "it_is_tony_developer_smartcart2025"

# Performance settings
MAX_CONCURRENT_REQUESTS = 10  # Process 10 barcodes at once
REQUEST_DELAY = 0.01  # Small delay between batches (seconds)

# Hardcoded list of barcodes to add - ADD YOUR BARCODES HERE
BARCODES = [
    6281007023955,
    5011417545676,
    6224010906075,
    6224010906327,
    6223000410158,
    6223000410172,
    6281073112577,
    5060805991366,
    6223001080787,
    6223001080800,
    5063305006226,
    6224003060098,
    8691066104553,
    8691066170121,
    8691066501031,
    8691066558035,
    6223001366713,
    8700216311588,
    6221073008104,
    6221073008135,
    6223001530275
]

def authenticate():
    """Authenticate and get access token"""
    print("🔐 Authenticating...")
    
    login_url = f"{API_BASE_URL}/auth/login"
    login_data = {
        'grant_type': 'password',
        'username': USERNAME,
        'password': PASSWORD,
        'scope': '',
        'client_id': 'string',
        'client_secret': 'string'
    }
    
    try:
        response = requests.post(login_url, data=login_data)
        response.raise_for_status()
        
        auth_data = response.json()
        access_token = auth_data['access_token']
        print(f"✅ Authentication successful! Token expires in {auth_data['expires_in']} seconds")
        return access_token
        
    except requests.exceptions.RequestException as e:
        print(f"❌ Authentication failed: {e}")
        sys.exit(1)

def get_current_session(access_token):
    """Get the current session for cart 3"""
    print(f"🛒 Getting current session for cart {CART_ID}...")
    print(f"🔑 Using token: {access_token[:50]}...")  # Show first 50 chars of token
    
    session_url = f"{API_BASE_URL}/customer-session/cart-status/{CART_ID}"
    headers = {
        'accept': 'application/json'
    }
    
    print(f"📡 Request URL: {session_url}")
    print(f"📋 Headers: {headers}")
    
    try:
        response = requests.get(session_url, headers=headers)
        print(f"📊 Response status: {response.status_code}")
        print(f"📄 Response headers: {dict(response.headers)}")
        
        response.raise_for_status()
        
        session_data = response.json()
        session_id = session_data['session_id']
        print(f"✅ Found session ID: {session_id}")
        print(f"   Cart ID: {session_data['cart_id']}")
        print(f"   User ID: {session_data['user_id']}")
        print(f"   Status: {session_data['status']}")
        print(f"   Has Active Session: {session_data['has_active_session']}")
        return session_id
        
    except requests.exceptions.RequestException as e:
        print(f"❌ Failed to get session: {e}")
        if hasattr(e, 'response') and e.response is not None:
            print(f"   Response text: {e.response.text}")
        sys.exit(1)

def add_barcode_to_cart(session_id, barcode, weight=1, index=None, total=None):
    """Add a barcode to the cart session"""
    add_item_url = f"{API_BASE_URL}/cart-items/add"
    headers = {
        'accept': 'application/json',
        'Content-Type': 'application/json',
        'X-API-Key': API_KEY
    }
    
    payload = {
        "sessionID": session_id,
        "barcode": barcode,
        "weight": weight
    }
    
    try:
        response = requests.post(add_item_url, headers=headers, json=payload)
        response.raise_for_status()
        
        progress = f"[{index}/{total}] " if index and total else ""
        print(f"✅ {progress}Added barcode {barcode} to cart (weight: {weight})")
        return True, barcode, None
        
    except requests.exceptions.RequestException as e:
        progress = f"[{index}/{total}] " if index and total else ""
        print(f"❌ {progress}Failed to add barcode {barcode}: {e}")
        error_details = None
        if hasattr(e, 'response') and e.response is not None:
            try:
                error_details = e.response.json()
                print(f"   Error details: {error_details}")
            except:
                error_details = e.response.text
                print(f"   Response text: {error_details}")
        return False, barcode, error_details

def main():
    print("🚀 Starting cart testing script...")
    print(f"📊 Target cart: {CART_ID}")
    print(f"📦 Will add {len(BARCODES)} barcodes to cart")
    print(f"⚡ Processing {MAX_CONCURRENT_REQUESTS} barcodes concurrently")
    print("=" * 50)
    
    # Step 1: Authenticate
    access_token = authenticate()
    
    # Step 2: Get current session
    session_id = get_current_session(access_token)
    
    print("\n" + "=" * 50)
    print("📦 Adding barcodes to cart concurrently...")
    print("=" * 50)
    
    # Step 3: Add all barcodes concurrently
    start_time = time.time()
    success_count = 0
    failed_barcodes = []
    total_count = len(BARCODES)
    
    # Use ThreadPoolExecutor for concurrent processing
    with ThreadPoolExecutor(max_workers=MAX_CONCURRENT_REQUESTS) as executor:
        # Submit all tasks
        futures = []
        for i, barcode in enumerate(BARCODES, 1):
            future = executor.submit(add_barcode_to_cart, session_id, barcode, 1, i, total_count)
            futures.append(future)
            
            # Small delay between submissions to avoid overwhelming the API
            time.sleep(REQUEST_DELAY)
        
        # Collect results as they complete
        for future in as_completed(futures):
            try:
                success, barcode, error_details = future.result()
                if success:
                    success_count += 1
                else:
                    failed_barcodes.append((barcode, error_details))
            except Exception as e:
                print(f"❌ Unexpected error processing barcode: {e}")
                failed_barcodes.append((None, str(e)))
    
    end_time = time.time()
    duration = end_time - start_time
    
    print("\n" + "=" * 50)
    print(f"🎉 Batch processing completed in {duration:.2f} seconds!")
    print(f"✅ Successfully added {success_count}/{total_count} barcodes")
    print(f"❌ Failed to add {len(failed_barcodes)} barcodes")
    
    if failed_barcodes:
        print("\n📋 Failed barcodes:")
        for barcode, error in failed_barcodes:
            if barcode:
                print(f"   - {barcode}: {error}")
            else:
                print(f"   - Unknown barcode: {error}")
    
    print(f"📊 Average time per barcode: {duration/total_count:.2f} seconds")
    print("=" * 50)

if __name__ == "__main__":
    main()
