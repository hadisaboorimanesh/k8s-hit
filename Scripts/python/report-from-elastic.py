import requests,time

# Variables
schema = "http"
elastic_address = "172.31.58.28:9200"
index_name = "nginxlogs-alias-production"
api = "_count"
auth = "ZWxhc3RpYzpzZDdIeDlSaVlnTXU2bThNOTAzKw=="
TELEGRAM_BOT_TOKEN = "7174802265:AAEniql9UCp-QOGRJqSc48-HqsR3GGE34RY"
#TELEGRAM_CHAT_ID = "47795747" #my chat id
TELEGRAM_CHAT_ID = "-1002238259046"
server_name_1 = "qcommercegw.tapsi.shop"
server_name_2 = "ids.tapsi.shop"

# URL and Headers for authentication and content type
url = schema + "://" + elastic_address + "/" + index_name + "/" + api
headers = {
    "Content-Type": "application/json",
    "Authorization": "Basic " + auth
}

# List of request_uri values 
request_uris_1s = [
    "/Basket/GetAll", 
    "/Category/Categories" , 
    "/Order/Payment" , 
    "/Product/Detail" , 
    "/Store/StoreList" , 
    "/User/Addresses" , 
    "/User/GetParty" , 
    "/User/Individual" , 
    "/User/LocationInfo" ,
    "/View/v2/ProductWidget",
    "/connect/hittoken",
    "/Insight/api/Activity"
    ]
request_uris_2s = [
    "/Basket/v2/UnAssignVoucher"
    ]
request_uris_3s = [
    "/Basket/Decrease", 
    "/Basket/Increase",
    "/Basket/Item" ,
    "/Basket/Items" ,
    "/Basket/Minimal" ,
    "/Basket/Voucher" ,
    "/Basket/v3/AssignVoucher" ,
    "/Order/Refund/PaymentMethod" ,
    "/Order/Repay" ,
    "/Product/Detail" ,
    "/Product/Search/Suggestion" ,
    "/User/RegisterCustomer" ,
    "/View/SearchView" ,
    "/View/v3/CheckoutView" ,
    "/View/v2/HomePageView" ,
    "/View/v2/StoreView" ,
    "/authCustomer/CreateOTPForLogin"
    ]
request_uris_5s = [
    "/Order/Start", 
    "/Basket/Callback"
    ]

def get_count(query, retries=5, wait_time=10):
    """Fetch count from API with retry on connection failure."""
    for attempt in range(retries):
        try:
            response = requests.get(url, headers=headers, json=query, timeout=10)  # Set timeout
            response.raise_for_status()  # Raise an error for bad HTTP responses

            data = response.json()
            if "count" in data:
                return data["count"]
            else:
                print("Key error: 'count' not found in response JSON")
                return 0  # Avoid NoneType errors

        except requests.exceptions.ConnectionError as e:
            print(f"Attempt {attempt + 1}/{retries}: Connection error: {e}")
        except requests.exceptions.Timeout:
            print(f"Attempt {attempt + 1}/{retries}: Request timed out")
        except requests.exceptions.HTTPError as e:
            print(f"Attempt {attempt + 1}/{retries}: HTTP error: {e}")
        except requests.exceptions.RequestException as e:
            print(f"Attempt {attempt + 1}/{retries}: Request error: {e}")
        except ValueError:
            print(f"Attempt {attempt + 1}/{retries}: Error parsing JSON response")
        
        # Wait before retrying
        if attempt < retries - 1:
            print(f"Retrying in {wait_time} seconds...")
            time.sleep(wait_time)
        else:
            print("Max retries reached. Returning 0.")
    
    return 0  # Return 0 after max retries

def calculate_percentage(total, gte_2s):
    if total == 0:
        return 0
    return (gte_2s / total) * 100

def send_to_telegram(alert_data):
    telegram_api_url = f"https://api-tg.nullip.ir/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
    payload = {
        "chat_id": TELEGRAM_CHAT_ID,
        "text": alert_data,
        "parse_mode": "HTML"
    }
    try:
        response = requests.post(telegram_api_url, json=payload)
        response.raise_for_status()
        print("✅ Message sent successfully!")
    except requests.RequestException as e:
        print(f"❌ Error sending message to Telegram: {e}")

