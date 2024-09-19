# Line Bot Using Ollama 💫⭐

## Steps to Create a LINE Bot (Message API) 🗃️:

### 0. Prepare Your Environment
* Create a script in Google Apps Script. Link 🔗: https://script.google.com/home

### 1. Copy the Code
Copy the provided code into your Google Apps Script project.

### 2. Configure API Keys
In the script, replace the placeholder URL with your actual API URL:
```javascript
const LINE_ACCESS_TOKEN = 'YOUR TOKEN';
const OLLAMA_API_URL = 'YOUR WEB.ngrok-free.app/v1';   
```
### 3. Customize Model (Optional)
```javascript
    const requestOptions = {
      "method": "post",
      "headers": {
        "Content-Type": "application/json"
      },
      "payload": JSON.stringify({
        "model": "coffeedoo",
        "messages": [
          ...conversationHistory
        ]
      })
    };
```
### 4. Deploy the Web App
Click on "Deploy" > "New deployment"
Choose "Web app" as the type
Set "Who has access" to "Anyone"
Click "Deploy" and copy the provided Web App URL
### 5. Set Up LINE Webhook
Go to your LINE bot settings in the LINE Developers Console
In the Messaging API settings, find the Webhook URL section
Click "Edit" and paste your Web App URL
Click "Update" or "Save"
Click "Verify" and wait for the success message


# Done! 🤓🤡
