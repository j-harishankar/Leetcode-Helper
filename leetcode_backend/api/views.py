from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

    
# Create your views here.
@csrf_exempt
def solve_view(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        title = data.get("title")
        url = data.get("url")
        print(f"Received: {title}, {url}")
        return JsonResponse({
            "steps": [
                f"Step 1: Understand the problem '{title}'",
                "Step 2: Write edge cases",
                "Step 3: Think of brute-force",
                "Step 4: Optimize your solution",
                f"Step 5: Submit on LeetCode: {url}"
            ]
        })
    return JsonResponse({"error": "Only POST allowed"}, status=400)
