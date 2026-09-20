import json

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field

from app.agent.graph import create_user_agent
from app.core.dependencies import get_current_user
from app.models.user import User


router = APIRouter(prefix="/agent", tags=["AI Agent"])


class AgentChatRequest(BaseModel):
    message: str = Field(min_length=2, max_length=2000)
    session_id: str = Field(min_length=1, max_length=100)


class AgentRestaurant(BaseModel):
    id: int
    name: str
    location: str
    cuisine: str
    rating: float
    price_range: str
    score: float | None = None


class AgentChatResponse(BaseModel):
    response: str
    restaurants: list[AgentRestaurant] = []


def is_restaurant_discovery_request(message: str) -> bool:
    """
    Determine whether the user's request is asking for restaurant
    discovery/recommendations.

    Booking, history, and cancellation requests should not return
    restaurant cards unless the user is explicitly asking to discover
    restaurants.
    """

    message_lower = message.lower()

    discovery_keywords = (
        "find restaurants",
        "find a restaurant",
        "find me restaurants",
        "find me a restaurant",
        "recommend restaurants",
        "recommend a restaurant",
        "restaurant recommendations",
        "show restaurants",
        "show me restaurants",
        "search restaurants",
        "search for restaurants",
        "discover restaurants",
        "looking for restaurants",
        "looking for a restaurant",
        "restaurants in",
        "restaurants near",
        "restaurants with",
        "best restaurants",
        "good restaurants",
        "highly rated restaurants",
    )

    return any(
        keyword in message_lower
        for keyword in discovery_keywords
    )


def extract_current_turn_tool_messages(messages, current_message):
    """
    Return only tool messages generated after the current user's
    message.

    LangGraph conversation memory contains messages from previous
    turns. We must not reuse those old tool results as current
    restaurant cards.
    """

    current_user_index = None

    # Find the latest user message matching the current request.
    for index in range(len(messages) - 1, -1, -1):
        message = messages[index]

        if getattr(message, "type", None) != "human":
            continue

        content = getattr(message, "content", "")

        if isinstance(content, str) and content == current_message:
            current_user_index = index
            break

    if current_user_index is None:
        return []

    return messages[current_user_index + 1:]


@router.post("/chat", response_model=AgentChatResponse)
def agent_chat(
    request: AgentChatRequest,
    current_user: User = Depends(get_current_user),
):
    """
    Process an authenticated user's request through the FoodiePilot
    LangGraph agent with conversation memory.

    Restaurant search results are returned separately as structured
    data only when the user is explicitly performing restaurant
    discovery.

    Only tool results generated during the current conversation turn
    are exposed as restaurant cards.
    """

    try:
        agent = create_user_agent(current_user.id)

        result = agent.invoke(
            {
                "messages": [
                    {
                        "role": "user",
                        "content": request.message,
                    }
                ]
            },
            config={
                "configurable": {
                    "thread_id": (
                        f"user_{current_user.id}_{request.session_id}"
                    )
                }
            },
        )

        messages = result.get("messages", [])

        if not messages:
            raise HTTPException(
                status_code=500,
                detail="Agent returned no response.",
            )

        final_message = messages[-1].content

        if isinstance(final_message, list):
            response_text = "".join(
                block.get("text", "")
                for block in final_message
                if isinstance(block, dict)
            )
        else:
            response_text = str(final_message)

        restaurants = []

        # ------------------------------------------------------------
        # IMPORTANT:
        # Only expose restaurant cards for discovery requests.
        # More importantly, only inspect tool messages belonging to
        # THIS user turn, not the entire conversation history.
        # ------------------------------------------------------------
        if is_restaurant_discovery_request(request.message):

            current_turn_messages = extract_current_turn_tool_messages(
                messages,
                request.message,
            )

            for message in current_turn_messages:

                if getattr(message, "type", None) != "tool":
                    continue

                content = getattr(message, "content", "")

                if not isinstance(content, str):
                    continue

                try:
                    tool_result = json.loads(content)
                except (json.JSONDecodeError, TypeError):
                    continue

                if not isinstance(tool_result, dict):
                    continue

                tool_restaurants = tool_result.get("restaurants")

                if not isinstance(tool_restaurants, list):
                    continue

                for restaurant in tool_restaurants:

                    if not isinstance(restaurant, dict):
                        continue

                    try:
                        restaurants.append(
                            AgentRestaurant(
                                id=int(restaurant["id"]),
                                name=str(restaurant["name"]),
                                location=str(
                                    restaurant["location"]
                                ),
                                cuisine=str(
                                    restaurant["cuisine"]
                                ),
                                rating=float(
                                    restaurant["rating"]
                                ),
                                price_range=str(
                                    restaurant["price_range"]
                                ),
                                score=(
                                    float(restaurant["score"])
                                    if restaurant.get("score") is not None
                                    else None
                                ),
                            )
                        )

                    except (
                        KeyError,
                        TypeError,
                        ValueError,
                    ):
                        continue

        # ------------------------------------------------------------
        # Remove duplicates while preserving the order returned by
        # the current turn's tool calls.
        # ------------------------------------------------------------
        unique_restaurants = []
        seen_ids = set()

        for restaurant in restaurants:

            if restaurant.id not in seen_ids:
                seen_ids.add(restaurant.id)
                unique_restaurants.append(restaurant)

        return {
            "response": response_text,
            "restaurants": unique_restaurants,
        }

    except HTTPException:
        raise

    except Exception as e:

        error_message = str(e)

        if (
            "RESOURCE_EXHAUSTED" in error_message
            or "429" in error_message
        ):
            raise HTTPException(
                status_code=429,
                detail=(
                    "AI service quota exceeded. "
                    "Please try again later."
                ),
            )

        raise HTTPException(
            status_code=500,
            detail=f"Agent request failed: {error_message}",
        )