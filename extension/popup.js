 console.log("📦 popup.js loaded");
        
        function parseMarkdownToHTML(text) {
            // Convert **bold** to <strong>
            text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            
            // Convert `code` to <code>
            text = text.replace(/`([^`]+)`/g, '<code>$1</code>');
            
            // Convert line breaks to <br>
            text = text.replace(/\n/g, '<br>');
            
            return text;
        }
        
        function formatStep(stepText, index) {
            const stepDiv = document.createElement("div");
            stepDiv.className = "step";
            
            // Check if this is a header (starts with ** and ends with **)
            if (stepText.match(/^\*\*.*\*\*:?$/)) {
                const headerText = stepText.replace(/^\*\*|\*\*:?$/g, '');
                stepDiv.innerHTML = `<h4>${headerText}</h4>`;
            }
            // Check if this is a bullet point (starts with *)
            else if (stepText.startsWith('* ')) {
                const bulletText = stepText.substring(2);
                stepDiv.innerHTML = `<p>• ${parseMarkdownToHTML(bulletText)}</p>`;
            }
            // Regular paragraph
            else {
                stepDiv.innerHTML = `<p>${parseMarkdownToHTML(stepText)}</p>`;
            }
            
            return stepDiv;
        }
        
        document.getElementById("getHelp").addEventListener("click", async () => {
            chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
                const tab = tabs[0];
                const url = tab.url;
                const title = tab.title;
                
                console.log("LeetCode URL:", url);
                console.log("Problem Title:", title);
                
                const output = document.getElementById("output");
                const button = document.getElementById("getHelp");
                
                // Show loading state
                output.innerHTML = '<div class="loading">Loading solution...</div>';
                button.disabled = true;
                button.textContent = "Loading...";
                
                try {
                    const response = await fetch("https://leetcode-helper-wn4c.onrender.com/api/solve/", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({ title, url })
                    });
                    
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    
                    const data = await response.json();
                    console.log("✅ Response from Django:", data);
                    
                    // Clear output
                    output.innerHTML = "";
                    
                    if (data.steps && Array.isArray(data.steps)) {
                        data.steps.forEach((step, index) => {
                            if (step && step.trim()) {
                                const stepElement = formatStep(step.trim(), index);
                                output.appendChild(stepElement);
                            }
                        });
                    } else {
                        output.innerHTML = '<div class="no-steps">No solution steps found.</div>';
                    }
                    
                } catch (error) {
                    console.error("❌ Error:", error);
                    output.innerHTML = `<div class="error">Error: ${error.message}<br><br>Please check your internet connection and try again.</div>`;
                } finally {
                    // Reset button
                    button.disabled = false;
                    button.textContent = "Get Step-by-Step Help";
                }
            });
        });
   