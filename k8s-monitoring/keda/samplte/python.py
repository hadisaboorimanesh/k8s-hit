import asyncio
import aiohttp
import time
from collections import deque
import statistics

class LoadTester:
    def __init__(self):
        self.url = ""
        self.requests_per_second = 0
        self.test_duration = 0
        self.results = deque(maxlen=1000000)  # Limit to last million results to manage memory
        self.start_time = 0
        self.session = None
        self.request_times = deque(maxlen=1000000)

    async def send_request(self):
        start_time = time.time()
        try:
            async with self.session.get(self.url) as response:
                await response.text()  # Ensure the full response is received
                status = response.status
        except aiohttp.ClientError as e:
            status = f"Error: {str(e)}"
        
        end_time = time.time()
        self.request_times.append(end_time - start_time)
        self.results.append(status)

    def get_input(self, prompt, default=""):
        return input(prompt) or default

    def setup(self):
        print("Nginx Load Tester with Constant Pressure\n")

        self.url = self.get_input("Enter Nginx URL (default: http://localhost:8080): ", "http://localhost:8080")
        
        while True:
            rps = self.get_input("Enter desired requests per second: ")
            try:
                self.requests_per_second = int(rps)
                if self.requests_per_second > 0:
                    break
                else:
                    print("Requests per second must be greater than 0.")
            except ValueError:
                print("Please enter a valid number.")

        while True:
            duration = self.get_input("Enter test duration in seconds: ")
            try:
                self.test_duration = int(duration)
                if self.test_duration > 0:
                    break
                else:
                    print("Test duration must be greater than 0.")
            except ValueError:
                print("Please enter a valid number.")

    async def constant_load_generator(self):
        interval = 1.0 / self.requests_per_second
        end_time = time.time() + self.test_duration
        while time.time() < end_time:
            start_time = time.time()
            asyncio.create_task(self.send_request())
            await asyncio.sleep(max(0, interval - (time.time() - start_time)))

    async def load_test(self):
        self.start_time = time.time()
        self.session = aiohttp.ClientSession()
        try:
            await self.constant_load_generator()
        finally:
            await self.session.close()

    def generate_report(self):
        total_requests = len(self.results)
        success_count = sum(1 for r in self.results if r == 200)
        error_count = total_requests - success_count
        elapsed_time = time.time() - self.start_time

        if self.request_times:
            avg_response_time = statistics.mean(self.request_times)
            median_response_time = statistics.median(self.request_times)
            p95_response_time = statistics.quantiles(self.request_times, n=20)[-1]
            p99_response_time = statistics.quantiles(self.request_times, n=100)[-1]
        else:
            avg_response_time = median_response_time = p95_response_time = p99_response_time = 0

        report = f"""
Load Test Report
================
URL tested: {self.url}
Test duration: {elapsed_time:.2f} seconds
Desired requests per second: {self.requests_per_second}

Results:
--------
Total requests: {total_requests}
Successful requests: {success_count}
Failed requests: {error_count}
Actual requests per second: {total_requests / elapsed_time:.2f}

Response Times:
---------------
Average: {avg_response_time*1000:.2f} ms
Median: {median_response_time*1000:.2f} ms
95th percentile: {p95_response_time*1000:.2f} ms
99th percentile: {p99_response_time*1000:.2f} ms

Error rate: {(error_count / total_requests) * 100:.2f}%
"""
        print(report)

    async def run(self):
        self.setup()
        print(f"Starting load test on {self.url}")
        print(f"Aiming for {self.requests_per_second} requests per second for {self.test_duration} seconds")
        print("Test in progress... Please wait.")
        
        await self.load_test()
        
        print("\nTest completed. Generating report...")
        self.generate_report()

def main():
    tester = LoadTester()
    asyncio.run(tester.run())

if __name__ == "__main__":
    main()
