import requests

# Update the URL to the correct port
url = "http://localhost:5174/routes/documents/mkdir"
data = {
    "directory_name": "test_directory"
}

response = requests.post(url, json=data)

print("Response Status Code:", response.status_code)
print("Response JSON:", response.json())
