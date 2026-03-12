import urllib.request
import urllib.error
import json

req_get = urllib.request.Request(
    "https://swat-garden-center.onrender.com/admin/physical-sales",
    headers={"Authorization": "Bearer admin_token"}
)

try:
    with urllib.request.urlopen(req_get) as response:
        data = json.loads(response.read().decode())
        sales = data.get("sales", [])
        if sales:
            sale_id = sales[0]['id']
            print(f"Testing PUT on: {sale_id}")
            
            put_payload = json.dumps({
                "date": "2026-03-08",
                "total_sale": 999.0,
                "expense": 0.0,
                "description": "Test urllib Update"
            }).encode('utf-8')
            
            req_put = urllib.request.Request(
                f"https://swat-garden-center.onrender.com/admin/physical-sales/{sale_id}",
                data=put_payload,
                headers={
                    "Authorization": "Bearer admin_token",
                    "Content-Type": "application/json"
                },
                method="PUT"
            )
            
            try:
                with urllib.request.urlopen(req_put) as put_response:
                    print(f"PUT Success! Code: {put_response.status}")
                    print(put_response.read().decode())
            except urllib.error.HTTPError as e:
                print(f"PUT Failed! Code: {e.code}")
                print(e.read().decode())
        else:
            print("No sales records found.")
except urllib.error.HTTPError as e:
    print(f"GET Failed! Code: {e.code}")
