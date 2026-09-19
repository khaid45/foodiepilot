from langchain_core.tools import tool

from app.agent.tools import (
    create_booking as create_booking_tool,
    get_my_bookings as get_my_bookings_tool,
    cancel_booking as cancel_booking_tool,
)


def create_user_bound_tools(user_id: int):
    """
    Create booking tools bound to the authenticated user's ID.

    The LLM does not receive user_id as an argument.
    The backend injects the authenticated user's ID.
    """

    @tool
    def create_booking(
        restaurant_id: int,
        booking_date: str,
        booking_time: str,
        guests: int,
    ) -> str:
        """
        Create a restaurant booking for the currently authenticated user.

        booking_date must use YYYY-MM-DD format.
        booking_time must use HH:MM format.
        guests must be between 1 and 20.
        """

        return create_booking_tool.invoke(
            {
                "user_id": user_id,
                "restaurant_id": restaurant_id,
                "booking_date": booking_date,
                "booking_time": booking_time,
                "guests": guests,
            }
        )

    @tool
    def get_my_bookings() -> str:
        """
        Retrieve all bookings belonging to the currently authenticated user.
        """

        return get_my_bookings_tool.invoke(
            {
                "user_id": user_id,
            }
        )

    @tool
    def cancel_booking(booking_id: int) -> str:
        """
        Cancel a booking belonging to the currently authenticated user.
        """

        return cancel_booking_tool.invoke(
            {
                "user_id": user_id,
                "booking_id": booking_id,
            }
        )

    return [
        create_booking,
        get_my_bookings,
        cancel_booking,
    ]