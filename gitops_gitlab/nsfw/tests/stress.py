from typing import List
from locust import HttpUser, task

# Due to the large amount of obscenity, For now, 
# we prefer to leave it up to you to fill in these examples.
# we fill it with 10 paragraph of Lorem ipsum and put a few swear word between them.
sample: List[str] = [

]

class LookupDetozer(HttpUser):
    @task
    def send_batch(self):
        self.client.post("/lookup-detoxification", json={"batch": sample})