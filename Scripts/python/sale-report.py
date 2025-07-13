import requests
import jdatetime

# Constants for Bot Token, Chat ID, and Metrics URL
TELEGRAM_BOT_TOKEN = "7174802265:AAEniql9UCp-QOGRJqSc48-HqsR3GGE34RY"
#TELEGRAM_CHAT_ID = "47795747" #my chat id
TELEGRAM_CHAT_ID = "-1002694093243"
METRICS_URL = "https://admingw.tapsi.shop/Admin/sale/Order/metrics"

# Get the current Shamsi date
now_shamsi = jdatetime.datetime.now()

def fetch_metrics():
    """Fetches the order metrics from the API"""
    try:
        response = requests.get(METRICS_URL)
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        print(f"Error fetching metrics: {e}")
        return None

def get_trend_icon(value):
    """Returns the trend icon for a given value (increase/decrease)"""
    return "🟢" if value > 0 else "🔴"

def get_revenue_trend_icon(value):
    """Returns the trend icon for revenue values"""
    return "🟢" if value > 0 else "🔴"

def format_number(value):
    """Formats numbers with commas and appends 'T' for revenue"""
    if value == "N/A":
        return value
    try:
        return f"{int(value):,} T"  # Adds commas and appends 'T' symbol
    except ValueError:
        return value

def format_message(data):
    """Formats the metrics into an HTML-styled message for Telegram"""
    if not data:
        return "⚠️ Failed to fetch order metrics."

    counts = data.get("counts", {})
    values = data.get("values", {})

    # Calculate trend icons
    order_trend_today_VS_yesterday = get_trend_icon(counts.get("diffTodayYesterdayCount", 0))
    order_trend_today_VS_last_week = get_trend_icon(counts.get("diffTodayLastWeekCount", 0))
    order_trend_today_VS_current_last_week = get_trend_icon(counts.get("diffCurrentWeekLastWeekCount", 0))

    revenue_trend_today_VS_yesterday = get_revenue_trend_icon(values.get("diffTodayYesterdayValue", 0))
    revenue_trend_today_VS_last_week = get_revenue_trend_icon(values.get("diffTodayLastWeekValue", 0))
    revenue_trend_today_VS_current_last_week = get_revenue_trend_icon(values.get("diffCurrentWeekLastWeekValue", 0))

    # Extract Today Net Orders
    today_net_order_count = counts.get("todayNetOrderCount", "N/A")
    today_net_order_value = values.get("todayNetOrderValue", "N/A")

    # Format the message with relevant metrics
    message = f"""
<b>📊 TapsiShop Hourly Report</b>
🗓️ Date: {now_shamsi.strftime('%Y/%m/%d %H:%M')}
📍 Location: 🇮🇷 Iran
🏢 Metrics Summary
━━━━━━━━━━━━━━

<b>🛍️ Orders:</b>
━━━━━━━━━━━━━━
 ● <b>Today:</b> {counts.get("todayGrossOrderCount", "N/A")}
 ● <b>Yest (Time):</b> {counts.get("yesterdayCurrentTimeGrossOrderCount", "N/A")}
 ● <b>LW (Time):</b> {counts.get("lastWeekCurrentTimeGrossOrderCount", "N/A")}
 ● <b>Yest:</b> {counts.get("yesterdayGrossOrderCount", "N/A")}
 ● <b>This Week:</b> {counts.get("currentWeekGrossOrderCount", "N/A")}
 ● <b>LW (To Time):</b> {counts.get("lastWeekFromStartUntilCurrentTimeGrossOrderCount", "N/A")}
 ● <b>LW Total:</b> {counts.get("lastWeekGrossOrderCount", "N/A")}

<b>📈 Order Changes:</b>
━━━━━━━━━━━━━━
{order_trend_today_VS_yesterday} <b>vs Yest:</b> {counts.get("diffTodayYesterdayCount", "N/A")} ({counts.get("diffTodayYesterdayPercentage", "N/A")}%)
{order_trend_today_VS_last_week} <b>vs LW (Time):</b> {counts.get("diffTodayLastWeekCount", "N/A")} ({counts.get("diffTodayLastWeekPercentage", "N/A")}%)
{order_trend_today_VS_current_last_week} <b>vs LW (To Time):</b> {counts.get("diffCurrentWeekLastWeekCount", "N/A")} ({counts.get("diffCurrentWeekLastWeekPercentage", "N/A")}%)

<b>💰 Revenue:</b>
━━━━━━━━━━━━━━
 ● <b>Today:</b> {format_number(values.get("todayGrossOrderValue", "N/A"))}
 ● <b>Yest (Time):</b> {format_number(values.get("yesterdayCurrentTimeGrossOrderValue", "N/A"))}
 ● <b>LW (Time):</b> {format_number(values.get("lastWeekCurrentTimeGrossOrderValue", "N/A"))}
 ● <b>Yest:</b> {format_number(values.get("yesterdayGrossOrderValue", "N/A"))}
 ● <b>This Week:</b> {format_number(values.get("currentWeekGrossOrderValue", "N/A"))}
 ● <b>LW (To Time):</b> {format_number(values.get("lastWeekFromStartUntilCurrentTimeGrossOrderValue", "N/A"))}
 ● <b>LW Total:</b> {format_number(values.get("lastWeekGrossOrderValue", "N/A"))}

<b>📦 Net Orders (Today):</b>
━━━━━━━━━━━━━━
 ● <b>Count:</b> {today_net_order_count}
 ● <b>Value:</b> {format_number(today_net_order_value)}

<b>📊 Revenue Changes:</b>
━━━━━━━━━━━━━━
{revenue_trend_today_VS_yesterday} <b>vs Yest:</b> {format_number(values.get("diffTodayYesterdayValue", "N/A"))} 
{revenue_trend_today_VS_yesterday} <b>vs Yest:</b> ({values.get("diffTodayYesterdayPercentage", "N/A")}%)
{revenue_trend_today_VS_last_week} <b>vs LW (Time):</b> {format_number(values.get("diffTodayLastWeekValue", "N/A"))} 
{revenue_trend_today_VS_last_week} <b>vs LW (Time):</b> ({values.get("diffTodayLastWeekPercentage", "N/A")}%)
{revenue_trend_today_VS_current_last_week} <b>vs LW (To Time):</b> {format_number(values.get("diffCurrentWeekLastWeekValue", "N/A"))} 
{revenue_trend_today_VS_current_last_week} <b>vs LW (To Time):</b> ({values.get("diffCurrentWeekLastWeekPercentage", "N/A")}%)


"""
    return message

def send_to_telegram():
    """Fetches metrics and sends a formatted message to Telegram"""
    data = fetch_metrics()
    message = format_message(data)
    
    if message.startswith("⚠️"):  # If message indicates a failure to fetch data, don't send
        print(message)
        return

    telegram_api_url = f"http://api-tg.nullip.ir/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
    payload = {
        "chat_id": TELEGRAM_CHAT_ID,
        "text": message,
        "parse_mode": "HTML"
    }

    try:
        response = requests.post(telegram_api_url, json=payload)
        response.raise_for_status()
        print("✅ Message sent successfully!")
    except requests.RequestException as e:
        print(f"❌ Error sending message to Telegram: {e}")

# Call the function to send the message
send_to_telegram()

""""
Abbreviation Key:
     Yest = Yesterday
     LW = Last Week
     (Time) = Same Time
     (To Time) = Until Same Time Today
     This Week = Current Week
"""