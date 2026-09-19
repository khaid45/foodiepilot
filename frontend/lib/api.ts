const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
export { API_BASE_URL };
type ApiRequestOptions = RequestInit & {
  token?: string;
};

async function apiRequest<T>(
  endpoint: string,
  options: ApiRequestOptions = {}
): Promise<T> {
  const { token, ...fetchOptions } = options;

  const headers = new Headers(fetchOptions.headers);

  headers.set("Content-Type", "application/json");

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...fetchOptions,
    headers,
  });

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;

    try {
      const error = await response.json();

      if (typeof error?.detail === "string") {
        message = error.detail;
      } else if (typeof error?.message === "string") {
        message = error.message;
      }
    } catch {
      // Keep the default HTTP error message.
    }

    throw new Error(message);
  }

  return response.json() as Promise<T>;
}

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

export interface Restaurant {
  id: number;
  name: string;
  location: string;
  cuisine: string;
  rating: number;
  available_tables: number;
  price_range: string;
}

export interface Booking {
  id: number;
  user_id: number;
  restaurant_id: number;
  booking_date: string;
  booking_time: string;
  guests: number;
  status: string;
  created_at: string;
}

export interface Availability {
  restaurant_id: number;
  booking_date: string;
  booking_time: string;
  requested_guests: number;
  available_tables: number;
  available: boolean;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface AgentRestaurant {
  id: number;
  name: string;
  location: string;
  cuisine: string;
  rating: number;
  price_range: string;
  score?: number | null;
}

export interface AgentResponse {
  response: string;
  restaurants: AgentRestaurant[];
}

export interface RestaurantFilters {
  location?: string;
  cuisine?: string;
  min_rating?: number;
  price_range?: string;
  min_tables?: number;
}

/* -------------------------------------------------------------------------- */
/* Restaurants                                                                */
/* -------------------------------------------------------------------------- */

export async function getRestaurants(
  filters: RestaurantFilters = {}
): Promise<Restaurant[]> {
  const params = new URLSearchParams();

  if (filters.location) {
    params.set("location", filters.location);
  }

  if (filters.cuisine) {
    params.set("cuisine", filters.cuisine);
  }

  if (filters.min_rating !== undefined) {
    params.set("min_rating", String(filters.min_rating));
  }

  if (filters.price_range) {
    params.set("price_range", filters.price_range);
  }

  if (filters.min_tables !== undefined) {
    params.set("min_tables", String(filters.min_tables));
  }

  const query = params.toString();

  return apiRequest<Restaurant[]>(
    `/restaurants/${query ? `?${query}` : ""}`
  );
}

export async function getRestaurant(
  restaurantId: number
): Promise<Restaurant> {
  return apiRequest<Restaurant>(`/restaurants/${restaurantId}`);
}

/* -------------------------------------------------------------------------- */
/* Availability                                                               */
/* -------------------------------------------------------------------------- */

export async function checkAvailability(
  restaurantId: number,
  bookingDate: string,
  bookingTime: string,
  guests: number
): Promise<Availability> {
  const params = new URLSearchParams({
    booking_date: bookingDate,
    booking_time: bookingTime,
    guests: String(guests),
  });

  return apiRequest<Availability>(
    `/restaurants/${restaurantId}/availability?${params.toString()}`
  );
}

/* -------------------------------------------------------------------------- */
/* Authentication                                                             */
/* -------------------------------------------------------------------------- */

export async function register(
  name: string,
  email: string,
  password: string
) {
  return apiRequest<{
    message: string;
    user: User;
  }>("/auth/register", {
    method: "POST",
    body: JSON.stringify({
      name,
      email,
      password,
    }),
  });
}

export async function login(
  email: string,
  password: string
): Promise<AuthResponse> {
  return apiRequest<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
    }),
  });
}

export async function getCurrentUser(token: string): Promise<User> {
  return apiRequest<User>("/auth/me", {
    token,
  });
}

/* -------------------------------------------------------------------------- */
/* Bookings                                                                   */
/* -------------------------------------------------------------------------- */

export async function createBooking(
  token: string,
  booking: {
    restaurant_id: number;
    booking_date: string;
    booking_time: string;
    guests: number;
  }
): Promise<Booking> {
  return apiRequest<Booking>("/bookings/", {
    method: "POST",
    token,
    body: JSON.stringify(booking),
  });
}

export async function getMyBookings(
  token: string
): Promise<Booking[]> {
  return apiRequest<Booking[]>("/bookings/my", {
    token,
  });
}

export async function getBooking(
  token: string,
  bookingId: number
): Promise<Booking> {
  return apiRequest<Booking>(`/bookings/${bookingId}`, {
    token,
  });
}

export async function cancelBooking(
  token: string,
  bookingId: number
) {
  return apiRequest<Booking>(`/bookings/${bookingId}`, {
    method: "DELETE",
    token,
  });
}

/* -------------------------------------------------------------------------- */
/* AI Agent                                                                   */
/* -------------------------------------------------------------------------- */

export async function chatWithAgent(
  token: string,
  message: string,
  sessionId: string
): Promise<AgentResponse> {
  return apiRequest<AgentResponse>("/agent/chat", {
    method: "POST",
    token,
    body: JSON.stringify({
      message,
      session_id: sessionId,
    }),
  });
}