def uptime_query(server_name,alert_percentage):
    uptime_query = {
        "query": {
            "bool": {
            "must": [
                { "match": { "server_name": server_name } },
                { "prefix": { "request_uri.keyword": "/" } },
                {
                "range": {
                    "@timestamp": {
                    "gte": "now-12h"
                    }
                }
                }
            ]
            }
        }
        }
    downtime_query = {
        "query": {
            "bool": {
            "must": [
                { "match": { "server_name": server_name } },
                { "prefix": { "request_uri.keyword": "/" } },
                {
                "bool": {
                    "should": [
                    { "prefix": { "status": "5" } },
                    ]
                }
                },
                {
                "range": {
                    "@timestamp": {
                    "gte": "now-12h"
                    }
                }
                }
            ]
            }
        }
        }
    uptime_count = get_count(uptime_query)
    print(uptime_count)
    downtime_count = get_count(downtime_query)
    print(downtime_count)
    downtime_percentage = downtime_count * 100 / uptime_count
    print(str(downtime_percentage) + "%")
    uptime_percentage = 100 - downtime_percentage
    print(str(uptime_percentage) + "%")
    if uptime_percentage <= alert_percentage:
        alert_data = f"""
<b>Status:</b> 🔥
<b>Severity:</b> critical
<b>Name:</b> {server_name} Uptime
<b>Description:</b> 🔴 Uptime of {server_name} is {str(uptime_percentage)}%

<b>Summary:</b> Uptime Alert
"""
        print("Alert sended")
        send_to_telegram(alert_data)
    else:
        alert_data = f"""
<b>Status:</b> 🔥
<b>Severity:</b> critical
<b>Name:</b> {server_name} Uptime
<b>Description:</b> 🟢 Uptime of {server_name} is {str(uptime_percentage)}%

<b>Summary:</b> Uptime Alert
"""
        print("Alert sended")
        send_to_telegram(alert_data)

def run_query(latency_second,alert_percentage):
    for request_uri in eval("request_uris_" + str(latency_second) + "s"):
        server_name = server_name_1
        if request_uri in ['/connect/hittoken', '/authCustomer/CreateOTPForLogin']:
            server_name = server_name_2
        query_total = {
            "query": {
                "bool": {
                    "must": [
                        {"match": {"server_name": server_name}},
                        {"match": {"status": "200"}},
                        {"prefix": {"request_uri.keyword": request_uri}},
                        {"range": {"@timestamp": {"gte": "now-12h"}}},
                    ]
                }
            }
        }

        query_gte = {
            "query": {
                "bool": {
                    "must": [
                        {"match": {"server_name": server_name}},
                        {"match": {"status": "200"}},
                        {"prefix": {"request_uri.keyword": request_uri}},
                        {"range": {"@timestamp": {"gte": "now-12h"}}},
                    ],
                    "filter": {"range": {"request_time": {"gt": latency_second}}},
                }
            }
        }


        total_count = get_count(query_total)
        print("Total Count of " + request_uri + " = " + str(total_count))
        gte_count = get_count(query_gte)
        print("Latency Count of " + request_uri + " = " + str(gte_count))


        percentage = calculate_percentage(total_count, gte_count)
        print("Percentage of " + request_uri + " = " + str(percentage) + "%")
        print("---------------------------------------------------------------------------------")
        if percentage >= alert_percentage:
            alert_data = f"""
<b>Status:</b> 🔥
<b>Severity:</b> critical
<b>Name:</b> ApplicationMetrics-{str(latency_second)}s
<b>Description:</b> 🟠 {request_uri} Percentage of Latency is {str(percentage)}%

<b>Summary:</b> Latency on {str(latency_second)}s
"""
            send_to_telegram(alert_data)

response = run_query(1,5)
response = run_query(2,5)
response = run_query(3,5)
response = run_query(5,5)
response = uptime_query("tapsi.shop", 99 )
