import ballerina/http;
import ballerinax/azure.openai.chat;

configurable string openAIToken = ?;
configurable string serviceUrl = ?;
configurable string deploymentId = ?;

const API_VERSION = "2023-08-01-preview";

final chat:Client azureOpenAiClient = check new (
    config = {auth: {apiKey: openAIToken}},
    serviceUrl = serviceUrl
);

# A service representing a network-accessible API
# bound to port `9090`.
service / on new http:Listener(9090) {

    resource function get chat(string input) returns string|error {
        chat:ChatCompletionRequestMessage[] messages = [{role: "user", content: input}];
        chat:ChatCompletionFunctions[] functions = [
            {
                name: "get_current_weather",
                description: "Get the current weather in a given location",
                parameters: {
                    "type": "object",
                    "properties": {
                        "location": {
                            "type": "string",
                            "description": "The city or town to get the weather for"
                        },
                        "unit": {
                            "type": "string",
                            "enum": ["celsius", "fahrenheit"]
                        }
                    },
                    "required": ["location"]
                }
            }
        ];
        chat:CreateChatCompletionRequest request = {
            messages,
            functions
        };
        chat:CreateChatCompletionResponse response = check azureOpenAiClient->/deployments/[deploymentId]/chat/completions.post(
            API_VERSION,
            request
        );
        string? content = response.choices[0].message?.content;
        chat:ChatCompletionRequestMessage_function_call? functionCall = response.choices[0].message?.function_call;

        if functionCall is chat:ChatCompletionRequestMessage_function_call {
            return "Function call: Name - " + (functionCall.name ?: "null") + ", Arguments - " + (functionCall.arguments ?: "null");
        }
        else if content is string {
            return content;
        }
        else {
            return error("Unknown response");
        }
    }
}